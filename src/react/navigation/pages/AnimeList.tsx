import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/layout";
import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { SelectCountry } from "../../components/SelectCountryOfOrigin";
import { SelectFormat } from "../../components/SelectFormat";
import { SelectGenres } from "../../components/SelectGenres";
import { SelectStatus } from "../../components/SelectStatus";
import { SelectYear } from "../../components/SelectYear";
import {
  MediaFormat,
  MediaListStatus,
  MediaType,
  useMediaListCollectionQuery,
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
  const [searchFormat, setSearchFormat] = useState<MediaFormat | undefined>();
  const [searchYear, setSearchYear] = useState<string | undefined>();
  const [status, setStatus] = useState<MediaListStatus | null | undefined>();
  const [genres, setGenres] = useState<string[]>([]);
  const [country, setCountry] = useState<string | undefined>();
  const [listsWTotal, setListsWTotal] = useState<MediaListCollectionTotal>();

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
      }
    }

    return () => {
      isMounted = false;
    };
  }, [data]);

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
            <Flex>selected genres</Flex>
            <Flex>results</Flex>
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
                  ) => setStatus(undefined)}
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
