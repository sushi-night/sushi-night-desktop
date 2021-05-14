import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/layout";
import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { AnimePosterFromList } from "../../components/AnimePoster";
import { SelectCountry } from "../../components/SelectCountryOfOrigin";
import { SelectFormat } from "../../components/SelectFormat";
import { SelectGenres } from "../../components/SelectGenres";
import { SelectStatus } from "../../components/SelectStatus";
import { SelectYear } from "../../components/SelectYear";
import { MediaListGroup_List } from "../../generated/custom";
import {
  Maybe,
  MediaFormat,
  MediaListCollectionQuery,
  MediaListStatus,
  MediaType,
  useMediaListCollectionQuery,
  MediaListEntryFragment,
} from "../../generated/graphql";
import {
  MapMediaListStatus,
  getMediaListTotals,
  MediaListCollectionTotal,
} from "../../util/util";
import { useAuthStore } from "../../zustand";

export const AnimeList: React.FC = () => {
  const { authenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFormat, setSearchFormat] = useState<MediaFormat>();
  const [searchYear, setSearchYear] = useState<string>();
  const [status, setStatus] = useState<MediaListStatus | null | undefined>();
  const [genres, setGenres] = useState<string[]>([]);
  const [country, setCountry] = useState<string>();
  const [listsWTotal, setListsWTotal] =
    useState<MediaListCollectionTotal | undefined>(undefined);
  const [filteredLists, setFilteredLists] =
    useState<MediaListCollectionQuery["MediaListCollection"] | undefined>(
      undefined
    );

  const { data, loading, error } = useMediaListCollectionQuery({
    variables: {
      userId: authenticated!,
      type: MediaType.Anime,
    },
    skip: !authenticated, //undefined,0
  });

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      if (data) {
        setListsWTotal(getMediaListTotals(data.MediaListCollection));
        setFilteredLists(data.MediaListCollection);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [data]);

  //memoize deps and fire only if they have changed
  const applyFilters = useCallback(() => {
    if (data?.MediaListCollection?.lists?.length) {
      var list: MediaListGroup_List;

      var results: Array<
        Maybe<{ __typename?: "MediaList" } & MediaListEntryFragment>
      > = [];

      if (status) {
        list = data?.MediaListCollection?.lists?.find(
          (l) => l?.name === MapMediaListStatus(status)
        );
      }

      if (searchQuery !== "") {
        if (list) {
          if (list.entries) {
            for (let a of list.entries) {
              if (a?.media?.title) {
                for (let title of Array.from(Object.values(a.media.title))) {
                  title = title?.toLowerCase();
                  if (title?.includes(searchQuery)) {
                    results.push(a);
                    break;
                  }
                }
              }
            }
          }
        } else {
          data?.MediaListCollection?.lists?.forEach((_l) => {
            if (_l?.entries) {
              for (let a of _l.entries) {
                if (a?.media?.title) {
                  for (let title of Array.from(Object.values(a.media.title))) {
                    title = title?.toLowerCase();
                    if (title?.includes(searchQuery)) {
                      results.push(a);
                      break;
                    }
                  }
                }
              }
            }
          });
        }
      } else {
        data.MediaListCollection.lists.forEach((l) => {
          if (l?.entries) results = results.concat(l.entries);
        });
      }

      if (searchFormat) {
        results = results?.filter((r) => r?.media?.format === searchFormat);
      }

      if (searchYear) {
        results = results?.filter(
          (r) =>
            r?.media?.startDate?.year &&
            r?.media?.startDate?.year === parseInt(searchYear)
        );
      }

      if (country) {
        results = results?.filter((r) => r?.media?.countryOfOrigin === country);
      }

      if (genres.length) {
        results = results?.filter((r) =>
          genres.every((g) => r?.media?.genres?.includes(g))
        );
      }

      let mockMediaCollection: MediaListCollectionQuery["MediaListCollection"] =
        {
          lists: [],
        };

      data?.MediaListCollection?.lists?.forEach((l) =>
        mockMediaCollection?.lists?.push({
          isCompletedList: l?.isCompletedList,
          name: l?.name,
          entries: [],
        })
      );

      let mockList: MediaListGroup_List = {
        isCompletedList: list?.isCompletedList,
        name: list?.name,
        entries: [],
      };

      results?.forEach((r) => {
        if (!list) {
          mockMediaCollection?.lists
            ?.find((l) => l?.name === MapMediaListStatus(r?.status))
            ?.entries?.push(r);
        } else {
          mockList?.entries?.push(r);
        }
      });

      if (list) {
        setFilteredLists({ lists: [mockList] });
      } else if (mockMediaCollection) {
        setFilteredLists({ lists: mockMediaCollection.lists });
      }
    }
  }, [
    searchQuery,
    genres,
    country,
    searchFormat,
    status,
    searchYear,
    data?.MediaListCollection?.lists,
  ]);

  useEffect(() => {
    applyFilters();
  }, [
    searchQuery,
    genres,
    country,
    searchFormat,
    status,
    searchYear,
    applyFilters,
  ]);

  return (
    <Box pb={8}>
      {error ? (
        <Text color="red">{error.name}</Text>
      ) : (
        <Grid templateColumns="repeat(6, 1fr)" gap={6}>
          <GridItem colSpan={1}>
            <Flex pt={6} pl={4} flexDir="column" align="flex-start">
              <InputGroup w={36}>
                <InputLeftElement
                  pointerEvents="none"
                  children={<AiOutlineSearch />}
                />
                <Input
                  placeholder="Filter"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
              <Box>
                <Heading as="h6" size="sm" pt={2} pb={1}>
                  Lists
                </Heading>
                <VStack spacing={-1} align="flex-start">
                  <Button
                    variant="unstyled"
                    isDisabled={loading}
                    onClick={() => setStatus(undefined)}
                  >
                    <Flex>
                      <Text textAlign="left" w={20}>
                        All
                      </Text>
                      <Center ml={4}>
                        {loading ? (
                          <Spinner />
                        ) : (
                          <Text>{listsWTotal?.all}</Text>
                        )}
                      </Center>
                    </Flex>
                  </Button>
                  {Object.values(MediaListStatus).map((status) => (
                    <Button
                      isDisabled={loading}
                      variant="unstyled"
                      key={status}
                      onClick={() => setStatus(status)}
                    >
                      <Flex>
                        <Text textAlign="left" w={20}>
                          {MapMediaListStatus(status)}
                        </Text>
                        <Center ml={4}>
                          {loading ? (
                            <Spinner />
                          ) : (
                            <Text>
                              {listsWTotal?.lists.find(
                                (l) => l.name === MapMediaListStatus(status)
                              )?.total || 0}
                            </Text>
                          )}
                        </Center>
                      </Flex>
                    </Button>
                  ))}
                </VStack>
              </Box>
            </Flex>
          </GridItem>
          <GridItem colSpan={4}>
            <Flex>
              <Wrap pt={4} pb={2}>
                {genres.map((genre) => (
                  <WrapItem key={genre}>
                    <HStack spacing={4}>
                      <Tag
                        size="md"
                        borderRadius="xl"
                        variant="solid"
                        colorScheme="green"
                      >
                        <TagLabel>{genre}</TagLabel>
                        <TagCloseButton
                          onClick={() => {
                            setGenres(genres.filter((g) => g !== genre));
                          }}
                        />
                      </Tag>
                    </HStack>
                  </WrapItem>
                ))}
              </Wrap>
            </Flex>
            <Flex>
              {loading && !filteredLists?.lists ? (
                <Spinner />
              ) : (
                <Box>
                  {Object.values(MediaListStatus).map((status) => (
                    <Box
                      key={status}
                      hidden={
                        filteredLists?.lists?.find(
                          (l) => l?.name === MapMediaListStatus(status)
                        )?.entries?.length
                          ? false
                          : true
                      }
                    >
                      <Heading as="h4" size="lg" pb={4}>
                        {MapMediaListStatus(status)}
                      </Heading>
                      <SimpleGrid columns={5} padding={2} spacing={5}>
                        {filteredLists?.lists
                          ?.find((l) => l?.name === MapMediaListStatus(status))
                          ?.entries?.map((anime) => (
                            <AnimePosterFromList
                              key={anime?.id}
                              anime={anime}
                            />
                          ))}
                      </SimpleGrid>
                    </Box>
                  ))}
                </Box>
              )}
            </Flex>
          </GridItem>
          <GridItem colSpan={1}>
            <Flex pt={6}>
              <VStack>
                <SelectFormat
                  _onSelect={(format: string) => {
                    if (format === "Any") {
                      setSearchFormat(undefined);
                    } else {
                      setSearchFormat(
                        Object.values(MediaFormat).find((f) => f === format)
                      );
                    }
                  }}
                />
                <SelectStatus
                  _placeholder="Any"
                  _onSelectStatus={(
                    _status: MediaListStatus | null | undefined
                  ) => setStatus(_status)}
                />
                <SelectGenres
                  genresOnly
                  _onSelectGenre={(genre: string) => {
                    if (genre === "Any") {
                      setGenres([]);
                    } else if (genre in genres) {
                      setGenres(genres.filter((g) => g !== genre));
                    } else {
                      setGenres([...genres, genre]);
                    }
                  }}
                  _onSelectTag={() => {}}
                />
                <SelectCountry
                  _onSelectCountry={(country) => setCountry(country)}
                />
                <SelectYear _onSelect={(year) => setSearchYear(year)} />
                {/* {
                  sort by?
                } */}
              </VStack>
            </Flex>
          </GridItem>
        </Grid>
      )}
    </Box>
  );
};
