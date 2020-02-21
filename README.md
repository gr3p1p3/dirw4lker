# dirW4lker.js

**dirw4lker** is a directories/files web-sites scanner. 


It works on HTTP and HTTPS host and it allows to find hidden files hosted on target url using a dictionary-list.


Pure written in NodeJs and **without** dependencies.

# Usage example on Kali

```bash
git clone https://gitlab.com/Gr3p/dirw4lker.git
cd dirw4lker
node index.js --host=http://testphp.vulnweb.com --listDir=/usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt
```


```bash
   .___.__        __      __  _____ .__   __                         __        
  __| _/|__|______/  \    /  \/  |  ||  | |  | __ ___________        |__| ______
 / __ | |  \_  __ \   \/\/   /   |  ||  | |  |/ // __ \_  __ \       |  |/  ___/
/ /_/ | |  ||  | \/\        /    ^   /  |_|    <\  ___/|  | \/       |  |\___ \ 
\____ | |__||__|    \__/\  /\____   ||____/__|_ \\___  >__|    /\/\__|  /____  >
     \/                  \/      |__|          \/    \/        \/\______|    \/ 

                                                                        by Gr3p


┌─────────┬─────────────────────────────────────────────────────────┐
│ (index) │                         Values                          │
├─────────┼─────────────────────────────────────────────────────────┤
│  host   │              'http://testphp.vulnweb.com'               │
│ listDir │ '/usr/share/dirbuster/wordlists/directory-list-1.0.txt' │
│  limit  │                          '500'                          │
└─────────┴─────────────────────────────────────────────────────────┘


**WARNING** Requests will be maximal 500
[ 2020-02-21T20:00:01.424Z ] '=>' 'http://testphp.vulnweb.com/cgi-bin/' '=>' 'HTTP/1.1 403 Forbidden'
[ 2020-02-21T20:00:06.278Z ] '=>' 'http://testphp.vulnweb.com/search.php' '=>' 'HTTP/1.1 200 OK'
[ 2020-02-21T20:00:14.841Z ] '=>' 'http://testphp.vulnweb.com/images/' '=>' 'HTTP/1.1 200 OK'

Limit of 500 requests!
```

## Install with npm

```bash
npm -g dirw4lker
```

## HowTo

dirw4lker is simple to use.

```bash
dirw4lker --host=<TARGET_URL> --listDir=<PATH_TO_DICTIONARY_LIST>
```

# Examples

```bash
dirw4lker --host=http://example.com --listDir=/tmp/directory.txt
```

dirw4lker will use your local-dns to resolve hostname as default. But you can change this with the option `--dns`.

```bash
dirw4lker --host=http://example.com --listDir=/tmp/directory.txt --dns=8.8.8.8
```

You can limit the number of maximal requests with the `--limit` option.
```bash
dirw4lker --host=http://example.com --listDir=/tmp/directory.txt --limit=500
```


## Problems and Fixes

- javascript heap out of memory => `node --max-old-space-size=<Number>`

## Special Thanks

Inspired from dirbuster.