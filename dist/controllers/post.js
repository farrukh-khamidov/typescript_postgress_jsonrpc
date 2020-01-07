"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = __importDefault(require("../models/Post"));
const posts = {
    getPosts: (args) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield Post_1.default.fetchAll();
        return response.rows;
    }),
    getPost: (args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = args[0];
            if (context.userId) {
                yield Post_1.default.incrementViewsCount(id, context.userId);
            }
            const response = yield Post_1.default.findById(id);
            if (response.rowCount !== 1) {
                return Promise.resolve({ message: 'Post not found!' });
            }
            return Promise.resolve({
                message: 'Post fetched successfully',
                post: response.rows[0]
            });
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }),
    createPost: (args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let post;
            const { title, content } = args[0];
            if (context.userId) {
                post = new Post_1.default(title, content, context.userId);
            }
            else {
                return Promise.resolve({ message: 'Not authenticated' });
            }
            yield post.save();
            return Promise.resolve({
                message: 'Post created successfully',
                creatorId: context.userId
            });
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }),
    updatePost: (args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, title, content } = args[0];
            const response = yield Post_1.default.findById(id);
            if (response.rowCount !== 1) {
                const error = new Error('Post not found!');
                error.statusCode = 403;
                throw error;
            }
            else {
                const post = response.rows[0];
                if (post.user_id !== context.userId) {
                    const error = new Error('Not authorized!');
                    error.statusCode = 403;
                    throw error;
                }
                yield Post_1.default.updateById(id, title, content, context.userId);
                return Promise.resolve({
                    message: 'Post updates successfully'
                });
            }
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }),
    deletePost: (args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = args[0];
            const response = yield Post_1.default.findById(id);
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
            yield Post_1.default.deleteById(id);
            return Promise.resolve({
                message: 'Post deleted successfully'
            });
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }),
    likePost: (args, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = args[0];
            const response = yield Post_1.default.changeLikesCount(id, context.userId);
            return Promise.resolve(response);
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    })
};
exports.default = posts;
