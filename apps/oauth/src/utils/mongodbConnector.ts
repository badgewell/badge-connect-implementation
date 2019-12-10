import * as assert from 'assert';
import { MongoClient } from 'mongodb';

export const clientInfo = {
  id: 'Og-ZMkFakkwvPjg5QXHRd',
  payload: {
    application_type: 'web',
    grant_types: ['authorization_code', 'refresh_token', 'implicit'],
    id_token_signed_response_alg: 'RS256',
    post_logout_redirect_uris: [],
    require_auth_time: false,
    response_types: ['id_token'],
    subject_type: 'public',
    token_endpoint_auth_method: 'client_secret_basic',
    // tslint:disable-next-line:object-literal-sort-keys
    introspection_endpoint_auth_method: 'client_secret_basic',
    revocation_endpoint_auth_method: 'client_secret_basic',
    request_uris: [],
    client_id_issued_at: 1574933729,
    client_id: 'Og-ZMkFakkwvPjg5QXHRd',
    client_name: 'Badge Issuer',
    client_secret_expires_at: 0,
    client_secret:
      '5sBjN9NhcalDdSjJffafFWbcbKW3ywJh156HdiF7usjYt1qSYCIyLJNHF3JitmKSGALMp9d7ON92iF8AsBApWA',
    client_uri: 'https://about.badgewell.com',
    logo_uri: 'https://about.badgewell.com',
    policy_uri: 'https://about.badgewell.com',
    redirect_uris: ['https://about.badgewell.com'],
    scope:
      'openid profile https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.readonly',
    tos_uri: 'https://about.badgewell.com'
  }
};

export const accessTokenInfo = {
  id: 'YuePj_Ezi3iwpBHoRbMTCjom1OfErz5i3VvPYmRhcdD',
  payload: {
    iat: 1574933729,
    // tslint:disable-next-line:object-literal-sort-keys
    clientId: 'Og-ZMkFakkwvPjg5QXHRd',
    kind: 'RegistrationAccessToken',
    jti: 'YuePj_Ezi3iwpBHoRbMTCjom1OfErz5i3VvPYmRhcdD'
  }
};

// Connection URL
process.env.MONGODB_DATABASE = process.env.DATABASE_TEST_NAME; // for testing purposes
const url = process.env.MONGODB_DATABASE;
export const connectMongoDB = async () => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(process.env.DATABASE_NAME);
    const clientCollection = db.collection('client');
    const accessTokenCollection = db.collection('registration_access_token');
    await clientCollection.insertOne(clientInfo);
    await accessTokenCollection.insertOne(accessTokenInfo);
  } catch (e) {
    console.log(e);
  }
};
