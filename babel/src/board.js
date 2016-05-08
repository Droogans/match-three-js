'use strict';
import * as _ from 'lodash';
import iterchunks from './tools/iterchunks';
import evaluate as affectOrbs.evaluate from './affectOrbs/evaluate';
import unmatch as affectOrbs.unmatch from './affectOrbs/unmatch';
// import './affectOrbs';
import findTriples from './getMatches/findTriples';
import combineTriples from './getMatches/combineTriples';
let SortedSet = require('collections/sorted-set');

export class Board {
    constructor (width = 8, height = 8, types = _.range(7)) {
        this.width = width;
        this.height = height;
        this.types = types;
        let chooseOrb = () => { return _.sample(this.types); };
        let sampleRow = () => { return _.times(this.width, chooseOrb); };
        this.orbs = _.zip(..._.times(this.height, sampleRow));
        if (this.hasMatch() || this.needsShuffle()) {
            this.shuffle();
        };
    }

    get size() {
        return [this.width, this.height];
    }

    get availableTypes() {
        return _.uniq(_.flatten(this.orbs)).sort();
    }
    
    get triples() {
        return findTriples(this.orbs);
    }
    
    get matches() {
        return combineTriples(this.triples);
    }

    evaluate(dropOptions = this.types) {
        let evaluation = affectOrbs.evaluate(this.orbs, this.height, this.width, this.matches, dropOptions)
        let [newOrbs, matchData] = evaluation;
        this.orbs = newOrbs;
        return matchData;

    }

    needsShuffle() {
        return !this.hasPotentialMatch();
    }

    hasPotentialMatch() {
        let chunks = iterchunks(this.orbs);
        // [[[1, 2, 3], [2, 3, 4]], [[3, 4, 5], [4, 5, 6]]] becomes
        //  [[1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6]]
        let flatChunks = _.flattenDepth(chunks, 1);
        let hasWideStyleMatch = _.some(_.map(flatChunks, hasPotentialMatchInSingleRow));
        return hasWideStyleMatch || _.some(_.map(chunks), hasPotentialMatchInPairOfRows);
    }
    
    hasMatch() {
        return Boolean(findTriples(this.orbs)[0]);
    }

    swap(swapOrbs, playerSwap = true) {
        let [[row1, col1], [row2, col2]] = swapOrbs;
        let orbsBefore = _.cloneDeep(this.orbs);
        this.orbs[row1][col1] = orbsBefore[row2][col2]
        this.orbs[row2][col2] = orbsBefore[row1][col1]
        // undo the swap if it did not yeild a match
        if (playerSwap && !this.hasMatch()) {
            this.orbs = orbsBefore;
        };
    }
    
    unmatch() {
        while(this.hasMatch()) {
            this.orbs = affectOrbs.unmatch(this.orbs);
        }
    }

    shuffle() {
        this.orbs = _.map(this.orbs, row => _.shuffle(row));
        this.unmatch();
        if (this.needsShuffle()) {
            this.shuffle();
        };
    }
};
