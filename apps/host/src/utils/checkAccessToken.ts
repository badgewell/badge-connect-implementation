import { Request, Response } from 'express';
import access_token from '../models/access_token.model.';
import profile from '../models/profile.model';

export const checkAccessToken = async (req: any, res: Response, next) => {
  try {
    console.log('checking accesstoken');

    const authHeader = req.headers.authorization || req.headers.access_token || req.headers.accessToken

    if (!authHeader) {
      res.status(403).send({
        status: {
          error: 'Header must be provided',
          statusCode: 401,
          statusText: 'UNAUTHENTICATED'
        }
      });
    } else {
      const token = authHeader.split(' ')[1];
      console.log('getting the  accesstoken back from the db');
      const accessToken = await access_token.findOne({
        id: token
      });

      if (!accessToken) {
        res.status(401).send({
          status: {
            error: 'Access Token is not found',
            statusCode: 401,
            statusText: 'UNAUTHENTICATED'
          }
        });
      } else {
        console.log('getting the uid and profile objects from the database');
        req.uid = accessToken.toJSON().payload.accountId;
        req.profile = await profile.findOne({
          id: `${process.env.BASE_URL}/profiles/${
            accessToken.toJSON().payload.accountId
          }`
        });
        next();
      }
    }
  } catch (error) {
    console.log(error);
  }
};
