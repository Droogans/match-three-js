import test from 'ava';
import * as _ from 'lodash';
import {boards} from './data/boards';
import {Board} from '../src/board';
let boardInstance = new Board(5, 5);

_.each(boards, (metadata, name) => {
    test(`unmatches ${name}`, t => {
        boardInstance.orbs = metadata.orbs;
        boardInstance.unmatch();
        t.false(boardInstance.hasMatch());
    });
});

test('unmatches a 3x3 nine-match', t => {
    boardInstance.orbs = [
        [1, 2, 3, 4, 5],
        [2, 0, 0, 0, 1],
        [3, 0, 0, 0, 2],
        [4, 0, 0, 0, 3],
        [5, 1, 2, 3, 4]
    ];
    boardInstance.unmatch();
    t.false(boardInstance.hasMatch());
})
