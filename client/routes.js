const apiUrl = '/api/v1';
// eslint-disable-next-line
export const messages = channelId => `${apiUrl}/channels/${channelId}/messages`;
export const channels = () => `${apiUrl}/channels`;
export const channel = id => `${apiUrl}/channels/${id}`;


// auth
export const login = provider => `${apiUrl}/auth/${provider}`;
export const logout = () => `${apiUrl}/auth/logout`;
export const tokensRefresh = () => `${apiUrl}/auth/refresh`;

export const test = () => `${apiUrl}/test`;
