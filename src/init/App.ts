import express from 'express'
import webServer, { wserver } from "../services/webServer";
import conDB, { DBConnection } from "../services/database";
import { parentPort } from 'worker_threads';
import paths from "./manejoRutasPadres";
import errorHTTP from "../uris/manejadorErroresHTTP";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from "swagger-ui-express";
import swaggerSetup from '../swagger/swagger'
// WATCHDOG
const TIME_KEE_ALIVE = 10 * 1000; //ms 

//SERVER CONEXION
const WebServer: wserver = new webServer();
export const DBConn: DBConnection = new conDB('localhost', 'root', 'BdD@3nt3l', 3306);
export const DBConnChoBK: DBConnection = new conDB('192.168.169.253', 'root', 't3l3ph0nY$', 3306);
/* export const DBConn: DBConnection = new conDB('192.168.169.253', 'root', 't3l3ph0nY$', 3306);  */

WebServer.server.use("/documentation",swaggerUi.serve,swaggerUi.setup(swaggerSetup));
WebServer.initialize(2950)
  .then((message) => {
    (async () => {
      try {
        if (!(await DBConn.getInstance())) console.log("No se conecto a la BdD ENTEL")
        else {
          console.log("Se conectó la BdD ENTEL");
          setInterval(checkCon, TIME_KEE_ALIVE);
        }

        if (!(await DBConnChoBK.getInstance())) console.log("No se conecto a la BdD BACKUP CHORRILLOS")
          else {
            console.log("Se conectó la BdD BACKUP CHORRILLOS");
            setInterval(checkConChorrillosBK, TIME_KEE_ALIVE);
          }

        const myPaths = new paths();
        WebServer.server.use(express.json());
        WebServer.server.use(express.urlencoded({ extended: true }));
        WebServer.server.use("/", myPaths.paths);
        /* WebServer.server.use("/documentation",swaggerUi.serve,swaggerUi.setup(swaggerSetup)); */
      } catch (error) {
        console.log(error);
        WebServer.server.use(errorHTTP.notFound);
      }

    })();
  })
  .catch((error) => {
    console.log("catchingServer... " + error);
    throw error
  });

// WATCHDOG
function checkCon() {
  const sql = 'SELECT 1';
  DBConn.conn.query(sql, (err, results) => {
    if (err) {
      console.error('Error al realizar la consulta:', err);
      parentPort!.postMessage(null);
    } else {
      //insertarFecha();
      //console.log(results);
      //parentPort.postMessage({ done: results });
    }
  })
};

function checkConChorrillosBK() {
  const sql = 'SELECT 1';
  DBConnChoBK.conn.query(sql, (err, results) => {
    if (err) {
      console.error('Error al realizar la consulta:', err);
      parentPort!.postMessage(null);
    } else {
      //insertarFecha();
      //console.log(results);
      //parentPort.postMessage({ done: results });
    }
  })
};

