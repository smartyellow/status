'use strict';

const operatorNames = {
  equal: 'equal to',
  start: 'starting with',
  end: 'ending in',
  contain: 'containing',
  greater: 'greater than',
  less: 'less than',
  greatereq: 'greater than or equal to',
  lesseq: 'less than or equal to',
};

const operators = {
  equal: (a, b) => String(a) === String(b),
  start: (a, b) => String(a).startsWith(b),
  end: (a, b) => String(a).startsWith(b),
  contain: (a, b) => String(a).includes(b),
  greater: (a, b) => Number(a) > Number(b),
  less: (a, b) => Number(a) < Number(b),
  greatereq: (a, b) => Number(a) >= Number(b),
  lesseq: (a, b) => Number(a) <= Number(b),
};

module.exports = { operatorNames, operators };
