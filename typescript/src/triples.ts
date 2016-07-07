import * as _ from 'lodash';
import * as tools from './tools';
import { SortedSet } from 'collections/sorted-set';
import * as types from '../types';

let _findTriples = (chunks: any[][], isTransposed: boolean): types.Coord[][] => {
    let triples: types.Coord[][] = [];

    _.each(chunks, chunk => {
        let orbs = _.first(chunk);
        let metadata: types.PositionInfo = _.last(chunk);
        if (_.uniq(orbs).length === 1) {
            let anchor = metadata.position.first;
            let firstOrb: types.Coord = anchor;
            let secondOrb: types.Coord;
            let thirdOrb: types.Coord;

            if (isTransposed) {
                secondOrb = [anchor[0] + 1, anchor[1]];
                thirdOrb = [anchor[0] + 2, anchor[1]];
            } else {
                secondOrb = [anchor[0], anchor[1] + 1];
                thirdOrb = [anchor[0], anchor[1] + 2];
            }

            let absolutePositions = [
                firstOrb,
                secondOrb,
                thirdOrb
            ];
            triples.push(absolutePositions);
        }
    });

    return triples;
};

/**
  * @description Gathers all triples, which are the coordinates for all instances of 
  * three consecutive matching orbs, first in rows, then in columns.
  */
export function find(orbs: any[][]): types.Coord[][] {
    let chunksOriginal = tools._iterchunks(orbs, [3, 1], true, false);
    let chunksTransposed = tools._iterchunks(_.zip(...orbs), [3, 1], true, true);

    return [
            ..._findTriples(chunksOriginal, false),
            ..._findTriples(chunksTransposed, true)
    ];
};

export function combine(triples: types.Coord[][]): types.Coord[][] {
    let matches: types.Coord[][] = [];
    let unused = triples;
    let couldMatch: types.Coord[][];
    let before: types.Coord[];
    let currentMatch: SortedSet;

    while (unused[0] != null) {
        currentMatch = new SortedSet(unused[0]);
        unused.shift();
        couldMatch = _.clone(unused);

        _.each(couldMatch, m => {
            //only union if there is an overlap!
            if (currentMatch.intersection(m).toArray()[0] != undefined) {
                before = currentMatch.toArray();
                currentMatch.swap(0, currentMatch.length, currentMatch.union(m));
                if (before != currentMatch.toArray()) {
                    unused.splice(unused.indexOf(m), 1);
                }
            }
        });
        matches.push(currentMatch.toArray());
    }
    return matches;
};
