/**
 * Executing a simple Scan using list as array
 * */

const dirWalker = require('../index');

(async function scan() {
    const config = {
        host: 'https://www.tripuls.de/',
        list: ['login.php', 'Templates/', 'impulse/'], //dont use any file but own list of strings
        appendSlashAfter: false, //deactivating default appending of "/"
        proxy: 'http://127.0.0.1:9080/', //using proxy
        asyncRequests: true
    };

    const result = await dirWalker.launch(config);
    console.log('\nFOUNDS:', result.founds.length, '/', result.sent);
    if (result.founds.length) {
        console.log('=>', result.founds.map((r) => (r.target)));
    }
})();