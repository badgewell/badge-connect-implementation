import { getById, saveDB, getWhere } from '../utils/mongo';
import { Issuer } from 'openid-client';

export const callback = async (req, res, next) => {
  const { id } = req.params;

  const redirect_uri = `http://${req.headers.host}/callback/${id}`;

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

  const { code_verifier, uid } = await getWhere(
    { state: params.state },
    'state'
  );
  console.log('the coming state', params.state, code_verifier, uid);

  // get the access_token
  if (Object.keys(params).length) {
    const tokenSet = await client.callback(redirect_uri, params, {
      code_verifier,
      state: params.state,
      response_type: 'code'
    });

    // get the user profile
    const userinfo = await client.userinfo(tokenSet); // get user profile

    await Promise.all([
      saveDB({ ...userinfo, uid, clientInternalId: id }, 'hostProfiles'),
      saveDB({ ...tokenSet, clientInternalId: id }, 'accessTokens')
    ]);

    await res.json({ userinfo });
  }
};
