import {isHttpError} from 'http-errors';

export function errorHandler(error, req, res, next) {
    if (isHttpError(error) === true) {
        return res.status(error.statusCode).send({ status: error.statusCode, message: error.message });
    }
        req.log.error(error);
        res.status(500).send({
            status: 500,
            // message: "Internal Server Error",
            message: "Something went wrong",
        });
    }
