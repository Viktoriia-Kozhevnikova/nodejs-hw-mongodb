import createHttpError from 'http-errors';

export function notFoundHandler(req, res, next) {

    next(createHttpError(404, "Route not found"));

        // res.status(404).send({
        //     status: 404,
        //     // message: "Not found",
        //     message: "Route not found",
        // });
    }
