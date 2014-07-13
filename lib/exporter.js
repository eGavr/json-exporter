var download = require('./download'),
    promisify = require('vow-node').promisify;

    request = promisify(require('request'));

download('http://api-yaru.yandex.ru/club/4611686018427404475/post/?format=json', request)
    .then(function(res) {
        console.log(JSON.stringify(res, null, '  '));
    })
    .fail(function(err) {
        console.log('err: ', err);
    });
