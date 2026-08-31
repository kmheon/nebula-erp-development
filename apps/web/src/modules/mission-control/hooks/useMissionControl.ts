import { useQuery } from "@tanstack/react-query";
import { missionControlKeys } from "../queries/missionControl.keys";
import { fetchMissionControlState } from "../services/missionControl.service";
import type { MissionControlState } from "../types/missionControl.types";

export function useMissionControlState() {
  return useQuery<MissionControlState>({
    queryKey: missionControlKeys.state(),
    queryFn: fetchMissionControlState,
  });
}
