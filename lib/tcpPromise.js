const net = require('net');

/**
 *
 * @param {Object} config
 * @param {String} config.ADDRESS - The receiver IP-Address/hostname.
 * @param {Number} config.PORT - Destination port.
 * @param {Buffer|String} config.PAYLOAD - The payload to inject on tcp-connection established.
 * @param {Number} config.maxChunks - Maximal number of chunks to receive before destroying connection. As Default 2.
 * @param {Number} config.timeout - TTL for socket in ms. As Default 10000.
 * @returns {Promise<String>} - The received response.
 */
module.exports = function tcpPromise(config) {
    let {ADDRESS, PORT, PAYLOAD, maxChunks, timeout, injectPayload} = config;

    //setting default params
    maxChunks = maxChunks || 2;
    timeout = timeout || 5000;
    injectPayload = (!injectPayload && injectPayload !== false) ? true : injectPayload;

    return new Promise(function (resolve, reject) {
        const client = new net.Socket();
        let response = '';
        let chunksCounter = 0;

        client.connect({port: PORT, host: ADDRESS}, function onConnectionOpen() {
            if (injectPayload && PAYLOAD) {
                client.write(PAYLOAD); //injecting payload
            }
        });

        client.on('error', function (err) {
            client.destroy(); // killing client
            reject(err);
        });

        client.on('close', function () {
            resolve(response);
        });

        client.on('end', function () {
            client.destroy(); // killing client
            resolve(response);
        });

        client.on('timeout', function () {
            client.destroy(); // killing client
            resolve(response);
        });

        client.on('data', function (data) {
            chunksCounter++;
            response += data.toString();
            //destroying socket after certain number of received chunks
            if (chunksCounter === maxChunks) {
                client.destroy();
            }
        });

        client.setTimeout(timeout);
    });
};