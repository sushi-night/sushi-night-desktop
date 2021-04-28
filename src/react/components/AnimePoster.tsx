import { Image } from "@chakra-ui/image";
import { Badge, Box, Flex, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import React from "react";
import { useHistory } from "react-router";
import {
  SearchQueryAnimeResult,
  AnimeInProgressQueryR,
} from "../generated/custom";
import {
  Maybe,
  Media,
  MediaCoverImage,
  MediaTitle,
  MediaFragment,
} from "../generated/graphql";
import { useAnimeState, useWatchState } from "../zustand";

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
                "extraLarge"
              >
            >;
          }
      >
    | undefined;
}

interface IAnimePosterInProgress {
  anime: AnimeInProgressQueryR;
}

interface IAnimePosterHome {
  anime: Maybe<{ __typename?: "Media" } & MediaFragment>;
}

export const AnimePosterFromSearch: React.FC<IAnimePosterFromSearch> = ({
  anime,
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
              src={anime!.coverImage?.extraLarge || ""}
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

export const AnimePosterInProgress: React.FC<IAnimePosterInProgress> = ({
  anime,
}) => {
  const { setAnimeId } = useAnimeState();
  const { setWatch } = useWatchState();
  const { push } = useHistory();

  return (
    <Box
      w={32}
      bg="blackAlpha.600"
      shadow="lg"
      rounded="md"
      overflow="hidden"
      cursor="pointer"
      pos="relative"
      onClick={() => {
        setAnimeId(anime!.id);
        setWatch({
          anime: anime!.media as Media,
          episode: anime!.progress || 1,
          gogoId: undefined,
        });
        push("/w/watch");
      }}
    >
      <Box pos="absolute" alignItems="flex-end" right={1}>
        <Badge
          textAlign="center"
          variant="solid"
          colorScheme="blackAlpha"
          rounded="lg"
        >
          {`${anime?.progress + "/" + (anime?.media?.episodes || "?")}`}
        </Badge>
      </Box>
      <Box>
        <Tooltip placement="bottom" label={anime!.media?.title?.userPreferred}>
          <Box>
            <Image
              src={anime!.media?.coverImage?.extraLarge || ""}
              alt="avatar"
              fit="cover"
              w={32}
              h={48}
            />
            <Text fontSize={16} textAlign="center" w="full" noOfLines={1}>
              {anime!.media?.title?.userPreferred}
            </Text>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};

export const AnimePosterHome: React.FC<IAnimePosterHome> = ({ anime }) => {
  const { setAnimeId } = useAnimeState();
  const { push } = useHistory();

  return (
    <Box
      w={32}
      bg="blackAlpha.600"
      shadow="lg"
      rounded="md"
      overflow="hidden"
      cursor="pointer"
      pos="relative"
      onClick={() => {
        setAnimeId(anime!.id);
        push("/w/animeDetails");
      }}
    >
      <Box pos="absolute" alignItems="flex-end" right={1}>
        <Badge
          textAlign="center"
          variant="solid"
          colorScheme="teal"
          alignSelf="flex-end"
          rounded="lg"
        >
          {`${anime?.startDate?.year + " " + anime?.format}`}
        </Badge>
      </Box>
      <Box>
        <Tooltip placement="bottom" label={anime!.title?.userPreferred}>
          <Box>
            <Image
              src={anime!.coverImage?.extraLarge || ""}
              alt="avatar"
              fit="cover"
              w={32}
              h={48}
            />
            <Text fontSize={16} textAlign="center" w="full" noOfLines={1}>
              {anime!.title?.userPreferred}
            </Text>
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};
