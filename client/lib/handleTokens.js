const saveTokens = ({ refreshToken, accessToken }) => {
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('accessToken', accessToken);
};

const removeTokens = () => {
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessToken');
};

const getTokens = () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const accessToken = localStorage.getItem('accessToken');
  if (refreshToken && accessToken) {
    return { refreshToken, accessToken };
  }
  return false;
};

export default {
  saveTokens,
  removeTokens,
  getTokens,
};
