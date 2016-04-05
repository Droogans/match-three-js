import test from 'ava';
import * as _ from 'lodash';
import {names} from './data/names';
import {orbs} from './data/orbs';
import {orbsBeforeSwap} from './data/swap';
import {swapOrbs} from './data/swap';
import {Board} from '../src/board';
let board;
let swappedOrbs;

test.before(() => {
    board = new Board(5, 5);
    swappedOrbs = [];
    _.each(_.range(orbs.length), i => {
        board.orbs = _.cloneDeep(orbsBeforeSwap[i]);
        board.swap(swapOrbs[i]);
        swappedOrbs.push(board.orbs);
    });
});

_.each(_.range(orbs.length), i => {
    test(`swaps into ${names[i]}`, t => {
       t.ok(_.isEqual(swappedOrbs[i], orbs[i]));
    });
});

test('keeps board.orbs the same if the swap does not yeild a match', t => {
    board.orbs = _.cloneDeep(orbsBeforeSwap[0]);
    board.swap([[3, 2], [4, 2]]);
    t.ok(_.isEqual(board.orbs, orbsBeforeSwap[0]));
});
