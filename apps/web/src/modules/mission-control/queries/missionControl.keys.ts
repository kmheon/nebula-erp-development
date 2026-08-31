export const missionControlKeys = {
  all: ["mission-control"] as const,
  state: () => [...missionControlKeys.all, "state"] as const,
};
