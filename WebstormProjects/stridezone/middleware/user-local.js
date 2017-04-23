module.exports = function () {
    return function setUserOnLocalsMiddleware(req, res, next) {
        res.locals.user = req.user;
        next();
    }
};