import { auth } from './auth';

const user = async (_, { _id }, { db }) => {
  try {
    const user = await db.User.findById(_id);
    if (!user) {
      throw new Error('User not found.');
    }
    return user;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const login = async (_, { username, password }, { db }) => {
  try {
    const user = await db.User.findOne({ username });
    if (!user) {
      throw new Error('Incorrect username.');
    }
    if (!user.validPassword(password)) {
      throw new Error('Incorrect password.');
    }
    return user.generateJWT();
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const upvote = async (_, { _id, choice, vessels }, { db, user }) => {
  auth(user);
  try {
    const image = await db.Image.findById(_id);
    if (!image) {
      throw new Error('Image not found.');
    }
    const fullUser = await db.User.findById(user._id);
    const found = fullUser.marksheet.findIndex(e => e.image === _id);
    if (found > -1) {
      const { choice: prevChoice, vessels: prevVessels } = fullUser.marksheet[
        found
      ];
      if (prevChoice === choice && prevVessels === vessels) {
        return 'Answer the same.';
      }
      fullUser.marksheet[found].choice = choice;
      fullUser.marksheet[found].vessels = vessels;
      if (prevChoice !== choice) {
        image[prevChoice] = image[prevChoice] > 0 ? image[prevChoice] - 1 : 0;
        image[choice] += 1;
      }
      if (prevVessels !== vessels) {
        if (vessels) {
          image.vessels += 1;
          image.noVessels -= 1;
        } else {
          image.vessels -= 1;
          image.noVessels += 1;
        }
      }
    } else {
      fullUser.marksheet.push({
        image: _id,
        choice,
        vessels,
      });
      image[choice] += 1;
      if (vessels) {
        image.vessels += 1;
      } else {
        image.noVessels += 1;
      }
    }
    await Promise.all([fullUser.save(), image.save()]);
    return 'Answer saved.';
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export { login, upvote, user };
