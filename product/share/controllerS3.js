"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs_1 = __importDefault(require("fs"));
// Configurar AWS
aws_sdk_1.default.config.update({
    region: 'us-east-1'
});
// Crear un nuevo objeto S3
const s3 = new aws_sdk_1.default.S3();
class processUri {
    //VALIDAR USUARIO PARA EL LOGIN
    static cargarDocumentos(req, res) {
        // El archivo estará disponible en req.file
        const file = req.file;
        if (req.file) {
            // Configuración de la subida a S3
            const params = {
                Bucket: 'documentos-mtto-bqs',
                Key: req.file.originalname,
                Body: fs_1.default.createReadStream(file.path), // Lee el archivo desde el directorio temporal donde multer lo almacenó
                /* ACL: 'public-read' // Opcional, establece los permisos del objeto en S3 */
            };
            // Subir el archivo a S3
            s3.upload(params, (err, data) => {
                if (err) {
                    res.status(500).send({ resultado: 'KO', message: 'Error al cargar archivo' });
                }
                else {
                    res.status(202).send({ resultado: 'OK', message: 'Archivo cargado correctamente' });
                }
            });
        }
        else {
            res.status(400).send({ resultado: 'KO', message: 'Faltan datos' });
        }
    }
    static descargarDocumento(req, res) {
        // Configuración de la descarga de S3
        const params = {
            Bucket: 'documentos-mtto-bqs',
            Key: req.params.fileName
        };
        // Descargar el archivo de S3
        s3.getObject(params, (err, data) => {
            if (err) {
                res.status(500).send({ resultado: 'KO', message: 'Error al descargar el archivo' });
            }
            else {
                const fileBuffer = data.Body;
                res.set('Content-Disposition', `attachment; filename="${req.params.fileName}"`);
                res.set('Content-Type', 'application/octet-stream');
                res.status(200).send(fileBuffer);
            }
        });
    }
    static descargarImagen(req, res) {
        // Configuración de la descarga de S3
        const params = {
            Bucket: 'zonas-coberturas-pst',
            Key: `${req.params.fileName}.png`
        };
        // Descargar el archivo de S3
        s3.getObject(params, (err, data) => {
            if (err) {
                res.status(500).send({ resultado: 'KO', message: 'Error al descargar la Imagen' });
            }
            else {
                const fileBuffer = data.Body;
                res.set('Content-Disposition', `attachment; filename="${req.params.fileName}.png"`);
                res.set('Content-Type', 'application/octet-stream');
                res.status(200).send(fileBuffer);
            }
        });
    }
}
exports.default = processUri;
