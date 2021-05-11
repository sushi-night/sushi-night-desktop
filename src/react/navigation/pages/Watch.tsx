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
  MediaListStatus,
  useSaveMediaListEntryMutation,
} from "../../generated/graphql";
import {
  getEpisodeLinks,
  AnimeEpisode,
  totalEps,
  getIdFromGogo,
} from "../../util/util";
import { useAuthStore, useWatchState } from "../../zustand";

export const Watch: React.FC = () => {
  const { watch, setWatch } = useWatchState();
  const { authenticated } = useAuthStore();
  const [options, setOptions] = useState<AnimeEpisode[] | null>(null);
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [option, setCurrentOption] = useState<string | undefined>(undefined);
  const [updateEntry, { loading, error }] = useSaveMediaListEntryMutation();

  useEffect(() => {
    let isMounted = true;
    if (isMounted && watch?.gogoId && !option) {
      setLoading(true);
      setCurrentOption(undefined);
      setOptions(null);
      (async () => {
        try {
          const opts = await getEpisodeLinks(watch.gogoId!, watch.episode);
          setOptions(
            opts.filter((opt) => !opt.link.startsWith("https://gogo-cdn.com"))
          );
          setCurrentOption(opts[0].link);
          setLoading(false);
          setError(null);

          const entry = await updateEntry({
            variables: {
              id: watch.anime.mediaListEntry?.id
                ? watch.anime.mediaListEntry?.id
                : undefined,
              mediaId: watch.anime.id,
              status:
                watch.anime.mediaListEntry?.status === MediaListStatus.Repeating
                  ? MediaListStatus.Repeating
                  : MediaListStatus.Current,
              progress: watch.episode,
            },
          });

          if (entry.data?.SaveMediaListEntry && authenticated) {
            setWatch({
              ...watch,
              anime: {
                ...watch.anime,
                mediaListEntry: {
                  id: entry.data?.SaveMediaListEntry?.id,
                  userId: authenticated,
                  mediaId: watch.anime.id,
                },
              },
            });
          }
        } catch (err) {
          setError(err.toString());
        }
      })();
    } else if (!watch?.gogoId) {
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
    return () => {
      isMounted = false;
    };
  }, [watch, setWatch, authenticated, option, updateEntry]);

  const saveProgress = (
    progress: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    var _progress = Math.floor(progress.currentTarget.currentTime);
    if (_progress % 5 === 0) {
      localStorage.setItem(
        `${watch?.anime.id}@ep${watch?.episode}`,
        _progress.toString()
      );
    }
  };

  return (
    <Box overflow="hidden">
      <Heading size="lg" alignSelf="center" textAlign="center" pb={2}>
        {watch?.anime.title?.userPreferred} - Episode {watch?.episode}
      </Heading>
      {_error || error ? (
        <Text color="red">{_error || error?.name}</Text>
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
                icon={<BsFillCaretLeftFill size={96} />}
                isDisabled={loading || watch!.episode > 1 ? false : true}
                onClick={() => {
                  if (watch) {
                    setWatch({
                      ...watch,
                      episode: watch.episode - 1,
                    });
                    setCurrentOption(undefined);
                  }
                }}
              />
            </WrapItem>
            <WrapItem pt={2} width="800px" height="450px">
              {_loading || !option ? (
                <Center width="800px">
                  <Spinner size="xl" top="50%" />
                </Center>
              ) : (
                <Center>
                  <AspectRatio width="800px" ratio={16 / 8} bgColor="black">
                    <video onTimeUpdate={saveProgress} src={option} controls />
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
                icon={<BsFillCaretRightFill size={96} />}
                isDisabled={
                  loading ||
                  watch!.episode <
                    totalEps(
                      watch!.anime.nextAiringEpisode,
                      watch!.anime.episodes
                    )
                    ? false
                    : true
                }
                onClick={() => {
                  if (watch) {
                    setWatch({
                      ...watch,
                      episode: watch.episode + 1,
                    });
                    setCurrentOption(undefined);
                  }
                }}
              />
            </WrapItem>
          </Wrap>
        </Box>
      )}
    </Box>
  );
};
