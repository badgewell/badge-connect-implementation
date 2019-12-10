import * as faker from 'faker';
import { saveDB } from '../utils/mongo';
import { IProfile } from '../types/profile.type';

export const generate = async (req, res) => {
  try {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    const profile: IProfile = {
      firstName,
      lastName,
      photo: faker.image.avatar(),
      jobTitle: faker.name.jobTitle(),
      password: faker.internet.password(),
      id: faker.random.uuid(),
      email: faker.internet.email(firstName, lastName)
    };

    await saveDB({ ...profile, _id: profile.id }, 'profiles');
    res.send(profile);
  } catch (e) {
    console.log(e);
    res.status(500).send({ msg: 'can not generate the profile ' });
  }
};
