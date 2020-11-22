export default (key, defaultValue = {}) => {
  const data = localStorage.getItem(key);
  let parsed;
  try {
    parsed = data && JSON.parse(data);
  } catch {
    return defaultValue;
  }
  return parsed || defaultValue;
};
