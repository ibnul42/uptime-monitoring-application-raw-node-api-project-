/*
Title: Routes
Description: Application Routes
Author: Ibnul Ashir
Date: 18/08/2021
*/

// dependencies

const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
};

module.exports = routes;
