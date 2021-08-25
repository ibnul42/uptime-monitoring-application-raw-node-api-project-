/*
Title: Initial file
Description: Initial file to start the node server and workers
Author: Ibnul Ashir
Date: 24/08/2021
*/

// dependencies
const server = require('./lib/server');
const workers = require('./lib/worker');

// app object - module scaffolding
const app = {};

app.init = () => {
    // start the server
    server.init();
    // start the worker
    workers.init();
};

app.init();

module.exports = app;
