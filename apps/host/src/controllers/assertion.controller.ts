import { Request, Response, NextFunction } from 'express';
import flatten from 'flat';
import url from 'url';

import { sha256 } from '../utils/sha256';

import Assertion from '../models/assertion.model';
import { IAssertion } from '../types/assertion.type';

export interface IAssertionResponse {
  status: { error: Error; statusCode: number; statusText: string };
  results: IAssertion[];
  selfLink: string;
  nextLink?: string;
  prevLink?: string;
}

export function validateCreateAssertion(
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

  if (!body.badge) {
    return res.status(400).send({
      status: {
        error: 'badge is required.',
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

  if (!body.verification) {
    return res.status(400).send({
      status: {
        error: 'verification is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (body.verification) {
    if (!body.verification.type) {
      return res.status(400).send({
        status: {
          error: 'verification.type is required.',
          statusCode: 400,
          statusText: 'BAD_REQUEST'
        }
      });
    }
  }

  if (!body.evidence) {
    return res.status(400).send({
      status: {
        error: 'evidence is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!Array.isArray(body.evidence)) {
    return res.status(400).send({
      status: {
        error: 'evidence must be array.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!(body.evidence.length > 0)) {
    return res.status(400).send({
      status: {
        error: 'evidence can not be an empty array.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  for (const item of body.evidence) {
    if (!item.id && !item.type) {
      return res.status(400).send({
        status: {
          error: 'evidence must be array of {id, type}.',
          statusCode: 400,
          statusText: 'BAD_REQUEST'
        }
      });
    }
  }

  if (!body.narrative) {
    return res.status(400).send({
      status: {
        error: 'narrative is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!body.issuedOn) {
    return res.status(400).send({
      status: {
        error: 'issuedOn is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!body.expires) {
    return res.status(400).send({
      status: {
        error: 'expires is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!body.recipient) {
    return res.status(400).send({
      status: {
        error: 'recipient is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!body.recipient.salt) {
    return res.status(400).send({
      status: {
        error: 'recipient.salt is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!body.recipient.type) {
    return res.status(400).send({
      status: {
        error: 'recipient.type is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!body.recipient.hashed) {
    return res.status(400).send({
      status: {
        error: 'recipient.hashed is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  if (!body.recipient.identity) {
    return res.status(400).send({
      status: {
        error: 'recipient.identity is required.',
        statusCode: 400,
        statusText: 'BAD_REQUEST'
      }
    });
  }

  next();
}

export async function createAssertion(req: Request, res: Response) {
  try {
    const assertion = new Assertion({
      ...flatten(req.body)
    });

    await assertion.save();

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

export async function findAssertions(req: any, res: Response) {
  try {
    const identity = sha256(req.profile.email, 'badgewellISO');
    const offset = +req.query.offset || 0;
    const limit = +req.query.limit || 10;
    const { status } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    // match on recipient.identity
    const assertions = await Assertion.find(
      {'recipient.identity': 'sha256$' + identity.hash},
      '-_id -__v -createdAt -updatedAt'
    )
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);


    const assertionsCount = await Assertion.countDocuments();
    const appUrl =
      req.protocol +
      '://' +
      req.get('host') +
      url.parse(req.originalUrl).pathname;

    const response: IAssertionResponse = {
      status: { error: null, statusCode: 200, statusText: 'OK' },
      results: assertions as any,
      selfLink: appUrl + '?limit=' + limit + '&offset=' + offset
    };

    if (offset >= 0 && offset < assertionsCount) {
      response.nextLink =
        appUrl + '?limit=' + limit + '&offset=' + (offset + limit);
    }

    if (offset > 0 && offset <= assertionsCount) {
      const offsetValue =  offset == 1 ? 0 : + (offset - limit);
      response.prevLink = appUrl + '?limit=' + limit + '&offset=' + offsetValue
    }

    return res.status(200).send(response);
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
