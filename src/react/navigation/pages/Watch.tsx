import { Button, IconButton } from "@chakra-ui/button";
import {
  AspectRatio,
  Box,
  Center,
  Heading,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import React, { useEffect, useState } from "react";
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import {
  getEpisodeLinks,
  AnimeEpisode,
  totalEps,
  getIdFromGogo,
} from "../../util/util";
import { useWatchState } from "../../zustand";

export const Watch: React.FC = () => {
  const { watch, setWatch } = useWatchState();
  const [options, setOptions] = useState<AnimeEpisode[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [option, setCurrentOption] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (watch?.gogoId) {
      setLoading(true);
      setCurrentOption(undefined);
      setOptions(null);
      (async () => {
        try {
          const opts = await getEpisodeLinks(watch.gogoId!, watch.episode);
          setOptions(opts);
          setCurrentOption(opts[0].link);
          setLoading(false);
          setError(null);
        } catch (err) {
          setError(err.toString());
        }
      })();
    } else {
      //try to get the id
      (async () => {
        try {
          if (watch?.anime) {
            const result = await getIdFromGogo(watch.anime);
            setWatch({ ...watch, gogoId: result });
          }
        } catch (err) {
          setError(err.toString());
        }
      })();
    }
  }, [watch, setWatch]);

  return (
    <Box overflow="hidden">
      <Heading size="lg" alignSelf="center" textAlign="center" pb={2}>
        {watch?.anime.title?.userPreferred} - Episode {watch?.episode}
      </Heading>
      {error ? (
        <Text color="red">{error}</Text>
      ) : (
        <Box>
          <Wrap justify="center" overflow="hidden" pb={1}>
            {options?.map((opt) => (
              <WrapItem key={opt.link}>
                <Button size="sm">{opt.quality}</Button>
              </WrapItem>
            ))}
          </Wrap>
          <Wrap justify="center">
            <WrapItem>
              <IconButton
                variant="outline"
                top="50%"
                transform="translate(-30%, -50%)"
                height="36"
                width="24"
                aria-label="previous-episode"
                icon={<BsFillCaretLeftFill size="lg" />}
                isDisabled={watch!.episode > 1 ? false : true}
                onClick={() =>
                  watch &&
                  setWatch({
                    ...watch,
                    episode: watch.episode - 1,
                  })
                }
              />
            </WrapItem>
            <WrapItem pt={2} width="800px" height="450px">
              {loading || !option ? (
                <Center width="800px">
                  <Spinner size="xl" top="50%" />
                </Center>
              ) : (
                <Center>
                  <AspectRatio width="800px" ratio={16 / 8} bgColor="black">
                    <video src={option} controls />
                  </AspectRatio>
                </Center>
              )}
            </WrapItem>
            <WrapItem>
              <IconButton
                variant="outline"
                left="100%"
                top="50%"
                transform="translate(-70%, -50%)"
                height="36"
                width="24"
                aria-label="next-episode"
                icon={<BsFillCaretRightFill size="lg" />}
                isDisabled={
                  watch!.episode <
                  totalEps(
                    watch!.anime.nextAiringEpisode,
                    watch!.anime.episodes
                  )
                    ? false
                    : true
                }
                onClick={() =>
                  watch &&
                  setWatch({
                    ...watch,
                    episode: watch.episode + 1,
                  })
                }
              />
            </WrapItem>
          </Wrap>
        </Box>
      )}
    </Box>
  );
};
