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

test.skip('finds all mathes of three, including overlaps', t => {
    let testMatches = [
        [ [ 0, 1 ], [ 0, 2 ], [ 0, 3 ] ],
        [ [ 0, 2 ], [ 0, 3 ], [ 0, 4 ] ],
        [ [ 2, 3 ], [ 3, 3 ], [ 4, 3 ] ],
        [ [ 3, 2 ], [ 3, 3 ], [ 3, 4 ] ]
    ];
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

    t.same(findMatches(board.orbs), testMatches);
});

test('combines all matches of 3 to create matches of 4+', t => {
    let testCombined = [
        [ [ 0, 1 ], [ 0, 2 ], [ 0, 3 ], [ 0, 4 ] ],
        [ [ 2, 3 ], [ 3, 2 ], [ 3, 3 ], [ 3, 4 ], [ 4, 3 ] ]
    ];
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

    t.same(combineMatches(findMatches(board.orbs)), testCombined);
});

test.skip('should have at least one possible match set by default', t => {
    t.ok(board.hasMatch());
});
