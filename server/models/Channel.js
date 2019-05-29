import path from 'path';
import { Model } from 'objection';

export default class Channel extends Model {
  static tableName = 'channels';

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
    messages: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'Message'),
      join: {
        from: 'channels.id',
        to: 'messages.channelId',
      },
    },
  };

}
