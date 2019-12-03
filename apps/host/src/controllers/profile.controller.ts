import { Request, Response, NextFunction } from 'express';
import flatten from 'flat';

import Profile from '../models/profile.model';
import { IProfile } from '../types/profile.type';

export interface IProfileResponse {
  status: { error: Error; statusCode: number; statusText: string };
  results: IProfile[];
  selfLink: string;
  nextLink?: string;
  prevLink?: string;
}

export function validateCreateProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { body } = req;

  if (!body.id) {
    return res.status(400).send({
      status: {
        error: 'id is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!body.type) {
    return res.status(400).send({
      status: {
        error: 'type is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!body['@context']) {
    return res.status(400).send({
      status: {
        error: '@context is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!body.description) {
    return res.status(400).send({
      status: {
        error: 'description is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!body.url) {
    return res.status(400).send({
      status: {
        error: 'url is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!body.email) {
    return res.status(400).send({
      status: {
        error: 'email is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!body.name) {
    return res.status(400).send({
      status: {
        error: 'name is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!body.image) {
    return res.status(400).send({
      status: {
        error: 'image is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  next();
}

export async function createProfile(req: Request, res: Response) {
  try {
    const profile = new Profile({
      ...flatten(req.body)
    });

    await profile.save();

    return res.status(200).send({
      status: {
        error: null,
        statusCode: 200,
        statusText: 'OK'
      }
    });
  } catch (error) {
    res.status(400).send({
      status: {
        error: error.message,
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }
}

export async function findProfile(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const profile = await Profile.findById(
      id,
      '-_id -__v -createdAt -updatedAt'
    );

    return res.status(200).send({
      status: {
        statusCode: 200,
        statusText: 'OK'
      },
      profile
    });
  } catch (err) {
    res.status(400).send({
      status: {
        error: err.message,
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }
}
