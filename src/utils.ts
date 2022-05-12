function removeUndefined(obj: any) {
  let _obj: Record<string, any> = {};
  Object.keys(obj || {})
    .filter((k) => obj[k] !== undefined)
    .forEach((k) => (_obj[k] = obj[k]));
  return _obj;
}
export const merge = (o1: any, o2: any) => {
  return {
    ...o1,
    ...removeUndefined(o2),
  };
};
