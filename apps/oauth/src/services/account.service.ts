import low from 'lowdb';
import Memory from 'lowdb/adapters/Memory';

const db = low(new Memory());

import assert from 'assert';

db.defaults({
  users: [
    {
      email: 'foo@example.com',
      email_verified: true,
      id: '23121d3c-84df-44ac-b458-3d63a9a05497',
    },
    {
      email: 'bar@example.com',
      email_verified: false,
      id: 'c2ac2b4a-2262-4e2f-847a-a40dd3c4dcd5',
    },
  ],
}).write();

export class Account {
  // This interface is required by oidc-provider
  public static async findAccount(ctx, id) {
    // This would ideally be just a check whether the account is still in your storage
    const account = db.get('users').find({ id }).value();
    if (!account) {
      return undefined;
    }

    return {
      accountId: id,
      
      // and this claims() method would actually query to retrieve the account claims
      async claims() {
        return {
          email: account.email,
          email_verified: account.email_verified,
          sub: id,
        };
      },
    };
  }

  // This can be anything you need to authenticate a user
  public static async authenticate(email, password) {
    try {
      assert(password, 'password must be provided');
      assert(email, 'email must be provided');
      const lowercase = String(email).toLowerCase();
      const account = db.get('users').find({ email: lowercase }).value();
      assert(account, 'invalid credentials provided');

      return account.id;
    } catch (err) {
      return undefined;
    }
  }
}
