export const getCookieValue = (field: 'userId' | 'token', request: Request) => {
  const cookie = request.headers.get("Cookie");
  const parts = cookie?.split(`${field}=`);
  if (parts?.length === 2) return parts?.pop()?.split(";").shift();
};
