import { normalize, schema } from 'normalizr';

const channelSchema = new schema.Entity('channels');
const channelListSchema = [channelSchema];

const userSchema = new schema.Entity('users');
const userListSchema = [userSchema];

const messageSchema = new schema.Entity('messages', {
  author: userSchema,
});

const messageListSchema = [messageSchema];


const schemas = {
  channelSchema,
  channelListSchema,
  userSchema,
  userListSchema,
  messageSchema,
  messageListSchema,
};

const normalizers = Object.keys(schemas).reduce((result, schemaName) => {
  const [name] = schemaName.split('Schema');
  return {
    ...result,
    [name]: data => normalize(data, schemas[schemaName]),
  }
}, {});

export default normalizers;
