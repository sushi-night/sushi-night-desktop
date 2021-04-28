import { Box, Flex, HStack, Text } from "@chakra-ui/layout";
import React from "react";
import { Maybe, ScoreDistribution } from "../generated/graphql";

interface ScoreDistributionProps {
  scoreDistribution:
    | Maybe<
        Maybe<
          {
            __typename?: "ScoreDistribution" | undefined;
          } & Pick<ScoreDistribution, "score" | "amount">
        >[]
      >
    | undefined;
}

export const ScoreD: React.FC<ScoreDistributionProps> = ({
  scoreDistribution,
}) => {
  return (
    <HStack>
      {scoresPercentages(scoreDistribution).map(
        ({ score, percentage, ammount }) => (
          <Flex key={score} h="36" flexDirection="column" justify="end">
            <Text>{ammount}</Text>
            <Box
              alignSelf="center"
              w={4}
              rounded="full"
              h={`${percentage}%`}
              minH={0.5}
              bgColor={getColor(score)}
            />
            <Text>{score}</Text>
          </Flex>
        )
      )}
    </HStack>
  );
};

export const scoresPercentages = (
  scores: ScoreDistributionProps["scoreDistribution"]
): {
  score: number;
  percentage: number;
  ammount: number;
}[] => {
  let total: number = 0;
  let results: {
    score: number;
    percentage: number;
    ammount: number;
  }[] = [];

  scores?.forEach((s) => {
    if (s?.amount) total += s.amount;
  });
  scores?.forEach((s) => {
    if (s?.score && s.amount)
      results.push({
        score: s.score,
        percentage: (s.amount * 100) / total,
        ammount: s.amount,
      });
  });

  return results;
};

const getColor = (score: number): string => {
  switch (score) {
    case 10:
      return "#FF0000";
    case 20:
      return "#E41C00";
    case 30:
      return "#C83900";
    case 40:
      return "#AD5500";
    case 50:
      return "#917100";
    case 60:
      return "#768E00";
    case 70:
      return "#5AAA00";
    case 80:
      return "#3FC600";
    case 90:
      return "#23E300";
    case 100:
      return "#08FF00";
    default:
      return "";
  }
};
