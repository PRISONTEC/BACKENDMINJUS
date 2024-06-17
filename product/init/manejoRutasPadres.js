"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const body_parser_1 = __importDefault(require("body-parser"));
const conexion_1 = __importDefault(require("../uris/conexion/conexion"));
const manejadorErroresHTTP_1 = __importDefault(require("../uris/manejadorErroresHTTP"));
const healthPage_1 = __importDefault(require("../uris/healthPage"));
const rutasS3_1 = __importDefault(require("../uris/dynamo/rutasS3"));
class manejadorRutas {
    constructor() {
        this.paths = (0, express_1.Router)();
        this.rutas();
    }
    rutas() {
        this.paths.use(body_parser_1.default.json());
        this.paths.get("/", healthPage_1.default.healthy); //CREAR-VALIDAR-ELIMINAR USUARIO
        this.paths.use("/conexion", conexion_1.default);
        this.paths.use("/files", rutasS3_1.default);
        this.paths.use(manejadorErroresHTTP_1.default.notFound);
    }
}
exports.default = manejadorRutas;
