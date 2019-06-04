const channelNameNormolize = (value) => {
  const strippedValue = value.replace(/[^\w\d]/g, '');
  return strippedValue;
};

export default channelNameNormolize;
