'use strict';
import test from 'ava';
import * as _ from 'lodash';
import {iterchunks} from '../src/board';
let orbs;
let chunks;
let chunksWithPositionInformation;

test.before(() => {
    orbs  = [ [ 6, 5, 4, 1 ],
              [ 3, 2, 2, 5 ],
              [ 3, 3, 4, 2 ],
              [ 6, 4, 0, 6 ] ];
    chunks = iterchunks(orbs);
    chunksWithPositionInformation = iterchunks(orbs, [4, 2], true);
});

test('has the correct length', t => {
    t.is(chunks.length, 6);
});

test('has the correct chunk size', t => {
    t.same(_.map(chunks, 'length'), _.fill(Array(6), 2));
});

test('each chunk has the correct slice size', t => {
    let allLengths = _.flatten(_.map(chunks, chunk => _.map(chunk, 'length')));
    t.same(allLengths, _.fill(Array(12), 4));
});

test('has the correct chunk contents', t => {
    let correctChunks = [
        [
            [6, 5, 4, 1],
            [3, 2, 2, 5]
        ],
        [
            [3, 2, 2, 5],
            [3, 3, 4, 2]
        ],
        [
            [3, 3, 4, 2],
            [6, 4, 0, 6]
        ],

        // transposed
        [
            [6, 3, 3, 6],
            [5, 2, 3, 4]
        ],
        [
            [5, 2, 3, 4],
            [4, 2, 4, 0]
        ],
        [
            [4, 2, 4, 0],
            [1, 5, 2, 6]
        ]
    ];
    t.same(chunks, correctChunks);
});

test('provides position information', t => {
    let correctChunks = [
        [
            [6, 5, 4, 1],
            [3, 2, 2, 5],
            {
                position: {
                    first: [0, 0],
                    last: [1, 3]
                }
            }
        ],
        [
            [3, 2, 2, 5],
            [3, 3, 4, 2],
            {
                position: {
                    first: [1, 0],
                    last: [2, 3]
                }
            }
        ],
        [
            [3, 3, 4, 2],
            [6, 4, 0, 6],
            {
                position: {
                    first: [2, 0],
                    last: [3, 3]
                }
            }
        ],

        // transposed
        [
            [6, 3, 3, 6],
            [5, 2, 3, 4],
            {
                position: {
                    first: [0, 0],
                    last: [3, 1]
                }
            }
        ],
        [
            [5, 2, 3, 4],
            [4, 2, 4, 0],
            {
                position: {
                    first: [0, 1],
                    last: [3, 2]
                }
            }
        ],
        [
            [4, 2, 4, 0],
            [1, 5, 2, 6],
            {
                position: {
                    first: [0, 2],
                    last: [3, 3]
                }
            }
        ]
    ];

    t.same(chunksWithPositionInformation, correctChunks);
});
