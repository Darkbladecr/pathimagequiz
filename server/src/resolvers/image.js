import { auth } from './auth';

const images = async (_, args, { db, user }) => {
  auth(user);
  try {
    return await db.Image.find({});
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export { images };
