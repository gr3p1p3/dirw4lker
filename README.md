# dirW4lker.js

**dirw4lker** is a directories/files web-sites scanner. 

It works with HTTP and HTTPS protocols and it allows to find hidden files hosted on target url using a dictionary-list.

Pure written in NodeJs and **without** dependencies.


## Updates

- [03.2020] @1.4.x **EXPERIMENTAL** Implemented `--asyncRequests` possibility to start a scan in an async way.
- [03.2020] @1.3.x  Implemented new option `--ignoreResponseWith`.

## Install with npm

```bash
npm install -g dirw4lker
```
or 

```bash
npm i dirw4lker
```

## HowTo

dirW4lker can used as Command Line Tool and is really simple to use.

```bash
dirw4lker --host=<TARGET_URL> --listDir=<PATH_TO_DICTIONARY_LIST>
```

You can omit the `--listDir` option to use the default list includes in this module.

*The default list is not really effective, but will cover common used page names*


# Js API

```javascript
const dirWalker = require('dirw4lker');

const config = {
    host: 'http://testphp.vulnweb.com',
};

dirWalker.launch(config)
    .then((founds) => {
        console.log('FOUNDS:', founds.length);  //FOUNDS: 4
    });
```

The method launch need a configuration object with the follow parameters:

| Param  | Type                | Description  |
| ------ | ------------------- | ------------ |
|host | <code>String</code> |  The receiver hostname. |
|listDir| <code>String</code> | [Optional] Path to the dictionary-file to use. |
|ext| <code>String</code> | [Optional] The extra extensions name to combine with the hostname. (EX: 'php,txt' or '.php,.txt') |
|dns| <code>String</code> | [Optional] Used dns to resolve hostname. You can use multiple dns splitting with `,`. (Ex: '8.8.8.8,8.8.4.4')   |
|ignoreResponseWith| <code>String</code> | [Optional] The string to ignore on response received. If response contains given parameter, then will be ignored.|
|asyncRequests| <code>Boolean</code> | [Optional] Starting attack in async way. As Default false. **WARNING** Unstable on big list at the moment.|
|verbose| <code>Boolean</code> | [Optional] Activate verbose. As default false.  |

@returns

| Type                | Description  |
| ------------------- | ------------ |
| <code>Promise<Array<Object>></code> |  The found results. [{target:<String>, response:<String>, ms:<Number>}, ...] |

# CLI: Quickstart

```bash
npm install -g dirw4lker
dirw4lker --host=http://testphp.vulnweb.com --asyncRequests
```
Output:
```bash
    .___.__        __      __  _____ .__   __                         __        
  __| _/|__|______/  \    /  \/  |  ||  | |  | __ ___________        |__| ______
 / __ | |  \_  __ \   \/\/   /   |  ||  | |  |/ // __ \_  __ \       |  |/  ___/
/ /_/ | |  ||  | \/\        /    ^   /  |_|    <\  ___/|  | \/       |  |\___ \ 
\____ | |__||__|    \__/\  /\____   ||____/__|_ \\___  >__|    /\/\__|  /____  >
     \/                  \/      |__|          \/    \/        \/\______|    \/ 

                                                                        by Gr3p


[!] Legal disclaimer: Usage of this tool for scanning targets without prior mutual consent is illegal.


┌─────────┬──────────────────────────────┐
│ (index) │            Values            │
├─────────┼──────────────────────────────┤
│  host   │ 'http://testphp.vulnweb.com' │
└─────────┴──────────────────────────────┘

--listDir parameter is not used or empty. Using default list will not be really effective!


[ 2020-03-01T17:20:31.991Z ] 'http://testphp.vulnweb.com/images/' '=>' 'HTTP/1.1 200 OK'
[ 2020-03-01T17:20:32.001Z ] 'http://testphp.vulnweb.com/cgi-bin/' '=>' 'HTTP/1.1 403 Forbidden'
[ 2020-03-01T17:20:32.106Z ] 'http://testphp.vulnweb.com/admin/' '=>' 'HTTP/1.1 200 OK'
[ 2020-03-01T17:20:32.161Z ] 'http://testphp.vulnweb.com/hpp/' '=>' 'HTTP/1.1 200 OK'

FOUNDS: 4
Time: 389.821ms
```

*Compared to sync way: Time 11217.262ms*

The CLI accept same parameters as API-Module.

# Examples

You can use your own list with the option `--listDir`

```bash
dirw4lker --host=http://example.com --listDir=/tmp/directory.txt
```

The option `--ext` can used to combine the string on list with file-extensions. Use `,` for multiple extensions.

```bash
dirw4lker --host=http://example.com --ext=php,txt,html
```

dirW4lker will use your local-dns to resolve hostname as default. But you can change this with the option `--dns`.
Use `,` for multiple dns servers.

```bash
dirw4lker --host=http://example.com --listDir=/tmp/directory.txt --dns=8.8.8.8
```

To ignore response with custom string, use the option ```--ignoreResponseWith=<stringToIgnore>```
For example, ignoring all responses containing code 301.

```bash
dirw4lker --host=http://example.com --listDir=/tmp/directory.txt --ignoreResponseWith=301
```

## Special Thanks

Inspired by [dirBuster](https://owasp.org/projects/).