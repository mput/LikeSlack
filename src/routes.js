const apiUrl = '/api/v1';
// eslint-disable-next-line
export const messages = channelId => `${apiUrl}/channels/${channelId}/messages`;
export const channels = () => `${apiUrl}/channels`;
export const channel = id => `${apiUrl}/channels/${id}`;
