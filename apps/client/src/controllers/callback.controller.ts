import { getById, saveDB, getOneWhere } from '../utils/mongo';
import { Issuer } from 'openid-client';
import { Request, Response } from 'express';
import fetch from 'node-fetch';

export const callback = async (req: any, res: Response, next) => {
  //console.log(222 , req.params.id);
  const { id } = req.params;

  const redirect_uri = `http://${req.headers.host}/callback/${id}`;

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

  const { code_verifier, uid } = await getOneWhere(
    { state: params.state },
    'state'
  );

  // get the access_token
  if (Object.keys(params).length) {
    const tokenSet = await client.callback(redirect_uri, params, {
      code_verifier,
      state: params.state,
      response_type: 'code'
    });

    // get the user profile
    const userinfo = await client.userinfo(tokenSet);

    await Promise.all([
      saveDB({ ...userinfo, uid, clientInternalId: id }, 'hostProfiles'),
      saveDB({ ...tokenSet, uid, clientInternalId: id }, 'accessTokens')
    ]);

    // set the base url for fetching the assertions
    // set the uid for use in the redirect
    //console.log(wellKnownMetadata.badgeConnectAPI[0].apiBase);
    req.apiBase = wellKnownMetadata.badgeConnectAPI[0].apiBase;
    req.uid = uid;

    next();
  }
};

export const getAssertions = async (req: any, res: any, next) => {
  //console.log(req);
  const response = await fetch(
    `${req.apiBase}/assertion?limit=11&offset=0`,
    { method: 'GET', headers: { accesstoken: process.env.ACCESS_TOKEN } }
  );

  const data = await response.json();
  for (const assertion of data.results) {
    assertion.uid = req.uid;
    assertion.client_id = req.params.id;

    console.log(assertion);
    await saveDB(assertion, 'assertions');
  }

  next();
};

export const redirect = (req, res) => {
  return res.redirect(`http://${req.headers.host}/profile/${req.uid}`);
};
