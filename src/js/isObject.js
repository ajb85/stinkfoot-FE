// @flow

export default (o: any): boolean =>
  typeof o === "object" && o !== null && !Array.isArray(o);
