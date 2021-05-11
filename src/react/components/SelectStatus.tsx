import { Heading } from "@chakra-ui/layout";
import { Box, Select } from "@chakra-ui/react";
import React from "react";
import { MediaListStatus } from "../generated/graphql";
import { MapMediaListStatus } from "../util/util";

interface ISelectStatus {
  _onSelectStatus: (status: MediaListStatus | null | undefined) => void;
  _default?:
    | {
        value: MediaListStatus | null | undefined;
        label: string;
      }
    | null
    | undefined;
  _placeholder?: string;
}

const statusesOptions = [
  {
    value: MediaListStatus.Current,
    label: MapMediaListStatus(MediaListStatus.Current),
  },
  {
    value: MediaListStatus.Planning,
    label: MapMediaListStatus(MediaListStatus.Planning),
  },
  {
    value: MediaListStatus.Completed,
    label: MapMediaListStatus(MediaListStatus.Completed),
  },
  {
    value: MediaListStatus.Repeating,
    label: MapMediaListStatus(MediaListStatus.Repeating),
  },
  {
    value: MediaListStatus.Paused,
    label: MapMediaListStatus(MediaListStatus.Paused),
  },
  {
    value: MediaListStatus.Dropped,
    label: MapMediaListStatus(MediaListStatus.Dropped),
  },
];
export const SelectStatus: React.FC<ISelectStatus> = ({
  _onSelectStatus,
  _default,
  _placeholder,
}) => (
  <Box w={40}>
    <Heading as="h4" size="sm" pb={2}>
      Status
    </Heading>
    <Select
      defaultValue={_default?.value || undefined}
      placeholder={_placeholder}
      onChange={(e) =>
        _onSelectStatus(e.target.value as MediaListStatus | null | undefined)
      }
    >
      {statusesOptions.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </Select>
  </Box>
);
