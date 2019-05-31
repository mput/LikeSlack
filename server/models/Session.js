import { Model } from 'objection';

export default class Session extends Model {
  static tableName = 'sessions';

  static jsonSchema = {
    type: 'object',
    required: ['userId', 'expireAt'],

    properties: {
      id: { type: 'integer' },
      userId: { type: 'integer' },
      expireAt: { type: 'string', format: 'date-time' },
    },
  };
}
