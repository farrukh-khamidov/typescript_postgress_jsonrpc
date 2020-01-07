"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const promise_1 = __importDefault(require("jayson/promise"));
const post_1 = __importDefault(require("./controllers/post"));
const auth_1 = __importDefault(require("./controllers/auth"));
const user_1 = __importDefault(require("./controllers/user"));
const isAuth_1 = __importDefault(require("./middleware/isAuth"));
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
const serverPosts = promise_1.default.server(post_1.default, {
    // all methods will receive a context object as the second arg
    useContext: true
});
const serverUserPosts = promise_1.default.server(user_1.default, {
    // all methods will receive a context object as the second arg
    useContext: true
});
app.post('/posts', isAuth_1.default, (req, res, next) => {
    // prepare a context object passed into the JSON-RPC method
    const context = { userId: req.userId };
    serverPosts.call(req.body, context, function (err, result) {
        if (err) {
            res.send(err);
        }
        // console.log(result);
        res.send(result || {});
    });
});
app.post('/auth', promise_1.default.server(auth_1.default).middleware());
app.post('/user-posts', isAuth_1.default, (req, res, next) => {
    // prepare a context object passed into the JSON-RPC method
    const context = { userId: req.userId };
    serverUserPosts.call(req.body, context, function (err, result) {
        if (err)
            return next(err);
        res.send(result || {});
    });
});
app.listen(3000, () => {
    console.log('Server on port ', 3000);
});
