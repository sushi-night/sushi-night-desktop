import React, { useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Spinner,
  Image,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Modal,
  ModalOverlay,
  ModalContent,
  Input,
  ModalBody,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import { useMeQuery, useSearchQuery } from "../generated/graphql";
import { useAuthStore } from "../zustand";
import { Link as RLink } from "react-router-dom";
import { AiFillSetting, AiOutlineDown, AiOutlineSearch } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import { appLogo } from "../../Constants";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FaUserAlt } from "react-icons/fa";
import { IconType } from "react-icons";
import { AnimePosterFromSearch } from "./AnimePoster";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

interface NavItem {
  label: string;
  to: string;
  icon?: IconType;
  subLabel?: string;
  children?: Array<NavItem>;
}

const NAV_ITEMS: Array<NavItem> = [
  { label: "Home", to: "/w/home" },
  { label: "Profile", to: "/w/profile" },
  { label: "Anime List", to: "/w/animelist" },
  {
    label: "Browse",
    to: "/w/browse",
    children: [
      {
        label: "Top 100",
        to: "/w/browse/:top100",
      },
      {
        label: "Trending",
        to: "/w/browse/:trending",
      },
      {
        label: "Top Movies",
        to: "/w/browse/:movies",
      },
    ],
  },
];

const NavSearch: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const { loading, data, error } = useSearchQuery({
    variables: { search },
    skip: search === "",
  });

  return (
    <Box>
      <IconButton
        onClick={onOpen}
        aria-label="search"
        rounded="full"
        _hover={undefined}
        variant="ghost"
        icon={<AiOutlineSearch size={34} />}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        scrollBehavior="outside"
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent mt={20} pb={2}>
          <ModalBody padding={2}>
            <InputGroup>
              <InputLeftElement
                children={<Icon as={AiOutlineSearch} h={6} w={7} />}
              />
              <Input
                placeholder="One Piece" //replace this with a random anime name?
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </InputGroup>
          </ModalBody>
          {loading ? <Spinner size="md" alignSelf="center" /> : null}
          {!loading && !error ? (
            <Flex>
              <SimpleGrid columns={4} padding={2} spacing={5}>
                {data ? (
                  data.anime?.results?.map((anime) => (
                    <AnimePosterFromSearch
                      key={anime!.id}
                      anime={anime!}
                      _onClick={onClose}
                    />
                  ))
                ) : (
                  <Text>No results</Text>
                )}
              </SimpleGrid>
            </Flex>
          ) : null}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export const Navbar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data, error, loading } = useMeQuery();
  const { authenticated, setAuthenticated } = useAuthStore();

  if (data) {
    if (!authenticated) {
      setAuthenticated(true);
    }
  }

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: !isOpen ? "none" : "inherit" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <Flex alignSelf="center">
                <Image src={appLogo} boxSize={12} rounded="full" />
              </Flex>
              <NavbarItems />
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <NavSearch />
            {error ? <Text color="red">{error.message}</Text> : null}
            {loading ? <Spinner size="xl" /> : null}
            <Popover trigger={"hover"} placement={"bottom-start"}>
              <PopoverTrigger>
                <Flex>
                  {data ? (
                    <Text mr={2} alignSelf="center">
                      {data.Viewer!.name}
                    </Text>
                  ) : null}
                  <Avatar
                    size={"sm"}
                    src={data ? data!.Viewer!.avatar!.large! : ""}
                  />
                  <Box mt={2} ml={1}>
                    <AiOutlineDown />
                  </Box>
                </Flex>
              </PopoverTrigger>
              <PopoverContent
                border={0}
                boxShadow={"xs"}
                p={4}
                rounded={"xl"}
                maxW={"40"}
              >
                <Stack>
                  <SubNav to="/w/profile" label="Profile" icon={FaUserAlt} />
                  <SubNav
                    to="/w/settings"
                    label="Settings"
                    icon={AiFillSetting}
                  />
                  <SubNav to="/logout" label="Logout" icon={FiLogOut} />
                </Stack>
                <Spacer></Spacer>
                <Divider />
                <ColorModeSwitcher />
              </PopoverContent>
            </Popover>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export const NavbarItems: React.FC = () => (
  <Stack direction={"row"} spacing={4}>
    {NAV_ITEMS.map((navItem) => (
      <Box key={navItem.label}>
        <Popover trigger={"hover"} placement={"bottom-start"}>
          <PopoverTrigger>
            <Link
              as={RLink}
              p={2}
              fontSize={"medium"}
              fontWeight={600}
              _hover={{
                textDecoration: "none",
              }}
              to={navItem.to}
            >
              {navItem.label}
            </Link>
          </PopoverTrigger>

          {navItem.children && (
            <PopoverContent
              border={0}
              boxShadow={"xl"}
              p={4}
              rounded={"xl"}
              maxW={"36"}
            >
              <Stack>
                {navItem.children.map((child) => (
                  <SubNav key={child.label} {...child} />
                ))}
              </Stack>
            </PopoverContent>
          )}
        </Popover>
      </Box>
    ))}
  </Stack>
);
const SubNav = ({ label, to, subLabel, icon }: NavItem) => {
  return (
    <Link
      as={RLink}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      to={to}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Flex alignItems="center">
            {icon ? <Icon as={icon} mr={2} /> : null}
            <Text
              transition={"all .3s ease"}
              _groupHover={{ color: "pink.400" }}
              fontWeight={500}
            >
              {label}
            </Text>
            <Text fontSize={"sm"}>{subLabel}</Text>
          </Flex>
        </Box>
      </Stack>
    </Link>
  );
};
