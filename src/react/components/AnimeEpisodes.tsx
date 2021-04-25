import { Button } from "@chakra-ui/button";
import { Box, Flex, Text, Wrap, WrapItem } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import React, { useEffect, useState } from "react";
import { Media } from "../generated/graphql";
import { getIdFromGogo, range, calcRanges } from "../util/util";
import { EpisodeListPage } from "./EpisodeListPage";

interface AnimeEpisodesProps {
  anime: Media;
}

export const AnimeEpisodes: React.FC<AnimeEpisodesProps> = ({ anime }) => {
  const [loadingEpisodes, setLoadingEpisodes] = useState(true);
  const [gogoId, setGogoId] = useState<null | string>(null);
  const [ranges, setRanges] = useState<range[] | null>(null);
  const [apiError, setApiError] = useState<null | string>(null);
  const [currentRange, setCurrentRange] = useState<range | null>(null);

  useEffect(() => {
    if (!gogoId && anime) {
      (async () => {
        try {
          setLoadingEpisodes(true);
          const result = await getIdFromGogo(anime);
          setGogoId(result);
          setApiError(null);
          setRanges(calcRanges(anime));
        } catch (err) {
          setApiError(err.toString());
        }
      })();
    }
  }, [anime, gogoId, ranges]);

  useEffect(() => {
    if (ranges) {
      setCurrentRange(ranges[0]);
      setLoadingEpisodes(false);
    }
  }, [ranges]);

  if (apiError) {
    return <Text color="red">{apiError.toString()}</Text>;
  } else if (loadingEpisodes) {
    return <Spinner size="xl" />;
  } else if (gogoId) {
    return (
      <Box maxW={"2xl"}>
        <Flex flexDirection="column">
          <Box w="full" pb={8}>
            {currentRange ? (
              <EpisodeListPage
                range={currentRange}
                anime={anime}
                gogoId={gogoId}
              />
            ) : (
              <Text>There are no episodes yet.</Text>
            )}
          </Box>
          <Wrap justify="center" w="full" spacing={3}>
            {ranges?.map((range) => (
              <WrapItem key={range.from}>
                <Button w={24} onClick={() => setCurrentRange(range)}>
                  {range.from} - {range.to}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
        </Flex>
      </Box>
    );
  } else {
    return <Text>Sorry, we couldn't find that anime.</Text>;
  }
};
