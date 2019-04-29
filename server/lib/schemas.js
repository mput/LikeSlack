import * as yup from 'yup';

// eslint-disable-next-line
export const channelSchema = yup.object().shape({
  name: yup.string().min(2).max(255).required(),
  removable: yup.boolean(),
});

export const messageSchema = yup.object().shape({
  message: yup.string().required(),
  author: yup.string().required(),
  channelId: yup.string().required(),
});
