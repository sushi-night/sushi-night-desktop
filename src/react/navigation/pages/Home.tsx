import { Flex, Heading, Text } from "@chakra-ui/layout";
import React from "react";
import { useMeQuery } from "../../generated/graphql";
import { Spinner } from "@chakra-ui/spinner";

export const Home: React.FC = () => {
  const { data, error, loading } = useMeQuery();

  if (error) {
    return <Text color="red">{error.message}</Text>;
  }
  if (loading) {
    return <Spinner size="xl" />;
  }

  if (data) {
    return <div>{data.Viewer.name}</div>;
  }

  return (
    <Flex>
      <Heading color="black">HOME</Heading>
    </Flex>
  );
};
