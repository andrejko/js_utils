var page = require('webpage').create();
var system = require('system');

page.onResourceError = function(resourceError) {
    page.reason = resourceError.errorString;
    page.reason_url = resourceError.url;
};

page.onResourceRequested = function(requestData, request) {
    //console.log('::loading', requestData['url']);
};

page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }

    // uncomment to log into the console
    // console.error(msgStack.join('\n'));
};

phantom.addCookie({
    'name'     : 'PHPSESSID',
    'value'    : 'd48gnetpep6amg716gugmtpoh1',
    'domain'   : 'sia-telecom.com.ua',
    'path'     : '/',
    'httponly' : true,
    'secure'   : false,
    'expires'  : (new Date()).getTime() + (1000 * 60 * 60)
});

page.open('http://sia-telecom.com.ua/admin/index.php?route=catalog/product/update&token=e694853e14ce84bfc84820543fcd8acc&product_id=842', function(status) {
    if (status === "success") {
        var resultSet = page.evaluate(function() {
            return jQuery(".list tr:eq(2) .left:eq(0)").text();
        });

        console.log(resultSet);
    } else {
        console.log(url + ' -----> ' + status + ' with error "' + page.reason);
    }

    phantom.exit();
});
