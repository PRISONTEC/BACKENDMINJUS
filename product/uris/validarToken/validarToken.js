"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const interface_1 = require("../../interfaces/interface");
/* interface AuthenticatedRequest extends Request {
    userId: string;
  } */
class validarToken {
    constructor(secret) {
        this.secret = secret;
    }
}
validarToken.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        res.status(401).json({ error: 'Access denied' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, interface_1.key_secret /* , (async (err)=>{console.log("error",err?.message)}) */);
        next();
    }
    catch (error) {
        /* res.status(401).json({ error: 'Invalid token' }); */
        res.send("token expiro");
    }
};
exports.default = validarToken;
