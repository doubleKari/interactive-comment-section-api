import express from "express"
import {scoreController} from "../controllers/index.mjs"



const router = express.Router();

router.patch("/:commentId/score", scoreController.updateScore);
router.patch("/:commentId/replies/:replyId/score", scoreController.updateScore)



export default router;
