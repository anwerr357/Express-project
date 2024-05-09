import express, {Router} from "express";


const router = Router()
router.get("/api/product/:id", (request, response) => {
    response.send([{
        id:21,
        name:"chicken mkhaded",
        price :12.99
    }])
});
export default router;