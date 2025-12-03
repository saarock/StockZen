import api from "../instance/axiosInstance";

class Auth {
  static async register(userFromData) {
    try {
      const response = await api.post("/register", userFromData);
      const data = await response.data;
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  static async verifyRefreshTokenAndgetNewAccessToken(refreshToken) {}

  static async sendMail(to) {
    try {
      const response = await api.post("/send_mail", { email: to });
      const data = response.data;
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }

  static async verifyMail(otbObj) {
    try {
      const response = await api.post("/mail_verify", otbObj);
      const data = response.data;
      return data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
}

export default Auth;
