import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export interface IRequest extends Request {
  authUser: any;
}

function verifyToken(req: IRequest, res: Response, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, authUser) => {
      if (err) {
        res.status(403).send({
          status: {
            error: err.message,
            statusCode: 401,
            statusText: 'UNAUTHENTICATED'
          }
        });
      } else {
        req.authUser = authUser;
        next();
      }
    });
  } else {
    res.status(403).send({
      status: {
        error: 'you must provide a token in Authorization header',
        statusCode: 401,
        statusText: 'UNAUTHENTICATED'
      }
    });
  }
}

export default verifyToken;
