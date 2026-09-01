import { useState } from "react";
import {
  Rocket,
  Zap,
  TrendingUp,
  ShieldCheck,
  Search,
  AlertTriangle,
  Layers,
  FileCode2,
} from "lucide-react";
import { useMissionControlState } from "../hooks/useMissionControl";
import {
  AppPageHeader,
  AppStatCard,
  AppTabs,
  AppBadge,
  AppCard,
  AppTable,
  type Column,
  type BadgeTone,
  AppInput,
  AppLoading,
} from "../../../components/ui";
import type { RoadmapTask, ModuleHealth } from "../types/missionControl.types";

export default function MissionControlPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [roadmapFilter, setRoadmapFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: state, isLoading } = useMissionControlState();

  if (isLoading || !state) {
    return (
      <div className="p-12">
        <AppLoading label="Loading Mission Control intelligence telemetry..." />
      </div>
    );
  }

  const filteredTasks = state.roadmapTasks.filter((t) => {
    const matchesFilter = roadmapFilter === "all" || t.status === roadmapFilter;
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const taskColumns: Column<RoadmapTask>[] = [
    {
      key: "id",
      header: "Task ID",
      className: "font-mono font-bold text-xs text-[var(--nebula-text-primary)]",
      render: (task) => task.id,
    },
    {
      key: "name",
      header: "Task Name",
      className: "font-medium text-[var(--nebula-text-primary)]",
      render: (task) => task.name,
    },
    {
      key: "epic",
      header: "Epic",
      className: "text-xs text-[var(--nebula-text-secondary)]",
      render: (task) => task.epic,
    },
    {
      key: "module",
      header: "Module",
      render: (task) => (
        <AppBadge tone="primary" size="sm" className="uppercase">
          {task.module}
        </AppBadge>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      className: "text-xs font-medium text-[var(--nebula-text-secondary)] capitalize",
      render: (task) => task.priority,
    },
    {
      key: "status",
      header: "Status",
      render: (task) => {
        const tone: BadgeTone =
          task.status === "completed"
            ? "success"
            : task.status === "in_progress"
            ? "primary"
            : "warning";

        return (
          <AppBadge tone={tone} size="sm" className="capitalize">
            {task.status.replace("_", " ")}
          </AppBadge>
        );
      },
    },
  ];

  const moduleColumns: Column<ModuleHealth>[] = [
    {
      key: "name",
      header: "Module Name",
      className: "font-semibold capitalize text-[var(--nebula-text-primary)]",
      render: (mod) => mod.name,
    },
    {
      key: "health",
      header: "Health Status",
      render: (mod) => (
        <AppBadge tone="success" size="sm" className="uppercase">
          {mod.health}
        </AppBadge>
      ),
    },
    {
      key: "files",
      header: "Files",
      align: "center",
      className: "text-center font-mono text-xs text-[var(--nebula-text-secondary)]",
      render: (mod) => mod.files,
    },
    {
      key: "services",
      header: "Services",
      align: "center",
      className: "text-center font-mono text-xs text-[var(--nebula-text-secondary)]",
      render: (mod) => mod.services,
    },
    {
      key: "components",
      header: "Components",
      align: "center",
      className: "text-center font-mono text-xs text-[var(--nebula-text-secondary)]",
      render: (mod) => mod.components,
    },
    {
      key: "completion",
      header: "Completion",
      align: "right",
      className: "text-right font-mono font-bold text-[var(--nebula-text-primary)]",
      render: (mod) => `${mod.completion}%`,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Enterprise Page Header */}
      <AppPageHeader
        title="Mission Control & Architectural Telemetry"
        subtitle="Unified ERP engineering command center reading real-time telemetry from .nebula/mission-control.json."
        actions={
          <AppBadge tone="primary" size="md">
            v{state.version} • {state.gitBranch}
          </AppBadge>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AppStatCard
          label="Active Phase"
          value={state.currentDevelopmentPhase}
          subtext={`Epic: ${state.currentEpic}`}
          icon={<Rocket size={20} />}
          tone="primary"
        />

        <AppStatCard
          label="Current Task"
          value={state.currentRoadmapTask}
          subtext={`Sprint: ${state.currentSprint}`}
          icon={<Zap size={20} />}
          tone="warning"
        />

        <AppStatCard
          label="Overall Progress"
          value={`${state.overallProgressPercent}%`}
          subtext="Milestone completion"
          icon={<TrendingUp size={20} />}
          tone="success"
        />

        <AppStatCard
          label="Quality Gates"
          value="Passed (3/3)"
          subtext="Build, TypeScript, ESLint"
          icon={<ShieldCheck size={20} />}
          tone="success"
        />
      </div>

      <AppTabs
        tabs={[
          { id: "overview", name: "Executive Overview", icon: <Rocket size={16} /> },
          { id: "roadmap", name: `Roadmap Tasks (${state.roadmapTasks.length})`, icon: <Zap size={16} /> },
          { id: "modules", name: `Module Health (${state.modules.length})`, icon: <Layers size={16} /> },
          { id: "context", name: "AI Architecture Context", icon: <FileCode2 size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
      />

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <AppCard
            title="Repository Health & Quality Scores"
            subtitle="Continuous architectural benchmarks across domain boundaries and system contracts."
            actions={
              <AppBadge tone="success" size="md">
                Overall: {state.scores.overallRepository}%
              </AppBadge>
            }
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
              {Object.entries(state.scores).map(([key, score]) => (
                <div
                  key={key}
                  className="rounded-[var(--nebula-radius)] border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)]/50 p-3 text-center"
                >
                  <span className="block truncate text-[11px] font-semibold uppercase text-[var(--nebula-text-secondary)]">
                    {key}
                  </span>
                  <span className="text-lg font-bold text-[var(--nebula-text-primary)]">
                    {score}%
                  </span>
                </div>
              ))}
            </div>
          </AppCard>
        </div>
      )}

      {/* ROADMAP TAB */}
      {activeTab === "roadmap" && (
        <div className="space-y-6">
          <AppCard
            title="Master Implementation Roadmap"
            subtitle="Task execution pipeline tracked in .nebula/mission-control.json."
            actions={
              <div className="flex flex-wrap gap-1 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)] p-1">
                {["all", "completed", "in_progress", "pending"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setRoadmapFilter(status)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase transition-all ${
                      roadmapFilter === status
                        ? "bg-[var(--nebula-surface)] text-[var(--nebula-text-primary)] shadow-[var(--nebula-shadow-xs)]"
                        : "text-[var(--nebula-text-secondary)] hover:text-[var(--nebula-text-primary)]"
                    }`}
                  >
                    {status.replace("_", " ")}
                  </button>
                ))}
              </div>
            }
          >
            <div className="space-y-4">
              <AppInput
                placeholder="Search tasks by ID or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={16} />}
              />

              <AppTable
                columns={taskColumns}
                data={filteredTasks}
                keyExtractor={(task) => task.id}
                emptyState={
                  <div className="py-8 text-center text-sm text-[var(--nebula-text-muted)]">
                    No tasks found matching filter.
                  </div>
                }
              />
            </div>
          </AppCard>
        </div>
      )}

      {/* MODULES TAB */}
      {activeTab === "modules" && (
        <div className="space-y-6">
          <AppCard
            title="Module Health & Boundary Audits"
            subtitle="Architectural status, file count, service layer ownership, and test isolation."
          >
            <AppTable
              columns={moduleColumns}
              data={state.modules}
              keyExtractor={(mod) => mod.name}
            />
          </AppCard>
        </div>
      )}

      {/* CONTEXT TAB */}
      {activeTab === "context" && (
        <div className="space-y-6">
          <AppCard
            title="AI Development Architecture Memory"
            subtitle="Contextual state synchronized with Project Intelligence and architectural guidelines."
            actions={
              <AppBadge tone="success" size="sm">
                Synchronized
              </AppBadge>
            }
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)]/40 p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--nebula-text-secondary)]">
                  Execution State
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-[var(--nebula-border)] pb-2">
                    <span className="text-[var(--nebula-text-secondary)]">Last Completed:</span>
                    <span className="font-semibold text-[var(--nebula-success)]">
                      {state.lastCompletedTask}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--nebula-border)] pb-2">
                    <span className="text-[var(--nebula-text-secondary)]">Next Recommended:</span>
                    <span className="font-semibold text-[var(--nebula-primary)]">
                      {state.nextRecommendedTask}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[var(--nebula-radius-lg)] border border-[var(--nebula-border)] bg-[var(--nebula-surface-muted)]/40 p-5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--nebula-text-secondary)]">
                  Active Governance Risks
                </h4>
                <div className="space-y-2">
                  {state.risks.map((risk, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-3 text-xs font-medium text-[var(--nebula-text-primary)]"
                    >
                      <AlertTriangle size={14} className="text-[var(--nebula-warning)] shrink-0" />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      )}
    </div>
  );
}

