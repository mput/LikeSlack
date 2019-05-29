import Knex from 'knex';
import { Model } from 'objection';

import configs from '../../knexfile';

export default () => {
  const environment = process.env.NODE_ENV || 'development';
  const config = configs[environment];
  const knex = Knex(config);
  Model.knex(knex);
};

