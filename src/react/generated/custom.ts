import {
  Media,
  Maybe,
  MediaTitle,
  MediaCoverImage,
  FuzzyDate,
  AiringSchedule,
  MediaList,
  MediaListGroup,
  MediaListEntryFragment,
} from "./graphql";

export type SearchQueryAnimeResult = { __typename?: "Media" } & Pick<
  Media,
  "id" | "type" | "format" | "bannerImage"
> & {
    title?: Maybe<
      { __typename?: "MediaTitle" } & Pick<MediaTitle, "userPreferred">
    >;
    coverImage?: Maybe<
      { __typename?: "MediaCoverImage" } & Pick<MediaCoverImage, "extraLarge">
    >;
    startDate?: Maybe<{ __typename?: "FuzzyDate" } & Pick<FuzzyDate, "year">>;
  };

export type AnimeInProgressQueryR = Maybe<
  { __typename?: "MediaList" } & Pick<
    MediaList,
    "id" | "status" | "score" | "progress"
  > & {
      media?: Maybe<
        { __typename?: "Media" } & Pick<
          Media,
          "id" | "type" | "status" | "format" | "episodes" | "bannerImage"
        > & {
            startDate?: Maybe<
              { __typename?: "FuzzyDate" } & Pick<
                FuzzyDate,
                "year" | "month" | "day"
              >
            >;
            title?: Maybe<
              { __typename?: "MediaTitle" } & Pick<
                MediaTitle,
                "userPreferred" | "romaji" | "english" | "native"
              >
            >;
            coverImage?: Maybe<
              { __typename?: "MediaCoverImage" } & Pick<
                MediaCoverImage,
                "extraLarge"
              >
            >;
            nextAiringEpisode?: Maybe<
              { __typename?: "AiringSchedule" } & Pick<
                AiringSchedule,
                "airingAt" | "timeUntilAiring" | "episode"
              >
            >;
          }
      >;
    }
>;

export type MediaListGroup_List =
  | Maybe<
      { __typename?: "MediaListGroup" } & Pick<
        MediaListGroup,
        "name" | "isCustomList"
      > & { isCompletedList: MediaListGroup["isSplitCompletedList"] } & {
          entries?: Maybe<
            Array<Maybe<{ __typename?: "MediaList" } & MediaListEntryFragment>>
          >;
        }
    >
  | undefined;
