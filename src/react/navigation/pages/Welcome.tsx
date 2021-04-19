import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import React from "react";
import { appLogo, authenticationURL } from "../../util/Constants";
import { GoMarkGithub } from "react-icons/go";
import Icon from "@chakra-ui/icon";
import { Button } from "@chakra-ui/button";
import { useServerStore, useWelcomeStore } from "../../zustand";

export const Welcome: React.FC = () => {
  const { setWelcome } = useWelcomeStore();
  const { server } = useServerStore();

  return (
    <Flex flexDirection="column" height="100%" bgColor="black">
      <Flex alignSelf="center" position="relative" marginTop={4}>
        <Image src={appLogo} height="xs" rounded="full" border="2px" />
        <Button
          _hover={null}
          alignSelf="flex-end"
          position="absolute"
          right={6}
          bottom={6}
          variant="ghost"
        >
          <Image
            src="https://avatars.githubusercontent.com/u/29718978?s=460&u=3fd4f3b9037124ffd108bf32725d877ba7e9f07c&v=4"
            rounded="full"
            boxSize={12}
          />
          <Icon
            as={GoMarkGithub}
            position="absolute"
            right={3}
            bottom={0}
            color="white"
            bgColor="black"
            rounded="full"
          />
        </Button>
      </Flex>
      <Box alignSelf="center" marginTop={5}>
        <Text color="darkcyan">
          Watch anime and keep your list up to date ad-free.
        </Text>
      </Box>
      <Flex alignSelf="center" marginTop={5} flexDirection="column">
        <Button
          isLoading={server == "loading"}
          colorScheme="teal"
          onClick={() => {
            window.open(authenticationURL);
            setWelcome(true); //fire this only after succesfully logging in.
          }}
        >
          Login with Anilist
        </Button>
        <Button
          isLoading={server == "loading"}
          colorScheme="teal"
          marginTop={2}
          variant="link"
          onClick={() => {
            setWelcome(true);
          }}
        >
          Continue without an account
        </Button>
      </Flex>
    </Flex>
  );
};
