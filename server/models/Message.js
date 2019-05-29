import path from 'path';
import { Model } from 'objection';

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
  };
}
