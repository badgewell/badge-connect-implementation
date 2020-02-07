import { getById, saveDB, getOneWhere } from '../utils/mongo';
import { Issuer, custom } from 'openid-client';
import { Response } from 'express';
import fetch from 'node-fetch';

custom.setHttpOptionsDefaults({
  timeout: 50000
});

export const callback = async (req: any, res: Response, next) => {
  const { id } = req.params;

  try {
    const redirect_uri = `${req.secure ? 'https' : 'http'}://${
      req.headers.host
    }/callback/${id}`;

    console.log('getting client and wellKnow from db');

    // get both the client and wellKnown from the database
    const [wellKnownMetadata, clientMetadata] = await Promise.all([
      getById(id, 'wellKnows'),
      getById(id, 'clients')
    ]);

    // get the wellKnown manifest from the host
    const issuer = new Issuer(wellKnownMetadata);

    const client = new issuer.Client(clientMetadata);

    // get the request params for use with the callback
    const params = client.callbackParams(req);

    console.log('getting state from the db');

    const { code_verifier, uid } = await getOneWhere(
      { state: params.state },
      'state'
    );

    console.log(code_verifier, uid, redirect_uri);

    console.log('executing callback flow ');
    // get the access_token
    if (Object.keys(params).length) {
      const tokenSet = await client.callback(redirect_uri, params, {
        code_verifier,
        state: params.state,
        response_type: 'code'
      });

      console.log('getting user info');
      // get the user profile
      // const userinfo = await client.userinfo(tokenSet);

      console.log('adding the hostProfiles and accessTokens to the database');

      await Promise.all([
        // saveDB({ ...userinfo, uid, clientInternalId: id }, 'hostProfiles'),
        saveDB({ ...tokenSet, uid, clientInternalId: id }, 'accessTokens')
      ]);

      req.apiBase = wellKnownMetadata.badgeConnectAPI[0].apiBase;
      req.uid = uid;
      req.tokenSet = tokenSet;
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(400).send('oauth flow failed');
  }
};

export const getAssertions = async (req: any, res: any, next) => {
  try {
    console.log('getting initial assertions');

    const response = await fetch(`${req.apiBase}/assertion?limit=11&offset=0`, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + req.tokenSet.access_token }
    });

    const data = await response.json();

    // TODO loop and get all the assertions
    console.log('saving the assertions into the database');
    for (const assertion of data.results) {
      assertion.uid = req.uid;
      assertion.client_id = req.params.id;

      if (typeof assertion.badge === 'string') {
        const object = await fetch(assertion.badge);
        assertion.badge = await object.json();
      }

      console.log(assertion);
      await saveDB(assertion, 'assertions');
    }
  } catch (error) {
    console.error(error);
    res.status(400).send('failed to fetch assertions using the access token');
  }

  next();
};

export const redirect = (req, res) => {
  return res.redirect(
    `${req.secure ? 'https' : 'http'}://${req.headers.host}/profile/${req.uid}`
  );
};
