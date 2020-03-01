const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const logWelcome = require('../util/welcome')();
const Logger = require('../util/Logger');
const startDicAttack = require('./startDicAttack');

/**
 * Launch dictionary-attack to the target host.
 * @param config
 * @param {string} config.host - The receiver hostname.
 * @param {string} [config.listDir] - The path to the dictionary-file.
 * @param {string} [config.ext] - The extra extensions name to combine with the hostname. (EX: 'php,txt' or '.php,.txt')
 * @param {string} [config.dns] - The used dns to resolve hostname.
 * @param {string} [config.ignoreResponseWith] - The string to ignore on response received. If response contains given parameter, then will be ignored.
 * @param {Boolean} [config.verbose] - Activate verbose. As default false.
 * @param {boolean} [config.asyncRequests] - Starting attack in async way. **WARNING** Unstable on big list.
 * @returns {Promise<Array<Object>>} - The found results. [{target:<host:port/foundPage>, response:<string>, ms:<Number>}, ...]
 */
async function launch(config) {
    const logger = new Logger(config.verbose);
    delete config.verbose;

    const EXTENSIONS = ['/']; //defining default extensions to use

    logger.log(logWelcome);
    logger.table(config);

    config.dns = config.dns ? config.dns.split(',') : false;
    if (!config.host) {
        throw new Error('host parameter is not used or empty. Ex: --host=http://example.com');
    }
    if (!config.listDir) {
        logger.log('\n--listDir parameter is not used or empty. Using default list will not be really effective!');
        config.listDir = __dirname + '/files/global.txt';
    }
    if (config.ext) {
        config.ext.split(',')
            .map(function (ext) {
                ext = (ext[0] !== '.') ? '.' + ext : ext;
                EXTENSIONS.push(ext);
            });
    }

    const data = await readFile(config.listDir);
    //cleaning data from #comments or empty strings
    const cleanedData = data.toString()
        .split('\n')
        .filter(function (string) {
            return string && string[0] !== '#';
        });

    logger.log('\n');

    return startDicAttack({
        list: cleanedData,
        extensions: EXTENSIONS,
        target: config.host,
        dns: config.dns,
        logger,
        ignoreResponseWith: config.ignoreResponseWith
    }, config.asyncRequests)
        .then(function filterForFoundResults(results) {
            logger.clearLine();
            return results
                .filter(function (response) {
                    return response && !response.err;
                });
        });
}

module.exports = {launch};