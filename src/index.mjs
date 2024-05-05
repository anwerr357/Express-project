import express, { response } from "express";

const app = express();
app.use(express.json()); // this middleware is meant to parse the data in http requests because if we don't include it we can see that the body in http request is "undefined".
const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "joybit", rate: 1320 },
  { id: 2, username: "anwer lahami", rate: 1230 },
  { id: 3, username: "eneru", rate: 1290 },
];
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
// server is listening on the port number passed

app.get("/", (request, response) => {
  response.send({ msg: "hello" });
  // we can pass ths status code just using like this: response.status(code of status).send({msg:'the message});
});

app.get("/api/users", (request, response) => {
  const { filter, value } = request.query;
  if (filter && value) {
    return response.send(
      mockUsers.filter((user) => user[filter].includes(value)),
    );
  }
  return response.send(mockUsers);
});
app.get("/api/product/:id", (request, response) => {
  const parsedId = parseInt(request.params.id);
  if (isNaN(parsedId))
    return response.status(400).send("BAD_REQUEST_INVALID_ID");
  const user = mockUsers.find((user) => {
    return user.id == parsedId;
  });
  if (user) {
    response.send(user);
  } else response.send("USER_NOT_FOUND");
});
/*
    here : localhost:3000/api/users/?key=v&key2=v2 these are query params used to be passed in the request they are used when you want to pass info in client side or also to send some data that you don't want to pass
            them in the request body so they are called 'query params';
 */
// here you may ask im using the same route ? so is there any conflicts ?? no there s because we are using different http methods one is 'get' , 'post'
app.post("/api/users", (request, response) => {
  const { body } = request;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
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
    body,
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  console.log(id);
  if (isNaN(parsedId)) return response.sendStatus(400); // BAD_REQUEST
  const index = mockUsers.findIndex((user) => user.id == parsedId);
  if (index == -1) return response.sendStatus(404); // NOT_FOUND
  mockUsers[index] = { id: parsedId, ...body };
  return response.status(201).send(mockUsers[index]);
});
