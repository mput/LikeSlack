import { Model } from 'objection';

export default class RefreshTokens extends Model {
  static tableName = 'refreshTokens';

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
}
