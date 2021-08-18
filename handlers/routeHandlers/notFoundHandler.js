/*
Title: Not Found Handler
Description: Not Found Handler
Author: Ibnul Ashir
Date: 18/08/2021
*/

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: 'Your requested URL was not found!',
    });
};

module.exports = handler;
