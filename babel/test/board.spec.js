'use strict';
import test from 'ava';
import * as _ from 'lodash';
import {Board} from '../src/board';
import {combineMatches} from '../src/board';
import {findMatches} from '../src/board';
let board;

test.before(() => {
    board = new Board();
});

test('creates a new 8x8 board', t => {
    // 8x8 default
    t.is(board.width, 8);
    t.is(board.height, 8);
    t.same(board.size, [8, 8]);
});

test('creates seven different types of orbs', t => {
    t.same(board.availableTypes, _.range(7));
});

test('gathers data for each match', t=> {
    board.orbs = [
        [ 3, 2, 2, 2, 2, 3, 6, 6 ],
        [ 4, 2, 0, 5, 3, 0, 1, 5 ],
        [ 1, 4, 3, 2, 5, 4, 6, 6 ],
        [ 3, 5, 2, 2, 2, 3, 3, 4 ],
        [ 1, 1, 3, 2, 5, 2, 6, 2 ],
        [ 3, 2, 5, 4, 5, 0, 4, 0 ],
        [ 1, 3, 1, 6, 1, 6, 3, 3 ],
        [ 1, 0, 3, 0, 1, 1, 3, 3 ]
    ];

    t.same(board.evaluate(combineMatches(findMatches(board.orbs))), [[ 2, 4 ], [ 2, 5 ]]);
});

test('deletes matches and drops down orbs', t=> {
    // matches in this test are 8 which are not a part of board.types
    // this shows that they have been replaced with valid random orbs
    board.orbs = [
        [ 3, 8, 8, 8, 8, 3, 6, 6 ],
        [ 4, 2, 0, 5, 3, 0, 1, 5 ],
        [ 1, 4, 3, 8, 5, 4, 6, 6 ],
        [ 3, 5, 8, 8, 8, 3, 3, 4 ],
        [ 1, 1, 3, 8, 5, 2, 6, 2 ],
        [ 3, 2, 5, 4, 5, 0, 4, 0 ],
        [ 1, 3, 1, 6, 1, 6, 3, 3 ],
        [ 1, 0, 3, 0, 1, 1, 3, 3 ]
    ];
    board.evaluate(combineMatches(findMatches(board.orbs)));

    t.same(board.orbs[4][3], 5); // the 5 should always drop down to [4, 3]
    _.each(_.flattenDeep(board.orbs), orb => {
        t.true(_.includes(board.types, orb))
    });
});

test.skip('should have at least one possible match set by default', t => {
    t.ok(board.hasMatch());
});
