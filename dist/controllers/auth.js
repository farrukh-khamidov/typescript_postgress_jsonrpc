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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const auth = {
    signup: (args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { firstName, lastName, userName, email, password } = args[0];
            const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
            const user = new User_1.User(firstName, lastName, userName, email, hashedPassword);
            yield user.save();
            return new Promise((resolve, reject) => {
                resolve({ message: 'User created successfully' });
            });
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }),
    login: (args) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(args);
            const { email, password } = args[0];
            const response = yield User_1.User.findByEmail(email);
            if (response.rowCount === 0) {
                const error = new Error('A user with this email does not exist!');
                error.statusCode = 401;
                throw error;
            }
            const user = response.rows[0];
            const isEqual = yield bcryptjs_1.default.compare(password, user.password);
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            const token = jsonwebtoken_1.default.sign({ email: user.email, userId: user.id }, 'thisismytypescriptsupersecretkey', { expiresIn: '1h' });
            return new Promise((resolve, reject) => {
                resolve({ token, userId: user.id });
            });
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    })
};
exports.default = auth;
