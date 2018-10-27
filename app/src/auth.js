import localforage from 'localforage';
import jwt_decode from 'jwt-decode';

const authControl = {
  isAuthenticated: false,
  decoded: {},
  async getToken() {
    return await localforage.getItem('jwt');
  },
  async signin(token) {
    if (!token) return;
    this.isAuthenticated = true;
    const decoded = jwt_decode(token);
    this.decoded = decoded;
    return await localforage.setItem('jwt', token);
  },
  async signout() {
    this.isAuthenticated = false;
    this.decoded = {};
    return await localforage.removeItem('jwt');
  },
  async checkToken() {
    let decoded;
    if (Object.keys(this.decoded) > 0) {
      decoded = this.decoded;
    } else {
      const token = await localforage.getItem('jwt');
      if (!token) return false;
      decoded = jwt_decode(token);
    }
    if (Math.round(new Date().getTime() / 1000) < decoded.exp) {
      this.decoded = decoded;
      this.isAuthenticated = true;
      return true;
    }
    return false;
  },
};

export { authControl };
