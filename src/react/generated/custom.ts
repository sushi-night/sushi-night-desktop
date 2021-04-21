import {
  Media,
  Maybe,
  MediaTitle,
  MediaCoverImage,
  FuzzyDate,
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
