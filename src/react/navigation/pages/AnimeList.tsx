import { Box, Flex } from "@chakra-ui/layout";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useAuthStore } from "../../zustand";

export const AnimeList: React.FC = () => {
  const { authenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchFormat, setSearchFormat] = useState<string | undefined>();
  const [searchYear, setSearchYear] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [genres, setGenres] = useState<string | undefined>();

  return (
    <Box>
      <Flex>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<AiOutlineSearch />}
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </Flex>
      <Flex></Flex>
    </Box>
  );
};
