const db = require('../util/postgres');
/**
 *
 * @param {string} game selected game
 * @returns promise with minyear and maxYear of selected game
 */
function minMax(game) {
  return db.any(`SELECT min(c.year) as minYear, max(c.year) maxYear 
  FROM cards c
  JOIN game g
    ON c.game_id = g.game_id
  where game_name = $1;`, [game]);
}

/**
 * checks if a game has a years property
 * @param {string} game
 * @returns years boolean
 */
function checkYears(game) {
  console.log('years check');
  return db.any(`
        SELECT years
        FROM game g
        WHERE game_name = $1;`, [game]);
}

module.exports = {
  gameList(req, res) {
    // console.log('THIS IS REQ FROM GAMELIST',req)
    // console.log('req.cookies in gameController --->', req.cookies);
    db.query('SELECT game_name, background, font, game_icon, game_logo, years FROM game')

      .then((data) => { console.log('gamelist data', data)
        return res.json(data);
      })
      .catch(err => console.error(err));
  },

  gameMenu(req, res) {
    const {
      game,
    } = req.params;
    console.log('game', game);
    db.any('SELECT game_category FROM game_categories where game_name =$1', [game])
      .then(async (data) => {
        res.locals.gameMenu = data;
        // eslint-disable-next-line no-return-await
        return await checkYears(game);
      })
      .then(async (years) => { console.log('years', years);
        // can do away with async wait.... later
        if (years[0].years === true) {
          // eslint-disable-next-line no-return-await
          return await minMax(game);
        }
      }).then((range) => {
        const {
          gameMenu,
        } = res.locals;
        gameMenu.push({ yearsRange: range });
        return res.send(gameMenu);
      })
      .catch(err => console.error(err));
  },
};
