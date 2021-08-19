/*
Title: Uptime Monitoring Application
Description: A RESTFul API to monitor up or down time of user defined links
Author: Ibnul Ashir
Date: 18/08/2021
*/

// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');

// app object - module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
    // res.end('hello');
    // get url and parse it
    const parsedurl = url.parse(req.url, true);
    const path = parsedurl.pathname;
    const trimedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedurl.query;
    const headersObject = req.headers;

    const requestProperties = {
        parsedurl,
        path,
        trimedPath,
        method,
        queryStringObject,
        headersObject,
    };

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const chosenHandler = routes[trimedPath] ? routes[trimedPath] : notFoundHandler;

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });
    req.on('end', () => {
        realData += decoder.end();

        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            // return the final output
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

module.exports = handler;
