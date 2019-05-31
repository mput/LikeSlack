import path from 'path';
import { Model } from 'objection';
import _ from 'lodash';

export default class Message extends Model {
  static tableName = 'messages';

  // static jsonSchema = {
  //   type: 'object',
  //   required: ['authProvider', 'userName'],

  //   properties: {
  //     id: { type: 'integer' },
  //     authProvider: { type: 'string', enum: ['github', 'anonymous'] },
  //     userName: { type: 'string', minLength: 3, maxLength: 255 },
  //     fullName: { type: 'string', minLength: 1, maxLength: 255 },
  //     validationKey: { type: 'string' },
  //     profileUrl: { type: 'string' },
  //   },
  // };

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
    // Remember to call the super class's implementation.
    const json = super.$formatJson(internalJson);
    // Do your conversion here.
    return _.omit(json, 'authorId');
  }
}
