export const getAuthorizedStatus = (request: Request) => {
  const cookie = request.headers.get("Cookie");
  if (!cookie) return false;
  const tokenRow = cookie.split("; ").find((row) => row.startsWith("token"));
  if (!tokenRow) return false;
  else return true;
};
