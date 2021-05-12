import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import {
  Box,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useHistory, useParams } from "react-router-dom";
import { AnimePosterFromSearch } from "../../components/AnimePoster";
import { SelectFormat } from "../../components/SelectFormat";
import { SelectGenres } from "../../components/SelectGenres";
import { SelectSeason } from "../../components/SelectSeason";
import { SelectYear } from "../../components/SelectYear";
import {
  Maybe,
  MediaFormat,
  MediaSeason,
  useAdvancedSearchQuery,
  useHomeTopQuery,
  MediaFragment,
  useHomeTrendingQuery,
} from "../../generated/graphql";
import { SearchQueryAnimeResult } from "../../generated/custom";
import { useAnimeState } from "../../zustand";
import { Skeleton } from "@chakra-ui/skeleton";
import { Tag, TagCloseButton, TagLabel } from "@chakra-ui/tag";

interface BrowseParams {
  filter?: string | undefined;
}

export const Browse: React.FC = () => {
  const { filter } = useParams<BrowseParams>();

  const { setAnimeId } = useAnimeState();
  const { push } = useHistory();
  const [searchGenresNTags, setSearchGenresNTags] = useState<{
    genres: string[];
    tags: string[];
  }>({ genres: [], tags: [] });
  const [searchYear, setSearchYear] = useState<string | undefined>();
  const [searchSeason, setSearchSeason] = useState<string | undefined>();
  const [searchFormat, setSearchFormat] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, loading, error } = useAdvancedSearchQuery({
    variables: {
      format: searchFormat ? (searchFormat as MediaFormat) : undefined,
      year: searchYear ? searchYear : undefined,
      genres: searchGenresNTags.genres.length
        ? searchGenresNTags.genres
        : undefined,
      tags: searchGenresNTags.tags.length ? searchGenresNTags.tags : undefined,
      season: searchSeason ? (searchSeason as Maybe<MediaSeason>) : undefined,
      search: searchQuery ? searchQuery : undefined,
    },
    skip: !(
      searchFormat ||
      searchYear ||
      searchGenresNTags.genres.length ||
      searchGenresNTags.tags.length ||
      searchSeason ||
      searchQuery.length > 2 ||
      filter !== undefined
    ),
    fetchPolicy: "network-only",
  });

  switch (filter) {
    case "top100":
      return <Top100 />;
    case "trending":
      return <Trending />;
    case "topMovies":
      return <Top100 movies />;
  }

  return (
    <Box>
      <HStack
        pt={8}
        alignContent="center"
        justifyContent="center"
        alignItems="center"
        spacing={8}
      >
        <Box w={40}>
          <Heading as="h4" size="sm" pb={2}>
            Search
          </Heading>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<AiOutlineSearch />}
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Box>
        <SelectGenres
          _onSelectGenre={(genre: string) => {
            if (genre === "Any") {
              setSearchGenresNTags({ tags: [], genres: [] });
            } else if (genre in searchGenresNTags.genres) {
              setSearchGenresNTags((prevState) => ({
                tags: [...prevState.tags],
                genres: prevState.genres.filter((g) => g !== genre),
              }));
            } else {
              setSearchGenresNTags((prevState) => ({
                genres: [...prevState.genres, genre],
                tags: [...prevState.tags],
              }));
            }
          }}
          _onSelectTag={(tag: string) => {
            if (tag === "Any") {
              setSearchGenresNTags({ tags: [], genres: [] });
            } else if (tag in searchGenresNTags.tags) {
              setSearchGenresNTags((prevState) => ({
                tags: prevState.tags.filter((t) => t !== tag),
                genres: [...prevState.genres],
              }));
            } else {
              setSearchGenresNTags((prevState) => ({
                tags: [...prevState.tags, tag],
                genres: [...prevState.genres],
              }));
            }
          }}
        />
        <SelectYear
          _onSelect={(year: string) => {
            if (year === "Any") {
              setSearchYear(undefined);
            } else {
              setSearchYear(year + "%");
            }
          }}
        />
        <SelectSeason
          _onSelect={(season: string) => {
            if (season === "Any") {
              setSearchSeason(undefined);
            } else {
              setSearchSeason(season);
            }
          }}
        />
        <SelectFormat
          _onSelect={(format: string) => {
            if (format === "Any") {
              setSearchFormat(undefined);
            } else {
              setSearchFormat(format);
            }
          }}
        />
      </HStack>
      <Wrap pt={4} px={24}>
        {searchGenresNTags.genres.map((genre) => (
          <WrapItem key={genre}>
            <HStack spacing={4}>
              <Tag
                size="md"
                borderRadius="xl"
                variant="solid"
                colorScheme="green"
              >
                <TagLabel>{genre}</TagLabel>
                <TagCloseButton
                  onClick={() => {
                    setSearchGenresNTags((prevState) => ({
                      tags: [...prevState.tags],
                      genres: prevState.genres.filter((g) => g !== genre),
                    }));
                  }}
                />
              </Tag>
            </HStack>
          </WrapItem>
        ))}
        {searchGenresNTags.tags.map((tag) => (
          <WrapItem key={tag}>
            <HStack spacing={4} px={1}>
              <Tag
                size="md"
                borderRadius="xl"
                variant="solid"
                colorScheme="green"
              >
                <TagLabel>{tag}</TagLabel>
                <TagCloseButton
                  onClick={() => {
                    setSearchGenresNTags((prevState) => ({
                      tags: prevState.tags.filter((t) => t !== tag),
                      genres: [...prevState.genres],
                    }));
                  }}
                />
              </Tag>
            </HStack>
          </WrapItem>
        ))}
      </Wrap>
      <Flex pt={2} px={1}>
        {error ? (
          <Text color="red">{error.name}</Text>
        ) : (
          <Skeleton isLoaded={!loading} w="full" h={80}>
            <SimpleGrid columns={5} padding={2} spacing={5}>
              {data?.Page?.media
                ? data.Page.media.map((media) => (
                    <AnimePosterFromSearch
                      key={media!.id}
                      anime={media as SearchQueryAnimeResult}
                      _onClick={() => {
                        setAnimeId(media!.id);
                        push("/w/animeDetails");
                      }}
                    />
                  ))
                : null}
            </SimpleGrid>
          </Skeleton>
        )}
      </Flex>
    </Box>
  );
};

interface ITop100Props {
  movies?: boolean;
}
const Top100: React.FC<ITop100Props> = ({ movies }) => {
  const [animes, setAnimes] =
    useState<Array<{ __typename?: "Media" } & MediaFragment>>();
  const [page, setPage] = useState<number>(1);

  const { loading, data, error } = useHomeTopQuery({
    variables: {
      perPage: 50, //maximum allowed to fetch is 50
      page,
      format: movies ? MediaFormat.Movie : undefined,
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (page < 2) {
      setPage(page + 1);
    }
  }, [page]);

  useEffect(() => {
    if (data) {
      let _animes = animes || [];
      setAnimes(
        _animes.concat(
          data?.top?.media as Array<{ __typename?: "Media" } & MediaFragment>
        )
      );
    }
  }, [data]);

  const { setAnimeId } = useAnimeState();
  const { push } = useHistory();

  return (
    <Box>
      <Heading py={4} alignSelf="center" textAlign="center">
        Top 100 {movies ? "Movies" : "Anime"}
      </Heading>
      {error ? (
        <Text color="red">{error.name}</Text>
      ) : (
        <Skeleton isLoaded={!loading} w="full" h={80}>
          <Box px={1} pt={2}>
            <SimpleGrid columns={5} px={1} spacing={5}>
              {animes
                ? animes.map((media) => (
                    <AnimePosterFromSearch
                      key={media!.id}
                      anime={media as SearchQueryAnimeResult}
                      _onClick={() => {
                        setAnimeId(media!.id);
                        push("/w/animeDetails");
                      }}
                    />
                  ))
                : null}
            </SimpleGrid>
          </Box>
        </Skeleton>
      )}
    </Box>
  );
};

const Trending: React.FC = () => {
  const { loading, data, error } = useHomeTrendingQuery({
    variables: {
      perPage: 24,
    },
  });

  const { setAnimeId } = useAnimeState();
  const { push } = useHistory();

  return (
    <Box>
      <Heading py={4} alignSelf="center" textAlign="center">
        Trending Anime
      </Heading>
      {error ? (
        <Text color="red">{error.name}</Text>
      ) : (
        <Skeleton isLoaded={!loading} w="full" h={80}>
          <Box px={1} pt={2}>
            <SimpleGrid columns={5} padding={2} spacing={5}>
              {data?.trending?.media
                ? data.trending.media.map((media) => (
                    <AnimePosterFromSearch
                      key={media!.id}
                      anime={media as SearchQueryAnimeResult}
                      _onClick={() => {
                        setAnimeId(media!.id);
                        push("/w/animeDetails");
                      }}
                    />
                  ))
                : null}
            </SimpleGrid>
          </Box>
        </Skeleton>
      )}
    </Box>
  );
};
