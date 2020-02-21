# dirW4lker.js

**dirw4lker** is a directories/files web-sites scanner. 

It works on HTTP and HTTPS host and it allows to find hidden files hosted on target url using a dictionary-list.

Pure written in NodeJs and **without** dependencies.

## Install with npm

```bash
npm install -g dirw4lker
```

## HowTo

dirw4lker is simple to use.

```bash
dirw4lker --host=<TARGET_URL> --listDir=<PATH_TO_DICTIONARY_LIST>
```

# Example on Kali

```bash
npm install -g dirw4lker
dirw4lker --host=http://testphp.vulnweb.com --listDir=/usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt --limit=500
```

```bash
     .___.__        __      __  _____ .__   __                         __        
   __| _/|__|______/  \    /  \/  |  ||  | |  | __ ___________        |__| ______
  / __ | |  \_  __ \   \/\/   /   |  ||  | |  |/ // __ \_  __ \       |  |/  ___/
 / /_/ | |  ||  | \/\        /    ^   /  |_|    <\  ___/|  | \/       |  |\___ \ 
 \____ | |__||__|    \__/\  /\____   ||____/__|_ \\___  >__|    /\/\__|  /____  >
      \/                  \/      |__|          \/    \/        \/\______|    \/ 
 
                                                                         by Gr3p
 
 
 ┌─────────┬────────────────────────────────────────────────────────────────┐
 │ (index) │                             Values                             │
 ├─────────┼────────────────────────────────────────────────────────────────┤
 │  host   │                  'http://testphp.vulnweb.com'                  │
 │ listDir │ '/usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt' │
 │  limit  │                             '500'                              │
 └─────────┴────────────────────────────────────────────────────────────────┘
 
 
 **WARNING** Requests will be maximal 500
 [ 2020-02-21T20:30:26.271Z ] '=>' 'http://testphp.vulnweb.com/index.php' '=>' 'HTTP/1.1 200 OK'
 [ 2020-02-21T20:30:26.413Z ] '=>' 'http://testphp.vulnweb.com/images/' '=>' 'HTTP/1.1 200 OK'
 [ 2020-02-21T20:30:28.721Z ] '=>' 'http://testphp.vulnweb.com/search.php' '=>' 'HTTP/1.1 200 OK'
 [ 2020-02-21T20:30:30.329Z ] '=>' 'http://testphp.vulnweb.com/cgi-bin/' '=>' 'HTTP/1.1 403 Forbidden'
 [ 2020-02-21T20:30:34.083Z ] '=>' 'http://testphp.vulnweb.com/login.php' '=>' 'HTTP/1.1 200 OK'
 [ 2020-02-21T20:30:55.660Z ] '=>' 'http://testphp.vulnweb.com/product.php' '=>' 'HTTP/1.1 200 OK'
 
 Limit of 500 requests!
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