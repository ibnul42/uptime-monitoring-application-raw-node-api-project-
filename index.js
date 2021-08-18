/*
Title: Uptime Monitoring Application
Description: A RESTFul API to monitor up or down time of user defined links
Author: Ibnul Ashir
Date: 18/08/2021
*/

// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');

// app object - module scaffolding
const app = {};

// configuration
app.config = {
    port: 3000,
};

// create Server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Listening to port ${app.config.port}`);
    });
};

// handle request response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
