import path from 'path';
import { Model } from 'objection';
import _ from 'lodash';

export default class Message extends Model {
  static tableName = 'messages';

  static jsonSchema = {
    type: 'object',
    required: ['message', 'authorId'],
    additionalProperties: false,

    properties: {
      authorId: { type: 'integer' },
      channelId: { type: 'integer' },
      message: { type: 'string', minLength: 1, maxLength: 1000 },
    },
  };

  static relationMappings = {
    channel: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'Channel'),
      join: {
        from: 'messages.channelId',
        to: 'channels.id',
      },
    },

    author: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'User'),
      join: {
        from: 'messages.authorId',
        to: 'users.id',
      },
    },
  };

  $formatJson(internalJson) {
    const json = super.$formatJson(internalJson);
    return _.omit(json, 'authorId');
  }
}
