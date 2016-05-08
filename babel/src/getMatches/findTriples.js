import {_iterchunks} from '../tools/iterchunks';

let _findTriples = (chunks, isTransposed) => {
    let triples = [];

    _.each(chunks, chunk => {
        let orbs = _.first(chunk);
        let metadata = _.last(chunk);
        if (_.uniq(orbs).length === 1) {
            let anchor = metadata.position.first;
            let firstOrb = anchor;
            let secondOrb;
            let thirdOrb;

            if (isTransposed) {
                secondOrb = [anchor[0] + 1, anchor[1]];
                thirdOrb = [anchor[0] + 2, anchor[1]];
            } else {
                secondOrb = [anchor[0], anchor[1] + 1];
                thirdOrb = [anchor[0], anchor[1] + 2];
            }

            let absolutePositions = [
                firstOrb,
                secondOrb,
                thirdOrb
            ];
            triples.push(absolutePositions);
        }
    });

    return triples;
};

/**
  * @description Gathers all triples, which are the coordinates for all instances of 
  * three consecutive matching orbs, first in rows, then in columns.
  */
export function findTriples(orbs) {
    let chunksOriginal = _iterchunks(orbs, [3, 1], true);
    let chunksTransposed = _iterchunks(_.zip(...orbs), [3, 1], true, true);

    return [
            ..._findTriples(chunksOriginal, false),
            ..._findTriples(chunksTransposed, true)
    ];
};
