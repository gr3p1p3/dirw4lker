# dirW4lker.js

**dirw4lker** is a directories/files web-sites scanner, that allow to find hidden files hosted on target url.

Pure written in NodeJs and without dependencies.

## Install

```bash
npm -g dirw4lker
```

## Arguments


## Usage

dirw4lker is simple to use.

```bash
dirw4lker --host=<TARGET_URL> --listDir=<PATH_TO_DICTIONARY_LIST>
```

# Examples

```bash
dirw4lker --host=http://example.com --listDir=/tmp/directory.txt
```

```bash
dirw4lker --host=http://example.com --listDir=/tmp/directory.txt --dns=8.8.8.8
```


## Thanks

Inspired from dirbuster.

Special Thanks to hackthebox.eu for giving me a test environment.

