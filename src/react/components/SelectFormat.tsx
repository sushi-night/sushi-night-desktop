import { Box, Heading } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import React from "react";
import { MediaFormat } from "../generated/graphql";
import { mapEnums } from "../util/util";

interface ISelectFormat {
  _onSelect: (year: string) => void;
}

const formats = Object.values(MediaFormat).filter(
  (v) => v !== "ONE_SHOT" && v !== "MANGA" && v !== "NOVEL"
); //filter out formats that are for manga.

export const SelectFormat: React.FC<ISelectFormat> = ({ _onSelect }) => {
  return (
    <Box w={40}>
      <Heading as="h4" size="sm" pb={2}>
        Format
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
        {formats.map((format) => (
          <option key={format} value={format.toUpperCase()}>
            {mapEnums(format)}
          </option>
        ))}
      </Select>
    </Box>
  );
};
