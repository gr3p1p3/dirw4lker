const Url = require('url');

const makeRequest = require('./makeRequest');
const dnsResolver = require('./dnsResolverPromise');

function isHttps(protocol) {
    return protocol && protocol === 'https:'
}

/**
 *
 * @param {object} config
 * @param {string} config.target - The receiver hostname.
 * @param {string[]} config.dns - The dns to use.
 * @param {Boolean} config.injectPayload - Inject http-get payload or not.
 * @returns {Promise<String>}
 */
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
    return await makeRequest(reqOptions);
}


module.exports = RequestAgent;