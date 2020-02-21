# dirW4lker.js

**dirw4lker** is a directories/files web-sites scanner. 


It works on HTTP and HTTPS host and it allows to find hidden files hosted on target url using a dictionary-list.


Pure written in NodeJs and **without** dependencies.

# Use example on Kali

```bash
git clone https://gitlab.com/Gr3p/dirw4lker.git
cd dirw4lker
node index.js --host=http://testphp.vulnweb.com --listDir=/usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt
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

dirw4lker will use your local-dns as default. But if you can change this with the option `--dns`.


```bash
dirw4lker --host=http://example.com --listDir=/tmp/directory.txt --dns=8.8.8.8
```

## Problems and Fix

- javascript heap out of memory => `node --max-old-space-size=<Number>`

## Thanks

Inspired from dirbuster.