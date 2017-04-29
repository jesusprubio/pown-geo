/*
  Copyright Jesús Pérez <jesusprubio@fsf.org>

  This code may only be used under the MIT license found at
  https://opensource.org/licenses/MIT.
*/

'use strict';

const getLoc = require('geoip-lite').lookup;
const logger = require('pown-logger');
const validator = require('pown-validator');

let pkgName = require('./package').name;


const defaults = '8.8.8.8';
pkgName = pkgName.slice(5);


exports.yargs = {
  command: pkgName,
  describe: 'Geolocate a host.',

  builder: {
    rhost: {
      type: 'string',
      alias: 'r',
      describe: `IP address to search for [${defaults}]`,
    },
  },

  handler: (argv = {}) => {
    const rhost = argv.rhost || defaults;

    logger.title(pkgName);

    if (validator.isPrivateIp(rhost)) {
      logger.result('Private IP');

      return;
    }

    const data = getLoc(rhost);

    logger.result(null, {
      ipRange: data.range,
      country: data.country,
      region: data.region,
      city: data.city,
      latitude: data.ll[0],
      longitude: data.ll[1],
      metro: data.metro,
      zip: data.zip,
      map: `https://www.google.es/maps/place/${data.ll[0]},${data.ll[1]}`,
    });
  },
};
