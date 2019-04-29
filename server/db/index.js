import knex from 'knex';
import configs from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
const config = configs[environment];
export default knex(config);
