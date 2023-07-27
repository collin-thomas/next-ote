import { serialize, parse } from "cookie";

/**
 * Sets __Host- prefix for extra security when in HTTPS env.
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#cookie_prefixes
 * @param {String} name Name of the cookie
 * @returns {String} Name of the cookie
 */
export const getSecureCookieName = (name) => {
  return `${process.env.NODE_ENV === "production" ? "__Host-" : ""}${name}`;
};

/**
 * Returns the representation of a HTTP cookie to be created.
 * Requires setHeader() to be called. See example.
 * Sets __Host- prefix for extra security when in HTTPS env.
 * @param {String} name Name of the cookie
 * @param {String} value Contents of the cookie
 * @param {Object} {maxAge} of the cookie
 * @returns {String} The cookie
 * @example context.res.setHeader("Set-Cookie", createCookie(...));
 */
export const createCookie = (name, value, { maxAge = 3600 } = {}) => {
  return serialize(getSecureCookieName(name), String(value), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge,
  });
};

/**
 * Returns the representation of a HTTP cookie to be deleted.
 * Requires setHeader() to be called. See example.
 * @param {String} name The name of the cookie to delete
 * @returns {String} The cookie
 * @example context.res.setHeader("Set-Cookie", deleteCookie(...));
 */
export const deleteCookie = (name) => {
  // Delete the 'token' cookie by setting the expiry date to the past
  return serialize(name, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: -1,
  });
};

/**
 * Get all HTTP Cookies
 * @param {Object} context Next.js context object from getServerSideProps
 * @returns {Object} Key value pair of cookies
 */
export const getCookies = ({ context }) => {
  return parse(context?.req?.headers?.cookie || "");
};
