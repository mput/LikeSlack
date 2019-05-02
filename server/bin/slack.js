import getApp from '..';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5656;
getApp().listen(port, () => console.log(`port: ${port}`)); // eslint-disable-line no-console
