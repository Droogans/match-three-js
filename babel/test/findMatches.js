import test from 'ava';
import * as _ from 'lodash';
import {findMatches} from '../src/board';
import {Board} from '../src/board';
import {names} from './data/names';
import {orbs} from './data/orbs';
import {foundMatches} from './data/foundMatches';

_.each(_.range(orbs.length), i => {
    test(`matches ${names[i]}`, t => {
        t.true(_.isEqual(findMatches(orbs[i]), foundMatches[i]));
    });
});
