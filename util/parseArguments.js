function parseArg(argumentsArray) {
    const argObj = {};
    for (let arg of argumentsArray) {
        const [attr, value] = arg.split('=');
        argObj[attr.replace(/-/gmi, '')] = value || true;
    }
    return argObj;
}

module.exports = parseArg;