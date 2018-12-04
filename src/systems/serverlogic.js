/**
 *  @author   Seirai <seilaizh@gmail.com>
 *  serverlogic.js
 *  Where a majority of the server authoritative logic will be placed.
 */
const fs = require('fs');

class Logic {
  constructor()
  {
    let rawMap;
    fs.readFile('../../assets/maps/testmap1.json', 'utf8', (err, data) =>
    {
      if(err) throw err;
      rawMap = JSON.parse(data);
    });
    console.log(rawMap);
  }
}

module.exports.Logic;
