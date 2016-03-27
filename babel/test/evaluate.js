import test from 'ava';
import * as _ from 'lodash';
import {names} from './data/names';
import {orbs} from './data/orbs';
import {testMatchData} from './data/evaluate';
import {nonMatchDropped} from './data/evaluate';
import {droppedRandoms} from './data/evaluate';
import {unaffectedOrbs} from './data/evaluate';
import {evaluate} from '../src/board';
import {findMatches} from '../src/board';
import {combineMatches} from '../src/board';
import {Board} from '../src/board';
let board;
let evaluatedOrbs;
let matchDatas;
let name;

test.before(() => {
    board = new Board(5, 5);
    evaluatedOrbs = [];
    matchDatas = [];

    _.each(_.range(orbs.length), i => {
        board.orbs = orbs[i];
        let matchData = board.evaluate(combineMatches(findMatches(board.orbs)), [7, 8]);
        evaluatedOrbs.push(board.orbs);
        matchDatas.push(matchData);
    });  
});

_.each(_.range(orbs.length), j => {
    name = names[j];

    test(`gathers data for ${name}`, t => {
        t.ok(_.isEqual(matchDatas[j], testMatchData[j]));
    });

    test(`removes matches and replaces with valid type orbs for ${name}`, t => {
        _.each(_.flattenDeep(evaluatedOrbs[j]), orb => {
            t.true(_.includes(_.range(9), orb));
        });
    });

    test(`nonmatch orbs drop down into the correct place for ${name}`, t => {
        let dropped = nonMatchDropped[j];
        _.each(dropped, section => {
            let [sliceData, droppedOrbs] = section;
            let [row, start, end] = sliceData;
            t.ok(_.isEqual(_.slice(evaluatedOrbs[j][row], start, end), droppedOrbs));
        });
    });

    test(`orbs from dropOptions fill in the rest of the board for ${name}`, t => {
        let randoms = droppedRandoms[j];
        _.each(randoms, sliceData => {
            let [row, start, end] = sliceData;
            _.each(_.slice(evaluatedOrbs[j][row], start, end), orb => {
                t.true(_.includes([7, 8], orb));    
            });
        });
    });

    test(`unaffected orbs are unchanged for ${name}`, t => {
        let unaffected = unaffectedOrbs[j];
        _.each(unaffected, sliceData => {
            let [row, start, end] = sliceData;
            let beforeSlice = _.slice(orbs[j][row], start, end);
            let evaluatedSlice = _.slice(evaluatedOrbs[j][row], start, end);

            t.true(_.isEqual(beforeSlice, evaluatedSlice));
        });
    });
});
