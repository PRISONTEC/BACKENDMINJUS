"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const interface_1 = require("../interfaces/interface");
const uuid_1 = require("uuid");
const getResponses_1 = __importDefault(require("./getResponses"));
const generateUuid = () => {
    return (0, uuid_1.v4)();
};
class processUri {
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
    static validarUsuario(req, res) {
        const sql = "call sesionesBloqueoRDP.validacionUsuario ('" + req.body.usuario + "');";
        getResponses_1.default.getResponse(sql, (result) => {
            try {
                let credenciales = result[0][0].resultado;
                if (credenciales.resultado == "OK") {
                    bcrypt.compare(req.body.contrasena, credenciales.contrasena, function (err, res1) {
                        if (res1) {
                            const token = jsonwebtoken_1.default.sign({ userId: req.body.usuario }, interface_1.key_secret, {
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
                                        idPerfil: insertResult.data.idPerfil,
                                        idUsuario: insertResult.data.idUsuario,
                                        username: insertResult.data.username,
                                        token
                                    });
                                }
                                else {
                                    res.status(500).send({ 'respuesta': 'KO', error: insertResult.error });
                                }
                            });
                        }
                        else {
                            res.status(203).send({ 'respuesta': 'KO' });
                        }
                    });
                }
                else {
                    res.status(203).send({ 'respuesta': 'KO' });
                }
                //res.send(result[0][0].resultado) 
            }
            catch (error) {
                res.status(400).send({ 'respuesta': 'KO', error: result.error });
            }
        });
    }
    ;
    static registrarDatosUsuario(usuario, fechaActualEpoch, callback) {
        const updateSql = `call centralBloqueadores.registrarDatosUsuario('${usuario}',${fechaActualEpoch});`;
        getResponses_1.default.getResponseChorrillosBK(updateSql, (result1) => {
            try {
                if (result1) {
                    if (result1.error) {
                        callback({ success: false, error: result1.error });
                    }
                    else {
                        // Aquí se intenta acceder al primer conjunto de resultados, asumiendo que es el que contiene los datos.
                        const datos = Array.isArray(result1) && result1.length > 0 ? result1[0] : null;
                        if (datos) {
                            callback({ success: true, data: datos[0]["resultado"] });
                        }
                        else {
                            console.log("No data returned from query");
                            callback({ success: false, error: 'No data returned from query' });
                        }
                    }
                }
                else {
                    console.log("No result returned from query");
                    callback({ success: false, error: 'No result returned from query' });
                }
            }
            catch (error) {
                callback({ success: false, error });
            }
        });
    }
    static obtenerUsuarios(req, res) {
        const sql = `SELECT uuid,nombres FROM sesionesBloqueoRDP.usuarios;`;
        getResponses_1.default.getResponse(sql, (result) => {
            try {
                if (result.error) {
                    res.status(404).send({ 'respuesta': 'KO' });
                }
                else {
                    res.status(200).send({ resultado: "OK", respuesta: result });
                }
            }
            catch (error) {
                res.status(400).send({ 'respuesta': 'KO', error: result.error });
            }
        });
    }
    ;
    static obtenerDatos(req, res) {
        const { fechaInicio, fechaFin, idPerfil } = req.query;
        const sql = `call centralBloqueadores.obtenerDatosFallas (${fechaInicio},${fechaFin},${idPerfil});`;
        getResponses_1.default.getResponseChorrillosBK(sql, (result) => {
            try {
                if (result.error) {
                    res.status(404).send({ 'respuesta': 'KO' });
                }
                else {
                    res.status(200).send({ resultado: "OK", respuesta: result });
                }
            }
            catch (error) {
                res.status(400).send({ 'respuesta': 'KO', error: result.error });
            }
        });
    }
    ;
    static actualizarBd(req, res) {
        const { id = null, idDetalleFalla = null, idRazon = null, observacion = null, idUsuario = null, idFile = null, idEstado = null, fechaHoraFin = null } = req.body;
        let resultadoId = '';
        if (id != null) {
            const array = id;
            resultadoId = `'${array.join(",")}'`;
        }
        else {
            resultadoId = id;
        }
        // Asignación condicional para idDetalleFalla
        const observacionFinal = observacion == null ? null : `'${observacion}'`;
        const idFileFinal = idFile == null ? null : `'${idFile}'`;
        const sql = `call centralBloqueadores.updateDatosFallas (${resultadoId},${idDetalleFalla},${fechaHoraFin},${idRazon},${observacionFinal},${idUsuario},${idFileFinal},${idEstado});`;
        getResponses_1.default.getResponseChorrillosBK(sql, (result) => {
            try {
                if (result.error) {
                    res.status(404).send({ resultado: "KO", respuesta: { respuesta: "KO" } });
                }
                else {
                    res.status(200).send({ respuesta: result[0][0] });
                }
            }
            catch (error) {
                res.status(400).send({ 'respuesta': 'KO', error: result.error });
            }
        });
    }
    ;
}
exports.default = processUri;
// POST>>CREAR UN RECURSO O INSERTAR
// GET--->>OBTNER RECURSO
// PUT -->>ACTUALIZAR
// PATCH-->>ACTUALIZAR PARCIALMENTE
// DELETE --->> REMOVER RECURSO
