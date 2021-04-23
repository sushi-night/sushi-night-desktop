import React from "react";
import { Image } from "@chakra-ui/image";
import { Badge, Box, Flex, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import { useHistory } from "react-router";
import { SearchQueryAnimeResult } from "../generated/custom";
import {
  Maybe,
  Media,
  MediaCoverImage,
  MediaTitle,
} from "../generated/graphql";
import { useAnimeState } from "../zustand";

interface IAnimePosterFromSearch {
  anime: SearchQueryAnimeResult;
  _onClick: () => void;
}

interface IAnimePosterFromRecomms {
  anime:
    | Maybe<
        { __typename?: "Media" } & Pick<
          Media,
          "id" | "format" | "type" | "status" | "bannerImage"
        > & {
            title?: Maybe<
              { __typename?: "MediaTitle" } & Pick<MediaTitle, "userPreferred">
            >;
            coverImage?: Maybe<
              { __typename?: "MediaCoverImage" } & Pick<
                MediaCoverImage,
                "large"
              >
            >;
          }
      >
    | undefined;
}

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
export const AnimePosterFromRecomms: React.FC<IAnimePosterFromRecomms> = ({
  anime,
}) => {
  const { setAnimeId } = useAnimeState();
  const { push } = useHistory();

  return (
    <Box
      p={0.5}
      bg="blackAlpha.600"
      shadow="lg"
      rounded="md"
      overflow="hidden"
      cursor="pointer"
      onClick={() => {
        setAnimeId(anime!.id);
        push("/w/animeDetails");
      }}
    >
      <Box>
        <Tooltip placement="bottom" label={anime!.title?.userPreferred}>
          <Box>
            <Image
              src={anime!.coverImage?.large || ""}
              w="xs"
              h={32}
              fit="cover"
              alt="avatar"
            />
            <Text fontSize={16} textAlign="center" noOfLines={1}>
              {anime!.title?.userPreferred}
            </Text>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};
