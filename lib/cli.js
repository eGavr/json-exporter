var download = require('./download'),
    promisify = require('vow-node').promisify,
    vfs = require('vow-fs'),
    fs = require('fs');

require('colors');

module.exports = require('coa').Cmd()
    .name(process.argv[1])
    .helpful()
    .title('Downloads all club\'s posts from the site \'my.ya.ru\' by the given url')
    .opt()
        .name('version')
        .title('Shows the version number')
        .short('v').long('version')
        .flag()
        .only()
        .act(function() {
            var p = require('../package.json');
            return p.name + ' ' + p.version;
        })
        .end()
    .opt()
        .name('cli')
        .title('URL-path to the latest data in club which is kept in JSON-format')
        .long('cli')
        .req()
        .end()
    .opt()
        .name('output')
        .title('Output JSON-file')
        .short('o').long('output')
        .end()
    .act(function(opts) {
        var output = opts.output ? opts.output : 'stdout';

        request = promisify(require('request'));

        download(opts.cli, request)
            .then(function(res) {
                console.log('\nI have found ', (res.entries.length + '').green, ' posts!');

                var res = JSON.stringify(res, null, '  ');
                return output === 'stdout' ? console.log(res) : vfs.write(output, res);
            })
            .fail(function(err) {
                console.log('err: ', err);
            });
    })
    .run(process.argv.slice(2));
