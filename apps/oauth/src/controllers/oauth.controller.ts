import assert from 'assert';
import Provider from 'oidc-provider';
import MongoAdapter from '../adapters/mongodb';
import { Account } from './../services/account.service';

const jsonKeys = {
  keys: [
    {
      crv: 'P-256',
      x: '41_cXrR9JDLRGipOZyYLdYio8q-sGUpqQMER1c2wyu0',
      y: 'MIO0ZHtea1yYG4IuL_IEeW8yiYVimk6Ksep3n-mn6OY',
      d: 'yEwu47S5ocs3SX-_Rmp5m2nX2jh3sWb_3veqwliwKKY',
      kty: 'EC',
      kid: '7XsB-w1RJA4mZKvWYyzFknmKKCxeI-loT7Tj9MRgF_E',
      use: 'sig'
    },
    {
      crv: 'Ed25519',
      x: 'zCTB3jQAfsi3MlPCdFBooy8Qh_ULreJcsoyvs0y-xOs',
      d: 'uv4STzeHWnkcBZWnPP2PklUQPbuZZNjs8Ri2QnXW--E',
      kty: 'OKP',
      kid: 'RgvlWI4PhLU2_DK3d7IaOdNgGbwHnYMSQ9hUQM0zBZM',
      use: 'sig'
    },
    {
      crv: 'P-256',
      x: 'BbeIf6hFMRPFZ4ISmdiflB-urmNFwBdtu-ftgyG6u8k',
      y: 'VIiHns4StrxTWzPOYS-nuUFJktl42YQBCUWdEZePzKw',
      d: '50bXpBFHvatqC0qY3RtoqH_TKhH65AKltBgryz0XTJk',
      kty: 'EC',
      kid: 'fJmRtD6w4SZNEie38W9gIqR1Oko2qzG9CjzfQTBzFPQ',
      use: 'enc'
    },
    {
      e: 'AQAB',
      n:
        't518p96StvzECTcivZ-0OHW5BQcmC1VZGHnB8l9Kz6xeOn9Dmsaz1vO9uvZvY-281VJBBSlcdmo5nBIy1kKekNQlt940QA7v2GAzGmBG8xNITO_ISznyZBV593ihacRjay-tqLqoCmTfykjlNXAjwz1LMGIJ5XxDf5s_zg_MxojbsehKEJN0cDmhZL-SSrPJG7C4DFP-p7eesm8tAOIlY0zWvLU3VUrbZIgf_xtJ3x-co3VHbzc4T-zqFwJUMolIeiYOeCRW-v92qaw5qwSJolaSqupus2UincE3AQGZZz5DfRUyhrtltHh-84IHrSGMwxwttH8GkJclBHmLrwkn1Q',
      d:
        'HbCMaIR3yrjiZe8RYgIB3SND8IkwYKLDTk7ZynwYF65yahkL8GnyyG4PHr0cU9csMn4jX1dJySfx-seCityo0RhMpQd8AWOo6p7bhIdO0Z0rkq0vAOL0y7QhTZ-m0fhcbwd9mAveghe_i_Dvhw2D6tztXHxtxzqpm2eaEJLDdNKD44bDmD9A_WxbeaZJ3q1PkcyZ0h9PGaDRzBoxrpsWhy1jHDZFERrDmUQE3i4uSR_ZenEG94vqLMXnRSvO9L3tdhQlwVlP3hHGySoTfiYF55x1yv9IBBwKgTN1x3IpWh4dSmOBBJybndNSuGyiDAObfGTvn94TNWLYe3s7JU2BnQ',
      p:
        '776hMclxqqZ7wbHD4AYjyZw-_JqyyzdvUpYF1qyDDlbs5egJ72GiXkczLHxYDchjn3MwXxDPTjW9KhTxBtpDIBmIM7yAxB1NL8QgNm0k_EuIdG9MOiWLc7Cf0LnsoyLNjsolVfKzWjRMw4fu8-UY0Kh0rItMh7ZrB3WD0dP1Cns',
      q:
        'xBCW6MJdTqnksqUMw2uxmHZVKaiJhVvxiVQkyFvwOgvq9jpEe6PxCq2vDndPiCd_Hvpu9N5fXoziwhV24e0Qi_SkCvbMu7tUFtkoRgIki6H5sGBcNLa5UjofRiybPF3RnfRQGK4VIgeHQLRtBHMgvEweh4sXgmqcQlGU9X0Kbe8',
      dp:
        'AbGYE_D3Y5w_fZPS7W89q3v2GfTB1Ju0pqG2stiPKHfGvq0P_Of0rLPWEbdjK93BjmvS6KkGvee1SWnSdhjupnhntO3c_wWx-OdqztegjkO-WAw9Pp_rR0r1JhVaLaDeUObuspe_WqDJ9guszX5N2ZOHF3z4cnEAepIC92WG8qc',
      dq:
        'Ic8OhsKFXnwzYI7PfZ9Dd5voIY_bbvCk3N5ynU4lRY0qjh0MFBn4BbRffGocf8j3xbq_iWATJ_W5YGhdIKZFdSzRYMagFTs_S9VUeYYDEUT0DnL_U2Oy3zgAjpRAjI9NByTK7waNxFlx_DlglyTXH0Es_oiAnE-P9Gum-RH_y2c',
      qi:
        'YGLdb_4J7NCxw2x5DE2tChmTIsqPt6z1XnrtcfdrOQx7IAMQLKAxyQaWhiiCjT_PkYw2qY9ksobZVYjTIiz1SN_o2raB8XOOxk0cWknthSgqSpcHxspiYzGhk2gdWW2eioAWXagmuXwvR6I8KOSW8aYPG9QpO4DlmqykB2HbqRU',
      kty: 'RSA',
      kid: '2YbBuGjUUhrIZnQC4e3Ww6mXHrTZeBS3otd4lw6gz-Q',
      use: 'enc'
    },
    {
      e: 'AQAB',
      n:
        '1HlzhthyhBOU_aLQnRwNoZ-ypqsJQb9OGTfb_Sa-9W1pWX9VhalZB-U-7LwlWFHax1r6gbAWmEfVY9U8NudONnu3JwULoA6GXWLmYwm3ItpBVwDQWx57L2XmlmZNO9zXMj87WEcMsd7nbEr8HPoifD2RapxE81tsC7YJmCC9JaS1TlbG5j6-naBx7q_MlosqhQXISoZljoIIL-dFHwsS-p_75lxpKBZHXJm41IJRoJX9GAFoNeYqhojUthGSx1idByJJT2AlrcC66m4P6RnDgY1mRiIIkewVaiAyHf2yeADjIgEmf3Ay0fsjfDzThpR14_iClCFKb1oJV3m29vl90w',
      d:
        'tSf79Pu036Fmhb58yYdyo9vqUSpA0TrP1raGrVeMtuqbSQBFJZoW26F8vhFIcf4QX6rVLR-6lAmjCeRz24fpapCevvkRSV04-IRrVAOjjmayEQETpKzfcLEcIh2FOkX3gNLiwUiKrVkUzYM9Y2NtZaqEwnYMX8UR4QZLNdasDlvLrrwhGrBXSzF7itYTTGjKIP9W4puAi3fF4kGwxHifidrlFosOazTvvIBCpGvrK8VOuQ1PDXtur4NVKbHWx8RBb2gLiC5-rkNvr4oAtE6P8NmVTDP9eN7g9k8sXLPwF05vrnVOen6zUkCDpRQOOOTcT73b3lVPsBbKW4dZTKINqQ',
      p:
        '7Mc_GUjUQXwBvqAF6TQIR4SYqfP5kLXSpGDAkVVHmQQ5YK8fcJL-oKhHpCX4UeW-zRwrpn3yc8ujafRb-JFdQ84TX5qKdh2xMghZrDRHUzGZecyn0z3jweoO5QTjHUxm1GIO-wmhrDbuVj0w9_G-_AwkgCGBKYwjkeq26uElpl0',
      q:
        '5bkeYIcOZqERogdtghS0EjcEZAcDfvZAqthWyh4aO0M50WKkfpzbPD4Ecl7DeJYgfAVmp7JXj-JDzBcgb55ZGUH1OF6bONWhTeMquR9Lb01wlLLeT5Es7bCC-7QvmoCGx1yJbZFDRtvoBs4v7lfDIXaeBxL9mZb191o1DR1zEe8',
      dp:
        'SHP3tO76NEeT6RbieCe52NiUNn03graAjFgm1NH5pLMMM6-iuTnhvJuBwJL112mr5uuV1852YESR7pwdgIRKu7LVbs3FTLttO1geyHj-0lA9HG4pdJRdmzrZ7-586Lw2Qwr2do7N7_qnF7CFyXkp7cpxaNvXwDTntYDTFDBs6uk',
      dq:
        'fJDZ8PurCmmSlyqx7dRuJGZi4h6PfbvoKvvua-DQ1ovIgUqc6e8CTnNOk_ngwrWdXcLL_GkPY_0MSFHOC9hwdeq3Ht7mCnaE5iglVYarr-ns_yTSuZB-LVEGZZg6K-w_qUD7YEdhlL3P3kjV4scCD1YzsKBSlYMvUvY-SCNM708',
      qi:
        'PSVROWg_VyeZ0k9xW03VqIz-TP_7XWKwjCLXobe0hDxTpbeBwKga6uT1tummgleCSkSdHUR-q6nfh03hV4JVXFp_LpiLQk-jMspcFCerZQeGFMwMNFeuBSrJd-vYDBdqIpf61aGIA40xfozIKVAuaQQ-sWMZhRKHmxLmrK3N7qI',
      kty: 'RSA',
      kid: 'C-TWI9LIludHsVJAoyz6AnccECOPnyfdliZkJ2bJCxw',
      use: 'sig'
    }
  ]
};

process.env.SECURE_KEY =
  'asupersecretpasswordthatnoonecanguess,anotherpassowrdthatismuchstorgerthantthefirstone';

assert(
  process.env.SECURE_KEY,
  'process.env.SECURE_KEY missing, run `heroku addons:create securekey`'
);
assert.equal(
  process.env.SECURE_KEY.split(',').length,
  2,
  'process.env.SECURE_KEY format invalid'
);

const oidc = new Provider(`http://localhost:5000`, {
  adapter: MongoAdapter, // the adapter to use later on ,
  // tslint:disable-next-line:object-literal-sort-keys
  clientDefaults: {
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    token_endpoint_auth_method: 'client_secret_basic'
  },
  pkceMethods: ['S256'],

  // jwks: jsonKeys as JSONWebKeySet,
  // oidc-provider only looks up the accounts by their ID when it has to read the claims,
  // tslint:disable-next-line:object-literal-sort-keys
  features: {
    // disable the packaged interactions
    devInteractions: { enabled: false },
    introspection: { enabled: true },
    registration: { enabled: true },
    registrationManagement: { enabled: true },
    revocation: { enabled: true }
  },
  // passing it our Account model method is sufficient, it should return a Promise that resolves
  // with an object with accountId property and a claims method.
  findAccount: Account.findAccount,

  // let's tell oidc-provider you also support the email scope, which will contain email and
  // email_verified claims
  claims: {
    email: ['email', 'email_verified'],
    openid: ['sub']
  },
  scopes: [
    'openid',
    'profile',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.readonly',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.create',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/profile.readonly',
    'https://purl.imsglobal.org/spec/ob/v2p1/scope/profile.update',
    'offline_access'
  ],

  // let's tell oidc-provider where our own interactions will be
  // setting a nested route is just good practice so that users
  // don't run into weird issues with multiple interactions open
  // at a time.

  interactions: {
    url: async (ctx, interaction) => {
      return `/interaction/${ctx.oidc.uid}`;
    }
  },
  //   the routes defined by the library
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
    userinfo: '/me'
  }
});

oidc.proxy = true;
oidc.keys = process.env.SECURE_KEY.split(',');

export const callback = oidc.callback;

export const startInteraction = async (req, res, next) => {
  try {
    // tslint:disable-next-line: no-console
    const details = await oidc.interactionDetails(req, res);
    console.log(
      'see what else is available to you for interaction viewsm',
      details
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
        uid
      });
    }

    return res.render('interaction', {
      client,
      details: prompt.details,
      params,
      title: 'Authorize',
      uid
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { uid, prompt, params } = await oidc.interactionDetails(req, res);
    const client = await oidc.Client.find(params.client_id);

    const accountId = await Account.authenticate(
      req.body.email,
      req.body.password
    );

    if (!accountId) {
      res.render('login', {
        client,
        details: prompt.details,
        uid,
        // tslint:disable-next-line:object-literal-sort-keys
        params: {
          ...params,
          login_hint: req.body.email
        },
        title: 'Sign-in',
        flash: 'Invalid email or password.'
      });
      return;
    }

    const result = {
      login: {
        account: accountId
      }
    };

    await oidc.interactionFinished(req, res, result, {
      mergeWithLastSubmission: false
    });
  } catch (err) {
    next(err);
  }
};

export const confirm = async (req, res, next) => {
  try {
    const result = {
      consent: {
        // rejectedScopes: [], // < uncomment and add rejections here
        // rejectedClaims: [], // < uncomment and add rejections here
      }
    };
    await oidc.interactionFinished(req, res, result, {
      mergeWithLastSubmission: true
    });
  } catch (err) {
    next(err);
  }
};
export const abort = async (req, res, next) => {
  try {
    const result = {
      error: 'access_denied',
      error_description: 'End-User aborted interaction'
    };
    await oidc.interactionFinished(req, res, result, {
      mergeWithLastSubmission: false
    });
  } catch (err) {
    next(err);
  }
};
