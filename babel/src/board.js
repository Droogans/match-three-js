'use strict';
import * as _ from 'lodash';
let SortedSet = require('collections/sorted-set');

// checks for one row of the iterchunk board for a match like [0010].
export function hasMatchInSingleRow (row) {
    return _.max(_.values(_.countBy(row))) > 2;
};

// return the index of all occurrences of `value` in `list`. [5, 3, 7, 5], 5 -> [0, 3]
export function indexOfAll (list, value) {
    return _.reduce(list, (acc, e, i) => {
        if (e === value) {
            acc.push(i);
        }

        return acc;
    }, []);
};

// checks across both rows for a match, like [0101]
//                                           [2031]
export function hasMatchInPairOfRows (pairOfRows) {
    let allValues = _.uniq(_.flatten(pairOfRows));
    let allMatches = _.map(allValues, value => {
        return _.uniq([...indexOfAll(pairOfRows[0], value),
                       ...indexOfAll(pairOfRows[1], value)]).sort();
    });

    return _.some(allMatches, match => {
        return _.some([
            _.isEqual(match, [0, 1, 2]),
            _.isEqual(match, [1, 2, 3]),
            _.isEqual(match, [0, 1, 2, 3]),
        ]);
    });
};

/**
 * With `orbs` being
 * [ [ 6, 5, 4 ],
 *   [ 3, 2, 2 ],
 *   [ 6, 4, 0 ] ]
 * And with a [3, 2] `chunkLimitRange`, this will yield each 3x2
 * grouping, and then, each available 2x3 grouping.
 * [ [ [6, 5, 4], [3, 2, 2] ], [ [3, 2, 2], [6, 4, 0] ],
 *   [ [6, 3, 6], [5, 2, 4] ], [ [5, 2, 4], [4, 2, 0] ] ]
 */
export function iterchunks (orbs, chunkLimitRange = [4, 2]) {
    let _iterchunks = (orbs, chunkLimitRange) => {
        let chunks = [];
        let [width, height] = chunkLimitRange;
        let [finalPositionWidth, finalPositionHeight] = [orbs[0].length - width, orbs.length - height];
        _.each(_.range(0, finalPositionHeight + 1), heightIndex => {
            _.each(_.range(0, finalPositionWidth + 1), widthIndex => {
                chunks.push([
                    orbs[heightIndex].slice(widthIndex, widthIndex + width),
                    orbs[heightIndex + 1].slice(widthIndex, widthIndex + width)
                ]);
            });
        });
        return chunks;
    };
    let transposedOrbs = _.zip(...orbs);
    return [..._iterchunks(orbs, chunkLimitRange), ..._iterchunks(transposedOrbs, chunkLimitRange)]
};

export function findMatches(orbs) {
    let matches = [];
    let height = orbs.length;
    let width = orbs[0].length;

    _.each(_.range(height), x => {
        _.each(_.range(width - 2), y => {
            if (orbs[x][y] == orbs[x][y + 1] && orbs[x][y] == orbs[x][y + 2]) {
                matches.push([[x, y], [x, y + 1], [x, y + 2]])
            };
        });
    });
    _.each(_.range(height - 2), x => {
        _.each(_.range(width), y => {
            if (orbs[x][y] == orbs[x + 1][y] && orbs[x][y] == orbs[x + 2][y]) {
                matches.push([[x, y], [x + 1, y], [x + 2, y]])
            };
        });
    });
    return matches;
}

export function combineMatches(matches) {
    let combinedMatches = [];
    let unused = matches;
    let couldMatch, before, currentMatch;

    while (unused[0] != null) {
        currentMatch = new SortedSet(unused[0]);
        unused.shift();
        couldMatch = _.clone(unused);

        _.each(couldMatch, m => { //only union if there is an overlap!
            if (currentMatch.intersection(m).toArray()[0] != null) {
                before = currentMatch.toArray();
                currentMatch.swap(0, currentMatch.length, currentMatch.union(m));
                if (before != currentMatch.toArray()) {
                    unused.splice(unused.indexOf(m), 1);
                }
            }
        });
        combinedMatches.push(currentMatch.toArray());
    }
    return combinedMatches;
}

export class Board {
    constructor (width = 8, height = 8, types = _.range(7)) {
        this.width = width;
        this.height = height;
        this.types = types;
        let chooseOrb = () => { return _.sample(types); };
        let sampleRow = () => { return _.times(width, chooseOrb); };
        this.orbs = _.zip(..._.times(height, sampleRow));
        // this.evaluateAll(this.orbs);
    }

    get size() {
        return [this.width, this.height];
    }

    get availableTypes() {
        return _.uniq(_.flatten(this.orbs)).sort();
    }
    
    /** 
      * 1. logs data for each match and replaces each orb with 'X'
      * 2. replaces each 'X' and all above orbs with either the orb directly above or a random new orb
      * 3. returns the match data -> [[match1Type, match1Amount], [match2Type, match2Amount], ...]
      */
    evaluate(matches) {
        let matchData = [];
        
        _.each(matches, match => {
            // log data
            let [xx, yy] = match[0];
            matchData.push([this.orbs[xx][yy], match.length]);
            // replace each coordinate with 'X'
            _.each(match, coord => {
                let [x, y] = coord;
                this.orbs[x][y] = 'X'
            })
        });

        /**
          * drop down and generate matches
          * 1. reads across starting from the top
          * 2. when it hits 'X', loops from that position directly up
          * 3. if the row isn't 0, it takes the orb from above
          * 4. if the row is 0, it creates a random orb
        */
        _.each(_.range(this.height), x =>{
            _.each(_.range(this.width), y => { //1
                if (this.orbs[x][y] == 'X') {
                    for (var z = x; z >= 0; z--) { //2
                        if (z > 0) { //3
                            this.orbs[z][y] = this.orbs[z - 1][y];
                        } else { //4
                            this.orbs[z][y] = _.sample(this.types);;
                        };
                    };
                };
            });
        });

        return matchData;
    }

    evaluateAll() {
        var matchEvents = [];
        while (this.hasMatch()) {
            matchEvents.push(this.evaluate());
        }
    }

    needsShuffle() {
        return !this.hasMatch();
    }

    hasMatch() {
        let chunks = iterchunks(this.orbs);
        // [[[1, 2, 3], [2, 3, 4]], [[3, 4, 5], [4, 5, 6]]] becomes
        //  [[1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6]]
        let flatChunks = _.flattenDepth(chunks, 1);
        let hasWideStyleMatch = _.some(_.map(flatChunks, hasMatchInSingleRow));
        return hasWideStyleMatch || _.some(_.map(chunks), hasMatchInPairOfRows);
    }

    shuffle() {

    }
};
