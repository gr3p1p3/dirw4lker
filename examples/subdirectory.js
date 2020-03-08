const dirWalker = require('../index');

(async function main() {
    const config = {
        host: 'http://10.10.10.160/',
        ext: 'php,html,txt,jpg,css,xml,js',
        asyncRequests: true,
        // verbose: true,
        ignoreResponseWith: '403'
    };

    const result = await dirWalker.launch(config);

    console.log('\nFOUNDS:', result.founds.length, '/', result.sent);
    if (result.founds.length) {
        console.log('=>', result.founds.map((r) => (r.target)));
    }

    const results = [];
    for (let found of result.founds) {
        const target = found.target;
        if (target[target.length - 1] === '/') {
            console.log('\nScanning subDir:', target);
            const subConfig = {...config, host: target};
            const res = await dirWalker.launch(subConfig);
            results.push(res);
            console.log('FOUNDS:', res.founds.length, '/', res.sent);
            if (res.founds.length) {
                console.log('=>', res.founds.map((r) => (r.target)));
            }
        }
    }
    console.log('res:', results);
})();