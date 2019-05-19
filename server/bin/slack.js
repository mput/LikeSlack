import getApp from '..';

const port = process.env.PORT || 5656;
getApp().listen(port, () => console.log(`port: ${port}`)); // eslint-disable-line no-console
