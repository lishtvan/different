import { FastifySchemaValidationError } from 'fastify/types/schema';

export const schemaErrorFormatter = (errors: FastifySchemaValidationError[]) => {
  const formattedErrors: Record<string, unknown> = {};
  errors.forEach((e) => {
    const errMsg = e.message;
    if (e.instancePath) {
      const key = e.instancePath.substring(1);
      formattedErrors[key] = errMsg;
      return;
    }
    if (!e.params.errors && e.params.missingProperty) {
      formattedErrors[e.params.missingProperty as string] = e.message;
      return;
    }
    // @ts-ignore
    const key = e.params.errors[0].params.missingProperty;
    formattedErrors[key] = errMsg;
  });
  return new Error(JSON.stringify(formattedErrors));
};
