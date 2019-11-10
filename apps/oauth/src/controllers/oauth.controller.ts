import assert from 'assert';
import Provider from 'oidc-provider';

import { Account } from './../services/account.service';

process.env.PORT = '3000';
process.env.SECURE_KEY =
  'asupersecretpasswordthatnoonecanguess,anotherpassowrdthatismuchstorgerthantthefirstone';

assert(process.env.PORT, 'process.env.PORT missing');
// assert(process.env.HEROKU_APP_NAME, 'process.env.HEROKU_APP_NAME missing');
assert(
  process.env.SECURE_KEY,
  'process.env.SECURE_KEY missing, run `heroku addons:create securekey`',
);
assert.equal(
  process.env.SECURE_KEY.split(',').length,
  2,
  'process.env.SECURE_KEY format invalid',
);

// tslint:disable-next-line: no-var-requires
const jwks = require('./../../jwks.json');

// simple account model for this application, user list is defined like so

const oidc = new Provider(`http://localhost:3000`, {
  // adapter: the adapter to use later on ,
  clients: [
    {
      client_id: 'foo',
      grant_types: ['implicit'],
      redirect_uris: ['https://about.badgewell.com'],
      response_types: ['id_token'],
      token_endpoint_auth_method: 'none',
    },
  ],
  jwks,

  // oidc-provider only looks up the accounts by their ID when it has to read the claims,
  features: {
    // disable the packaged interactions
    devInteractions: { enabled: false },

    introspection: { enabled: true },
    revocation: { enabled: true },
  },
  // passing it our Account model method is sufficient, it should return a Promise that resolves
  // with an object with accountId property and a claims method.
  findAccount: Account.findAccount,

  // let's tell oidc-provider you also support the email scope, which will contain email and
  // email_verified claims
  claims: {
    email: ['email', 'email_verified'],
    openid: ['sub'],
  },
  scopes: [
    'openid',
    'profile',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.readonly',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.create',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/profile.readonly',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/profile.update',
    'offline_access',
  ],

  // let's tell oidc-provider where our own interactions will be
  // setting a nested route is just good practice so that users
  // don't run into weird issues with multiple interactions open
  // at a time.

  interactions: {
    url: async (ctx, interaction) => {
      return `/interaction/${ctx.oidc.uid}`;
    },
  },
  // the routes defined by the library
  routes: {
    authorization: '/authorization',
    check_session: '/session/check',
    code_verification: '/device',
    device_authorization: '/device/auth',
    end_session: '/session/end',
    introspection: '/token/introspection',
    jwks: '/jwks',
    pushed_authorization_request: '/request',
    registration: '/registration',
    revocation: '/token/revocation',
    token: '/token',
    userinfo: '/me',
  },
});

oidc.proxy = true;
oidc.keys = process.env.SECURE_KEY.split(',');

export const callback = oidc.callback;

export const startInteraction = async (req, res, next) => {
  try {
    // tslint:disable-next-line: no-console
    console.log('here');
    const details = await oidc.interactionDetails(req, res);
    console.log(
      'see what else is available to you for interaction views',
      details,
    );
    const { uid, prompt, params } = details;

    const client = await oidc.Client.find(params.client_id);

    if (prompt.name === 'login') {
      return res.render('login', {
        client,
        details: prompt.details,
        flash: undefined,
        params,
        title: 'Sign-in',
        uid,
      });
    }

    return res.render('interaction', {
      client,
      details: prompt.details,
      params,
      title: 'Authorize',
      uid,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

export const confirm = async (req, res, next) => {
  try {
    const result = {
      consent: {
        // rejectedScopes: [], // < uncomment and add rejections here
        // rejectedClaims: [], // < uncomment and add rejections here
      },
    };
    await oidc.interactionFinished(req, res, result, {
      mergeWithLastSubmission: true,
    });
  } catch (err) {
    next(err);
  }
};
export const abort = async (req, res, next) => {
  try {
    const result = {
      error: 'access_denied',
      error_description: 'End-User aborted interaction',
    };
    await oidc.interactionFinished(req, res, result, {
      mergeWithLastSubmission: false,
    });
  } catch (err) {
    next(err);
  }
};
