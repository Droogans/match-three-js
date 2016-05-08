import indexOfAll from '../tools/indexOfAll';

// checks for one row of the iterchunk board for a potential match like [0010].
export function hasPotentialMatchInSingleRow (row) {
    return _.max(_.values(_.countBy(row))) > 2;
};

// checks across both rows for a potential match, like [0101]
//                                                     [2031]
export function hasPotentialMatchInPairOfRows (pairOfRows) {
    let allValues = _.uniq(_.flatten(pairOfRows));
    let allMatches = _.map(allValues, value => {
        return _.uniq([...indexOfAll(pairOfRows[0], value),
                       ...indexOfAll(pairOfRows[1], value)]).sort();
    });

    return _.some(allMatches, match => {
        return _.some([
            _.isEqual(match, [0, 1, 2]),
            _.isEqual(match, [1, 2, 3]),
            _.isEqual(match, [0, 1, 2, 3]),
        ]);
    });
};