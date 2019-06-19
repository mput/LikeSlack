export default io => (ctx, next) => {
  const { id: senderId } = ctx.headers;
  const meta = {};
  if (senderId) {
    meta.senderId = senderId;
  }
  ctx.socketEmit = (eventName, payload) => {
    const data = {
      payload,
      meta,
    };
    io.emit(eventName, data);
  };
  return next();
};
