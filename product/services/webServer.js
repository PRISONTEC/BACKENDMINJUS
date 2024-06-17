"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
class default_1 {
    constructor() {
        this.server = (0, express_1.default)();
    }
    initialize(port) {
        return new Promise((resolve, reject) => {
            this.server.use((0, cors_1.default)({
                origin: '*'
            }));
            this.server.listen(port, () => {
                resolve("Server Connected on Port " + port);
            });
        });
    }
}
exports.default = default_1;
