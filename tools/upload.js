const request = require('request');
var uploader = function (link,callback) {
    request.post('http://localhost:9001/upload', {
        json: {
            link
        },
        headers: {
            clientid: "123",
        }
    }, callback);
}
module.exports = uploader;