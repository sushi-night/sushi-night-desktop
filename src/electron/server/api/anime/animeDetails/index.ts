import express, { Request, Response, Router } from "express";
import { getAnimeDetails } from "animu-desu";

const router: Router = express.Router();

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await getAnimeDetails(id)
    .then((details) => res.json(details))
    .catch((err) => res.json(err));
});

export { router };
