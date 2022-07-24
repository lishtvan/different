const getError = (message: string) => {
  const arr = message.split("/")[1].split(" ");
  const field = arr[0];
  arr.shift();
  const formattedMessage = arr.join(" ");
  return { formattedMessage, field };
};

export const getErrors = (message: string) => {
  const errors: Record<string, unknown> = {};
  if (message.includes(",")) {
    console.log("includes");
    const messages = message.split(" ,");
    for (const message of messages) {
      const { formattedMessage, field } = getError(message);
      errors[field] = formattedMessage;
    }
  } else {
    const { formattedMessage, field } = getError(message);
    errors[field] = formattedMessage;
  }
  return errors;
};
