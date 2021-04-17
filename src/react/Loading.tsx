import React from "react";
import {
  ChakraProvider,
  Flex,
  Heading,
  Spinner,
  Image,
  Center,
  Box,
} from "@chakra-ui/react";
import { serverStarting } from "./util/Constants";

export const Loading: React.FC = () => {
  return (
    <ChakraProvider>
      <Center>
        <Heading>Please wait while we connect you to the anime world.</Heading>
      </Center>
      <Flex mt={2} wrap="wrap" boxSize="full" width="100%">
        <Image src={serverStarting} objectFit="cover" width="full" />
      </Flex>
    </ChakraProvider>
  );
};
