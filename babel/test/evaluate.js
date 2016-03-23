import test from 'ava';
import * as _ from 'lodash';
import {findMatches} from '../src/board';
import {combineMatches} from '../src/board';
import {Board} from '../src/board';
let board, exampleMatches, correctMatches, answer;

test.before(() => {
    board = new Board(5, 5);
    exampleMatches = [[
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 4, 5, 1, 2, 3 ],
        [ 3, 6, 6, 6, 2 ],
        [ 2, 3, 4, 5, 1 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 4, 5, 1, 2, 6 ],
        [ 3, 4, 5, 1, 6 ],
        [ 2, 3, 4, 5, 6 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 4, 5, 1, 2, 3 ],
        [ 3, 4, 5, 1, 2 ],
        [ 2, 6, 6, 6, 6 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 6, 4 ],
        [ 4, 5, 1, 6, 3 ],
        [ 3, 4, 5, 6, 2 ],
        [ 2, 3, 4, 6, 1 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 6, 6, 6, 6, 6 ],
        [ 3, 4, 5, 1, 2 ],
        [ 2, 3, 4, 5, 1 ]
    ], [
        [ 1, 2, 6, 4, 5 ],
        [ 5, 1, 6, 3, 4 ],
        [ 4, 5, 6, 2, 3 ],
        [ 3, 4, 6, 1, 2 ],
        [ 2, 3, 6, 5, 1 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 6, 3, 4 ],
        [ 4, 6, 6, 6, 3 ],
        [ 3, 4, 6, 1, 2 ],
        [ 2, 3, 4, 5, 1 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 4, 6, 1, 2, 3 ],
        [ 3, 6, 5, 1, 2 ],
        [ 2, 6, 6, 6, 1 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 6, 6, 6, 6, 3 ],
        [ 3, 4, 6, 1, 2 ],
        [ 2, 3, 6, 5, 1 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 4, 6, 6, 6, 6 ],
        [ 3, 4, 6, 1, 2 ],
        [ 2, 3, 6, 5, 1 ]
    ], [
        [ 1, 2, 3, 4, 5 ],
        [ 5, 1, 2, 3, 4 ],
        [ 6, 6, 6, 6, 6 ],
        [ 3, 4, 6, 1, 2 ],
        [ 2, 3, 6, 5, 1 ]
    ]];
});
test.skip('gathers data for each match', t=> {
     let correctMatchData = [[6, 3], [6, 3], [6, 4], [6, 4],
                             [6, 5], [6, 5], [6, 5], [6, 5], 
                             [6, 6], [6, 6], [6, 7]];
     _.each(_.range(11), i => {
         board.orbs = exampleMatches[i]
         t.same(board.evaluate(combineMatches(findMatches(board.orbs))), correctMatchData[i]);
     });
 });
 
 test.skip('makes sure matches have been removed and all orbs are valid types', t=> {
     board.orbs = [
         [ 3, 8, 8, 8, 8, 3, 6, 6 ],
         [ 4, 2, 0, 5, 3, 0, 1, 5 ],
         [ 1, 4, 3, 8, 5, 4, 6, 6 ],
         [ 3, 5, 8, 8, 8, 3, 3, 4 ],
         [ 1, 1, 3, 8, 5, 2, 6, 2 ],
         [ 3, 2, 5, 4, 5, 0, 4, 0 ],
         [ 1, 3, 1, 6, 1, 6, 3, 3 ],
         [ 1, 0, 3, 0, 1, 1, 3, 3 ]
     ];
     board.evaluate(combineMatches(findMatches(board.orbs)));
 
     _.each(_.flattenDeep(board.orbs), orb => {
         t.true(_.includes(board.types, orb))
     });
 });
 
 test.skip('nonmatch orbs drop down into the correct place', t => {
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
 
 test.skip('unaffected orbs are unchanged', t => {
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