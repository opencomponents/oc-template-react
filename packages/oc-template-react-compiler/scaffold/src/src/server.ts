import { Context } from 'oc-template-typescript-react-compiler';
import { AdditionalData, ClientProps, OcParameters } from './types';

const database = [
  { name: 'John Doe', age: 34, hobbies: ['Swimming', 'Basketball'] },
  { name: 'Jane Doe', age: 35, hobbies: ['Running', 'Rugby'] }
];

async function getUser(userId: number) {
  return database[userId];
}

export async function data(
  context: Context<OcParameters>,
  callback: (error: any, data: ClientProps | AdditionalData) => void
) {
  const { userId } = context.params;
  const user = await getUser(userId);
  const shouldGetMoreData = context.params.getMoreData;
  const [firstName, lastName] = user.name.split(/\s+/);

  if (shouldGetMoreData) {
    return callback(null, {
      age: user.age,
      hobbies: user.hobbies
    });
  }

  return callback(null, {
    userId,
    firstName,
    lastName
  });
}
