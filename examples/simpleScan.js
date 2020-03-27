/**
 * Executing a simple Scan
 * */

const dirWalker = require('../index');

(async function scan() {
    const config = {
        host: 'http://testphp.vulnweb.com/',
        ext: 'php,txt,xml',
        asyncRequests: true
    };

    const result = await dirWalker.launch(config);
    console.log('\nFOUNDS:', result.founds.length, '/', result.sent);
    if (result.founds.length) {
        console.log('=>', result.founds.map((r) => (r.target)));
    }
})();