import test from 'ava';
import * as _ from 'lodash';
import {findMatches} from '../src/board';
import {iterchunks} from '../src/board';
import {Board} from '../src/board';
let board;
let match;

test.before(() => {
    board = new Board(5, 5);
});

test('matches a simple row match', t => {
    board.orbs = [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 4, 5, 1, 2, 3 ],
        [ 3, 6, 6, 6, 2 ],
        [ 2, 3, 4, 5, 1 ]
    ];

    match = [
        [[3, 1], [3, 2], [3, 3]]
    ];
    t.ok(_.isEqual(findMatches(board.orbs), match));
});

test('matches a simple column match', t => {
    board.orbs = [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 4, 5, 1, 2, 6 ],
        [ 3, 4, 5, 1, 6 ],
        [ 2, 3, 4, 5, 6 ]
    ];

    match = [
        [[2, 4], [3, 4], [4, 4]]
    ];
    t.ok(_.isEqual(findMatches(board.orbs), match));
});

test('matches a simple row four-match', t => {
    board.orbs = [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 4, 5, 1, 2, 3 ],
        [ 3, 4, 5, 1, 2 ],
        [ 2, 6, 6, 6, 6 ]
    ];

    match = [
        [[4, 1], [4, 2], [4, 3]],
        [[4, 2], [4, 3], [4, 4]]
    ];
    t.ok(_.isEqual(findMatches(board.orbs), match));
});

test('matches a simple row four-match', t => {
    board.orbs = [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 6, 4 ],
        [ 4, 5, 1, 6, 3 ],
        [ 3, 4, 5, 6, 2 ],
        [ 2, 3, 4, 6, 1 ]
    ];

    match = [
        [[1, 3], [2, 3], [3, 3]],
        [[2, 3], [3, 3], [4, 3]]
    ];
    t.ok(_.isEqual(findMatches(board.orbs), match));
});

test('matches a simple row five-match', t => {
    board.orbs = [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 6, 6, 6, 6, 6 ],
        [ 3, 4, 5, 1, 2 ],
        [ 2, 3, 4, 5, 1 ]
    ];

    match = [
        [[2, 0], [2, 1], [2, 2]],
        [[2, 1], [2, 2], [2, 3]],
        [[2, 2], [2, 3], [2, 4]]
    ];
    t.ok(_.isEqual(findMatches(board.orbs), match));
});

test('matches a simple row five-match', t => {
    board.orbs = [
        [ 1, 2, 6, 4, 5 ],
        [ 5, 1, 6, 3, 4 ],
        [ 4, 5, 6, 2, 3 ],
        [ 3, 4, 6, 1, 2 ],
        [ 2, 3, 6, 5, 1 ]
    ];

    match = [
        [[0, 2], [1, 2], [2, 2]],
        [[1, 2], [2, 2], [3, 2]],
        [[2, 2], [3, 2], [4, 2]]
    ];
    t.ok(_.isEqual(findMatches(board.orbs), match));
});

test('matches a cross-match', t => {
    board.orbs = [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 6, 3, 4 ],
        [ 4, 6, 6, 6, 3 ],
        [ 3, 4, 6, 1, 2 ],
        [ 2, 3, 4, 5, 1 ]
    ];

    match = [
        [[2, 1], [2, 2], [2, 3]],
        [[1, 2], [2, 2], [3, 2]]
    ];
    t.ok(_.isEqual(findMatches(board.orbs), match));
});

test('matches a cross-match', t => {
    board.orbs = [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 4, 6, 1, 2, 3 ],
        [ 3, 6, 5, 1, 2 ],
        [ 2, 6, 6, 6, 1 ]
    ];

    match = [
        [[4, 1], [4, 2], [4, 3]],
        [[2, 1], [3, 1], [4, 1]]
    ];
    t.ok(_.isEqual(findMatches(board.orbs), match));
});

test('matches a four match plus corner match', t => {
    board.orbs = [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 6, 6, 6, 6, 3 ],
        [ 3, 4, 6, 1, 2 ],
        [ 2, 3, 6, 5, 1 ]
    ];

    match = [
        [[2, 0], [2, 1], [2, 2]],
        [[2, 1], [2, 2], [2, 3]],
        [[2, 2], [3, 2], [4, 2]]
    ];
    t.ok(_.isEqual(findMatches(board.orbs), match));
});

test('matches a four match plus corner match (inverted)', t => {
    board.orbs = [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 4, 6, 6, 6, 6 ],
        [ 3, 4, 6, 1, 2 ],
        [ 2, 3, 6, 5, 1 ]
    ];

    match = [
        [[2, 1], [2, 2], [2, 3]],
        [[2, 2], [2, 3], [2, 4]],
        [[2, 2], [3, 2], [4, 2]]
    ];
    t.ok(_.isEqual(findMatches(board.orbs), match));
});

test('matches a seven match', t => {
    board.orbs = [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 6, 6, 6, 6, 6 ],
        [ 3, 4, 6, 1, 2 ],
        [ 2, 3, 6, 5, 1 ]
    ];

    match = [
        [[2, 0], [2, 1], [2, 2]],
        [[2, 1], [2, 2], [2, 3]],
        [[2, 2], [2, 3], [2, 4]],
        [[2, 2], [3, 2], [4, 2]]
    ];
    t.ok(_.isEqual(findMatches(board.orbs), match));
});
