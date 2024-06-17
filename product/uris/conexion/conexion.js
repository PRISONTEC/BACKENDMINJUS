"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const procesarUri_1 = __importDefault(require("../../share/procesarUri"));
const validarToken_1 = __importDefault(require("../validarToken/validarToken"));
class Controller {
    constructor() {
        this.router = (0, express_1.Router)();
        this.subRutas();
    }
    subRutas() {
        this.router.post("/login", procesarUri_1.default.validarUsuario); //VALIDAR USUARIO
        this.router.get("/usuarios", validarToken_1.default.verifyToken, procesarUri_1.default.obtenerUsuarios);
        this.router.get("/informacion", validarToken_1.default.verifyToken, procesarUri_1.default.obtenerDatos);
        this.router.put("/actualizarBd", validarToken_1.default.verifyToken, procesarUri_1.default.actualizarBd);
    }
}
/**
 * Post track
 * @openapi
 * /conexion/login:
 *    post:
 *      tags:
 *        - login
 *      summary: "Listar usuario"
 *      description: Este endpoint es para validar usuario
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/login"
 *      responses:
 *        '200':
 *          description: Retorna el objeto insertado en la coleccion.
 *        '422':
 *          description: Error de validacion.
 *      security:
 *       - bearerAuth: []
 */
/**
 * Get información
 * @openapi
 * /conexion/usuarios:
 *    get:
 *      tags:
 *        - usuarios
 *      summary: "Obtener Usuarios"
 *      description: Este endpoint obtiene los usuarios basada en el token.
 *      responses:
 *        '200':
 *          description: Retorna la información solicitada.
 *        '422':
 *          description: Error de validación.
 *      security:
 *        - Bearer: []
 */
/**
 * Get información
 * @openapi
 * /conexion/informacion:
 *    get:
 *      tags:
 *        - obtenerInformacion
 *      summary: "Obtener información"
 *      description: Este endpoint obtiene información basada en las fechas de inicio y fin.
 *      parameters:
 *        - in: query
 *          name: fechaInicio
 *          required: true
 *          schema:
 *            type: string
 *          description: La fecha de inicio en formato de marca de tiempo (timestamp).
 *        - in: query
 *          name: fechaFin
 *          required: true
 *          schema:
 *            type: string
 *          description: La fecha de fin en formato de marca de tiempo (timestamp).
 *      responses:
 *        '200':
 *          description: Retorna la información solicitada.
 *        '422':
 *          description: Error de validación.
 *      security:
 *        - Bearer: []
 */
/**
 * Actualizar información
 * @openapi
 * /conexion/actualizarBd:
 *   put:
 *     tags:
 *       - actualizarBq
 *     summary: "Actualizar información"
 *     description: Este endpoint actualiza información.
 *     requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/actualizarBq"
 *     responses:
 *       '200':
 *         description: Retorna la información actualizada.
 *       '422':
 *         description: Error de validación.
 *     security:
 *       - Bearer: []
 */
exports.default = new Controller().router;
