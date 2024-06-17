
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { key_secret } from "../interfaces/interface";
import { v4 as uuidv4 } from 'uuid';
import { Credenciales } from "../interfaces/interface"
import gettingResponses from "./getResponses";
import { SqlInMemory } from "typeorm/driver/SqlInMemory";


const generateUuid = (): string => {
    return uuidv4();
};

export default class processUri {

    //VALIDAR USUARIO PARA EL LOGIN
    /* static validarUsuario(req: Request, res: Response) {
        const sql = "call sesionesBloqueoRDP.validacionUsuario ('" + req.body.usuario + "');"
        gettingResponses.getResponse(sql, (result: any) => {
            try {
                let credenciales: Credenciales = result[0][0].resultado;
                if (credenciales.resultado == "OK") {
                    bcrypt.compare(req.body.contrasena, credenciales.contrasena!,
                        function (err, res1) {
                            if (res1) {
                                const token = jwt.sign({ userId: req.body.usuario }, key_secret, {
                                    expiresIn: '12h'
                                });
                                res.send({
                                    resultado: "OK",
                                    idUsuario: credenciales.idUsuario,
                                    nombre:result[0][0].resultado.nombre,
                                    token
                                })
                            } else {
                                res.status(203).json({ 'respuesta': 'KO' })
                            }
                        }
                    );
                } else {
                    res.status(204).json({ 'respuesta': 'KO' })
                }
                //res.send(result[0][0].resultado) 
            } catch (error) {
                res.status(400).json({ 'respuesta': 'KO', error: result.error })
            }
        })
    }; */

 //VALIDAR USUARIO PARA EL LOGIN
    static validarUsuario(req: Request, res: Response) {
        const sql = "call sesionesBloqueoRDP.validacionUsuario ('" + req.body.usuario + "');"
        gettingResponses.getResponse(sql, (result: any) => {
            try {
                let credenciales: Credenciales = result[0][0].resultado;
                if (credenciales.resultado == "OK") {
                    bcrypt.compare(req.body.contrasena, credenciales.contrasena!,
                        function (err, res1) {
                            if (res1) {
                                const token = jwt.sign({ userId: req.body.usuario }, key_secret, {
                                    expiresIn: '12h'
                                });
                                // Guardar la fecha actual en formato epoch
                                const fechaActualEpoch = Math.floor(Date.now() / 1000);
                                // Llamar a la función para insertar más datos
                                processUri.registrarDatosUsuario(req.body.usuario, fechaActualEpoch, (insertResult) => {
                                    if (insertResult.success) {
                                        res.send({
                                            resultado: insertResult.data.resultado,
                                            respuesta: insertResult.data.respuesta,
                                            /* idUsuario: credenciales.idUsuario, */
                                            idPerfil:insertResult.data.idPerfil,
                                            idUsuario:insertResult.data.idUsuario,
                                            username:insertResult.data.username,
                                            token
                                        });
                                    } else {
                                        res.status(500).send({ 'respuesta': 'KO', error: insertResult.error });
                                    }
                                });
                            } else {
                                res.status(203).send({ 'respuesta': 'KO' })
                            }
                        }
                    );
                } else {
                    res.status(203).send({ 'respuesta': 'KO' })
                }
                //res.send(result[0][0].resultado) 
            } catch (error) {
                res.status(400).send({ 'respuesta': 'KO', error: result.error })
            }
        })
    };

    static registrarDatosUsuario(usuario: string, fechaActualEpoch: number, callback: (result: { success: boolean,data?: any,error?: any }) => void) {
        const updateSql = `call centralBloqueadores.registrarDatosUsuario('${usuario}',${fechaActualEpoch});`;
        gettingResponses.getResponseChorrillosBK(updateSql, (result1: any) => {
            try{
                if (result1) {
                    if (result1.error) {
                        callback({ success: false,error: result1.error })
                    } else {
                         // Aquí se intenta acceder al primer conjunto de resultados, asumiendo que es el que contiene los datos.
                        const datos = Array.isArray(result1) && result1.length > 0 ? result1[0] : null;
                        if (datos) {
                            callback({ success: true, data:datos[0]["resultado"] });
                        } else {
                            console.log("No data returned from query");
                            callback({ success: false, error: 'No data returned from query' });
                        }
                    }
                } else {
                    console.log("No result returned from query");
                    callback({ success: false, error: 'No result returned from query' });
                }
            }
            catch(error){
                callback({ success: false,error })
            }
            
        });
    }

    static obtenerUsuarios(req: Request, res: Response) {
        const sql = `SELECT uuid,nombres FROM sesionesBloqueoRDP.usuarios;`
        gettingResponses.getResponse(sql, (result: any) => {
            try {
                if (result.error) {
                    res.status(404).send({ 'respuesta': 'KO'})
                } else {
                    res.status(200).send({ resultado: "OK", respuesta: result })
                }
            } catch (error) {
                res.status(400).send({ 'respuesta': 'KO', error: result.error })
            }
        })
    };

    static obtenerDatos(req: Request, res: Response) {
        const { fechaInicio, fechaFin,idPerfil } = req.query
        const sql = `call centralBloqueadores.obtenerDatosFallas (${fechaInicio},${fechaFin},${idPerfil});`
        gettingResponses.getResponseChorrillosBK(sql, (result: any) => {
            try {
                if (result.error) {
                    res.status(404).send({ 'respuesta': 'KO'})
                } else {
                    res.status(200).send({ resultado: "OK", respuesta: result })
                }
                
            } catch (error) {
                res.status(400).send({ 'respuesta': 'KO', error: result.error })
            }
        })
    };

    static actualizarBd(req: Request, res: Response) {
        const { id=null,idDetalleFalla=null, idRazon=null, observacion=null, idUsuario=null, idFile=null, idEstado=null, fechaHoraFin=null } = req.body;
        let resultadoId: string = '';
        if(id !=null ){
            const array: number[] = id;
            resultadoId = `'${array.join(",")}'`;
        }else{
            resultadoId=id
        }
        // Asignación condicional para idDetalleFalla
        const observacionFinal = observacion == null ? null : `'${observacion}'`;
        const idFileFinal = idFile == null ? null : `'${idFile}'`
        
        const sql = `call centralBloqueadores.updateDatosFallas (${resultadoId},${idDetalleFalla},${fechaHoraFin},${idRazon},${observacionFinal},${idUsuario},${idFileFinal},${idEstado});`
        gettingResponses.getResponseChorrillosBK(sql, (result: any) => {
            try {
                if (result.error) {
                    res.status(404).send({ resultado: "KO", respuesta: { respuesta: "KO" } })
                } else {
                    res.status(200).send({ respuesta: result[0][0] })
                }
            } catch (error) {
                res.status(400).send({ 'respuesta': 'KO', error: result.error })
            }
        })
    };


    


}



// POST>>CREAR UN RECURSO O INSERTAR
// GET--->>OBTNER RECURSO
// PUT -->>ACTUALIZAR
// PATCH-->>ACTUALIZAR PARCIALMENTE
// DELETE --->> REMOVER RECURSO
