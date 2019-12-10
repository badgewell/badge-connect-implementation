import * as faker from "faker";
import { saveDB } from "../utils/mongo";

export const generateProfile = (req, res, next) => {
  try {
    const profile: any = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      id: faker.random.uuid(),
      photo: faker.image.avatar(),
      jobTitle: faker.name.jobTitle()
    };

    profile.email = faker.internet.email(profile.firstName, profile.lastName);

    res.send(profile);
    saveDB(profile, process.env.CLIENT_DATABASE);
    next();
  } catch (e) {
    console.log(e);
  }
};
