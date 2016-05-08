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
