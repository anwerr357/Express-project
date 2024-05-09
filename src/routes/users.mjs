import express, {response, Router} from "express";
import {checkSchema, query} from "express-validator";
import {schemaValidator} from "../utils/schemaValidator/schemaValidator.mjs";
import {mockUsers} from "../utils/constants.mjs";
import passport from "passport";

const router = Router()
// this one is middleware which catch request before let's say hits the target  endpoint and it verifies if the params and body respects th

export const commonIssueMiddleware = (request, response, next) => {
    const {
        params: {id}
    } = request;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return response.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) return response.status(400).send("USER_NOT_FOUND");
    request.findUserIndex = findUserIndex;
    next();
}

router.get("/api/users", commonIssueMiddleware, query('filter').isString().isEmpty().withMessage('query is empty').isLength({
    min: 3,
    max: 10
}).withMessage('query needs to respect length between 3 and 10'));
router.post("/api/users", checkSchema(schemaValidator));
router.put("/api/users", commonIssueMiddleware);
router.patch("/api/users", commonIssueMiddleware);

export default router;