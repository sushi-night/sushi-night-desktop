import { Box, Heading } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import React from "react";
import { epsToRender, getCurrentYear } from "../util";

interface ISelectYear {
  _onSelect: (year: string) => void;
}

export const SelectYear: React.FC<ISelectYear> = ({ _onSelect }) => {
  const years = epsToRender(1940, getCurrentYear() + 1).reverse();

  return (
    <Box w={40}>
      <Heading as="h4" size="sm" pb={2}>
        Year
      </Heading>
      <Select
        placeholder="Any"
        onChange={(e) => {
          if (!e.target.value) {
            _onSelect("Any");
          } else {
            _onSelect(e.target.value);
          }
        }}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Select>
    </Box>
  );
};
