import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { Box, Heading, HStack } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useParams } from "react-router-dom";
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

interface BrowseParams {
  filter?: string | undefined;
}

export const Browse: React.FC = () => {
  const { filter } = useParams<BrowseParams>();
  const [searchGenresNTags, setSearchGenresNTags] = useState<{
    genres: string[];
    tags: string[];
  }>({ genres: [], tags: [] });
  const [searchYear, setSearchYear] = useState<number | undefined>();
  const [searchSeason, setSearchSeason] = useState<string | undefined>();
  const [searchFormat, setSearchFormat] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data, loading, error } = useAdvancedSearchQuery({
    variables: {
      format: searchFormat as MediaFormat,
      year: searchYear?.toString(),
      genres: searchGenresNTags.genres.length
        ? searchGenresNTags.genres
        : undefined,
      tags: searchGenresNTags.tags.length ? searchGenresNTags.tags : undefined,
      season: searchSeason as Maybe<MediaSeason>,
      search: searchQuery,
    },
    skip: ![
      searchFormat ||
        searchYear ||
        searchGenresNTags.genres.length ||
        searchGenresNTags.tags.length ||
        searchSeason ||
        searchQuery.length > 3,
    ],
  });
  useEffect(() => {
    console.log(
      searchGenresNTags,
      searchSeason,
      searchYear,
      searchFormat,
      searchQuery
    );
  }, [searchGenresNTags, searchSeason, searchYear, searchFormat, searchQuery]);

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
            console.log("genre", genre);

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
            console.log("tag", tag);
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
              setSearchYear(parseInt(year));
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
    </Box>
  );
};