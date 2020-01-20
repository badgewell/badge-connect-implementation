import chaiServer from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import flatten from 'flat';

import { server } from '../server';
import Profile from '../models/profile.model';

const { expect } = chaiServer;

chaiServer.use(chaiHttp);

const profileBody = {
  id: 'https://badges.imsglobal.org/public/issuers/PDSlozoSTjircXTKVvuOLg',
  type: 'Issuer',
  '@context': 'https://w3id.org/openbadges/v2',
  description:
    'Founded in 1899, Sample University is a world-class institution of higher education.\n\n(Note: This badge issuer is intended for use in the IMS Global certification program.)',
  url: 'http://openbadgesvalidator.imsglobal.org/SampleResources/about.html',
  email: 'info@business.sampleuniversity.edu',
  name: 'Sample University - College of Business',
  image:
    'https://badges.imsglobal.org/public/issuers/PDSlozoSTjircXTKVvuOLg/image'
};

describe('Profile Controller', () => {
  it('should not create profile and show validation', done => {
    chaiServer
      .request(server)
      .post('/profile')
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

  it('should create profile', done => {
    chaiServer
      .request(server)
      .post('/profile')
      .set('content-type', 'application/json')
      .set('authorization', `Bearer ${jwt.sign({}, process.env.JWT_SECRET)}`)
      .send(profileBody)
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

  it('should find profile by id', done => {
    const profileRef = new Profile({
      ...flatten(profileBody)
    });

    profileRef.save().then(({ _id }) => {
      chaiServer
        .request(server)
        .get('/profile')
        .set('content-type', 'application/json')
        .set(
          'authorization',
          `Bearer ${jwt.sign(
            {
              id: _id
            },
            process.env.JWT_SECRET
          )}`
        )
        .end((err: any, res: any) => {
          const { body, status } = res;
          expect(status).to.be.equal(200);
          expect(body).to.deep.equal({
            status: {
              statusCode: 200,
              statusText: 'OK'
            },
            profile: profileBody
          });
          done();
        });
    });
  });
});
