import { getById, saveDB } from '../utils/mongo';
const { Issuer } = require('openid-client');

export const callback = async (req, res, next) => {
  const { id } = req.params;
  const { uid, code_challenge } = req.query;

  console.log('the code challenge', code_challenge);
  const redirect_uri = `http://${req.headers.host}/callback/${id}?uid=${uid}`;

  // get both the client and wellKnown from the database
  const [wellKnownMetadata, clientMetadata] = await Promise.all([
    getById(id, 'wellKnows'),
    getById(id, 'clients')
  ]);

  // get the wellKnown manifest from the host
  const issuer = await Issuer.discover(wellKnownMetadata.badgeConnectAPI[0].id);

  const client = new issuer.Client(clientMetadata);

  // TODO remove hard coded code_verifier

  // get the request params for use with the callback
  const params = client.callbackParams(req);

  const code_verifier = await getById(code_challenge, 'codeChallenges');
  console.log('this is the param', params, code_verifier);

  // get the access_token
  if (Object.keys(params).length) {
    const tokenSet = await client.callback(redirect_uri, params, {
      code_verifier,
      response_type: 'code'
    });

    // get the user profile
    const userinfo = await client.userinfo(tokenSet); // get user profile

    await Promise.all([
      saveDB({ ...userinfo, _id: uid }, 'hostProfiles'),
      saveDB({ ...tokenSet, _id: uid }, 'accessTokens')
    ]);

    await res.json({ userinfo });
  }
};
