import Assertion from './models/assertion.model';
import Profile from './models/profile.model';

import dotenv from 'dotenv';
dotenv.config();

const profile = {
  id: `${process.env.BASE_URL}/profiles/23121d3c-84df-44ac-b458-3d63a9a05497`,
  type: 'Profile',
  '@context': 'https://w3id.org/openbadges/v2',
  description: 'Test user',
  url: 'http://openbadgesvalidator.imsglobal.org/SampleResources/about.html',
  email: 'h2rashwan@gmail.com',
  name: 'Alice Smith'
};

const assertion = {
  '@context': 'https://w3id.org/openbadges/v2',
  evidence: [],
  id: `${process.env.BASE_URL}/assertion/B1pzF8uCz/sk4nLu0n7a0eRC84iG3I/LlXtf36AK5hsjTm4kiHDvYe1leC3`,
  type: 'Assertion',
  recipient: {
    type: 'email',
    hashed: true,
    identity:
      'sha256$ba8f5c30dab6b0165fd6024ded880eb4532d4255a9e258d4501fe58f55d28809',
    salt: 'badgewellISO'
  },
  issuedOn: '2019-08-11T16:21:14.164Z',
  verification: { type: 'hosted' },
  badge:
    'https://www.badgewell.com/api/openbadges/badges/B1pzF8uCz/sk4nLu0n7a0eRC84iG3I'
};

export const middleware = async (req, res) => {
  await generateData();
  res.send('data generated');
};

export const generateData = async () => {
  try {
    const _profile = await Profile.findOne({
      id: `${process.env.BASE_URL}/profiles/23121d3c-84df-44ac-b458-3d63a9a05497`
    });

    if (_profile) {
      console.log('Profile already exists');
    } else {
      const result = await Profile.create(profile);
      console.log('Profile saved ', result);
    }

    const _assertion = await Assertion.findOne({
      id:
        `${process.env.BASE_URL}/assertion/B1pzF8uCz/sk4nLu0n7a0eRC84iG3I/LlXtf36AK5hsjTm4kiHDvYe1leC3`
    });

    if (_assertion) {
      console.log('Assertion already exists');
    } else {
      const result = await Assertion.create(assertion);
      console.log('Assertion saved ', result);
    }
  } catch (error) {
    console.error(error);
  }
};
