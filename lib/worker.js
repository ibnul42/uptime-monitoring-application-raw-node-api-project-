/*
Title: Worker
Description: Worker
Author: Ibnul Ashir
Date: 24/08/2021
*/

// dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./data');
const { parseJSON } = require('../helpers/utilities');
const { sendTwilioSms } = require('../helpers/notifications');

// worker object - module scaffolding
const worker = {};

// lookup all the checks from db
worker.gatherAllChecks = () => {
    // get all the checks
    data.list('checks', (err, checks) => {
        if (!err && checks && checks.length > 0) {
            checks.forEach((check) => {
                // read the checkData
                data.read('checks', check, (err, originalCheckData) => {
                    if (!err && originalCheckData) {
                        // pass the data to the checkValidator
                        worker.validateCheckData(parseJSON(originalCheckData));
                    } else {
                        console.log('Error: Reading on of the check data!');
                    }
                });
            });
        } else {
            console.log('ERROR: Could not find any checks to process');
        }
    });
};

// validate individual check data
worker.validateCheckData = (originalCheckData) => {
    const originalData = originalCheckData;
    if (originalCheckData && originalCheckData.id) {
        originalData.state =
            typeof originalCheckData.state === 'string' &&
            ['up', 'down'].indexOf(originalCheckData.state) > -1
                ? originalCheckData.state
                : 'down';

        originalData.lastChecked =
            typeof originalCheckData.lastChecked === 'number' && originalCheckData.lastChecked > 0
                ? originalCheckData.lastChecked
                : false;

        // pass to the next process
        worker.performCheck(originalData);
    } else {
        console.log('ERROR: check was invalid or not properly formated');
    }
};

// perform check
worker.performCheck = (originalCheckData) => {
    // prepare the initial check outcome
    let checkOutCome = {
        error: false,
        responseCode: false,
    };

    // mark the outcome has not been sent yet
    let outComeSent = false;

    // parse the url from original data
    const parsedUrl = url.parse(`${originalCheckData.protocol}://${originalCheckData.url}`, true);
    const hostName = parsedUrl.hostname;
    const { path } = parsedUrl;

    // construct the request
    const requestDetails = {
        protocol: `${originalCheckData.protocol}:`,
        hostname: hostName,
        method: originalCheckData.method.toUpperCase(),
        path,
        timeout: originalCheckData.timeoutSeconds * 1000,
    };

    const protocolToUse = originalCheckData.protocol === 'http' ? http : https;
    const req = protocolToUse.request(requestDetails, (res) => {
        // Take the status of the response
        const status = res.statusCode;

        // update the check uotcome and pass to next process
        checkOutCome.responseCode = status;
        if (!outComeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    });

    req.on('error', (e) => {
        checkOutCome = {
            error: true,
            value: e,
        };
        // update the check uotcome and pass to next process
        if (!outComeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    });

    req.on('timeout', (e) => {
        checkOutCome = {
            error: true,
            value: 'timeout',
        };
        // update the check uotcome and pass to next process
        if (!outComeSent) {
            worker.processCheckOutcome(originalCheckData, checkOutCome);
            outComeSent = true;
        }
    });

    // request end
    req.end();
};

// save check outcome to database and send to next process
worker.processCheckOutcome = (originalCheckData, checkOutCome) => {
    // check if check outcome is up or down
    const state =
        !checkOutCome.error &&
        checkOutCome.responseCode &&
        originalCheckData.successCodes.indexOf(checkOutCome.responseCode) > -1
            ? 'up'
            : 'down';

    // decide wheather we should alert the user or not
    const alertWanted = !!(originalCheckData.lastChecked && originalCheckData.state !== state);

    // update the check data
    const newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();

    // update the check to disk
    data.update('checks', newCheckData.id, newCheckData, (err) => {
        if (!err) {
            if (alertWanted) {
                // send the checkData to next process
                worker.alertUserToStatusChange(newCheckData);
            } else {
                console.log('Alert is not needed as there is no state change!');
            }
            // send the checkdata to next process
        } else {
            console.log('Error trying to save check data of one of the checks!');
        }
    });
};

// send notification sms to user if state changes
worker.alertUserToStatusChange = (newCheckData) => {
    const msg = `Alert: Your check for${newCheckData.method.toUpperCase()} ${
        newCheckData.protocol
    }://${newCheckData.url} is currently ${newCheckData.state}`;

    sendTwilioSms(newCheckData.userPhone, msg, (err) => {
        if (!err) {
            console.log(`User is alerted to a status change via sms: ${msg}`);
        } else {
            console.log('There waqs a problem sending message to one of the user');
        }
    });
};

// timer to loop worker per minute
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 5000);
};
// start the worker
worker.init = () => {
    // execute all the checks
    worker.gatherAllChecks();

    // call the loop for checking continue
    worker.loop();
};

// export
module.exports = worker;
