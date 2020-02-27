function Logger(debugFlag) {
    const thisInstance = this;

    thisInstance.clearLine = function clearLine() {
        if (debugFlag) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
        }
    };

    thisInstance.log = function log(arg) {
        if (debugFlag) {
            console.log(...arguments);
        }
    };

    thisInstance.table = function table(arg) {
        if (debugFlag) {
            console.table(arg);
        }
    };

    thisInstance.overwriteLastLine = function overwriteLastLine(arg) {
        if (debugFlag) {
            thisInstance.clearLine();
            thisInstance.write(arg);
        }
    };

    thisInstance.write = function write(arg) {
        if (debugFlag) {
            process.stdout.write(arg);
        }
    };

    return thisInstance;
}

module.exports = Logger;