import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import {
  Box,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Text,
} from "@chakra-ui/layout";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useHistory } from "react-router-dom";
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
} from "../../generated/graphql";
import { SearchQueryAnimeResult } from "../../generated/custom";
import { useAnimeState } from "../../zustand";
import { Skeleton } from "@chakra-ui/skeleton";

// interface BrowseParams {
//   filter?: string | undefined;
// }

export const Browse: React.FC = () => {
  const { setAnimeId } = useAnimeState();
  const { push } = useHistory();
  //const { filter } = useParams<BrowseParams>(); todo: use this
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
      searchQuery.length > 2
    ),
    fetchPolicy: "network-only",
  });

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
      <Flex pt={5}>
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

// switch (filter) {
//     case "top100": //run top100 query average_score desc.
//       return <div>top100</div>;
//     case "trending": //run trending query
//       return <div>trending</div>;
//     case "topMovies": //run top100 query avg_score desc + type=movie
//       return <div>topMovies</div>;
//     default:
//       //no params provided
//       return <div>noparams</div>;
//   }
