'use strict';

// Round minutes up to 10 and remove seconds
// e.g. 15:34:51 -> 15:30:00
function roundDate(d) {
  d.setMinutes(Math.round(d.getMinutes() / 10) * 10);
  d.setSeconds(0, 0);
  return d;
}

module.exports = { roundDate };
