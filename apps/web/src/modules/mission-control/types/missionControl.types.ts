export interface RoadmapTask {
  id: string;
  name: string;
  status: "completed" | "in_progress" | "pending" | "blocked";
  epic: string;
  module: string;
  priority: "High" | "Med" | "Low";
}

export interface ModuleHealth {
  name: string;
  completion: number;
  health: "excellent" | "good" | "stable" | "warning";
  files: number;
  services: number;
  components: number;
}

export interface ProjectScores {
  architecture: number;
  documentation: number;
  testing: number;
  frontend: number;
  backend: number;
  api: number;
  database: number;
  modules: number;
  overallRepository: number;
}

export interface DocumentItem {
  title: string;
  path: string;
  status: string;
}

export interface MissionControlState {
  projectName: string;
  version: string;
  currentDevelopmentPhase: string;
  currentEpic: string;
  currentRoadmapTask: string;
  lastCompletedTask: string;
  nextRecommendedTask: string;
  currentSprint: string;
  gitBranch: string;
  buildStatus: string;
  typescriptStatus: string;
  eslintStatus: string;
  testStatus: string;
  overallProgressPercent: number;
  roadmapTasks: RoadmapTask[];
  modules: ModuleHealth[];
  scores: ProjectScores;
  risks: string[];
  documentation: DocumentItem[];
}
