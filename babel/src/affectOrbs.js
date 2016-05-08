/**
  * 1. logs data for each match and replaces each orb with '\u241a'
  * 2. replaces each '\u241a' and all above orbs with either the orb directly above or a random new orb
  * 3. returns the match data -> [[match1Type, match1Amount], [match2Type, match2Amount], ...]
  */
export function evaluate(orbs, height, width, matches, dropOptions) {
    let matchData = [];

    _.each(matches, match => {
        // log data
        matchData.push([orbs[match[0][0]][match[0][1]], match.length]);
        // replace each coordinate with '\u241a'
        _.each(match, coord => {
            let [row, col] = coord;
            orbs[row][col] = '\u241a'
        })
    });

    /**
      * drop down and generate matches
      * 1. reads across starting from the top
      * 2. when it hits '\u241a', loops from that position directly up
      * 3. if the row isn't 0, it takes the orb from above
      * 4. if the row is 0, it creates a random orb
      */
    _.each(_.range(height), row =>{
        _.each(_.range(width), col => { //1
            if (orbs[row][col] == '\u241a') {
                for (var z = row; z >= 0; z--) { //2
                    if (z > 0) { //3
                        orbs[z][col] = orbs[z - 1][col];
                    } else { //4
                        orbs[z][col] = _.sample(dropOptions);;
                    };
                };
            };
        });
    });

    return [orbs, matchData];
};

/**
  * @private
  * @description Does the dirty work for unmatch by taking a given orb and swapping with a neighbor
  * of a different type, or a random orb on the board if there are no valid neighbors.
  * @see unmatch
  */
let _unmatch = (row, col, match, skipToRandom = false) => {
    let thisOrb = orbs[row][col];
    let swapped = false;
    let directions = _.shuffle(['up', 'down', 'left', 'right']);
    for (let i = 0; i < 4; i++) {
        // abandons the process and jumps to swapping a random orb
        if (skipToRandom) { break };
        if (directions[i] === 'up' && !_.isUndefined(orbs[row - 1]) && orbs[row - 1][col] !== thisOrb) {
            this.swap([[row, col], [row - 1, col]], false);
            swapped = true;
            break;
        } else if (directions[i] === 'down' && !_.isUndefined(orbs[row + 1]) && orbs[row + 1][col] !== thisOrb) {
            this.swap([[row, col], [row + 1, col]], false);
            swapped = true;
            break;
        } else if (directions[i] === 'left' && !_.isUndefined(orbs[row][col - 1]) && orbs[row][col - 1] !== thisOrb) {
            this.swap([[row, col], [row, col - 1]], false);
            swapped = true;
            break;
        } else if (directions[i] === 'right' && !_.isUndefined(orbs[row][col + 1]) && orbs[row][col + 1] !== thisOrb) {
            this.swap([[row, col], [row, col + 1]], false);
            swapped = true;
            break;
        }
    }
    while (!swapped) {
        let [randomRow, randomCol] = [_.random(this.height - 1), _.random(this.width - 1)];
        if (!_.includes(match, [randomRow, randomCol]) && orbs[randomRow][randomCol] !== thisOrb) {
            this.swap([[row, col], [randomRow, randomCol]], false);
            swapped = true;
        }
    }
};
    
/**
  * @description Removes all match events one at a time by swapping a median or intersecting orb
  * with its neighbor or a random orb if necessary. 
  *
  * Intersectiions only occur if the match is not a simple match, i.e. it only spans one
  * column or one row.
  *
  * @example A simple match could go from 
  *         [ 1, 2, 3, 4 ],             [ 1, 2, 5, 4 ],
  *         [ 2, 5, 5, 5 ],             [ 2, 5, 3, 5 ],
  *         [ 3, 4, 1, 2 ],     to      [ 3, 4, 1, 2 ],
  *         [ 4, 1, 2, 3 ]              [ 4, 1, 2, 3 ]
  *
  * @example A multidimensional match could go from 
  *         [ 1, 2, 3, 4 ],             [ 1, 5, 3, 4 ],
  *         [ 2, 5, 5, 5 ],             [ 2, 2, 5, 5 ],
  *         [ 3, 5, 1, 2 ],     to      [ 3, 5, 1, 2 ],     orbs[1][1] was the
  *         [ 4, 5, 2, 3 ]              [ 4, 5, 2, 3 ]      intersection swapped
  *
  * @example A side-by-side match could go from 
  *         [ 1, 5, 5, 5 ],             [ 1, 5, 4, 5 ],                 [ 1, 5, 4, 5 ],
  *         [ 2, 5, 5, 5 ],             [ 2, 5, 5, 5 ],                 [ 2, 5, 1, 5 ],
  *         [ 3, 4, 1, 2 ],     to      [ 3, 4, 1, 2 ],    and then     [ 3, 4, 5, 2 ],
  *         [ 4, 1, 2, 3 ]              [ 5, 1, 2, 3 ]                  [ 5, 1, 2, 3 ]
  */
export function unmatch(orbs) {
    let intersections = [];
    let match = combineMatches(findTriples(orbs))[0];
    // it is a simple match if all of the coords have only 1 rowCoord or 1 colCoord
    let [rowCoords, colCoords] = _.zip(...match);
    let isSimpleMatch = _.uniq(rowCoords).length === 1 || _.uniq(colCoords).length === 1;
    if (isSimpleMatch) {
        // finds the median orb in the match
        let median = Math.floor(match.length / 2);
        let [midRow, midCol] = match[median];

        // Checks for a side-by-side match, which could cause and endless loop.
        // In that case, the skipToRandom argument in _unmatch is triggered.
        let midNeighbors;
        if (_.uniq(rowCoords).length === 1) {
            midNeighbors = [orbs[midRow][midCol - 1], orbs[midRow][midCol + 1]];
        } else {
            midNeighbors = [orbs[midRow - 1][midCol], orbs[midRow + 1][midCol]];
        }
        let isSideBySideMatch = _.includes(midNeighbors, orbs[midRow][midCol]);

        this._unmatch(...match[median], match, isSideBySideMatch);
    } else {
        // collects which rows and columns have matches in them
        let matchRows = [];
        let matchCols = [];
        _.each(_.countBy(rowCoords), (v, k) => {
            if (v > 2) {
                matchRows.push(_.toInteger(k));
            };
        });
        _.each(_.countBy(colCoords), (v, k) => {
            if (v > 2) {
                matchCols.push(_.toInteger(k));
            };
        });
        // if a coordinate is in a row match and a column match, it is an intersection
        _.each(match, coords => {
            if (_.includes(matchRows, coords[0]) && _.includes(matchCols, coords[1])) {
                intersections.push(coords);
            };
        });
        // chooses a random intersection to unmatch 
        this._unmatch(..._.sample(intersections), match);
    };    
    return orbs;
};
