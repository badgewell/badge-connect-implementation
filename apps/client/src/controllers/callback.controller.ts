import { getById, saveDB, getOneWhere } from '../utils/mongo';
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

    await res.json({ userinfo });
  }
};
