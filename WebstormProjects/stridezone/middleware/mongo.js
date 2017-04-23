var mongojs = require('mongojs');


function mongoMiddleware(options) {
    return function mongoMiddleware(req, res, next) {
        req.db = req.app.db;
        req.cgtc = req.app.db.collection("cgtc");
        next();
    };
}

module.exports = mongoMiddleware;
