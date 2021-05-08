import { Box, Text } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import React from "react";
import { useHomeSeasonQuery } from "../generated/graphql";
import { getCurrentSeason, getCurrentYear } from "../util/util";
import { AnimePosterHome } from "./AnimePoster";
import { HorizontalScroll } from "./HorizontalScroll";

interface AnimeSeasonPopularProps {
  perPage: number;
}

export const AnimeSeasonPopular: React.FC<AnimeSeasonPopularProps> = ({
  perPage,
}) => {
  const { loading, error, data } = useHomeSeasonQuery({
    variables: {
      season: getCurrentSeason(),
      seasonYear: getCurrentYear(),
      perPage,
    },
  });

  return (
    <Box>
      <Skeleton isLoaded={!loading}>
        {error ? <Text color="red">{error.name}</Text> : null}
        <HorizontalScroll>
          {data
            ? data.season?.media?.map((media) =>
                media ? <AnimePosterHome key={media.id} anime={media} /> : null
              )
            : null}
        </HorizontalScroll>
      </Skeleton>
    </Box>
  );
};
