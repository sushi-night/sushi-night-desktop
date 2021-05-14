import { useApi } from "./axios";
import {
  FuzzyDate,
  Maybe,
  Media,
  MediaListCollection,
  MediaListStatus,
  MediaSeason,
  MediaStatus,
  MediaTitle,
  ScoreFormat,
  Studio,
  StudioEdge,
} from "../generated/graphql";

export const MapMediaListStatus = (
  status?: MediaListStatus | Maybe<MediaListStatus> | undefined
): string => {
  switch (status) {
    case MediaListStatus.Current: {
      return "Watching";
    }
    case undefined: {
      return "";
    }
    default: {
      return mapEnums(status?.toString());
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
    ? status.charAt(0) + status.substring(1).toLowerCase().replaceAll("_", " ")
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

let date: Date;

const getDate = () => {
  if (date) return date;
  date = new Date();
  return date;
};

export const getCurrentSeason = (): MediaSeason => {
  switch (getDate().getUTCMonth()) {
    case 2 | 3 | 4:
      return MediaSeason.Spring;
    case 5 | 6 | 7:
      return MediaSeason.Summer;
    case 8 | 9 | 10:
      return MediaSeason.Fall;
    case 11 | 0 | 1:
      return MediaSeason.Winter;
    default:
      return MediaSeason.Spring;
  }
};

export const getCurrentYear = (): number => getDate().getUTCFullYear();

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

    id = (
      await useApi().get<string[]>(
        `/getId/${anime.title.romaji}/${totalEpisodes}/${otherNames}/${year}`
      )
    ).data[0];
  }
  return id;
};

export interface AnimeEpisode {
  link: string;
  quality: string;
}

export const getEpisodeLinks = async (
  id: string,
  episode: number
): Promise<AnimeEpisode[]> => {
  return (await useApi().get(`/watch/${id}/${episode}`)).data;
};

export const totalEps = (
  nextAiringEpisode: Media["nextAiringEpisode"],
  episodes: Maybe<number> | undefined
) =>
  nextAiringEpisode ? nextAiringEpisode.episode - 1 : episodes ? episodes : 0;

export const maxEpisodesBeforePagination = 24;

export type range = {
  from: number;
  to: number;
};

export const calcRanges = (anime: Media): range[] | null => {
  const { status } = anime;
  let { nextAiringEpisode } = anime;
  let { episodes } = anime;
  if (status === MediaStatus.NotYetReleased) {
    return null;
  }
  const totalEpisodes = totalEps(nextAiringEpisode, episodes);
  if (!totalEpisodes) return null;

  const rangeCount = Math.ceil(totalEpisodes / maxEpisodesBeforePagination);

  let ranges: range[] = [];

  var base = 1;
  var end = maxEpisodesBeforePagination;

  for (var i = 0; i < rangeCount; i++) {
    if (end >= totalEpisodes) {
      end = totalEpisodes;
    }

    if (end >= totalEpisodes && base >= totalEpisodes) {
      end = totalEpisodes;
      base = totalEpisodes;
      if (ranges[i - 1].to === end) break;
    }

    ranges.push({
      from: base,
      to: end,
    });
    base = end + 1;
    end = end + maxEpisodesBeforePagination;
  }
  return ranges;
};

export const epsToRender = (from: number, to: number) => {
  var episodesToRender: number[] = new Array(to - from + 1);

  while (from <= to) {
    episodesToRender.push(from++);
  }
  return episodesToRender;
};

type option = { value: any; label: any };

export const options = (start: number, end: number, step: number): option[] => {
  let _scores: option[] = new Array(end - start + 1);
  while (start <= end) {
    _scores.push({ value: start, label: start });
    start += step;
  }
  return _scores;
};

var _userScores: option[] = [];

export const getUserScores = () => _userScores;

export const setUserScores = (
  scoringMethod: Maybe<ScoreFormat> | undefined
) => {
  switch (scoringMethod) {
    case ScoreFormat.Point_10: {
      _userScores = options(0, 10, 1);
      break;
    }
    case ScoreFormat.Point_100: {
      _userScores = options(0, 100, 1);
      break;
    }
    case ScoreFormat.Point_10Decimal: {
      _userScores = options(0, 10, 0.5);
      break;
    }
    case ScoreFormat.Point_5: {
      _userScores = options(0, 5, 1);
      break;
    }
    case ScoreFormat.Point_3: {
      _userScores = options(0, 3, 1);
      break;
    }
  }
};

type MediaListTotal = {
  name: Maybe<string | undefined>;
  total: number | undefined;
};

export type MediaListCollectionTotal = {
  lists: MediaListTotal[];
  all: number;
};

export const getMediaListTotals = (
  medialistcollection: Maybe<MediaListCollection | undefined>
): MediaListCollectionTotal => {
  var all: number = 0;
  var lists: MediaListTotal[] = [];

  medialistcollection?.lists?.forEach((list) => {
    lists.push({ name: list?.name, total: list?.entries?.length });
    if (list?.entries?.length) {
      all += list.entries.length;
    }
  });

  return { lists, all };
};
