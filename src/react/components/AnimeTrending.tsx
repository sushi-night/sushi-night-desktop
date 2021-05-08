import { Box, Text } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import React from "react";
import { useHomeTrendingQuery } from "../generated/graphql";
import { AnimePosterHome } from "./AnimePoster";
import { HorizontalScroll } from "./HorizontalScroll";

interface AnimeTrendingProps {
  perPage: number;
}

export const AnimeTrending: React.FC<AnimeTrendingProps> = ({ perPage }) => {
  const { loading, error, data } = useHomeTrendingQuery({
    variables: { perPage },
  });

  return (
    <Box>
      <Skeleton isLoaded={!loading}>
        {error ? <Text color="red">{error.name}</Text> : null}
        <HorizontalScroll>
          {data
            ? data.trending?.media?.map((media) =>
                media ? <AnimePosterHome key={media.id} anime={media} /> : null
              )
            : null}
        </HorizontalScroll>
      </Skeleton>
    </Box>
  );
};
