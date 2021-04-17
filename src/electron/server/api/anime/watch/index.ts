import express, { Request, Response, Router } from "express";
import { getEpisodeLinks } from "animu-desu";

const router: Router = express.Router();

router.get("/:id/:episode", async (req: Request, res: Response) => {
  const { id, episode } = req.params;
  if (isNaN(parseInt(episode))) {
    res.json({ error: "Episode must be integer." });
  } else {
    await getEpisodeLinks(id,parseInt(episode))
      .then((links) => res.json(links))
      .catch((err) => res.json(err));
  }
});

export { router };