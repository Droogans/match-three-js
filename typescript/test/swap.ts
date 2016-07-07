import test from 'ava';
import * as _ from 'lodash';
import {Board} from '../src/board';
import {boards} from './data/boards';
let boardInstance = new Board(5, 5);
let swappedOrbs = {};

_.each(boards, (metadata, name) => {
    boardInstance.orbs = _.cloneDeep(metadata.swap.orbsBeforeSwap);
    boardInstance.swap(metadata.swap.swapOrbs);
    swappedOrbs[name] = boardInstance.orbs;
});

_.each(boards, (metadata, name) => {
    test(`swaps into ${name}`, t => {
       t.ok(_.isEqual(swappedOrbs[name], metadata.orbs));
    });
});
