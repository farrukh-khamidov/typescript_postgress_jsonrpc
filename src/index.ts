import express from 'express';
import bodyParser from 'body-parser';

import jayson from 'jayson/promise';

import posts from './controllers/post';
import auth from './controllers/auth';
import userPosts from './controllers/user';

import isAuth from './middleware/isAuth';
import { IGetUserAuthInfoRequest } from './utils/custom';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const serverPosts = jayson.server(posts, {
  // all methods will receive a context object as the second arg
  useContext: true
});

const serverUserPosts = jayson.server(userPosts, {
  // all methods will receive a context object as the second arg
  useContext: true
});

app.post(
  '/posts',
  isAuth,
  (
    req: IGetUserAuthInfoRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // prepare a context object passed into the JSON-RPC method
    const context = { userId: req.userId };
    serverPosts.call(req.body, context, function(err, result) {
      if (err) {
        res.send(err);
      }
      // console.log(result);
      res.send(result || {});
    });
  }
);

app.post('/auth', jayson.server(auth).middleware());

app.post(
  '/user-posts',
  isAuth,
  (
    req: IGetUserAuthInfoRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // prepare a context object passed into the JSON-RPC method
    const context = { userId: req.userId };
    serverUserPosts.call(req.body, context, function(err, result) {
      if (err) return next(err);
      res.send(result || {});
    });
  }
);

app.listen(3000, () => {
  console.log('Server on port ', 3000);
});
