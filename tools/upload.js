const request = require('request');
var uploader = function (link,departmentId,callback) {
    // request.post('http://192.168.1.4:9001/upload', {
        request.post('http://localhost:9001/upload', {
        json: {
            link,departmentId
        },
        headers: {
            clientid: "123",
        }
    }, callback);
}
module.exports = uploader;