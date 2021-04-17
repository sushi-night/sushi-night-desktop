import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

interface Route {
  name: string;
  description: string;
  url: string;
}

var routes: Route[] = [
  {
    name: "Popular animes",
    description: "Get the popular animes by page.",
    url: `/api/anime/popular/:page`,
  },
  {
    name: "Query Search",
    description: "Search for a something by page.",
    url: `/api/anime/search/q/:word/:page`,
  },
  {
    name: "List of genres",
    description: "Get the list of genres available in gogoanime.",
    url: `/api/anime/genrelist`,
  },
  {
    name: "Search by genre",
    description: "Search for animes with some genre in some page.",
    url: `/api/anime/search/g/:genre/:page`,
  },
  {
    name: "Recently added episodes",
    description: "get the recently added episodes by page.",
    url: `/api/anime/recentlyadded/:page`,
  },
  {
    name: "Details of an anime",
    description: "Get the details of an anime by its ID.",
    url: `/api/anime/details/:id`,
  },
  {
    name: "Links for an episode of an anime",
    description: "Get links for an episode by its ID and episode.",
    url: `/api/anime/watch/:id/:episode`,
  },
];

const getApiRoutes = (currentUrl: string): Route[] => {
  var formattedroutes= [] as Route[];

  routes.forEach((route) => {
    formattedroutes.push({
      name: route.name,
      description: route.description,
      url: `${currentUrl}${route.url}`,
    });
  });
  return formattedroutes;
};

router.get("/", (req: Request, res: Response) => {
  const currentUrl = `${req.protocol}://${req.get("host")}`;
  res.json(getApiRoutes(currentUrl));
});

export { router };
