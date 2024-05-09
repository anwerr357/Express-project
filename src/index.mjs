import express, {response} from "express";
import {checkSchema, query, validationResult} from "express-validator";
import {schemaValidator} from "./utils/schemaValidator/schemaValidator.mjs";
import {mockUsers} from "./utils/constants.mjs";
import routes from "./routes/index.mjs";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import router from "./routes/users.mjs";

const app = express();
app.use(express.json()); // this middleware is meant to parse the data in http requests because if we don't include it we can see that the body in http request is "undefined".
const PORT = process.env.PORT || 3000;
import "./strategies/local-strategy.mjs"
// Middleware setup
app.use(cookieParser());

app.use(
    session({
        secret: "SECRET_JOY",
        resave: false,
        saveUninitialized: false,
    })
);


app.use(passport.initialize());
app.use(passport.session());

app.use(routes)
// server is listening on the port number passed
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
app.get("/", (request, response) => {
    console.log(request.session);
    console.log(request.session.id);

    response.send({msg: "hello"});
    // we can pass ths status code just using like this: response.status(code of status).send({msg:'the message});
});

app.get("/api/users", (request, response) => {
    console.log(validationResult(request))
    const {filter, value} = request.query;
    if (filter && value) {
        return response.send(mockUsers.filter((user) => user[filter].includes(value)),);
    }
    $
    return response.send(mockUsers);
});
app.get("/api/product/:id", (request, response) => {
    const {findUserIndex} = request
    return response.status(201).send(mockUsers[findUserIndex]);
});
/*
    here : localhost:3000/api/users/?key=v&key2=v2 these are query params used to be passed in the request they are used when you want to pass info in client side or also to send some data that you don't want to pass
            them in the request body, so they are called 'query params';
 */
// here you may ask im using the same route ? so is there any conflicts ?? no there s because we are using different http methods one is 'get' , 'post'
app.post("/api/users", (request, response) => {
    const {body} = request;
    const resultValidationRequest = validationResult(request);
    if (!resultValidationRequest.isEmpty()) return response.status(400).send({errors: resultValidationRequest.array()});
    const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...body};
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
});
/* REQUESTS HTTP:
       PUT : this one  needs that you update the entire record or them missing one will be null
       PATCH : update only partial of the record
       DELETE : delete the record
   */
app.put("/api/users/:id", (request, response) => {
    const {
        body, params: {id}, findUserIndex
    } = request;
    const parsedId = parseInt(id);
    mockUsers[findUserIndex] = {id: parsedId, ...body};
    return response.status(201).send(mockUsers[findUserIndex]);
});

app.patch("/api/users/:id", (request, response) => {
    const {
        body, params: {id}, findUserIndex
    } = request;
    const parsedId = parseInt(id);
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body};
    return response.status(201).send(mockUsers[findUserIndex]);
});
app.delete("/api/users/:id", (request, response) => {
    const {findUserIndex} = request
    mockUsers.splice(findUserIndex, 1);
    return response.status(200).send(mockUsers);
});
app.post('/api/auth', (request, response) => {
    const {
        body: {
            username, password
        }
    } = request;
    const findUser = mockUsers.find((user) => (user.username === username && user.password === password));
    if (!findUser) return response.status(401).send('INVALID_CREDENTIALS');
    request.session.user = username;
    return response.status(201).send('USER_HAS_BEEN_AUTHENTICATED');


});
app.get('/api/auth/status', (request, response) => {
    return request.session.user ? response.sendStatus(200) : response.sendStatus(401);
});


app.post('/api/users/auth', passport.authenticate('local'), (request, response) => {
        const {
            body: {
                username, password
            }
        } = request;
        const findUser = mockUsers.find((user) => ((user.username === username) && (user.password === password)));
        console.log(findUser)
        if (!findUser) response.sendStatus(404)
        request.session.user = findUser.id;
        return response.sendStatus(200)
    }
)