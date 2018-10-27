import localforage from 'localforage';
import jwt_decode from 'jwt-decode';

const authControl = {
  isAuthenticated: false,
  decoded: {},
  async signin(token) {
    if (!token) return;
    this.isAuthenticated = true;
    await localforage.setItem('jwt', token);
    console.log('signed in');
  },
  async signout() {
    this.isAuthenticated = false;
    await localforage.removeItem('jwt');
    console.log('signed out');
  },
  async checkToken() {
    const token = await localforage.getItem('jwt');
    if (!token) return false;
    const decoded = jwt_decode(token);
    console.log(decoded);
    this.decoded = decoded;
    this.isAuthenticated = true;
    return true;
    // console.log(decoded);
  },
};

export { authControl };
