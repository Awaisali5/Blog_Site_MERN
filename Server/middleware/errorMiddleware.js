//Unsupported (404) routes
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error);
}

// middleware to handle the error 

const errorMiddleware = (error, req, res, next) => {
    if(res.headerSend) {
        return next(error)
    }
    res.status(error.code || 500).json({msg: error.message || 'An Unknown Error '})
}


module.exports ={notFound, errorMiddleware}