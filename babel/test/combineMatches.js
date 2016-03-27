import test from 'ava';
import * as _ from 'lodash';
import {names} from './data/names';
import {combineMatches} from '../src/board';
import {combinedMatches} from './data/combinedMatches';
import {foundMatches} from './data/foundMatches';

_.each(_.range(foundMatches.length), i => {
    test(`combines ${names[i]}`, t => {
        t.ok(_.isEqual(combineMatches(foundMatches[i]), combinedMatches[i]));
    });
});
