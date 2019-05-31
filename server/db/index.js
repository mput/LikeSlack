import Knex from 'knex';
import { Model } from 'objection';

import configs from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
const config = configs[environment];
export const knex = Knex(config);

export default () => {
  Model.knex(knex);
};
