import { getById } from '../utils/mongo';
const { Issuer } = require('openid-client');

export const callback = async (req, res, next) => {
  // uid

  const { id } = req.params;

  const redirect_uri = `http://${req.headers.host}/callback/${id}`;

  const [wellKnownMetadata, clientMetadata] = await Promise.all([
    getById(id, 'wellKnows'),
    getById(id, 'clients')
  ]);

  // const { uid } = req.query;

  const issuer = await Issuer.discover(wellKnownMetadata.badgeConnectAPI[0].id);

  issuer.registration_endpoint = issuer.badgeConnectAPI[0].registrationUrl;
  issuer.authorization_endpoint = issuer.badgeConnectAPI[0].authorizationUrl;
  issuer.token_endpoint = issuer.badgeConnectAPI[0].tokenUrl;
  issuer.issuer = 'http://localhost:5000';
  issuer.jwks_uri = 'http://localhost:5000/jwks';
  issuer.userinfo_endpoint = 'http://localhost:5000/me';


  const client = new issuer.Client(clientMetadata);

  const code_verifier = 'davXRxc9zXNz6ZvdUL79ORSmXDEMe6TpM2AuL3bqz8t'; // generators.codeVerifier();

  const params = client.callbackParams(req);

  if (Object.keys(params).length) {
    const tokenSet = await client.callback(redirect_uri, params, {
      code_verifier
      // response_type: 'code'
    });

    console.log('got::::::', tokenSet);
    console.log('id token claims', tokenSet.claims());

    const userinfo = await client.userinfo(tokenSet);
    console.log('userinfo', userinfo);

    res.json({ userinfo });
  }
};
