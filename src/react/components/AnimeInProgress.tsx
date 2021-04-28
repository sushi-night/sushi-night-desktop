import { Box, Text } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import React from "react";
import { useAnimeInProgressQuery } from "../generated/graphql";
import { useAuthStore } from "../zustand";
import { AnimePosterInProgress } from "./AnimePoster";
import { HorizontalScroll } from "./HorizontalScroll";

export const AnimeInProgress: React.FC = () => {
  const { authenticated } = useAuthStore();
  const { loading, error, data } = useAnimeInProgressQuery({
    variables: { userId: authenticated },
    skip: !authenticated,
  });

  return (
    <Box>
      <Skeleton isLoaded={!loading}>
        {error ? <Text color="red">{error.name}</Text> : null}
        <HorizontalScroll>
          {data
            ? data.Page?.mediaList?.map((media) => (
                <AnimePosterInProgress key={media?.id} anime={media} />
              ))
            : null}
        </HorizontalScroll>
      </Skeleton>
    </Box>
  );
};
