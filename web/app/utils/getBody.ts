export const getBody = (formEntries: { [key: string]: FormDataEntryValue }) => {
  const body: { [key: string]: unknown } = {};
  for (const property in formEntries) {
    console.log(property, formEntries[property]);
    if (formEntries[property]) {
      body[property] = formEntries[property];
    }
  }
  return body;
};
