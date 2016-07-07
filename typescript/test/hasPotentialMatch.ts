import test from 'ava';
import * as _ from 'lodash';
import * as orbs from '../src/orbs';
import * as tools from '../src/tools';
import {Board} from '../src/board';
let board;

test.before(() => {
    board = new Board();
});

test('finds potential matches in valid single rows', t => {
    let validRowPotentialMatches = [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];

    _.each(validRowPotentialMatches, validRowPotentialMatch => {
        t.ok(orbs.hasPotentialMatchInSingleRow(validRowPotentialMatch));
    });
});

test('does not find potential matches in invalid single row', t => {
    t.notOk(orbs.hasPotentialMatchInSingleRow([1, 1, 0, 0]));
});

test('reports all indexes of a certain value in a list', t => {
    let row = [3, 3, 5, 8];
    t.same(tools.indexOfAll(row, 3), [0, 1]);
    t.same(tools.indexOfAll(row, 5), [2]);
    t.same(tools.indexOfAll(row, 8), [3]);
    t.same(tools.indexOfAll(row, 9), []);
});

test('finds potential matches in valid row pairs', t => {
    let validRowPairs = [
        [
            [0, 1, 0, 2],
            [1, 0, 4, 3]
        ],
        [
            [0, 0, 1, 2],
            [1, 3, 0, 3]
        ],
        [
            [0, 1, 1, 2],
            [1, 0, 0, 3]
        ],
        [
            [0, 0, 1, 3],
            [1, 5, 0, 0]
        ],
        [
            [0, 0, 0, 3],
            [1, 5, 6, 0]
        ],
        [
            [5, 8, 1, 3],
            [0, 0, 0, 0]
        ]
    ];

    _.each(validRowPairs, validRowPair => {
        t.ok(orbs.hasPotentialMatchInPairOfRows(validRowPair));
    });
});

test('does not find potential matches in invalid row pairs', t => {
    let invalidRowPairs = [
        [
            [0, 1, 3, 0],
            [1, 0, 4, 3]
        ],
        [
            [0, 0, 1, 0],
            [1, 3, 1, 3]
        ],
        [
            [0, 7, 1, 0],
            [1, 0, 5, 3]
        ]
    ];

    _.each(invalidRowPairs, invalidRowPair => {
        t.notOk(orbs.hasPotentialMatchInPairOfRows(invalidRowPair));
    });
});

test('needs shuffle for entire board', t => {
    board.orbs = [
        [ 0, 1, 2, 3, 4, 5, 6, 7 ],
        [ 7, 0, 1, 2, 3, 4, 5, 6 ],
        [ 6, 7, 0, 1, 2, 3, 4, 5 ],
        [ 5, 6, 7, 0, 1, 2, 3, 4 ],
        [ 4, 5, 6, 7, 0, 1, 2, 3 ],
        [ 3, 4, 5, 6, 7, 0, 1, 2 ],
        [ 2, 3, 4, 5, 6, 7, 0, 1 ],
        [ 1, 2, 3, 4, 5, 6, 7, 0 ]
    ];
    t.ok(board.needsShuffle());
    t.notOk(board.hasPotentialMatch());
});

test('has potential match for single row', t => {
    board.orbs = [
        [ 0, 1, 2, 3, 4, 5, 6, 7 ],
        [ 7, 0, 1, 2, 3, 4, 5, 6 ],
        [ 6, 7, 0, 1, 2, 3, 4, 5 ],
        [ 5, 6, 7, 0, 1, 2, 3, 4 ],
        [ 4, 5, 6, 7, 0, 1, 2, 3 ],
        [ 3, 4, 5, 6, 7, 0, 1, 2 ],
        [ 2, 3, 4, 5, 6, 7, 0, 1 ],
        [ 1, 2, 3, 4, 8, 6, 8, 8 ]
    ];
    t.notOk(board.needsShuffle());
    t.ok(board.hasPotentialMatch());
});

test('has potential match for single column', t => {
    board.orbs = [
        [ 0, 1, 2, 3, 4, 5, 6, 7 ],
        [ 7, 0, 1, 2, 3, 4, 5, 6 ],
        [ 6, 7, 0, 1, 2, 3, 4, 5 ],
        [ 5, 6, 7, 0, 1, 2, 3, 4 ],
        [ 4, 5, 6, 7, 0, 1, 2, 8 ],
        [ 3, 4, 5, 6, 7, 0, 1, 2 ],
        [ 2, 3, 4, 5, 6, 7, 0, 8 ],
        [ 1, 2, 3, 4, 5, 6, 7, 8 ]
    ];
    t.notOk(board.needsShuffle());
    t.ok(board.hasPotentialMatch());
});

test('has potential match for two rows', t => {
    board.orbs = [
        [ 0, 1, 2, 3, 4, 5, 6, 7 ],
        [ 7, 0, 1, 2, 3, 4, 5, 6 ],
        [ 6, 7, 0, 1, 2, 3, 4, 5 ],
        [ 5, 6, 7, 0, 1, 2, 3, 4 ],
        [ 4, 5, 6, 7, 0, 1, 2, 3 ],
        [ 3, 4, 5, 6, 7, 0, 1, 2 ],
        [ 2, 3, 4, 5, 6, 8, 0, 1 ],
        [ 1, 2, 3, 4, 5, 6, 8, 8 ]
    ];
    t.notOk(board.needsShuffle());
    t.ok(board.hasPotentialMatch());
});

test('has potential match for two columns', t => {
    board.orbs = [
        [ 0, 1, 2, 3, 4, 5, 6, 7 ],
        [ 7, 0, 1, 2, 3, 4, 5, 6 ],
        [ 6, 7, 0, 1, 2, 3, 4, 5 ],
        [ 5, 6, 7, 0, 1, 2, 3, 4 ],
        [ 4, 5, 6, 7, 0, 1, 2, 3 ],
        [ 3, 4, 5, 6, 7, 0, 8, 2 ],
        [ 2, 3, 4, 5, 6, 7, 0, 8 ],
        [ 1, 2, 3, 4, 5, 6, 7, 8 ]
    ];
    t.notOk(board.needsShuffle());
    t.ok(board.hasPotentialMatch());
});

test('has potential match for rows and columns', t => {
    board.orbs = [
        [ 0, 1, 2, 3, 4, 5, 6, 7 ],
        [ 7, 0, 1, 2, 3, 4, 5, 6 ],
        [ 6, 7, 0, 1, 2, 3, 8, 5 ],
        [ 5, 6, 7, 0, 1, 2, 8, 4 ],
        [ 4, 5, 6, 7, 8, 8, 2, 8 ],
        [ 3, 4, 5, 6, 7, 0, 8, 2 ],
        [ 2, 3, 4, 5, 6, 7, 8, 1 ],
        [ 1, 2, 3, 4, 5, 6, 7, 0 ]
    ];
    t.notOk(board.needsShuffle());
    t.ok(board.hasPotentialMatch());
});
