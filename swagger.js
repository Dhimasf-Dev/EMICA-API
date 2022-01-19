import swaggerAutogen from 'swagger-autogen';
//const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '',      // by default: '1.0.0'
    title: 'REST API EMICA TEST',        // by default: 'REST API'
    description: '',  // by default: ''
  },
  host: '',      // by default: 'localhost:3000'
  basePath: '',  // by default: '/'
  schemes: [],   // by default: ['http']
  consumes: [],  // by default: ['application/json']
  produces: [],  // by default: ['application/json']
  tags: [        // by default: empty Array
    {
      name: '',         // Tag name
      description: '',  // Tag description
    },
    // { ... }
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
  }
  },  // by default: empty object (Swagger 2.0)
  definitions: {},          // by default: empty object
  components: {}            // by default: empty object (OpenAPI 3.x)
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];
//const endpointsFiles = ['./app.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */

//swaggerAutogen(outputFile, endpointsFiles, doc);
swaggerAutogen()(outputFile, endpointsFiles, doc);

// import { readFile } from "fs/promises";
// const outputFile = JSON.parse(await readFile("./swagger-output.json"));
//const outputFile = './swagger-output.json'
// const endpointsFiles = ['./index.js']

//swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {require('./index.js')});
// swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
//     await import('./index.js'); // Your project's root file
//   });
// swaggerAutogen(outputFile, endpointsFiles, doc);
