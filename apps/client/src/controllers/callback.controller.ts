import { getById, saveDB, getOneWhere } from '../utils/mongo';
import { Issuer } from 'openid-client';
import { Request, Response } from 'express';
import fetch from 'node-fetch';

export const callback = async (req: any, res: Response, next) => {
  const { id } = req.params;

  const redirect_uri = `http://${req.headers.host}/callback/${id}`;

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
    const userinfo = await client.userinfo(tokenSet);

    console.log('adding the hostProfiles and accessTokens to the database');

    await Promise.all([
      saveDB({ ...userinfo, uid, clientInternalId: id }, 'hostProfiles'),
      saveDB({ ...tokenSet, uid, clientInternalId: id }, 'accessTokens')
    ]);

    req.apiBase = wellKnownMetadata.badgeConnectAPI[0].apiBase;
    req.uid = uid;
    req.tokenSet = tokenSet;

    next();
  }
};

export const getAssertions = async (req: any, res: any, next) => {
  console.log('getting initial assertions');

  const response = await fetch(`${req.apiBase}/assertion?limit=11&offset=0`, {
    method: 'GET',
    headers: { accesstoken: req.tokenSet.access_token }
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

  next();
};

export const redirect = (req, res) => {
  return res.redirect(`http://${req.headers.host}/profile/${req.uid}`);
};
