const Url = require('url');

const tcpPromise = require('./tcpPromise');
const tlsPromise = require('./tlsPromise');
const dnsResolver = require('./dnsResolverPromise');

function getPayLoad(path, hostname) {
    return 'GET ' + path + ' HTTP/1.1\r\n'
        + 'Host: ' + hostname + '\r\n'
        + 'Connection: close\r\n'
        + '\r\n'
}

function makeRequest(config) {
    const {address, host, port, path, isHttps, injectPayload} = config;
    const payload = getPayLoad(path, host);

    if (isHttps) {
        return tlsPromise({ADDRESS: address, host: host, PORT: port, PAYLOAD: payload, injectPayload});
    } else {
        return tcpPromise({ADDRESS: address, PORT: port, PAYLOAD: payload, injectPayload});
    }
}

function isHttps(protocol) {
    return protocol && protocol === 'https:'
}

async function RequestAgent(config) {
    let {target, dns, injectPayload} = config;

    const url = Url.parse(target);
    const addresses = (dns) ? await dnsResolver(url.hostname, dns) : [];
    const port = url.port || (isHttps(url.protocol) ? 443 : 80); //setting default port if not exist on given target
    const reqOptions = {
        address: addresses[0] || url.hostname, //getting first resolved ip-address
        host: url.hostname,
        port: parseInt(port),
        path: url.path,
        injectPayload: injectPayload,
        isHttps: isHttps(url.protocol)
    };

    // const dataResponse = await makeRequest(reqOptions);
    return makeRequest(reqOptions);
}


module.exports = RequestAgent;