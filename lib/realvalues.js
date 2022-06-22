'use strict';

const realValueNames = {
  httpstatus: 'HTTP status code',
  body: 'Response body',
  bodylength: 'Response body length',
  ok: 'Response OK?',
  redir: 'Redirected?',
  restype: 'Response type',
};

const realValues = {
  httpstatus: ({ res }) => res.status,
  body: ({ body }) => body,
  bodylength: ({ body }) => body.length,
  ok: ({ res }) => res.ok,
  redir: ({ res }) => res.redirected,
  restype: ({ res }) => res.type,
};

module.exports = { realValueNames, realValues };
