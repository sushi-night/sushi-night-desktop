import { Heading } from "@chakra-ui/layout";
import { Box, Select } from "@chakra-ui/react";
import React from "react";

interface ISelectCountry {
  _onSelectCountry: (country: string | undefined) => void;
}

export const SelectCountry: React.FC<ISelectCountry> = ({
  _onSelectCountry,
}) => (
  <Box w={40}>
    <Heading as="h4" size="sm" pb={2}>
      Country
    </Heading>
    <Select
      placeholder="Any"
      onChange={(e) => _onSelectCountry(e.target.value)}
    >
      <option value="JP">Japan</option>
      <option value="KR">South Korea</option>
      <option value="CN">China</option>
    </Select>
  </Box>
);
