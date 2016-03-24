import test from 'ava';
import * as _ from 'lodash';
import {testOrbs} from './data/evaluate';
import {testCombined} from './data/evaluate';
import {testMatchData} from './data/evaluate';
import {evaluate} from '../src/board';
import {findMatches} from '../src/board';
import {combineMatches} from '../src/board';
import {Board} from '../src/board';
let board = new Board(5, 5);
let index;

_.each(_.range(testOrbs.length), i => {
    board.orbs = testOrbs[i];
    let matchData = board.evaluate(combineMatches(findMatches(board.orbs)));

    test(`gathers data: test match ${i}`, t => {
        t.ok(_.isEqual(matchData, testMatchData[i]));
    });

    test(`removes matches and replaces with valid type orbs: test match ${i}`, t => {
        _.each(_.flattenDeep(board.orbs), orb => {
            t.true(_.includes(board.types, orb))
        });
    });
});

// still needs to be iterated through all matches
 test('nonmatch orbs drop down into the correct place', t => {
     board.orbs = [
         [ 1, 2, 3, 4, 5 ],
         [ 5, 1, 2, 3, 4 ],
         [ 4, 5, 1, 2, 3 ],
         [ 3, 6, 6, 6, 2 ],
         [ 2, 3, 4, 5, 1 ]
     ];
     board.evaluate(combineMatches(findMatches(board.orbs)));

     t.same(_.slice(board.orbs[3], 1, 4), [5, 1, 2]);
     t.same(_.slice(board.orbs[2], 1, 4), [1, 2, 3]);
     t.same(_.slice(board.orbs[1], 1, 4), [2, 3, 4]);
 });

// still needs to be iterated through all matches
 test('unaffected orbs are unchanged', t => {
     board.orbs = [
         [ 1, 2, 3, 4, 5 ],
         [ 5, 1, 2, 3, 4 ],
         [ 4, 5, 1, 2, 3 ],
         [ 3, 6, 6, 6, 2 ],
         [ 2, 3, 4, 5, 1 ]
     ];
     board.evaluate(combineMatches(findMatches(board.orbs)));

     t.same(board.orbs[4], [2, 3, 4, 5, 1]);
     t.same(board.orbs[3][0], 3);
     t.same(board.orbs[3][4], 2);
     t.same(board.orbs[2][0], 4);
     t.same(board.orbs[2][4], 3);
     t.same(board.orbs[1][0], 5);
     t.same(board.orbs[1][4], 4);
     t.same(board.orbs[0][0], 1);
     t.same(board.orbs[0][4], 5);
 });
