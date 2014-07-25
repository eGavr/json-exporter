var download = require('./download'),
    transform = require('./to-github-api-structure'),
    promisify = require('vow-node').promisify,
    vfs = require('vow-fs'),
    fs = require('fs');

require('colors');

module.exports = require('coa').Cmd()
    .name(process.argv[1])
    .helpful()
    .title('Downloads all club\'s posts from the site \'my.ya.ru\' by the given url and transforms them to github API structure')
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
                var posts = res.entries.length;

                console.log('\nI have found ', (posts + '').green, ' posts!');

                gitRes = transform(res);

                var body = JSON.stringify(gitRes.body, null, '  ');

                console.log((gitRes.hidden + '').red + ' are hidden!');

                console.log('So I have transformed ' + (posts - gitRes.hidden + '').green + ' of them to github API structure!');

                return output === 'stdout' ? console.log(body) : vfs.write(output, body);
            })
            .fail(function(err) {
                console.log('err: ', err.red);
            });
    })
    .run(process.argv.slice(2));
