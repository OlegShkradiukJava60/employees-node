import { RequestHandler } from 'express';
import {ZodType} from 'zod'
export default function validation(schema: ZodType<any, any, any>): RequestHandler {
    return (req, _, next) => {
        req.body = schema.parse(req.body);
        next();
    }
}