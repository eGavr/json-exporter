var fs = require('fs');

function getComments(id, replies) {
    if (!replies.length) return [];

    var comments = [];

    replies.forEach(function(reply) {
        !reply.deleted && comments.push({
            number: id,
            user: {
                login: reply.author.login
            },
            created_at: reply.published,
            updated_at: reply.published,
            body: reply.content
        });

        reply.hasOwnProperty('replies') && (comments = comments.concat(getComments(id, reply.replies)));
    });

    return comments;
}

function getIssue(id, post, commentsCount) {
    return {
        number: id,
        title: post.title,
        user: {
            login: post.author.name,
            avatar_url: post.author.links.userpic
        },
        labels: getLabels(post.categories),
        comments: commentsCount,
        created_at: post.published,
        updated_at: post.updated,
        body: post.content
    }
}

function getLabels(categories) {
    var res = ['archive'];

    categories.forEach(function(categoriy) {
        res.push(categoriy.term);
    });

    return res;
}

function transform(body) {
    var res = { issues: [], comments: [] },
        entries = body.entries,
        id = body.entries.length * -1;

    entries.forEach(function(post) {
        var comments = getComments(id, post.links.comments.replies),
            issue = getIssue(id, post, comments.length);

        res.issues.push(issue);
        res.comments = res.comments.concat(comments);

        id++;
    });

    return res;
}

//transform(JSON.parse(fs.readFileSync('res.json')));

module.exports = transform;
