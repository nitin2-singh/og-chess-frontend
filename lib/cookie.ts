import Cookies from "js-cookie";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

export const cookies = {
  getAccessToken() {
    return Cookies.get(ACCESS_TOKEN);
  },

  setAccessToken(token: string) {
    Cookies.set(ACCESS_TOKEN, token, {
      expires: 1,
      sameSite: "lax",
    });
  },

  getRefreshToken() {
    return Cookies.get(REFRESH_TOKEN);
  },

  setRefreshToken(token: string) {
    Cookies.set(REFRESH_TOKEN, token, {
      expires: 7,
      sameSite: "lax",
    });
  },

  clear() {
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(REFRESH_TOKEN);
  },
};
