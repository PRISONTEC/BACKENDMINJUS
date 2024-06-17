
import { Request, Response } from "express";
import multer from 'multer'; // Middleware para manejar la carga de archivos
import AWS from 'aws-sdk';
import fs from 'fs';
import { key_secret } from "../interfaces/interface";
import { Credenciales } from "../interfaces/interface"


// Configurar AWS
AWS.config.update({
    region: 'us-east-1'
});

// Crear un nuevo objeto S3
const s3 = new AWS.S3();


export default class processUri {


    //VALIDAR USUARIO PARA EL LOGIN
    static cargarDocumentos(req: Request, res: Response) {
        // El archivo estará disponible en req.file
        const file = req.file as Express.Multer.File;
        if (req.file) {
            // Configuración de la subida a S3
            const params: AWS.S3.PutObjectRequest = {
                Bucket: 'documentos-mtto-bqs',
                Key: req.file.originalname,
                Body: fs.createReadStream(file.path), // Lee el archivo desde el directorio temporal donde multer lo almacenó
                /* ACL: 'public-read' // Opcional, establece los permisos del objeto en S3 */
            };

            // Subir el archivo a S3
            s3.upload(params, (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
                if (err) {
                    res.status(500).send({resultado:'KO',message:'Error al cargar archivo'});
                } else {
                    res.status(202).send({resultado:'OK',message:'Archivo cargado correctamente'});
                }
            });
        }else{
            res.status(400).send({resultado:'KO',message:'Faltan datos'});
        }
    }


    static descargarDocumento(req: Request, res: Response) {
        // Configuración de la descarga de S3
            const params: AWS.S3.GetObjectRequest = {
                Bucket: 'documentos-mtto-bqs',
                Key: req.params.fileName
            };

            // Descargar el archivo de S3
            s3.getObject(params, (err: Error, data: AWS.S3.Types.GetObjectOutput) => {
                if (err) {
                    res.status(500).send({resultado:'KO',message:'Error al descargar el archivo'});
                } else {
                    const fileBuffer = data.Body as Buffer;
                    res.set('Content-Disposition', `attachment; filename="${req.params.fileName}"`);
                    res.set('Content-Type', 'application/octet-stream');
                    res.status(200).send(fileBuffer);
                }
            });
    }

    static descargarImagen(req: Request, res: Response) {
        // Configuración de la descarga de S3
            const params: AWS.S3.GetObjectRequest = {
                Bucket: 'zonas-coberturas-pst',
                Key: `${req.params.fileName}.png`
            };

            // Descargar el archivo de S3
            s3.getObject(params, (err: Error, data: AWS.S3.Types.GetObjectOutput) => {
                if (err) {
                    res.status(500).send({resultado:'KO',message:'Error al descargar la Imagen'});
                } else {
                    const fileBuffer = data.Body as Buffer;
                    res.set('Content-Disposition', `attachment; filename="${req.params.fileName}.png"`);
                    res.set('Content-Type', 'application/octet-stream');
                    res.status(200).send(fileBuffer);
                }
            });
    }
}