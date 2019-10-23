import chaiServer from 'chai';
import chaiHttp from 'chai-http';
import server from '../../dist/server';
const { expect } = chaiServer;

chaiServer.use(chaiHttp);

describe('test /.well-known/badgeconnect.json ', () => {
        it(' should return ok ', (done) => {
            chaiServer
                .request(server)
                .get('/.well-known/badgeconnect.json')
                .end((err: any, res: any) => {
                    const {body , status} = res;
                    expect(status).to.be.equal(200);
                    expect(body).property('type').equal('Manifest');
                    expect(body).property('id').include(`/.well-known/badgeconnect.json`);
                    expect(body.badgeConnectAPI).to.be.a('array').with.length.greaterThan(0);
                    expect(body.badgeConnectAPI[0]).to.include
                    .keys(['id', 'type', 'apiBase', 'authorizationUrl', 'image',
                     'name', 'privacyPolicyUrl', 'registrationUrl', 'scopesOffered',
                     'termsOfServiceUrl', 'tokenUrl', 'version']);

                    done();
                });
        });
    });

