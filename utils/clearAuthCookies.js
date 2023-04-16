/** Clear the cookies used by next-auth. */
export const clearAuthCookies = (res) => {
  res.setHeader("Set-Cookie", "next-auth.callback-url=-1; Max-Age=0");
  res.setHeader("Set-Cookie", "next-auth.csrf-token=-1; Max-Age=0");
  res.setHeader("Set-Cookie", "next-auth.session-token=-1; Max-Age=0");
};
