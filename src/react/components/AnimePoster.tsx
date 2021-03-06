import { Image } from "@chakra-ui/image";
import { Badge, Box, Flex, Spacer, Text } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import * as React from "react";
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
  MediaListEntryFragment,
} from "../generated/graphql";
import { useAnimeState, useWatchState } from "../zustand";

interface IAnimePosterFromSearch {
  anime: SearchQueryAnimeResult;
  _onClick?: () => void;
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

const _AnimePosterFromSearch: React.FC<IAnimePosterFromSearch> = ({
  anime,
  _onClick,
}) => {
  return (
    <Box
      cursor="pointer"
      border="2px"
      borderRadius="lg"
      borderColor="steelblue"
      backgroundColor="blackAlpha.400"
      onClick={_onClick}
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
export const _AnimePosterFromRecomms: React.FC<IAnimePosterFromRecomms> = ({
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

export const _AnimePosterInProgress: React.FC<IAnimePosterInProgress> = ({
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

export const _AnimePosterHome: React.FC<IAnimePosterHome> = ({ anime }) => {
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
        <Tooltip placement="bottom" label={anime?.title?.userPreferred}>
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

interface IAnimePosterFromList {
  anime:
    | Maybe<{ __typename?: "MediaList" } & MediaListEntryFragment>
    | undefined;
}

const _AnimePosterFromList: React.FC<IAnimePosterFromList> = ({ anime }) => {
  const { setAnimeId } = useAnimeState();
  const { push } = useHistory();

  if (!anime) return null;
  else {
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
          setAnimeId(anime!.mediaId);
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
            {`${anime?.media?.startDate?.year + " " + anime?.media?.format}`}
          </Badge>
        </Box>
        <Box>
          <Tooltip
            placement="bottom"
            label={anime?.media?.title?.userPreferred}
          >
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
              <Flex>
                <Text p={1}>
                  {`${anime?.progress + "/" + (anime?.media?.episodes || "?")}`}
                </Text>
                <Spacer />
                <Text p={1}>{anime?.score}</Text>
              </Flex>
            </Box>
          </Tooltip>
        </Box>
      </Box>
    );
  }
};

//improve performance since posters will always have the same
//props, if _AnimePosterInProgress or _AnimePosterFromList
//change, rerender them.
export const AnimePosterFromSearch = React.memo(_AnimePosterFromSearch);
export const AnimePosterFromRecomms = React.memo(_AnimePosterFromRecomms);
export const AnimePosterInProgress = React.memo(
  _AnimePosterInProgress,
  (prevProps, nextProps) => prevProps.anime === nextProps.anime
);
export const AnimePosterHome = React.memo(_AnimePosterHome);
export const AnimePosterFromList = React.memo(
  _AnimePosterFromList,
  (prevProps, nextProps) => prevProps.anime === nextProps.anime
);
