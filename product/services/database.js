"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
class default_1 {
    constructor(host, user, pass, port) {
        this.activeDB = false;
        this.conn = mysql2_1.default.createConnection({
            host: host,
            user: user,
            password: pass,
            port: port,
        });
        this.activeDB = false;
    }
    getInstance() {
        return new Promise((resolve, reject) => {
            this.conn.connect((err) => {
                if (err) {
                    console.log(err);
                    this.activeDB = false;
                    reject(this.activeDB);
                }
                else {
                    this.activeDB = true;
                    resolve(this.activeDB);
                }
            });
        });
    }
    isAlive() {
        return this.activeDB;
    }
    setState(state) {
        this.activeDB = state;
    }
}
exports.default = default_1;
