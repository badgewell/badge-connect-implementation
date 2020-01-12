import Assertion from './models/assertion.model';
import Profile from './models/profile.model';

const profile = {
  id: 'https://ims.global.org/profiles/23121d3c-84df-44ac-b458-3d63a9a05497',
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
  id:
    'https://www.badgewell.com/api/openbadges/assertion/B1pzF8uCz/sk4nLu0n7a0eRC84iG3I/LlXtf36AK5hsjTm4kiHDvYe1leC3',
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

export const generateData = async () => {
  try {
    const _profile = await Profile.findOne({
      id: 'https://ims.global.org/profiles/23121d3c-84df-44ac-b458-3d63a9a05497'
    });
    // console.log('_profile :: ', _profile);

    if (_profile) { 
      console.log('Profile already exists');
    } else {
      const result = await Profile.create(profile);
      console.log('Profile saved ', result);
    }


    if (
      await Assertion.findOne({
        id:
          'https://www.badgewell.com/api/openbadges/assertion/B1pzF8uCz/sk4nLu0n7a0eRC84iG3I/LlXtf36AK5hsjTm4kiHDvYe1leC3'
      })
    ) {
      console.log('Assertion already exists');
    } else {
      const result = await Assertion.create(assertion);
      console.log('Assertion saved ', result);
    }
  } catch (error) {
    console.log(error);
  }
};
