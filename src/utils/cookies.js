import { serialize, parse } from "cookie";

export const getSecureCookieName = (name) => {
  return `${process.env.NODE_ENV === "production" ? "__Host-" : ""}${name}`;
};

export const createCookie = (name, value, { maxAge = 3600 } = {}) => {
  return serialize(getSecureCookieName(name), String(value), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge,
  });
};

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

export const getCookies = (context) => {
  return parse(context?.req?.headers?.cookie || "");
};
