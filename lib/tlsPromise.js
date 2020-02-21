const tls = require('tls');
const fs = require('fs');

/**
 *
 * @param {Object} config
 * @param {String} config.ADDRESS - The receiver IP-Address/hostname.
 * @param {Number} config.PORT - Destination port.
 * @param {Buffer|String} config.PAYLOAD - The payload to inject on tcp-connection established.
 * @param config.maxChunks - Maximal number of chunks to receive before destroying connection. As Default 2.
 * @param config.timeout - As Default 10000.
 * @returns {Promise<String>} - The received response.
 */
module.exports = function tlsPromise(config) {
    let {ADDRESS, PORT, host, PAYLOAD, maxChunks, timeout} = config;

    //setting default params
    maxChunks = maxChunks || 2;
    timeout = timeout || 5000;

    return new Promise(function (resolve, reject) {
        const tlsOptions = {
            host: ADDRESS,
            port: PORT,
            servername: host,
            rejectUnauthorized: false,
            key: fs.readFileSync(__dirname + '/payloads/key.pem'),  // own key => `npx tls-keygen`
            cert: fs.readFileSync(__dirname + '/payloads/cert.pem') // own cert => `npx tls-keygen`
        };

        let tlsClient = tls;
        let response = '';
        let chunksCounter = 0;

        tlsClient = tlsClient.connect(tlsOptions, function onConnectionOpen() {
            if (!tlsClient.authorized) {
                reject('Client connected but not authorized!');
            }
            if (PAYLOAD) {
                tlsClient.write(PAYLOAD); //injecting payload
            }
        });

        tlsClient.on('error', function (err) {
            tlsClient.destroy(); // killing client
            reject(err);
        });

        tlsClient.on('close', function () {
            resolve(response);
        });

        tlsClient.on('end', function () {
            tlsClient.destroy();
            resolve(response);
        });

        tlsClient.on('timeout', function () {
            tlsClient.destroy();
            resolve(response);
        });

        tlsClient.on('data', function (data) {
            chunksCounter++;
            response += data.toString();

            //destroying socket after certain number of received chunks
            if (chunksCounter === maxChunks) {
                tlsClient.destroy();
            }
        });

        tlsClient.setTimeout(timeout);
    });
};