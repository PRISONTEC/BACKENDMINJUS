import { Router } from "express";
import processUri from "../../share/controllerS3";
import multer from 'multer'; // Middleware para manejar la carga de archivos
import validarToken from "../validarToken/validarToken";

class Controller {
    router: Router
    upload: multer.Multer;
    constructor() {
        this.router = Router()
        this.upload = multer({ dest: 'uploads/' });
        this.subRutas()
    }


    subRutas() {
        this.router.post("/upload", validarToken.verifyToken, this.upload.single('file'),processUri.cargarDocumentos);
        this.router.get('/download/:fileName',validarToken.verifyToken, processUri.descargarDocumento);
        this.router.get('/downloadImagen/:fileName',validarToken.verifyToken, processUri.descargarImagen);
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

export default new Controller().router