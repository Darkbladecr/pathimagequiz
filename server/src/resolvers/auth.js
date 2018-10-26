const auth = user => {
  if (!user) {
    throw new Error('Not Authorized.');
  }
};

export { auth };
