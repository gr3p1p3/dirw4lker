/**
 * Executing a simple Scan and read responses
 * */

const dirWalker = require('../index');

(async function scan() {
    const config = {
        host: 'http://testphp.vulnweb.com/',
        list: ['login.php'], // scan only one page
        appendSlashAfter: false, //deactivating default appending of "/"
    };

    const result = await dirWalker.launch(config);
    console.log('=>', result.founds);
})();