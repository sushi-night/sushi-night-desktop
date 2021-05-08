import { Box, Text } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import React from "react";
import { useHomeTopQuery } from "../generated/graphql";
import { AnimePosterHome } from "./AnimePoster";
import { HorizontalScroll } from "./HorizontalScroll";

interface AnimeTopProps {
  perPage: number;
}

export const AnimeTop: React.FC<AnimeTopProps> = ({ perPage }) => {
  const { loading, error, data } = useHomeTopQuery({
    variables: { perPage },
  });

  return (
    <Box>
      <Skeleton isLoaded={!loading}>
        {error ? <Text color="red">{error.name}</Text> : null}
        <HorizontalScroll>
          {data
            ? data.top?.media?.map((media) =>
                media ? <AnimePosterHome key={media.id} anime={media} /> : null
              )
            : null}
        </HorizontalScroll>
      </Skeleton>
    </Box>
  );
};
