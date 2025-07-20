export const isInvalidValue = (value: unknown) => {
  return !(value === "" || value === null || value === undefined);
};
