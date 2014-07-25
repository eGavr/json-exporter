var vow = require('vow');

require('colors');

function replaceNextUrls(body) {
    if (!body.links.next) return vow.resolve(body);

    var nextUrl = body.links.next;

    console.log('>> '.green, nextUrl);

    return request(nextUrl)
            .then(function(req) {
                return replaceNextUrls(JSON.parse(req.body));
            })
            .then(function(_body) {
                body.entries = body.entries.concat(_body.entries);

                return body;
            })
            .fail(function(err) {
                console.log('err: ', err.red);
            });
}

function replaceComments(body) {
    var urls = [],
        _urls = {},
        entries = body.entries;

    entries && entries.forEach(function(elem) {
        elem.links.comments && urls.push(elem.links.comments);
    });


    if (urls.length === 0) {
        return vow.resolve(body);
    }

    return vow.all(urls.map(function(url) {
        return request(url)
            .then(function(req) {
                console.log('>> '.green, url);

                _urls[url] = JSON.parse(req.body);
            });
    }))
    .then(function() {
        entries.forEach(function(elem) {
            elem.links.comments = _urls[elem.links.comments];
        });

        return body;
    })
    .fail(function(err){
        console.log('err: ', err.red)
    })
}


function download(url, request) {
    return request(url)
        .then(function(req) {
            console.log(' I am downloading all posts from URLs related to the given one:');

            return replaceNextUrls(JSON.parse(req.body));
        })
        .then(function(body) {
            delete body.links.next;

            console.log('\n\n\n\n\nEverything looks alright!\n\n\n\n\n'.green, 'I am downloading all comments from these URLs:')

            return replaceComments(body);
        })
        .fail(function(err) {
            console.log('err: ', err.red);
        });
}

module.exports = download;
