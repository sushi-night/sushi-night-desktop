import { Box, Button, Heading, Select, Skeleton, Text } from "@chakra-ui/react";
import React from "react";
import { useGenresAndTagsQuery } from "../generated/graphql";

interface ISelectGenres {
  _onSelectGenre: (genre: string) => void;
  _onSelectTag: (tag: string) => void;
}

export const SelectGenres: React.FC<ISelectGenres> = ({
  _onSelectGenre,
  _onSelectTag,
}) => {
  const { data, loading, error } = useGenresAndTagsQuery();

  return (
    <Box w={40}>
      <Heading as="h4" size="sm" pb={2}>
        Genres
      </Heading>
      {error ? <Text>{error.name}</Text> : null}
      <Skeleton isLoaded={!loading}>
        <Select
          placeholder="Any"
          onChange={(e) => {
            let [type, value] = e.target.value.split(":");
            if (type && value) {
              switch (type) {
                case "genre": {
                  _onSelectGenre(value.toString());
                  break;
                }
                default: {
                  _onSelectTag(value.toString());
                  break;
                }
              }
            } else {
              _onSelectTag("Any");
            }
          }}
        >
          {data?.genres?.map((genre) => (
            <option key={genre} value={`genre:${genre}`}>
              {genre}
            </option>
          ))}
          {data?.tags?.map((tag) => (
            <option key={tag?.name} value={tag?.name}>
              {tag?.name}
            </option>
          ))}
        </Select>
      </Skeleton>
    </Box>
  );
};
