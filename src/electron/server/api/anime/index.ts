import express, { Request, Response, Router } from "express";
import {router as popular} from "./popular";
import {router as search} from "./search";
import {router as genrelist} from "./genreList";
import {router as recentlyAdded} from "./recentlyAdded";
import {router as animeDetails} from "./animeDetails";
import {router as watch} from "./watch";
import {router as getId} from "./getId";
const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.json("this is the anime route");
});
  
router.use("/popular",popular);
router.use("/search",search);
router.use("/genreList",genrelist);
router.use("/recentlyAdded",recentlyAdded);
router.use("/details",animeDetails);
router.use("/watch",watch);
router.use("/getId",getId);

export { router };