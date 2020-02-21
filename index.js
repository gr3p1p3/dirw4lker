const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

const RequestAgent = require('./lib/RequestAgent');
const logWelcome = require('./util/welcome')();
const parseArg = require('./util/parseArguments');

/**
 * Start dictionary attack with given list.
 * @param {Array<string>} list - The list of string to use.
 * @returns {Promise<void>}
 */
async function launcher(list) {
    const extensions = ['/', '.php', '.txt'];
    for (let string of list) {
        if (string[0] !== '#') {
            for (let ext of extensions) {
                const targetPath = string + ext;
                await makeAndLogReq(targetPath, {
                    target: TARGET_HOST,
                    // injectPayload: false,
                    dns: USE_DNS ? USE_DNS.split(',') : undefined
                });
            }
        }
    }
}

function makeAndLogReq(path, config) {
    const target = config.target + '/' + path;
    config.target = target;

    return RequestAgent(config)
        .then(function (responseString) {
            if (!responseString || responseString.match('404')) {
                // console.log('NOT FOUND FOR:', target);
            } else {
                const CODE = responseString.split('\r\n')[0];
                console.log([new Date()], '=>', target, '=>', CODE);
                // if (~CODE.indexOf(403)) {
                //     console.log(responseString);
                // }
            }
        })
        .catch(function (err) {
            console.log((err.code || err), '@@at', target);
        });
}

async function main() {
    console.log(logWelcome);

    const args = parseArg(process.argv.slice(2));
    console.table(args);
    console.log('\n');

    if (!args.host) {
        throw '--host parameter is not used or empty. Ex: --host=http://example.com/';
    }

    if (!args.listDir) {
        throw '--listDir parameter is not used or empty.';
    }

    TARGET_HOST = args.host;
    USE_DNS = args.dns;
    SAVE_LOGS = args.logs;
    const data = await readFile(args.listDir);

    return launcher(data.toString().split('\n'));
}

let TARGET_HOST, USE_DNS, SAVE_LOGS;

//execute all
return main()
    .catch(console.log);
