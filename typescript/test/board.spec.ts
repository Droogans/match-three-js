'use strict';
import test from 'ava';
import * as _ from 'lodash';
import {Board} from '../src/board';
import * as orbs from '../src/orbs';
import * as triples from '../src/triples';
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

test('should have at least one possible match set and should not have a match event by default', t => {
    _.each(_.range(100), i => {
        board = new Board();
        t.ok(board.hasPotentialMatch() && !board.hasMatch());
    });
});

test('attic orbs should have at least one possible match set and should not have a match event by default', t => {
    _.each(_.range(100), i => {
        board = new Board();
        t.ok(orbs.hasPotentialMatch(board.attic.orbs) && !Boolean(triples.find(board.attic.orbs)[0]));
    });
});

test('unique attic orb types can be assigned', t => {
    let atticBoard1 = new Board(8, 8, _.range(5));
    atticBoard1.attic.types = _.range(5, 10);
    atticBoard1.attic.generateOrbs();
    t.same(_.range(5, 10), _.uniq(_.flatten(atticBoard1.attic.orbs)).sort());
});

test('attic orbs can be set manually', t => {
    let testAttic = [
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7],
        [0, 1, 2, 3, 4, 5, 6, 7]
    ];
    let atticBoard2 = new Board();
    atticBoard2.attic.orbs = testAttic;
    t.is(atticBoard2.attic.orbs, testAttic);
});
