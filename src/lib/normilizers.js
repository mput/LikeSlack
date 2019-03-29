const channelNameNormolize = (value) => {
  const strippedValue = value.replace(/[^a-zA-Z\d]/g, '');
  return `#${strippedValue}`;
};

export default channelNameNormolize;
