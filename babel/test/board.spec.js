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

test.skip('should have at least one possible match set by default', t => {
    t.ok(board.hasMatch());
});
