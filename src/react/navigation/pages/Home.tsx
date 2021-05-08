import { Box, Heading } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";
import React from "react";
import { AnimeInProgress } from "../../components/AnimeInProgress";
import { AnimeTop } from "../../components/AnimeTop";
import { AnimeSeasonPopular } from "../../components/AnimeSeasonPopular";
import { AnimeTrending } from "../../components/AnimeTrending";
import { useAuthStore } from "../../zustand";

export const Home: React.FC = () => {
  const { authenticated } = useAuthStore();

  return (
    <Box>
      <Heading
        pt={4}
        alignSelf="center"
        textAlign="center"
        as="h4"
        size="lg"
        pb={1}
      >
        Anime in progress
      </Heading>
      {authenticated ? (
        <AnimeInProgress />
      ) : (
        <Skeleton isLoaded={!!authenticated} minH={56} />
      )}
      <Heading
        pt={4}
        alignSelf="center"
        textAlign="center"
        as="h4"
        size="lg"
        pb={1}
      >
        Trending
      </Heading>
      <AnimeTrending perPage={21} />
      <Heading
        pt={4}
        alignSelf="center"
        textAlign="center"
        as="h4"
        size="lg"
        pb={1}
      >
        Popular this season
      </Heading>
      <AnimeSeasonPopular perPage={21} />
      <Heading
        pt={4}
        alignSelf="center"
        textAlign="center"
        as="h4"
        size="lg"
        pb={1}
      >
        All time popular
      </Heading>
      <AnimeTop perPage={21} />
    </Box>
  );
};
