import { Router } from "express";
import processUri from "../../share/procesarUri";
import validarToken from "../validarToken/validarToken";
import { Request, Response } from "express";


class Controller {
    router: Router
    constructor() {
        this.router = Router()
        this.subRutas()
    }

    subRutas() {
        this.router.post("/login",processUri.validarUsuario)//VALIDAR USUARIO
        this.router.get("/usuarios",validarToken.verifyToken,processUri.obtenerUsuarios)   
        this.router.get("/informacion",validarToken.verifyToken,processUri.obtenerDatos)
        this.router.put("/actualizarBd",validarToken.verifyToken,processUri.actualizarBd)
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




export default new Controller().router