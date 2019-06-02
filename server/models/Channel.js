import path from 'path';
import { Model } from 'objection';

export default class Channel extends Model {
  static tableName = 'channels';

  static jsonSchema = {
    type: 'object',
    required: ['name'],
    additionalProperties: false,
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 40 },
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
