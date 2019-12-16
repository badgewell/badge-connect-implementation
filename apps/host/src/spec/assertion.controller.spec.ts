import chaiServer from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import server from '../server';
const { expect } = chaiServer;

chaiServer.use(chaiHttp);

const assertionBody = {
  id: 'https://badges.imsglobal.org/public/assertions/XAQX0D3iSCOqIDiuLJTGTw',
  type: 'Assertion',
  '@context': 'https://w3id.org/openbadges/v2',
  badge: 'https://badges.imsglobal.org/public/badges/6m-_xam7SFq_sg5lam43Jw',
  image:
    'https://badges.imsglobal.org/public/assertions/XAQX0D3iSCOqIDiuLJTGTw/image',
  verification: {
    type: 'HostedBadge'
  },
  evidence: [
    {
      type: 'Evidence',
      id: 'http://example.com/writingsample.html'
    }
  ],
  narrative:
    'Andy submitted two writing samples that exemplified mastery of this competency.',
  issuedOn: '2019-04-12T21:19:29.58435+00:00',
  expires: '2055-12-31T00:00:00+00:00',
  recipient: {
    salt: 'a3a25e7b290c40f5847e3cccf90bec99',
    type: 'email',
    hashed: true,
    identity:
      'sha256$56a7b7baaa94884699ba1aab62b943ee1d83e9adc5782a8db40ffd8f762c688c'
  }
};

describe('Assertion Controller', () => {
  it('should not create assertion and show validation', done => {
    chaiServer
      .request(server)
      .post('/assertion')
      .set('content-type', 'application/json')
      .set('authorization', `Bearer ${jwt.sign({}, process.env.JWT_SECRET)}`)
      .send({})
      .end((err: any, res: any) => {
        const { body, status } = res;
        expect(status).to.be.equal(400);
        expect(body).to.deep.equal({
          status: {
            error: 'id is required.',
            statusCode: 400,
            statusText: 'BAD_REQUEST'
          }
        });
        done();
      });
  });

  it('should create assertion', done => {
    chaiServer
      .request(server)
      .post('/assertion')
      .set('content-type', 'application/json')
      .set('authorization', `Bearer ${jwt.sign({}, process.env.JWT_SECRET)}`)
      .send(assertionBody)
      .end((err: any, res: any) => {
        const { body, status } = res;
        expect(status).to.be.equal(200);
        expect(body).to.deep.equal({
          status: {
            error: null,
            statusCode: 200,
            statusText: 'OK'
          }
        });
        done();
      });
  });
});
