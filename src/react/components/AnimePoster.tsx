import { Badge, Box, Flex, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import React from "react";
import { useHistory } from "react-router";
import { SearchQueryAnimeResult } from "../generated/custom";
import { useAnimeState } from "../zustand";

interface IAnimePosterFromSearch {
  anime: SearchQueryAnimeResult;
  _onClick: () => void;
}

// interface IAnimePosterFromList {
//   anime: MediaListEntryFragment;
// }

//TODO: if anime doesnt have coverImage, render a placeholder one
export const AnimePosterFromSearch: React.FC<IAnimePosterFromSearch> = ({
  anime,
  _onClick,
}) => {
  const { setAnimeId } = useAnimeState();
  const { push } = useHistory();
  return (
    <Box
      cursor="pointer"
      border="2px"
      borderRadius="lg"
      borderColor="steelblue"
      backgroundColor="blackAlpha.400"
      onClick={() => {
        setAnimeId(anime.id);
        push("/w/animeDetails");
        _onClick();
      }}
    >
      <Tooltip label={anime.title?.userPreferred}>
        <Box
          bgImage={`url(${anime.coverImage?.extraLarge || ""})`}
          bgSize="cover"
          bgRepeat="no-repeat"
          bgPosition="center"
          rounded="lg"
          height="72"
        >
          <Flex flexDirection="row-reverse" alignItems="center">
            <Badge
              textAlign="center"
              variant="solid"
              colorScheme="teal"
              alignSelf="flex-end"
              rounded="lg"
            >
              {`${anime.startDate?.year + " " + anime.format}`}
            </Badge>
          </Flex>
        </Box>
      </Tooltip>
      <Text textAlign="center" noOfLines={1}>
        {anime.title?.userPreferred}
      </Text>
    </Box>
  );
};
//TODO: Define a colorScheme for each format
