import { Box, Center, Flex, Heading, Spacer, Text } from "@chakra-ui/layout";
import {
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Skeleton,
  Button,
  Image,
} from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/tabs";
import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useMediaQuery } from "../../generated/graphql";
import { MapMediaListStatus } from "../../util/util";
import { useAnimeState } from "../../zustand";

export const AnimeDetails: React.FC = () => {
  const { animeId } = useAnimeState();
  const { loading, error, data } = useMediaQuery({
    variables: { id: animeId },
    skip: !animeId,
  });
  const [showReadMore, setShowReadMore] = useState(false);
  const [readMore, setReadMore] = useState(false);

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
              <Box w={44} ml={8}>
                <Flex flexDirection="column">
                  <Image
                    mt={14}
                    src={data?.Media?.coverImage?.extraLarge || ""}
                  />
                  <Flex mt={4}>
                    <Button colorScheme="blue">
                      {data?.Media?.mediaListEntry?.status
                        ? MapMediaListStatus(
                            data?.Media?.mediaListEntry?.status
                          )
                        : "Add to List"}
                    </Button>
                    <Spacer />
                    <Box>
                      <Button colorScheme="red">
                        <FaHeart />
                      </Button>
                    </Box>
                  </Flex>
                </Flex>
              </Box>
            </Skeleton>
            <Box position="absolute" top={80} left={60}>
              <Box top={2}>
                <Skeleton isLoaded={!loading}>
                  <Box
                    onMouseEnter={() => setShowReadMore(true)}
                    onMouseLeave={() => setShowReadMore(false)}
                  >
                    <Heading top={2} as="h3" size="md" color="rgb(159,173,189)">
                      {data?.Media?.title?.userPreferred}
                    </Heading>
                    <Flex overflowY="auto" height="initial">
                      <Text
                        color="rgb(159,173,189)"
                        mt={2}
                        noOfLines={readMore ? 0 : 9}
                        maxWidth="80ch"
                        dangerouslySetInnerHTML={{
                          __html: data?.Media?.description || "",
                        }}
                      />
                    </Flex>

                    <Center>
                      {data?.Media?.description &&
                      data.Media.description.length > 671 &&
                      !readMore ? (
                        <Button
                          variant={showReadMore ? "ghost" : "unstyled"}
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
                      <Tab>Characters</Tab>
                      <Tab>Staff</Tab>
                      <Tab>Stats</Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel>
                        <p>ov</p>
                      </TabPanel>
                      <TabPanel>
                        <p>wa</p>
                      </TabPanel>
                      <TabPanel>
                        <p>ch</p>
                      </TabPanel>
                      <TabPanel>
                        <p>staff</p>
                      </TabPanel>
                      <TabPanel>
                        <p>stats</p>
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
