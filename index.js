/*
Title: Uptime Monitoring Application
Description: A RESTFul API to monitor up or down time of user defined links
Author: Ibnul Ashir
Date: 18/08/2021
*/

// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');

// app object - module scaffolding
const app = {};

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

data.delete('test', 'newFile', (err) => {
    console.log(err);
});

// configuration
// app.config = {
//     port: 3000,
// };

// create Server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Listening to port ${environment.port}`);
    });
};

// handle request response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
