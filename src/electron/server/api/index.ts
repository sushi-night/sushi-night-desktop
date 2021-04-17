import express,{Router} from "express";
import { router as home } from "./home"
import { router as anime } from "./anime"

const router: Router = express.Router();

router.use("/", home);
router.use("/anime", anime);

export {router};