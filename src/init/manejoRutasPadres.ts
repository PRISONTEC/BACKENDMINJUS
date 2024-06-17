import { Router } from "express";
import bodyParser from "body-parser";
import subRutasConexion from "../uris/conexion/conexion"
import errorHTTP from "../uris/manejadorErroresHTTP";
import healthPage from "../uris/healthPage";
import subRutasS3 from '../uris/dynamo/rutasS3';

export default class manejadorRutas {
  readonly paths: Router;

  constructor() {
    this.paths = Router();
    this.rutas();
  }

  rutas() {
    this.paths.use(bodyParser.json());
    this.paths.get("/", healthPage.healthy); //CREAR-VALIDAR-ELIMINAR USUARIO
    this.paths.use("/conexion", subRutasConexion);
    this.paths.use("/files", subRutasS3);

    
    this.paths.use(errorHTTP.notFound);
  }
}
