import passport from "passport";
import Strategy from "passport-local";
import {mockUsers} from "../utils/constants.mjs";


passport.serializeUser((user, done) => {
    console.log(`Here serializing the: ${user}`)
    done(null, user.id);

})
passport.deserializeUser((id, done) => {
    console.log(`Here deserializing the: ${id}`)
// this method check for the user if it exists in the session or not
    try {

        const findUser = mockUsers.find((user) => (user.id === id));
        if (!findUser) throw new Error("User Not Found");
        done(null, findUser);

    } catch (err) {
        done(err, null);

    }
})


export default passport.use(new Strategy((username, password, done) => {
    console.log(`username: ${username}`)
    console.log(`password: ${password}`)
    try {
        const findUser = mockUsers.find((user) => (user.username === user.username));
        if (!findUser) throw new Error('User Not found');
        if (findUser.password !== password) throw new Error('Invalid Credentials');
        done(null, findUser)

    } catch (e) {
        done(e, null);
    }
}));