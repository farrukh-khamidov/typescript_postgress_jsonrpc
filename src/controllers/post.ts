import Post from '../models/Post';

const posts = {
  getPosts: async (args: any) => {
    const response = await Post.fetchAll();
    return response.rows;
  },

  getPost: async (args: any, context: any) => {
    try {
      const { id } = args[0];
      if (context.userId) {
        await Post.incrementViewsCount(id, context.userId);
      }
      const response = await Post.findById(id);

      if (response.rowCount !== 1) {
        return Promise.resolve({ message: 'Post not found!' });
      }
      return Promise.resolve({
        message: 'Post fetched successfully',
        post: response.rows[0]
      });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },

  createPost: async (args: any, context: any) => {
    try {
      let post: Post;
      const { title, content } = args[0];
      if (context.userId) {
        post = new Post(title, content, context.userId);
      } else {
        return Promise.resolve({ message: 'Not authenticated' });
      }
      await post.save();

      return Promise.resolve({
        message: 'Post created successfully',
        creatorId: context.userId
      });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },

  updatePost: async (args: any, context: any) => {
    try {
      const { id, title, content } = args[0];
      const response = await Post.findById(id);
      if (response.rowCount !== 1) {
        const error = new Error('Post not found!');
        error.statusCode = 403;
        throw error;
      } else {
        const post = response.rows[0];

        if (post.user_id !== context.userId) {
          const error = new Error('Not authorized!');
          error.statusCode = 403;
          throw error;
        }
        await Post.updateById(id, title, content, context.userId);
        return Promise.resolve({
          message: 'Post updates successfully'
        });
      }
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },

  deletePost: async (args: any, context: any) => {
    try {
      const { id } = args[0];

      const response = await Post.findById(id);

      if (response.rowCount !== 1) {
        const error = new Error('Post not found!');
        error.statusCode = 403;
        throw error;
      }

      const post = response.rows[0];

      if (post.user_id !== context.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
      }
      await Post.deleteById(id);
      return Promise.resolve({
        message: 'Post deleted successfully'
      });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },

  likePost: async (args: any, context: any) => {
    try {
      const { id } = args[0];
      const response = await Post.changeLikesCount(id, context.userId);

      return Promise.resolve(response);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }
};

export default posts;
