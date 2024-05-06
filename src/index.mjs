import express from "express";
import {checkSchema, query, validationResult} from "express-validator";
import {schemaValidator} from "./utils/schemaValidator/schemaValidator.mjs";
const app = express();
app.use(express.json()); // this middleware is meant to parse the data in http requests because if we don't include it we can see that the body in http request is "undefined".
const PORT = process.env.PORT || 3000;

const mockUsers = [
    {id: 1, username: "joybit", rate: 1320},
    {id: 2, username: "anwer lahami", rate: 1230},
    {id: 3, username: "eneru", rate: 1290},
];
// server is listening on the port number passed

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

// this one is middleware which catch request before let's say hits the target  endpoint and it verifies if the params and body respects th
const commonIssueMiddleware = (request, response, next) => {
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

app.get("/", (request, response) => {
    response.send({msg: "hello"});
    // we can pass ths status code just using like this: response.status(code of status).send({msg:'the message});
});

app.get("/api/users",
    query('filter').isString().isEmpty().withMessage('query is empty').isLength({
        min: 3,
        max: 10
    }).withMessage('query needs to respect length between 3 and 10')
    , (request, response) => {
        console.log(validationResult(request))
        const {filter, value} = request.query;
        if (filter && value) {
            return response.send(
                mockUsers.filter((user) => user[filter].includes(value)),
            );
        }
        return response.send(mockUsers);
    });
app.get("/api/product/:id", commonIssueMiddleware, (request, response) => {
    const {findUserIndex} = request
    return response.status(201).send(mockUsers[findUserIndex]);
});
/*
    here : localhost:3000/api/users/?key=v&key2=v2 these are query params used to be passed in the request they are used when you want to pass info in client side or also to send some data that you don't want to pass
            them in the request body, so they are called 'query params';
 */
// here you may ask im using the same route ? so is there any conflicts ?? no there s because we are using different http methods one is 'get' , 'post'
app.post("/api/users",checkSchema(schemaValidator),
    (request, response) => {
    const {body} = request;
    const resultValidationRequest = validationResult(request);
    if(!resultValidationRequest.isEmpty()) return response.status(400).send({errors :resultValidationRequest.array()});
    const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...body};
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
});
/* REQUESTS HTTP:
       PUT : this one  needs that you update the entire record or them missing one will be null
       PATCH : update only partial of the record
       DELETE : delete the record
   */
app.put("/api/users/:id", commonIssueMiddleware, (request, response) => {
    const {
        body,
        params: {id},
        findUserIndex
    } = request;
    const parsedId = parseInt(id);
    mockUsers[findUserIndex] = {id: parsedId, ...body};
    return response.status(201).send(mockUsers[findUserIndex]);
});

app.patch("/api/users/:id", commonIssueMiddleware, (request, response) => {
    const {
        body,
        params: {id},
        findUserIndex
    } = request;
    const parsedId = parseInt(id);
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body};
    return response.status(201).send(mockUsers[findUserIndex]);
});
app.delete("/api/users/:id", commonIssueMiddleware, (request, response) => {
    const {findUserIndex} = request
    mockUsers.splice(findUserIndex, 1);
    return response.status(200).send(mockUsers);
});