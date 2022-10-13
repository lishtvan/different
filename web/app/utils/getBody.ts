export const getBody = (form: FormData) => {
  const object: { [key: string]: unknown } = {};
  form.forEach((value, key) => {
    if (!Reflect.has(object, key)) {
      if (value) object[key] = value;
      return;
    }
    if (!Array.isArray(object[key])) {
      object[key] = [object[key]];
    }
    const arrayField = object[key] as Array<unknown>;
    arrayField.push(value);
  });
  return object;
};
