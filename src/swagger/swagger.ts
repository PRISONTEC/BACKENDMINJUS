import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.0",
  info: {
    title: "DOCUMENTACION BACKEND MINJUS",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://190.187.248.85:2950",
    },
  ],
  components: {
    /* securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      },
    }, */
    securitySchemes:{
      Bearer:{
      type: "apiKey",
      name: "Authorization",
      in: "header"
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    schemas: {
      login:{
        type: "object",
        required: ["usuario", "contrasena"],
        properties: {
          usuario: {
            type: "string",
          },
          contrasena: {
            type: "string",
          },
        },
      },
      obtenerInformacion: {
        type: "object",
        required: ["fechaInicio", "fechaFin"],
        properties: {
          fechaInicio: {
            type: "string",
          },
          fechaFin: {
            type: "string",
          },
        },
      },
      actualizarBq: {
        type: "object",
        required: ["id","idDetalleFalla", "idRazon", "observacion", "idUsuario", "idFile", "idEstado", "fechaHoraFin"],
        properties: {
          id: {
            type: "string",
          },
          idDetalleFalla: {
            type: "integer",
          },
          idRazon: {
            type: "integer",
          },
          observacion: {
            type: "string",
          },
          idUsuario: {
            type: "integer",
          },
          idFile: {
            type: "string",
          },
          idEstado: {
            type: "integer",
          },
          fechaHoraFin: {
            type: "integer",
          },
        },
      },
      obtenerArchivo: {
       /*  type: "object",
        required: ["fechaInicio", "fechaFin"],
        properties: {
          fechaInicio: {
            type: "string",
          },
          fechaFin: {
            type: "string",
          },
        }, */
      },
      /* crearDetalleFalla: {
        type: "object",
        required: ["idRazon","observacion","idUsuario","idFile"],
        properties: {
          idRazon: {
            type: "integer",
          },
          observacion: {
            type: "string",
          },
          idUsuario: {
            type: "integer",
          },
          idFile: {
            type: "string",
          }
        },
      } */
    },
  },
};

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  apis: ["./usr/local/backendMinjus/product/uris/conexion/*","./usr/local/backendMinjus/product/uris/dynamo/*"],
  //apis: ["./src/uris/conexion/*","./src/uris/dynamo/*"],

};

export default swaggerJSDoc(swaggerOptions);


//mi variable es la planificacion estrategica y productividad y mi dimension e indicadores cuales podrian ser