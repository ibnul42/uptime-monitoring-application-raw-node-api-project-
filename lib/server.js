/*
Title: Server file
Description: Server related file
Author: Ibnul Ashir
Date: 18/08/2021
*/

// dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
const environment = require('../helpers/environments');
// const { sendTwilioSms } = require('./helpers/notifications');
// const data = require('./lib/data');

// server object - module scaffolding
const server = {};

// testing file system
// data.create('test', 'newFile', { name: 'Bangladesh', language: 'Bangla' }, (err) => {
//     console.log(`error was`, err);
// });

// data.read('test', 'newFile', (err, data) => {
//     console.log(err, data);
// });

// data.update('test', 'newFile', { name: 'Australia', language: 'English' }, (err) => {
//     console.log(`error was`, err);
// });

// data.delete('test', 'newFile', (err) => {
//     console.log(err);
// });

// configuration
// server.config = {
//     port: 3000,
// };
// sendTwilioSms('01765427688', 'Hello World', (error) => {
//     console.log(`Error was ${error}`);
// });

// create Server
server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`);
    });
};

// handle request response
server.handleReqRes = handleReqRes;

// start the server
server.init = () => {
    server.createServer();
};

// export
module.exports = server;
