var vow = require('vow');

function replaceNextUrls(body) {
    if (!body.links.next) return vow.resolve(body);

    var nextUrl = body.links.next;

    //console.log(nextUrl);

    return request(nextUrl)
            .then(function(req) {
                return replaceNextUrls(JSON.parse(req.body));
            })
            .then(function(_body) {
                body.entries = body.entries.concat(_body.entries);

                return body;
            })
            .fail(function(err) {
                console.log('err: ', err);
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
            //.then(function(req) {
            //    return replaceComments(JSON.parse(req.body));
            //})
            .then(function(req) {
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
        console.log('err: ', err)
    })
}


function download(url, request) {
    return request(url)
        .then(function(req) {
            //console.log('I am replacing next urls');

            return replaceNextUrls(JSON.parse(req.body));
        })
        .then(function(body) {
            delete body.links.next;

            //console.log('I am replacing comments');

            return replaceComments(body);
        })
        .fail(function(err) {
            console.log('err: ', err);
        });
}

module.exports = download;
