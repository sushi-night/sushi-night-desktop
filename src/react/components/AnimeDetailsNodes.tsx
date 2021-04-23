import React from "react";
import {
  chakra,
  Box,
  Image,
  Flex,
  Heading,
  Text,
  Spacer,
  Tooltip,
} from "@chakra-ui/react";
import {
  MediaEdge,
  Media,
  MediaTitle,
  MediaCoverImage,
  CharacterEdge,
  Character,
  CharacterImage,
  CharacterName,
  Staff,
  StaffImage,
  StaffName,
  StaffEdge,
  Maybe,
} from "../generated/graphql";
import { mapEnums } from "../util/util";
import { textColor } from "../../Constants";
import { useHistory } from "react-router";
import { useAnimeState } from "../zustand";

interface AnimeRelationProps {
  anime: Maybe<
    { __typename?: "MediaEdge" } & Pick<MediaEdge, "id" | "relationType"> & {
        node?: Maybe<
          { __typename?: "Media" } & Pick<
            Media,
            "id" | "format" | "type" | "status" | "bannerImage"
          > & {
              title?: Maybe<
                { __typename?: "MediaTitle" } & Pick<
                  MediaTitle,
                  "userPreferred"
                >
              >;
              coverImage?: Maybe<
                { __typename?: "MediaCoverImage" } & Pick<
                  MediaCoverImage,
                  "large"
                >
              >;
            }
        >;
      }
  >;
}

interface AnimeCharacterProps {
  character: Maybe<
    { __typename?: "CharacterEdge" } & Pick<
      CharacterEdge,
      "id" | "role" | "name"
    > & {
        voiceActors?: Maybe<
          Array<
            Maybe<
              { __typename?: "Staff" } & Pick<Staff, "id"> & {
                  language: Staff["languageV2"];
                } & {
                  name?: Maybe<
                    { __typename?: "StaffName" } & Pick<StaffName, "full">
                  >;
                  image?: Maybe<
                    { __typename?: "StaffImage" } & Pick<StaffImage, "large">
                  >;
                }
            >
          >
        >;
        node?: Maybe<
          { __typename?: "Character" } & Pick<Character, "id"> & {
              name?: Maybe<
                { __typename?: "CharacterName" } & Pick<CharacterName, "full">
              >;
              image?: Maybe<
                { __typename?: "CharacterImage" } & Pick<
                  CharacterImage,
                  "large"
                >
              >;
            }
        >;
      }
  >;
}

interface AnimeStaffProps {
  staffMember: Maybe<
    { __typename?: "StaffEdge" } & Pick<StaffEdge, "id" | "role"> & {
        node?: Maybe<
          { __typename?: "Staff" } & Pick<Staff, "id"> & {
              language: Staff["languageV2"];
            } & {
              name?: Maybe<
                { __typename?: "StaffName" } & Pick<StaffName, "full">
              >;
              image?: Maybe<
                { __typename?: "StaffImage" } & Pick<StaffImage, "large">
              >;
            }
        >;
      }
  >;
}

export const AnimeRelation: React.FC<AnimeRelationProps> = ({ anime }) => {
  const { setAnimeId } = useAnimeState();
  const { push } = useHistory();

  return (
    <Flex
      p={1}
      cursor="pointer"
      onClick={() => {
        setAnimeId(anime!.node!.id);
        push("/w/animeDetails");
      }}
    >
      <Tooltip placement="bottom" label={anime?.node?.title?.userPreferred}>
        <Box bg="blackAlpha.600" shadow="lg" rounded="sm" overflow="hidden">
          <Box>
            <Image
              w="xs"
              h={32}
              fit="cover"
              src={anime?.node?.coverImage?.large || undefined}
              alt="avatar"
            />

            <chakra.span fontSize="sm" color={textColor}>
              {mapEnums(anime?.relationType?.toString())}
            </chakra.span>
          </Box>
        </Box>
      </Tooltip>
    </Flex>
  );
};

export const AnimeCharacter: React.FC<AnimeCharacterProps> = ({
  character,
}) => {
  return (
    <Flex w="80" bgColor="blackAlpha.600" p={2}>
      <Box w="full">
        <Flex>
          <Box>
            <Image
              boxSize={16}
              w={12}
              src={character?.node?.image?.large || ""}
            />
          </Box>
          <Spacer />
          <Box w="full">
            <Flex w="full">
              <Heading color={textColor} as="h4" size="xs" pl={1}>
                {character?.node?.name?.full}
              </Heading>
              <Spacer />

              <Heading color={textColor} as="h4" size="xs" pr={1}>
                {character?.voiceActors
                  ? character?.voiceActors[0]?.name?.full
                  : "?"}
              </Heading>
            </Flex>
            <Flex mt={6}>
              <Text color={textColor} size="xs" pl={1}>
                {character?.role ? mapEnums(character?.role) : "?"}
              </Text>
              <Spacer />
              <Text color={textColor} size="xs" pr={1}>
                {character?.voiceActors
                  ? character?.voiceActors[0]?.language
                  : "?"}
              </Text>
            </Flex>
          </Box>
          <Spacer />
          <Box>
            <Image
              boxSize={16}
              w={12}
              src={
                character?.voiceActors
                  ? character?.voiceActors[0]?.image?.large || ""
                  : ""
              }
            />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export const AnimeStaff: React.FC<AnimeStaffProps> = ({ staffMember }) => {
  return (
    <Flex w="80" h="20" bgColor="blackAlpha.600" p={2}>
      <Box w="full" h="full">
        <Flex>
          <Box>
            <Image
              boxSize={16}
              w={12}
              src={staffMember?.node?.image?.large || ""}
            />
          </Box>
          <Spacer />
          <Box w="full">
            <Flex w="full" flexDirection="column" textAlign="left">
              <Heading color={textColor} as="h4" size="xs" pl={1}>
                {staffMember?.node?.name?.full}
              </Heading>
              <Text mt={6} color={textColor} size="xs" pl={1}>
                {staffMember?.role ? mapEnums(staffMember?.role) : "?"}
              </Text>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};
