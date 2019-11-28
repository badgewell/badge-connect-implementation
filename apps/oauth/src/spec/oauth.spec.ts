// @ts-ignore
import chaiServer from 'chai';
// @ts-ignore
import chaiHttp from 'chai-http';
import server from '../../dist/server';
const { expect } = chaiServer;
import * as mongodbConnector from '../utils/mongodbConnector';

chaiServer.use(chaiHttp);

const req = {
    client_name: 'Badge Issuer',
    client_uri: 'https://about.badgewell.com',
    logo_uri: 'https://about.badgewell.com',
    tos_uri: 'https://about.badgewell.com',
    // tslint:disable-next-line:object-literal-sort-keys
    policy_uri: 'https://about.badgewell.com',
    software_id: '13dcdc83-fc0d-4c8d-9159-6461da297388',
    software_version: '54dfc83-fc0d-4c8d-9159-6461da297388',
    redirect_uris: [
        'https://about.badgewell.com',
    ],
    token_endpoint_auth_method: 'none',
    grant_types: [
        'authorization_code',
        'refresh_token', 'implicit',
    ],
    response_types: [
        'code',
    ],
    scope: 'openid profile https://purl.imsglobal.org/spec/ob/v2p1/scope/assertion.readonly',
};

describe('test /registration', () => {
    it(' should return client registration information ', (done) => {
        chaiServer
            .request(server)
            .post('/registration')
            .send(req)
            .end((err: any, res: any) => {
                const {body , status} = res;
                expect(status).to.be.equal(201);
                expect(body).property('client_id').to.be.a('string');
                expect(body).property('scope').to.be.a('string');
                expect(body).property('grant_types').to.be.a('array').with.length.greaterThan(0);
                expect(body).property('response_types').to.be.a('array').with.length.greaterThan(0);
                done();
            });
    });
});

describe('test /token/revocation', () => {
    before(async () => {
        await mongodbConnector.connectMongoDB();
    });
    it(' should return status code 200 ', (done) => {

        chaiServer
            .request(server)
            .post('/token/revocation')
            .auth('Og-ZMkFakkwvPjg5QXHRd', '5sBjN9NhcalDdSjJffafFWbcbKW3ywJh156HdiF7usjYt1qSYCIyLJNHF3JitmKSGALMp9d7ON92iF8AsBApWA')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({token: 'YuePj_Ezi3iwpBHoRbMTCjom1OfErz5i3VvPYmRhcdD'})
            .end((err: any, res: any) => {
                console.log(mongodbConnector.accessTokenInfo.id);
                console.log(res);
                const {body , status} = res;
                expect(status).to.be.equal(200);
                done();
            });
    });
});
