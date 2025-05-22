import express from "express"
import {userController} from "../controllers/index.mjs"



const router = express.Router();

router.use(express.json());
router.post("/users/", userController.addUser);
router.get("/users/", userController.getUsers);


export default router;
