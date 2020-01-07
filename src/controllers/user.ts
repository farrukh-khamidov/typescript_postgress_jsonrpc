import Post from '../models/Post';

const userPosts = {
  getUserPosts: async (args: any, context: any) => {
    try {
      const response = await Post.fetchAllOfUser(context.userId);
      return new Promise((resolve, reject) => {
        resolve({
          message:
            response.rows.length > 0
              ? 'Posts fetched successfully'
              : 'No posts yet!',
          posts: response.rows
        });
      });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },

  getTopLikedPosts: async (args: any, context: any) => {
    try {
      const response = await Post.fetchTopLikedOfUser(context.userId);
      return new Promise((resolve, reject) => {
        resolve({
          message:
            response.rows.length > 0
              ? 'Posts fetched successfully'
              : 'No posts yet!',
          posts: response.rows
        });
      });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },

  getTopViewedPosts: async (args: any, context: any) => {
    try {
      const response = await Post.fetchTopViewedOfUser(context.userId);
      return new Promise((resolve, reject) => {
        resolve({
          message:
            response.rows.length > 0
              ? 'Posts fetched successfully'
              : 'No posts yet!',
          posts: response.rows
        });
      });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },

  getUserPostsInfo: async (args: any, context: any) => {
    try {
      const response = await Post.fetchUserPostsInfo(context.userId);
      return new Promise((resolve, reject) => {
        resolve({
          message:
            response.rows.length > 0
              ? 'PostsInfo fetched successfully'
              : 'No posts yet!',
          postsInfo: response.rows
        });
      });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }
};

export default userPosts;
