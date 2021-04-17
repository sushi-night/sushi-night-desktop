import express, { Request, Response, Router } from "express";
import { getGenreList } from "animu-desu";

const router: Router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  await getGenreList()
    .then((genreList) => res.json(genreList))
    .catch((err) => res.json(err));
});

export { router };
