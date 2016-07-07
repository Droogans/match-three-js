import test from 'ava';
import * as _ from 'lodash';
import {Board} from '../src/board';
import {boards} from './data/boards';
import * as attic from './data/attic';
let boardInstance = new Board(5, 5);

/*

Collects data for each `board` after evaluation and stores it in `testBoards`.
This data is then compared to the correct data in `boards` for the tests.

Passing tests could look like this:

testBoards -> {
    'a simple row match': {
        matchData: [
            [6, 3]
        ],
        evaluatedOrbs: [
            [ 1, 7, 8, 7, 5 ],
            [ 5, 2, 3, 4, 4 ],
            [ 4, 1, 2, 3, 3 ],
            [ 3, 5, 1, 2, 2 ],
            [ 2, 3, 4, 5, 1 ]
        ]
    },
    'a simple column match': {
        matchData: [
            [6, 3]
        ],
        evaluatedOrbs: [
            [ 1, 2, 3, 4, 7 ],
            [ 5, 1, 2, 3, 8 ],
            [ 4, 5, 1, 2, 7 ],
            [ 3, 4, 5, 1, 5 ],
            [ 2, 3, 4, 5, 4 ]
        ]
    },
    // and so on...
}

*/
let testBoards = {};
_.each(boards, (metadata, name) => {
    boardInstance.orbs = _.cloneDeep(metadata.orbs);
    boardInstance.attic.orbs = attic.orbs;
    testBoards[name] = {};
    testBoards[name].matchData = boardInstance.evaluate();
    testBoards[name].evaluatedOrbs = boardInstance.orbs;
});

_.each(boards, (metadata, name) => {
    test(`gathers data for ${name}`, t => {
        t.true(_.isEqual(testBoards[name].matchData, metadata.evaluate.matchData));
    });
        
    test(`removes matches and replaces with valid type orbs for ${name}`, t => {
        _.each(_.flattenDeep(testBoards[name].evaluatedOrbs), orb => {
            t.true(_.includes(_.range(10), orb));
        });        
    });
    
    test(`nonmatch orbs drop down into the correct place for ${name}`, t => {
        _.each(metadata.evaluate.nonMatchDropped, section => {
            let [sliceData, droppedOrbs] = section;
            let [row, start, end] = sliceData;
            t.ok(_.isEqual(_.slice(testBoards[name].evaluatedOrbs[row], start, end), droppedOrbs));
        });
    });
    
    test(`orbs from atticOrbs drop down to fill in the rest of the board for ${name}`, t => {
        _.each(metadata.evaluate.atticOrbsDropped, section => {
            let [sliceData, droppedAtticOrbs] = section;
            let [row, start, end] = sliceData;
            t.ok(_.isEqual(_.slice(testBoards[name].evaluatedOrbs[row], start, end), droppedAtticOrbs));
        });
    });
    
    test(`unaffected orbs are unchanged for ${name}`, t => {
        _.each(metadata.evaluate.unaffectedOrbs, sliceData => {
            let [row, start, end] = sliceData;
            let beforeSlice = _.slice(metadata.orbs[row], start, end);
            let evaluatedSlice = _.slice(testBoards[name].evaluatedOrbs[row], start, end);
            t.true(_.isEqual(beforeSlice, evaluatedSlice));
        });
    });
});
