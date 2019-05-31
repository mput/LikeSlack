import path from 'path';
import { Model } from 'objection';

export default class Channel extends Model {
  static tableName = 'channels';

  static jsonSchema = {
    type: 'object',
    required: ['authProvider', 'userName'],
    additionalProperties: false,
    properties: {
      id: { type: 'integer' },
      authProvider: { type: 'string', enum: ['github', 'anonymous'] },
      validationKey: { type: 'string' },
      profileUrl: { type: 'string' },
    },
  };

  static relationMappings = {
    messages: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'Message'),
      join: {
        from: 'channels.id',
        to: 'messages.channelId',
      },
    },
  }
}
