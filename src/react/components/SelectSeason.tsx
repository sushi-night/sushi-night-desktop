import { Box, Heading } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import React from "react";
import { MediaSeason } from "../generated/graphql";
import { mapEnums } from "../util";

interface ISelectSeason {
  _onSelect: (season: string) => void;
}

const seasons = Object.keys(MediaSeason);

export const SelectSeason: React.FC<ISelectSeason> = ({ _onSelect }) => {
  return (
    <Box w={40}>
      <Heading as="h4" size="sm" pb={2}>
        Season
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
        {seasons.map((season) => (
          <option key={season} value={season}>
            {mapEnums(season)}
          </option>
        ))}
      </Select>
    </Box>
  );
};
