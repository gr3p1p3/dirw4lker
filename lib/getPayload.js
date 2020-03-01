function getPayLoad(path, hostname) {
    return 'GET ' + path + ' HTTP/1.1\r\n'
        + 'Host: ' + hostname + '\r\n'
        + 'Connection: close\r\n'
        + '\r\n'
}

module.exports = getPayLoad;