export const getBody = (formEntries: { [key: string]: FormDataEntryValue }) => {
  const body: { [key: string]: unknown } = {};
  for (const property in formEntries) {
    if (formEntries[property]) body[property] = formEntries[property];
  }
  return body;
};
