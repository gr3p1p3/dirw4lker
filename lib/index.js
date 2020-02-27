const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const RequestAgent = require('./RequestAgent');
const logWelcome = require('../util/welcome')();
const Logger = require('../util/Logger');

//undefined global variables
let TARGET_HOST, USE_DNS, LIMIT, SAVE_LOGS, logger;

/**
 * Start dictionary attack with given list.
 * @param {Array<string>} list - The list of string to use.
 * @param {Array<string>} extensions - The list of extensions to combinate.
 * @returns {Promise<Array>}
 */
async function startDicAttack(list, extensions) {
    const listLen = list.length * extensions.length;
    let requestsCounter = 0;
    const result = [];
    for (let string of list) {
        for (let ext of extensions) {
            requestsCounter++;
            const targetPath = string + ext;
            if (!LIMIT || requestsCounter < LIMIT) {
                logger.overwriteLastLine(parseInt(requestsCounter / listLen * 100) + '%' + '\t' + targetPath);
                const timerStart = new Date();
                const response = await makeAndLogReq(targetPath, {
                    target: TARGET_HOST,
                    // injectPayload: false,
                    dns: USE_DNS ? USE_DNS.split(',') : undefined
                });
                const time = new Date() - timerStart;
                if (response) {
                    result.push({info: response, ms: time});
                }
            } else {
                throw '\nLimit of ' + LIMIT + ' requests is reached!';
            }
        }
    }
    logger.clearLine();
    return result;
}

function makeAndLogReq(path, config) {
    const target = config.target + '/' + path;
    config.target = target;

    return RequestAgent(config)
        .then(function filterResponse(responseString) {
            if (!responseString || responseString.match('404')) {
                return false;
            } else {
                const CODE = responseString.split('\r\n')[0];
                logger.clearLine();
                logger.log([new Date()], target, '=>', CODE);
            }
            return {target: target, res: responseString};
        })
        .catch(function (err) {
            //TODO implement logic: If errors are more then <25> then paused scanning
            logger.log((err.code || err), '@@at', target);
            return undefined;
        });
}

/**
 *
 * @param config
 * @returns {Promise<void>}
 */
async function launch(config) {
    const EXTENSIONS = ['/']; //defining default extensions to use
    logger = new Logger(config.verbose);
    delete config.verbose;
    logger.log(logWelcome);
    logger.table(config);

    if (!config.host) {
        throw 'host parameter is not used or empty. Ex: --host=http://example.com';
    }
    if (!config.listDir) {
        logger.log('\n--listDir parameter is not used or empty. Using default list will not be really effective!');
        config.listDir = __dirname + '/files/global.txt';
    }
    if (config.limit) {
        LIMIT = parseInt(config.limit);
        logger.log('\n**WARNING** Requests will be maximal', LIMIT);
    }
    if (config.ext) {
        config.ext.split(',')
            .map(function (ext) {
                ext = (ext[0] !== '.') ? '.' + ext : ext;
                EXTENSIONS.push(ext);
            });
    }

    TARGET_HOST = config.host;
    USE_DNS = config.dns;
    // SAVE_LOGS = args.logs; //TODO implement this option to saving logs
    const data = await readFile(config.listDir);

    //cleaning data from #comments or empty string (useless)
    const cleanedData = data.toString()
        .split('\n')
        .filter(function (string) {
            return string && string[0] !== '#';
        });

    logger.log('\n');
    return startDicAttack(cleanedData, EXTENSIONS);
}


module.exports = {launch, RequestAgent};