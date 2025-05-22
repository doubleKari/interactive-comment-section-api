import express from "express"
import {userController} from "../controllers/index.mjs"



const router = express.Router();

router.use(express.json());
router.post("/", userController.addUser);
router.get("/", userController.getUsers);


export default router;
