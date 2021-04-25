import { Box, Flex, Stack, Text, Wrap, WrapItem } from "@chakra-ui/layout";
import React from "react";
import {
  Maybe,
  MediaListStatus,
  StatusDistribution,
} from "../generated/graphql";
import { MapMediaListStatus } from "../util/util";

interface StatusDistributionProps {
  statusDistribution:
    | Maybe<
        Maybe<
          {
            __typename?: "StatusDistribution" | undefined;
          } & Pick<StatusDistribution, "status" | "amount">
        >[]
      >
    | undefined;
  released: boolean;
}

export const StatusD: React.FC<StatusDistributionProps> = ({
  statusDistribution,
  released,
}) => {
  return (
    <Box pr={4}>
      <Stack>
        <Wrap spacing={5} justify="space-around">
          {statusDistribution?.map((status) => {
            return status?.status ? (
              status.status !== MediaListStatus.Completed ||
              (status.status === MediaListStatus.Completed && released) ? (
                <WrapItem key={status?.status}>
                  <Flex flexDirection="column">
                    <Box
                      px={2}
                      py={1}
                      cursor="text"
                      rounded="md"
                      bgColor={getColor(status.status)}
                    >
                      {MapMediaListStatus(status.status)}
                    </Box>
                    <Text color={getColor(status.status)}>
                      {status.amount} Users
                    </Text>
                  </Flex>
                </WrapItem>
              ) : null
            ) : null;
          })}
        </Wrap>
        <Box>
          <Flex mt={1}>
            {statusPercentages(statusDistribution).map(
              ({ status, percentage }) => (
                <Box
                  key={status}
                  bgColor={getColor(status)}
                  h={1}
                  w={`${percentage}%`}
                />
              )
            )}
          </Flex>
        </Box>
      </Stack>
    </Box>
  );
};

export const statusPercentages = (
  status: StatusDistributionProps["statusDistribution"]
): { status: Maybe<MediaListStatus> | undefined; percentage: number }[] => {
  let total: number = 0;
  let results: {
    status: Maybe<MediaListStatus> | undefined;
    percentage: number;
  }[] = [];

  status?.forEach((s) => {
    if (s?.amount) total += s.amount;
  });
  status?.forEach((s) => {
    if (s?.amount)
      results.push({ status: s.status, percentage: (s.amount * 100) / total });
  });

  return results;
};

const getColor = (status: Maybe<MediaListStatus> | undefined): string => {
  switch (status) {
    case MediaListStatus.Current:
      return "rgb(104, 214, 57)";
    case MediaListStatus.Planning:
      return "rgb(2, 169, 255)";
    case MediaListStatus.Paused:
      return "rgb(146, 86, 243)";
    case MediaListStatus.Dropped:
      return "rgb(247, 121, 164)";
    case MediaListStatus.Completed:
      return "#f779e4";
    default:
      return "";
  }
};
