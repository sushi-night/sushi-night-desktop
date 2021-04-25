import { Button } from "@chakra-ui/button";
import { Wrap, WrapItem } from "@chakra-ui/layout";
import React from "react";
import { useHistory } from "react-router";
import { Media } from "../generated/graphql";
import { epsToRender, range } from "../util/util";
import { useWatchState } from "../zustand";

interface EpisodeListPageProps {
  range: range;
  gogoId: string;
  anime: Media;
}

export const EpisodeListPage: React.FC<EpisodeListPageProps> = ({
  range,
  anime,
  gogoId,
}) => {
  const episodes = epsToRender(range.from, range.to);
  const { setWatch } = useWatchState();
  const { push } = useHistory();

  if (episodes) {
    return (
      <Wrap w="full">
        {episodes.map((episode) => (
          <WrapItem key={episode}>
            <Button
              w={12}
              onClick={() => {
                setWatch({
                  anime,
                  gogoId,
                  episode,
                });
                push("/w/watch");
              }}
            >
              {episode}
            </Button>
          </WrapItem>
        ))}
      </Wrap>
    );
  }
  return null;
};
