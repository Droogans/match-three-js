import test from 'ava';
import * as _ from 'lodash';
import * as triples from '../src/triples';
import {boards} from './data/boards';

_.each(boards, (metadata, board) => {
    test(`finds triples for ${board}`, t => {
        t.true(_.isEqual(triples.find(metadata.orbs), metadata.triples));
    });
});

_.each(boards, (metadata, board) => {
    test(`combines triples into matches for ${board}`, t => {
        t.true(_.isEqual(triples.combine(metadata.triples), metadata.matches));
    });
});