const server = require('http').createServer().listen(0);

const { Issuer, generators } = require('openid-client');
const open = require('open');

server.removeAllListeners('request');
const { ISSUER = 'http://localhost:4000/.well-known/badgeconnect.json' } = process.env;

server.once('listening', () => {
  (async () => {
    const issuer = await Issuer.discover(ISSUER);
    console.log(issuer);
    issuer.registration_endpoint = 'http://localhost:5000/registration';
    issuer.authorization_endpoint = 'http://localhost:5000/authorization';
    //issuer.token_endpoint = 'http://localhost:5000/token'
    // console.log(issuer.authorizationUrl);
    // console.log(issuer.registrationUrl);

    const client = await issuer.Client.register({
      redirect_uris: ['https://about.badgewell.com'],
      application_type: 'native',
      token_endpoint_auth_method: 'client_secret_basic',
    });
    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);
    const redirect_uri = 'https://about.badgewell.com';

    server.on('request', async (req, res) => {
      res.setHeader('connection', 'close');
      const params = client.callbackParams(req);

      if (Object.keys(params).length) {
        const tokenSet = await client.callback(
          redirect_uri, params, { code_verifier, response_type: 'code' },
        );

        console.log('got', tokenSet);
        console.log('id token claims', tokenSet.claims());

        const userinfo = await client.userinfo(tokenSet);
        console.log('userinfo', userinfo);

        res.end('you can close this now');
        server.close();
      }
    });

    await open(client.authorizationUrl({
      redirect_uri,
      code_challenge,
      code_challenge_method: 'S256',
      scope: 'openid email',
    }), { wait: false });
  })().catch((err) => {
    console.error(err);
    process.exitCode = 1;
    server.close();
  });
});
