const tcpPromise = require('./tcpPromise');
const tlsPromise = require('./tlsPromise');
const getPayLoad = require('./getPayload');

function makeRequest(config) {
    const {address, host, port, path, isHttps, injectPayload} = config;
    const payload = getPayLoad(path, host);

    if (isHttps) {
        return tlsPromise({ADDRESS: address, host: host, PORT: port, PAYLOAD: payload, injectPayload});
    } else {
        return tcpPromise({ADDRESS: address, PORT: port, PAYLOAD: payload, injectPayload});
    }
}

module.exports = makeRequest;