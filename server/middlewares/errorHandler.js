const notFound = (req, res, next) => { 
    const err = new Error(`Route not found: ${req.originalUrl}`);
    res.status(404);
    next(err);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    return res.status(statusCode).json({
        success: false,
        message: err?.message,
        error: err,
    });
};

module.exports = {
    notFound,
    errorHandler,
};