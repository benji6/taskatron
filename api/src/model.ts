import {MongoClient} from 'mongodb';
import {IUserPostBody, IUserRecord} from './shared/types'

const url = 'mongodb://localhost:27017';
const dbName = 'mu';

export const insertUser = (user: IUserPostBody): Promise<IUserRecord> => MongoClient.connect(url)
  .then((client: any) => client.db(dbName)
    .collection('users')
    .insertOne(user)
    .then((result: any) => {
      console.log('result', result)
      console.log('user', user)
      client.close();
      return user
    })
  );
