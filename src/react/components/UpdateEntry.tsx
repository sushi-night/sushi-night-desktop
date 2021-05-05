import { Button } from "@chakra-ui/button";
import {
  Box,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/layout";
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/select";
import React, { useState } from "react";
import {
  FuzzyDate,
  Maybe,
  MediaList,
  MediaListStatus,
  useDeleteMediaListEntryMutation,
  useSaveMediaListEntryMutation,
} from "../generated/graphql";
import { getUserScores, MapMediaListStatus, options } from "../util/util";
import { useAnimeState } from "../zustand";
import { DatePicker } from "./DatePicker";

interface IUpdateEntryProps {
  entry?: Maybe<
    { __typename?: "MediaList" } & Pick<
      MediaList,
      "id" | "status" | "score" | "progress" | "repeat" | "notes"
    > & {
        startedAt?: Maybe<
          { __typename?: "FuzzyDate" } & Pick<
            FuzzyDate,
            "year" | "month" | "day"
          >
        >;
        completedAt?: Maybe<
          { __typename?: "FuzzyDate" } & Pick<
            FuzzyDate,
            "year" | "month" | "day"
          >
        >;
      }
  >;
  maxEpisodes: number;
  _onDelete: () => void;
}

export const UpdateEntry: React.FC<IUpdateEntryProps> = ({
  entry,
  maxEpisodes,
  _onDelete,
}) => {
  const { animeId } = useAnimeState();
  const saveEntry = useSaveMediaListEntryMutation();
  const deleteEntry = useDeleteMediaListEntryMutation();
  const [status, setStatus] = useState(entry?.status);
  const [score, setScore] = useState(entry?.score);
  const [progress, setProgress] = useState(entry?.progress);
  const [startedAt, setStartedAt] = useState(entry?.startedAt);
  const [completedAt, setCompletedAt] = useState(entry?.completedAt);
  const [notes, setNotes] = useState(entry?.notes);
  const [repeat, setRepeat] = useState(entry?.repeat);
  const [err, setError] = useState<string | null>(null);

  return (
    <Box>
      <SimpleGrid rows={4} spacingY={4}>
        <Flex>{err ? <Text color="red">{err.toString()}</Text> : null}</Flex>
        <Flex>
          <SelectStatus
            _onSelectStatus={(_status: MediaListStatus | null | undefined) =>
              setStatus(_status)
            }
            _default={{
              value: entry?.status,
              label: MapMediaListStatus(
                entry?.status as MediaListStatus | undefined
              ),
            }}
          />
          <Spacer />
          <SelectScore
            _default={entry?.score}
            _onSelectScore={(_score: Maybe<number> | undefined) => {
              setScore(_score);
            }}
          />
          <Spacer />
          <SelectProgress
            _default={entry?.progress}
            _onSelectProgress={(_progress: Maybe<number> | undefined) => {
              setProgress(_progress);
            }}
            _maxProgress={maxEpisodes}
          />
          <Spacer />
        </Flex>
        <Flex w="lg">
          <SelectDate
            _default={entry?.startedAt}
            _onSelectDate={(_date) => {
              setStartedAt(_date);
            }}
            _title="Started At"
          />
          <Spacer />
          <SelectDate
            _default={entry?.completedAt}
            _onSelectDate={(_date) => {
              setCompletedAt(_date);
            }}
            _title="Completed At"
          />
          <Spacer />
          <Repeats
            totalRepeats={entry?.repeat}
            _onSelectRepeat={(value: number) => setRepeat(value)}
          />
        </Flex>
        <Box w="lg">
          <Heading as="h4" size="sm" pb={2}>
            Notes
          </Heading>
          <Textarea
            value={notes || undefined}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Box>
        <HStack pt={4} align="flex-end" justify="flex-end" w="lg">
          <Button
            colorScheme="red"
            isLoading={saveEntry[1].loading || deleteEntry[1].loading}
            onClick={async () => {
              try {
                await deleteEntry[0]({ variables: { id: entry?.id } });
                setError(null);
                _onDelete();
              } catch (err) {
                setError(err);
              }
            }}
            isDisabled={!!!entry?.id}
          >
            Delete
          </Button>
          <Button
            isLoading={saveEntry[1].loading || deleteEntry[1].loading}
            colorScheme="blue"
            onClick={async () => {
              try {
                const result = await saveEntry[0]({
                  variables: {
                    id: entry?.id ? entry?.id : undefined,
                    mediaId: animeId,
                    status: status ? status : undefined,
                    completedAt: completedAt?.day ? completedAt : undefined,
                    startedAt: startedAt?.day ? startedAt : undefined,
                    progress: progress ? progress : undefined,
                    score: score ? score : undefined,
                    repeat: repeat ? repeat : undefined,
                    notes: notes ? notes : undefined,
                  },
                });
                if (entry && result.data?.SaveMediaListEntry?.id) {
                  entry.id = result.data?.SaveMediaListEntry?.id;
                }
                setError(null);
              } catch (err) {
                setError(err);
              }
            }}
          >
            Save
          </Button>
        </HStack>
      </SimpleGrid>
    </Box>
  );
};

interface ISelectStatus {
  _onSelectStatus: (status: MediaListStatus | null | undefined) => void;
  _default: {
    value: MediaListStatus | null | undefined;
    label: string;
  };
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
}) => (
  <Box w={40}>
    <Heading as="h4" size="sm" pb={2}>
      Status
    </Heading>
    <Select
      defaultValue={_default.value || undefined}
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

interface ISelectScore {
  _onSelectScore: (score: Maybe<number> | undefined) => void;
  _default: Maybe<number> | undefined;
}

export const SelectScore: React.FC<ISelectScore> = ({
  _onSelectScore,
  _default,
}) => (
  <Box w={40}>
    <Heading as="h4" size="sm" pb={2}>
      Score
    </Heading>
    <Select
      defaultValue={_default || 0}
      onChange={(e) =>
        _onSelectScore((e.target.value as unknown) as Maybe<number> | undefined)
      }
    >
      {getUserScores().map((score) => (
        <option key={score.value} value={score.value}>
          {score.label}
        </option>
      ))}
    </Select>
  </Box>
);

interface ISelectProgress {
  _onSelectProgress: (progress: Maybe<number> | undefined) => void;
  _default: Maybe<number> | undefined;
  _maxProgress: Maybe<number> | undefined;
}

export const SelectProgress: React.FC<ISelectProgress> = ({
  _onSelectProgress,
  _default,
  _maxProgress,
}) => (
  <Box w={40}>
    <Heading as="h4" size="sm" pb={2}>
      Progress
    </Heading>
    <Select
      defaultValue={_default || 0}
      onChange={(e) =>
        _onSelectProgress(
          (e.target.value as unknown) as Maybe<number> | undefined
        )
      }
    >
      {options(0, _maxProgress as number, 1).map((score) => (
        <option key={score.value} value={score.value}>
          {score.label}
        </option>
      ))}
    </Select>
  </Box>
);

type _date =
  | Maybe<
      {
        __typename?: "FuzzyDate" | undefined;
      } & Pick<FuzzyDate, "year" | "month" | "day">
    >
  | undefined;

interface ISelectDate {
  _onSelectDate: (date: _date) => void;
  _default: _date;
  _title: string;
}

export const SelectDate: React.FC<ISelectDate> = ({
  _onSelectDate,
  _default,
  _title,
}) => {
  const [startDate, setStartDate] = useState(
    _default?.day
      ? new Date(_default.year!, _default.month!, _default.day!)
      : undefined
  );

  return (
    <Box w={40}>
      <Heading as="h4" size="sm" pb={2}>
        {_title}
      </Heading>
      <DatePicker
        value={startDate}
        onChange={(date: Date | null) => {
          setStartDate(date as Date);
          date &&
            _onSelectDate({
              day: date.getDay(),
              month: date.getMonth(),
              year: date.getFullYear(),
            });
        }}
      />
    </Box>
  );
};

interface IRepeatsProps {
  totalRepeats: Maybe<number> | undefined;
  _onSelectRepeat: (value: number) => void;
}

export const Repeats: React.FC<IRepeatsProps> = ({
  totalRepeats,
  _onSelectRepeat,
}) => {
  return (
    <Box w={40}>
      <Heading as="h4" size="sm" pb={2}>
        Total Rewatches
      </Heading>
      <NumberInput
        defaultValue={totalRepeats || 0}
        min={0}
        max={99}
        onChange={(value) => _onSelectRepeat(parseInt(value))}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Box>
  );
};
