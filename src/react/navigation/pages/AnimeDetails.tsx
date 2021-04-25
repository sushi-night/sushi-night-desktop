import {
  Box,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/layout";
import {
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Skeleton,
  Button,
  Image,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/tabs";
import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import {
  Media,
  MediaStatus,
  MediaType,
  useMediaQuery,
} from "../../generated/graphql";
import {
  MapMediaListStatus,
  mapStartDate,
  mapEnums,
  secondsToDhm,
  mapSeason,
  mapStudios,
  mapAlternativeTitles,
} from "../../util/util";
import { useAnimeState } from "../../zustand";
import {
  AnimeCharacter,
  AnimeRelation,
  AnimeStaff,
} from "../../components/AnimeDetailsNodes";
import { textColor } from "../../../Constants";
import { StatusD } from "../../components/StatusDistribution";
import { ScoreD } from "../../components/ScoreDistribution";
import { AnimePosterFromRecomms } from "../../components/AnimePoster";
import { AnimeEpisodes } from "../../components/AnimeEpisodes";

export const AnimeDetails: React.FC = () => {
  const { animeId } = useAnimeState();
  const { loading, error, data } = useMediaQuery({
    variables: { id: animeId },
    skip: !animeId,
  });

  const [showReadMore, setShowReadMore] = useState(false);
  const [readMore, setReadMore] = useState(false);

  useEffect(() => {
    window.scrollTo(1, 0); //fix weird scrollbar bug  
    setShowReadMore(false);
    setReadMore(false);
  }, [animeId]);

  return (
    <Box>
      {error ? (
        <Text>{error}</Text>
      ) : (
        <Box
          bgImage={`url(${data?.Media?.bannerImage || ""})`}
          bgSize="cover"
          bgRepeat="no-repeat"
          bgPosition="center"
          height={256}
        >
          <Box>
            <Skeleton isLoaded={!loading}>
              <Box w={48} ml={8}>
                <Flex flexDirection="column">
                  <Image
                    mt={14}
                    src={data?.Media?.coverImage?.extraLarge || ""}
                  />
                  <Flex mt={4}>
                    <Box>
                      <ButtonGroup isAttached size="md">
                        <Button colorScheme="blue" mr={-2.5} pl={2}>
                          {data?.Media?.mediaListEntry?.status
                            ? MapMediaListStatus(
                                data?.Media?.mediaListEntry?.status
                              )
                            : "Add to List"}
                        </Button>
                        <IconButton
                          aria-label="edit"
                          colorScheme="linkedin"
                          icon={<BsChevronDown />}
                          width="0.5"
                        />
                      </ButtonGroup>
                    </Box>
                    <Spacer />
                    <Box>
                      <Button
                        colorScheme="red"
                        color={data?.Media?.isFavourite ? "red" : "ButtonText"}
                        pl={2}
                        pr={2}
                      >
                        <FaHeart />
                      </Button>
                    </Box>
                  </Flex>
                  <Box>
                    <Box
                      mt={4}
                      rounded="sm"
                      bgColor="blackAlpha.400"
                      pt={2}
                      pb={2}
                      pl={4}
                    >
                      <VStack>
                        <Box>
                          {data?.Media?.nextAiringEpisode ? (
                            <Box color="blue.300">
                              <Heading as="h4" size="sm">
                                Airing
                              </Heading>
                              <Text>{`Ep ${
                                data.Media.nextAiringEpisode.episode
                              }: ${secondsToDhm(
                                data.Media.nextAiringEpisode.timeUntilAiring
                              )}`}</Text>
                            </Box>
                          ) : null}
                          <Box mt={2} color={textColor}>
                            <Heading as="h6" size="sm" fontWeight="semibold">
                              Format
                            </Heading>
                            <Text>{data?.Media?.format}</Text>
                          </Box>
                          <Box mt={2} color={textColor}>
                            <Heading as="h6" size="sm" fontWeight="semibold">
                              Episode Duration
                            </Heading>
                            <Text>{data?.Media?.duration} mins</Text>
                          </Box>
                          <Box mt={2} color={textColor}>
                            <Heading as="h6" size="sm" fontWeight="semibold">
                              Status
                            </Heading>
                            <Text>
                              {mapEnums(data?.Media?.status?.toString())}
                            </Text>
                          </Box>
                          <Box mt={2} color={textColor}>
                            <Heading as="h6" size="sm" fontWeight="semibold">
                              Start Date
                            </Heading>
                            <Text>{mapStartDate(data?.Media?.startDate)}</Text>
                          </Box>
                          <Box mt={2} color={textColor}>
                            <Heading as="h6" size="sm" fontWeight="semibold">
                              Season
                            </Heading>
                            <Text>
                              {mapSeason(
                                data?.Media?.season,
                                data?.Media?.seasonYear
                              )}
                            </Text>
                          </Box>
                          <Box mt={2} color={textColor}>
                            <Heading as="h6" size="sm" fontWeight="semibold">
                              Average Score
                            </Heading>
                            <Text>{data?.Media?.averageScore}%</Text>
                          </Box>
                          <Box mt={2} color={textColor}>
                            <Heading as="h6" size="sm" fontWeight="semibold">
                              Mean Score
                            </Heading>
                            <Text>{data?.Media?.meanScore}%</Text>
                          </Box>
                          <Box mt={2} color={textColor}>
                            <Heading as="h6" size="sm" fontWeight="semibold">
                              Popularity
                            </Heading>
                            <Text>{data?.Media?.popularity}</Text>
                          </Box>
                          <Box mt={2} color={textColor}>
                            <Heading as="h6" size="sm" fontWeight="semibold">
                              Favourites
                            </Heading>
                            <Text>{data?.Media?.favourites}</Text>
                          </Box>
                          <Box mt={2} color={textColor}>
                            <Heading as="h6" size="sm" fontWeight="semibold">
                              Studios
                            </Heading>
                            {mapStudios(data?.Media?.studios?.edges).map(
                              (studio) => (
                                <Text key={studio.id}>{studio.name}</Text>
                              )
                            )}
                          </Box>
                          <Box mt={2} color={textColor}>
                            <Heading as="h6" size="sm" fontWeight="semibold">
                              Producers
                            </Heading>
                            {mapStudios(data?.Media?.studios?.edges, true).map(
                              (producer) => (
                                <Text key={producer.id}>{producer.name}</Text>
                              )
                            )}
                          </Box>
                          <Box mt={2} color={textColor}>
                            <Heading as="h6" size="sm" fontWeight="semibold">
                              Source
                            </Heading>
                            <Text>
                              {mapEnums(data?.Media?.source?.toString())}
                            </Text>
                          </Box>
                          <Box mt={2} color={textColor}>
                            <Heading as="h6" size="sm" fontWeight="semibold">
                              Genres
                            </Heading>
                            {<Text>{data?.Media?.genres?.join(", ")}</Text>}
                          </Box>
                        </Box>
                      </VStack>
                    </Box>
                  </Box>
                </Flex>
              </Box>
            </Skeleton>
            <Box position="absolute" top={80} left={64}>
              <Box w="3xl">
                <Skeleton isLoaded={!loading}>
                  <Box
                    onMouseEnter={() => setShowReadMore(true)}
                    onMouseLeave={() => setShowReadMore(false)}
                  >
                    <Heading as="h3" size="md" color={textColor} pt={4}>
                      {data?.Media?.title?.userPreferred}
                    </Heading>
                    <Flex flexDirection="column">
                      <Text
                        textAlign="justify"
                        color={textColor}
                        noOfLines={readMore ? 0 : 9}
                        maxWidth="90ch"
                        dangerouslySetInnerHTML={{
                          __html: data?.Media?.description || "",
                        }}
                      />
                      <Text
                        as="h1"
                        fontSize="sm"
                        fontStyle="oblique"
                        mt={2}
                        color={textColor}
                      >
                        Other names: {mapAlternativeTitles(data?.Media?.title)}
                      </Text>
                      <Text
                        as="h1"
                        fontSize="sm"
                        fontStyle="oblique"
                        mt={1}
                        color={textColor}
                      >
                        Synonyms: {data?.Media?.synonyms?.join(", ")}
                      </Text>
                    </Flex>

                    <Center>
                      {data?.Media?.description &&
                      data.Media.description.length > 671 &&
                      !readMore ? (
                        <Button
                          variant={showReadMore ? "ghost" : "unstyled"}
                          rounded="none"
                          width="100%"
                          onClick={() => setReadMore(true)}
                        >
                          {showReadMore ? "Read More" : ""}
                        </Button>
                      ) : null}
                    </Center>
                  </Box>
                </Skeleton>
                <Skeleton isLoaded={!loading}>
                  <Tabs align="center">
                    <TabList>
                      <Tab>Overview</Tab>
                      <Tab>Watch</Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel>
                        <Flex>
                          <Heading color={textColor} as="h4" size="md" pb={2}>
                            Relations
                          </Heading>
                        </Flex>
                        <SimpleGrid maxW="3xl" columns={7}>
                          {data?.Media?.relations?.edges?.map((edge) =>
                            edge?.node?.type === MediaType.Anime ? (
                              <AnimeRelation key={edge?.id} anime={edge} />
                            ) : null
                          )}
                        </SimpleGrid>
                        <Flex>
                          <Heading
                            color={textColor}
                            as="h4"
                            size="md"
                            pb={2}
                            pt={2}
                          >
                            Characters
                          </Heading>
                        </Flex>
                        <SimpleGrid columns={2} columnGap={24} spacing={2}>
                          {data?.Media?.characterPreview?.edges?.map((edge) => (
                            <AnimeCharacter key={edge?.id} character={edge} />
                          ))}
                        </SimpleGrid>
                        <Flex>
                          <Heading
                            color={textColor}
                            as="h4"
                            size="md"
                            pb={2}
                            pt={2}
                          >
                            Staff
                          </Heading>
                        </Flex>
                        <SimpleGrid columns={2} spacing={2} columnGap={24}>
                          {data?.Media?.staffPreview?.edges?.map((edge) => (
                            <AnimeStaff key={edge?.id} staffMember={edge} />
                          ))}
                        </SimpleGrid>
                        <Flex>
                          <Heading
                            color={textColor}
                            as="h4"
                            size="sm"
                            pb={2}
                            pt={2}
                          >
                            Status Distribution
                          </Heading>
                        </Flex>
                        <StatusD
                          released={
                            data?.Media?.status === MediaStatus.Finished
                          }
                          statusDistribution={
                            data?.Media?.stats?.statusDistribution
                          }
                        />
                        <Flex>
                          <Heading color={textColor} as="h4" size="sm" pt={2}>
                            Score Distribution
                          </Heading>
                        </Flex>
                        <ScoreD
                          scoreDistribution={
                            data?.Media?.stats?.scoreDistribution
                          }
                        />
                        <Flex>
                          <Heading
                            color={textColor}
                            as="h4"
                            size="sm"
                            pb={2}
                            pt={2}
                          >
                            Recommendations
                          </Heading>
                        </Flex>
                        <SimpleGrid columns={7} spacing={2} pb={6}>
                          {data?.Media?.recommendations?.nodes?.map((node) =>
                            node ? (
                              <AnimePosterFromRecomms
                                key={node.id}
                                anime={node.mediaRecommendation}
                              />
                            ) : null
                          )}
                        </SimpleGrid>
                      </TabPanel>
                      <TabPanel>
                        {data?.Media ? (
                          <AnimeEpisodes anime={data.Media as Media} />
                        ) : null}
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </Skeleton>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
