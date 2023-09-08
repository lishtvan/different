import { FastifySchemaValidationError } from 'fastify/types/schema';

export const schemaErrorFormatter = (errors: FastifySchemaValidationError[]) => {
  // @ts-ignore
  const formattedErrors: Record = {};
  errors.forEach((e) => {
    const errMsg = e.message;
    if (e.instancePath) {
      const key = e.instancePath.substring(1);
      formattedErrors[key] = errMsg;
      return;
    }
    // @ts-ignore
    const key = e.params.errors[0].params.missingProperty;
    formattedErrors[key] = errMsg;
  });
  console.log(formattedErrors);
  return new Error(JSON.stringify(formattedErrors));
};
