var moment = require('moment');
["log", "warn", "error"].forEach(function(method) {
    var oldMethod = console[method].bind(console);
    console[method] = function() {
        oldMethod.apply(console, [moment().format('YYYY-MM-DD HH:mm:ss.SSS')].concat(arguments[0]));
    };
});
exports.console=console;