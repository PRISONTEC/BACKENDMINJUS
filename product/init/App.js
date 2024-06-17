"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnChoBK = exports.DBConn = void 0;
const express_1 = __importDefault(require("express"));
const webServer_1 = __importDefault(require("../services/webServer"));
const database_1 = __importDefault(require("../services/database"));
const worker_threads_1 = require("worker_threads");
const manejoRutasPadres_1 = __importDefault(require("./manejoRutasPadres"));
const manejadorErroresHTTP_1 = __importDefault(require("../uris/manejadorErroresHTTP"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("../swagger/swagger"));
// WATCHDOG
const TIME_KEE_ALIVE = 10 * 1000; //ms 
//SERVER CONEXION
const WebServer = new webServer_1.default();
exports.DBConn = new database_1.default('localhost', 'root', 'BdD@3nt3l', 3306);
exports.DBConnChoBK = new database_1.default('192.168.169.253', 'root', 't3l3ph0nY$', 3306);
/* export const DBConn: DBConnection = new conDB('192.168.169.253', 'root', 't3l3ph0nY$', 3306);  */
WebServer.server.use("/documentation", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
WebServer.initialize(2950)
    .then((message) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!(yield exports.DBConn.getInstance()))
                console.log("No se conecto a la BdD ENTEL");
            else {
                console.log("Se conectó la BdD ENTEL");
                setInterval(checkCon, TIME_KEE_ALIVE);
            }
            if (!(yield exports.DBConnChoBK.getInstance()))
                console.log("No se conecto a la BdD BACKUP CHORRILLOS");
            else {
                console.log("Se conectó la BdD BACKUP CHORRILLOS");
                setInterval(checkConChorrillosBK, TIME_KEE_ALIVE);
            }
            const myPaths = new manejoRutasPadres_1.default();
            WebServer.server.use(express_1.default.json());
            WebServer.server.use(express_1.default.urlencoded({ extended: true }));
            WebServer.server.use("/", myPaths.paths);
            /* WebServer.server.use("/documentation",swaggerUi.serve,swaggerUi.setup(swaggerSetup)); */
        }
        catch (error) {
            console.log(error);
            WebServer.server.use(manejadorErroresHTTP_1.default.notFound);
        }
    }))();
})
    .catch((error) => {
    console.log("catchingServer... " + error);
    throw error;
});
// WATCHDOG
function checkCon() {
    const sql = 'SELECT 1';
    exports.DBConn.conn.query(sql, (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            worker_threads_1.parentPort.postMessage(null);
        }
        else {
            //insertarFecha();
            //console.log(results);
            //parentPort.postMessage({ done: results });
        }
    });
}
;
function checkConChorrillosBK() {
    const sql = 'SELECT 1';
    exports.DBConnChoBK.conn.query(sql, (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            worker_threads_1.parentPort.postMessage(null);
        }
        else {
            //insertarFecha();
            //console.log(results);
            //parentPort.postMessage({ done: results });
        }
    });
}
;
