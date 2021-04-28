import { Box, Text } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import React from "react";
import { useHomePopularQuery } from "../generated/graphql";
import { AnimePosterHome } from "./AnimePoster";
import { HorizontalScroll } from "./HorizontalScroll";

export const AnimePopular: React.FC = () => {
  const { loading, error, data } = useHomePopularQuery();

  return (
    <Box>
      <Skeleton isLoaded={!loading}>
        {error ? <Text color="red">{error.name}</Text> : null}
        <HorizontalScroll>
          {data
            ? data.popular?.media?.map((media) =>
                media ? <AnimePosterHome key={media.id} anime={media} /> : null
              )
            : null}
        </HorizontalScroll>
      </Skeleton>
    </Box>
  );
};
