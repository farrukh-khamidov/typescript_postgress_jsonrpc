import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { User } from '../models/User';

const auth = {
  signup: async (args: any) => {
    try {
      const { firstName, lastName, userName, email, password } = args[0];
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User(
        firstName,
        lastName,
        userName,
        email,
        hashedPassword
      );
      await user.save();
      return new Promise((resolve, reject) => {
        resolve({ message: 'User created successfully' });
      });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },

  login: async (args: any) => {
    try {
      console.log(args);
      const { email, password } = args[0];
      const response = await User.findByEmail(email);
      if (response.rowCount === 0) {
        const error = new Error('A user with this email does not exist!');
        error.statusCode = 401;
        throw error;
      }

      const user = response.rows[0];
      const isEqual = await bcrypt.compare(password, user.password);

      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        { email: user.email, userId: user.id },
        'thisismytypescriptsupersecretkey',
        { expiresIn: '1h' }
      );
      return new Promise((resolve, reject) => {
        resolve({ token, userId: user.id });
      });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }
};

export default auth;
