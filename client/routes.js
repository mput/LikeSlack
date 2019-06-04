const apiUrl = '/api/v1';

// channels
export const channels = () => `${apiUrl}/channels`;
export const channel = id => `${apiUrl}/channels/${id}`;
// messages
export const messages = channelId => `${apiUrl}/channels/${channelId}/messages`;
// auth
export const login = provider => `${apiUrl}/auth/${provider}`;
export const logout = () => `${apiUrl}/auth/logout`;
export const tokensRefresh = () => `${apiUrl}/auth/refresh`;
// user
export const user = id => `${apiUrl}/users/${id}`;
export const userMe = () => `${apiUrl}/me`;
