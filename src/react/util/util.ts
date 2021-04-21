import { MediaListStatus } from "../generated/graphql";

export const MapMediaListStatus = (
  status?: MediaListStatus
): string | undefined => {
  switch (status) {
    case MediaListStatus.Completed: {
      return "Completed";
    }
    case MediaListStatus.Current: {
      return "Watching";
    }
    case MediaListStatus.Dropped: {
      return "Dropped";
    }
    case MediaListStatus.Paused: {
      return "Paused";
    }
    case MediaListStatus.Planning: {
      return "Planning";
    }
    case MediaListStatus.Repeating: {
      return "Repeating";
    }
    default: {
      return status;
    }
  }
};
