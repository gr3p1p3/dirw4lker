/**
 * Executing a simple Scan using list as array
 * */

const dirWalker = require('../index');

(async function scan() {
    const config = {
        host: 'http://testphp.vulnweb.com/',
        list: ['login.php', 'Templates/'], //dont use any file but own list of strings
        appendSlashAfter: false, //deactivating default appending of "/"
        proxy: 'http://5.230.65.45:8081/', //using proxy
        asyncRequests: true
    };

    const result = await dirWalker.launch(config);
    console.log('\nFOUNDS:', result.founds.length, '/', result.sent);
    if (result.founds.length) {
        console.log('=>', result.founds.map((r) => (r.target)));
    }
})();