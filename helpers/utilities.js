/*
Title: Utilities
Description: Important Utilities
Author: Ibnul Ashir
Date: 21/08/2021
*/

// dependencies

// module scaffolding
const utilities = {};
const crypto = require('crypto');
const environments = require('./environments');

// parse JSON string to Object
utilities.parseJSON = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }

    return output;
};

// hash string

utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};

// create randon string
utilities.createRandomString = (strLength) => {
    let length = strLength;
    length = typeof strLength === 'number' && strLength > 0 ? strLength : false;
    if (length) {
        const possibleCaracters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';
        for (let i = 1; i <= length; i += 1) {
            const randomChar = possibleCaracters.charAt(
                Math.floor(Math.random() * possibleCaracters.length)
            );
            output += randomChar;
        }
        return output;
    }
    return false;
};

// export module
module.exports = utilities;
