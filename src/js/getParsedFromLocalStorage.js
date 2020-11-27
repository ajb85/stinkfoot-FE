// @flow

export default (key: string, defaultValue: void | {}): {} => {
  if (defaultValue === undefined) {
    defaultValue = {};
  }

  const data = localStorage.getItem(key);
  let parsed;
  try {
    parsed = data && JSON.parse(data);
  } catch {
    return defaultValue;
  }
  return parsed || defaultValue;
};
