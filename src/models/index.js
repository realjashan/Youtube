// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Video, Comment, User } = initSchema(schema);

export {
  Video,
  Comment,
  User
};