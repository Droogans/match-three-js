import * as _ from 'lodash';
import * as types from '../types';

// return the index of all occurrences of `value` in `list`. [5, 3, 7, 5], 5 -> [0, 3]
export function indexOfAll (list: any[], value: any): number[] {
    return _.reduce(list, (acc: number[], e, i: number) => {
        if (e === value) {
            acc.push(i);
        }

        return acc;
    }, []);
};

/**
 * @private
 * @description Used to provide more granularity to functions that need to call iterchunks
 * on a non-transposed set of orbs, as well as a transposed set of orbs.
 * @see findTriples
 */
export function _iterchunks (orbs: any[][], chunkLimitRange: [number, number], includePositionInformation: boolean, isTransposed: boolean): any[][][] | types.IterchunksWithPosition {
    let chunks = [];
    let [width, height] = chunkLimitRange;
    let [finalPositionWidth, finalPositionHeight] = [orbs[0].length - width, orbs.length - height];
    _.each(_.range(0, finalPositionHeight + 1), heightIndex => {
        _.each(_.range(0, finalPositionWidth + 1), widthIndex => {
            let chunkData: any[] = orbs.slice(heightIndex, heightIndex + height).map(row => {
                return row.slice(widthIndex, widthIndex + width);
            });

            if (includePositionInformation) {
                let startingCoordinates = [heightIndex, widthIndex];
                let endingCoordinates = [heightIndex + height - 1, widthIndex + width - 1];
                if (isTransposed) {
                    startingCoordinates = startingCoordinates.reverse();
                    endingCoordinates = endingCoordinates.reverse();
                }

                chunkData.push({
                    position: {
                        first: startingCoordinates,
                        last: endingCoordinates
                    }
                });
            }

            chunks.push(chunkData);
        });
    });
    return chunks;
};

/**
 * With `orbs` being
 * [ [ 6, 5, 4 ],
 *   [ 3, 2, 2 ],
 *   [ 6, 4, 0 ] ]
 * And with a [3, 2] `chunkLimitRange`, this will yield each 3x2
 * grouping, and then, each available 2x3 grouping.
 * [ [ [6, 5, 4], [3, 2, 2] ], [ [3, 2, 2], [6, 4, 0] ],
 *   [ [6, 3, 6], [5, 2, 4] ], [ [5, 2, 4], [4, 2, 0] ] ]
 *
 * If you want to also return the position of the first member of the chunk,
 * as row/col coordinates, pass in `includePositionInformation`. That will return the
 * same data as above, but with a final piece of information, an object with a `position`
 * key that maps to the first and last row/col coordinates of that chunk.
 * [
 *     [
 *         [6, 5, 4], [3, 2, 2],
 *         {
 *             position: {
 *                 first: [0, 0],
 *                 last: [1, 2]
 *             }
 *         }
 *     ],
 *     [
 *         [3, 2, 2], [6, 4, 0],
 *         {
 *             position: {
 *                 first: [1, 0],
 *                 last: [2, 2]
 *             }
 *         }
 *     ],
 *     [
 *         [6, 3, 6], [5, 2, 4],
 *         {
 *             position: {
 *                 first: [0, 0],
 *                 last: [2, 1]
 *             }
 *         }
 *     ],
 *     [
 *         [5, 2, 4], [4, 2, 0]
 *         {
 *             position: {
 *                 first: [0, 1],
 *                 last: [2, 2]
 *             }
 *         }
 *     ]
 * ]
 */
export function iterchunks (orbs: any[][], chunkLimitRange: [number, number] = [4, 2], includePositionInformation = false): any[][][] | types.IterchunksWithPosition[] {
    let transposedOrbs: any[][] = _.zip(...orbs);
    return [
            ..._iterchunks(orbs, chunkLimitRange, includePositionInformation, false),
            ..._iterchunks(transposedOrbs, chunkLimitRange, includePositionInformation, true)
    ]
};
