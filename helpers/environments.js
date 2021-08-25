/*
Title: Environments
Description: Handle all Environment related things
Author: Ibnul Ashir
Date: 19/08/2021
*/

// dependencies

// module scaffolding
const environments = {};

// staging environment
environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'sijgijdsfghljdkrhhds',
    maxChecks: 5,
    twilio: {
        fromPhone: '+19142186402',
        AccountSid: 'ACeb29f9c1f349f10045db2f51b9841538',
        AuthToken: '8904b64160f06339b644320b8a26325a',
    },
};

// production environment
environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'sijgijdsfghlrfdyhtyjhds',
    maxChecks: 5,
    twilio: {
        fromPhone: '+19142186402',
        AccountSid: 'ACeb29f9c1f349f10045db2f51b9841538',
        AuthToken: '8904b64160f06339b644320b8a26325a',
    },
};

// determine which environment was passed
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export environment object
const environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

// export module
module.exports = environmentToExport;
