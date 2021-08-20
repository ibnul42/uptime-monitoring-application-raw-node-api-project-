// dependencies
const fs = require('fs');
const path = require('path');

// module scffolding
const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
    // open file for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // write data to file and then close it
            fs.writeFile(fileDescriptor, stringData, (errr) => {
                if (!errr) {
                    fs.close(fileDescriptor, (error) => {
                        if (!error) {
                            callback(false);
                        } else {
                            callback('Error writing to new file');
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            callback('Could not create new file. it may exists already');
        }
    });
};

// read data to file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    });
};

// update data file
lib.update = (dir, file, data, callback) => {
    // file opening for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err1, fileDescriptor) => {
        if (!err1 && fileDescriptor) {
            // converting data to string
            const stringData = JSON.stringify(data);

            // write data  to file and close
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback(`Error closing to new file`);
                        }
                    });
                } else {
                    callback('Error writing to new file');
                }
            });
        } else {
            callback(`Error updating, file may not exist`);
        }
    });
};

// delete data from file
lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false);
        } else {
            callback(`Error deleting file, file mat nor exist`);
        }
    });
};

module.exports = lib;
