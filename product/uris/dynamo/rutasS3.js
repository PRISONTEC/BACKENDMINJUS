"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllerS3_1 = __importDefault(require("../../share/controllerS3"));
const multer_1 = __importDefault(require("multer")); // Middleware para manejar la carga de archivos
const validarToken_1 = __importDefault(require("../validarToken/validarToken"));
class Controller {
    constructor() {
        this.router = (0, express_1.Router)();
        this.upload = (0, multer_1.default)({ dest: 'uploads/' });
        this.subRutas();
    }
    subRutas() {
        this.router.post("/upload", validarToken_1.default.verifyToken, this.upload.single('file'), controllerS3_1.default.cargarDocumentos);
        this.router.get('/download/:fileName', validarToken_1.default.verifyToken, controllerS3_1.default.descargarDocumento);
        this.router.get('/downloadImagen/:fileName', validarToken_1.default.verifyToken, controllerS3_1.default.descargarImagen);
    }
}
/**
 * Get información
 * @openapi
* /files/download/{fileName}:
 *    get:
 *      tags:
 *        - obtenerArchivo
 *      summary: "Descargar un archivo"
 *      description: "Este endpoint permite descargar un archivo especificado por su nombre."
 *      parameters:
 *       - name: fileName
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: "El nombre del archivo a descargar"
 *      responses:
 *        '200':
 *         description: "Archivo descargado exitosamente"
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *        '404':
 *          description: "Archivo no encontrado"
 *      security:
 *        - Bearer: []
 */
/**
 * Get información
 * @openapi
* /files/downloadImagen/{fileName}:
 *    get:
 *      tags:
 *        - obteneImagen
 *      summary: "Descargar Imagen"
 *      description: "Este endpoint permite descargar una imagen especificado por su nombre."
 *      parameters:
 *       - name: fileName
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: "El nombre de la imagen a descargar"
 *      responses:
 *        '200':
 *         description: "Imagen descargado exitosamente"
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *        '404':
 *          description: "Imagen no encontrado"
 *      security:
 *        - Bearer: []
 */
exports.default = new Controller().router;
