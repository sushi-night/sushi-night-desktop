import { AxiosError } from "axios";
import { useApi } from "./axios";
import {
  FuzzyDate,
  Maybe,
  Media,
  MediaListStatus,
  MediaSeason,
  MediaTitle,
  Studio,
  StudioEdge,
} from "../generated/graphql";

export const MapMediaListStatus = (status?: MediaListStatus): string => {
  switch (status) {
    case MediaListStatus.Current: {
      return "Watching";
    }
    default: {
      return mapEnums(status);
    }
  }
};

export const secondsToDhm = (seconds: number): string => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  const dDisplay = d > 0 ? d + "d " : "";
  const hDisplay = h > 0 ? h + "h " : "";
  const mDisplay = m > 0 ? m + "m " : "";
  return dDisplay + hDisplay + mDisplay;
};

export const mapEnums = (status?: string) =>
  status
    ? status.charAt(0) + status.substring(1).toLowerCase().replace("_", " ")
    : "";

export const mapStartDate = (
  startDate:
    | Maybe<
        {
          __typename?: "FuzzyDate" | undefined;
        } & Pick<FuzzyDate, "year" | "month" | "day">
      >
    | undefined
): string => {
  const month = startDate?.month ? `${mapMonths(startDate.month)} ` : "?";
  const day = startDate?.day ? `${startDate.day.toString()}, ` : "?";
  const year = startDate?.year ? startDate.year.toString() : "?";
  return month + day + year;
};

export const mapSeason = (
  season: Maybe<MediaSeason> | undefined,
  seasonYear: Maybe<number> | undefined
) => `${mapEnums(season?.toString())} ${seasonYear}`;

export const mapStudios = (
  edges:
    | Maybe<
        Maybe<
          {
            __typename?: "StudioEdge" | undefined;
          } & Pick<StudioEdge, "isMain"> & {
              node?:
                | Maybe<
                    {
                      __typename?: "Studio" | undefined;
                    } & Pick<Studio, "id" | "name">
                  >
                | undefined;
            }
        >[]
      >
    | undefined,
  producers?: boolean
): { id: number; name: string }[] => {
  let results: { id: number; name: string }[] = [];
  if (edges) {
    edges.forEach((studio) => {
      if (!producers && studio?.isMain === true)
        results.push({ id: studio.node!.id, name: studio.node!.name });
      else if (producers && studio?.isMain === false)
        results.push({ id: studio.node!.id, name: studio.node!.name });
    });
  }
  return results;
};

export const mapAlternativeTitles = (
  title:
    | Maybe<
        {
          __typename?: "MediaTitle" | undefined;
        } & Pick<MediaTitle, "userPreferred" | "romaji" | "english" | "native">
      >
    | undefined
): string => {
  let result: string[] = [];
  const userPreferred = title?.userPreferred;
  if (title?.english && title.english !== userPreferred)
    result.push(title.english.toString());
  if (title?.romaji && title.romaji !== userPreferred)
    result.push(title.romaji.toString());
  if (title?.native && title.native !== userPreferred)
    result.push(title.native.toString());

  return result.join(", ");
};

export const mapMonths = (year: number): string => {
  switch (year) {
    case 1: {
      return "Jan";
    }
    case 2: {
      return "Feb";
    }
    case 3: {
      return "Mar";
    }
    case 4: {
      return "Apr";
    }
    case 5: {
      return "May";
    }
    case 6: {
      return "Jun";
    }
    case 7: {
      return "Jul";
    }
    case 8: {
      return "Aug";
    }
    case 9: {
      return "Sep";
    }
    case 10: {
      return "Oct";
    }
    case 11: {
      return "Nov";
    }
    case 12: {
      return "Dec";
    }
    default: {
      return mapEnums(year.toString());
    }
  }
};

export const getIdFromGogo = async (anime: Media) => {
  let id: string = "";
  const totalEpisodes = totalEps(anime.nextAiringEpisode, anime.episodes);
  let otherNames: string = "";
  const year = anime?.startDate?.year;

  if (anime.title) {
    let title = {
      userPreferred: anime.title.userPreferred,
      romaji: anime.title.romaji,
      native: anime.title.native,
      english: anime.title.english,
    };
    let valuesArray = Object.values(title);

    valuesArray = valuesArray.filter((v, i) => valuesArray.indexOf(v) === i);

    for (let titleFormat of valuesArray) {
      //sometimes they are null thats why i check
      if (titleFormat) otherNames += titleFormat + ",";
    }
    otherNames = otherNames.slice(0, -1); //remove last comma.

    await useApi()
      .get<string[]>(
        `/getId/${anime.title.romaji}/${totalEpisodes}/${otherNames}/${year}`
      )
      .then((ids) => {
        console.log(ids);
        id = ids.data[0];
      })
      .catch((err: AxiosError) => {
        console.log(err.request);
        console.log(err);
        return `[API]ERROR: ${err}`;
      });
  }
  return id;
};

export const totalEps = (
  nextAiringEpisode: Media["nextAiringEpisode"],
  episodes: Maybe<number> | undefined
) =>
  nextAiringEpisode
    ? nextAiringEpisode.episode - 1
    : episodes
    ? episodes
    : null;
