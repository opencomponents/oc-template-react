export const data = (context, callback) => {
  const { name } = context.params;
  return callback(null, { name });
};
