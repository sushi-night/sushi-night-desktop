import express, { Request, Response, Router } from "express";
import { getAnimeDetails, search } from "animu-desu";
import { AnimeAndDate } from "animu-desu";

const router: Router = express.Router();

router.get(
  "/:title/:totalEpisodes/:otherNames/:year",
  async (req: Request, res: Response) => {
    const { title, totalEpisodes, otherNames, year } = req.params;
    let anilist = {} as animeFromAnilist;

    try {
      anilist = {
        otherNames: decodeURIComponent(otherNames),
        title: decodeURIComponent(title),
        year: parseInt(year),
        totalEpisodes: parseInt(totalEpisodes),
      };
    } catch (err) {
      res.json(err);
    }
    let results = [] as AnimeAndDate[];
    let found = [] as AnimeAndDate[];
    let toReturn = [] as string[];

    await search(decodeURIComponent(title), 1)
      .then((data) => (results = data))
      .catch((err) => res.json(err));

    await compareYearAndTotalEpisodes(anilist, results).then((matching) =>
      matching.map((match) => {
        found.push(match)
      })
    ).catch((err) => res.json(err));

    if (found.length > 2) {
      await Promise.all(
        found.map(async (animeFromQuery) => {
          await getAnimeDetails(animeFromQuery.id)
            .then((details) => {
              anilist.otherNames
                .split(",")
                .map((name) => {
                  if (details.otherNames.includes(name)) {
                    toReturn.push(details.id);
                  }
                });
            })
            .catch((err) => res.json(err));
        })
      );
    } else {
      found.map((match) => {
        toReturn.push(match.id);
      });
    }

    res.json(toReturn);
  }
);

interface animeFromAnilist {
  title: string;
  totalEpisodes: number;
  otherNames: string;
  year: number;
}

async function compareYearAndTotalEpisodes(
  anilist: animeFromAnilist,
  gogoResults: AnimeAndDate[]
): Promise<AnimeAndDate[]> {
  let matching = [] as AnimeAndDate[];
  await Promise.all(gogoResults.map(async (result) => {
    if (result.released === anilist.year) {
      await getAnimeDetails(result.id).then((details) => {
        if (
          details.totalEpisodes === anilist.totalEpisodes ||
          details.totalEpisodes === anilist.totalEpisodes - 1
        )
          matching.push(result);
      })
    }
  }));
  return matching;
}

export { router };
