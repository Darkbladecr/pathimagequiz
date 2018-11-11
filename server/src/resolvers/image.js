import { auth } from './auth';
import shuffle from 'lodash/shuffle';

const reorderImages = (images, marksheet) => {
  const completedIds = marksheet.map(x => x.image.toString());
  const completed = images.filter(x => completedIds.includes(x._id.toString()));
  const incomplete = images.filter(
    x => !completedIds.includes(x._id.toString())
  );
  return completed.concat(incomplete);
};

const images = async (_, args, { db, user }) => {
  auth(user);
  try {
    const { marksheet } = await db.User.findById(user._id);
    const images = await db.Image.find({});
    const shuffled = shuffle(images);
    return reorderImages(shuffled, marksheet);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export { images };
