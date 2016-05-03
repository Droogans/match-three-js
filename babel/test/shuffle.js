import test from 'ava';
import * as _ from 'lodash';
import {Board} from '../src/board';
import {combineMatches} from '../src/board';
import {findMatches} from '../src/board';
import {orbs} from './data/orbs';
import {names} from './data/names';
let i = 100;
let board5 = new Board(5, 5);
let board8 = new Board(8, 8);
let board12 = new Board(12, 12);

test(`shuffles and unmatches a 5x5 board ${i} times`, t => {
    _.each(_.range(i), j => {
        board5.shuffle();
        t.true(!(board5.needsShuffle() || board5.hasMatchEvent()))
    });
});

test(`shuffles and unmatches an 8x8 board ${i} times`, t => {
    _.each(_.range(i), j => {
        board8.shuffle();
        t.true(!(board8.needsShuffle() || board8.hasMatchEvent()))
    });
});

test(`shuffles and unmatches a 12x12 board ${i} times`, t => {
    _.each(_.range(i), j => {
        board12.shuffle();
        t.true(!(board12.needsShuffle() || board12.hasMatchEvent()))
    });
});