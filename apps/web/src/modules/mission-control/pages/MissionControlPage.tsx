import { useState } from "react";
import { useMissionControlState } from "../hooks/useMissionControl";

export default function MissionControlPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "roadmap" | "modules" | "context">("overview");
  const [roadmapFilter, setRoadmapFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: state, isLoading } = useMissionControlState();

  if (isLoading || !state) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading Mission Control state from Project Intelligence...
      </div>
    );
  }

  const filteredTasks = state.roadmapTasks.filter((t) => {
    const matchesFilter = roadmapFilter === "all" || t.status === roadmapFilter;
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Mission Control
            </h1>
            <span className="text-xs font-mono px-3 py-1 bg-primary/10 text-primary rounded-full font-bold uppercase">
              {state.version}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lightweight development command center reading from <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">.nebula/mission-control.json</code>.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
          {[
            { id: "overview", label: "Overview" },
            { id: "roadmap", label: "Roadmap Tasks" },
            { id: "modules", label: "Module Health" },
            { id: "context", label: "AI Context" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Phase</span>
                <div className="text-base font-bold text-slate-900 truncate max-w-[200px]" title={state.currentDevelopmentPhase}>
                  {state.currentDevelopmentPhase}
                </div>
                <div className="text-xs text-primary font-medium">Epic: {state.currentEpic}</div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                🚀
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Current Task</span>
                <div className="text-base font-bold text-slate-900 truncate max-w-[200px]" title={state.currentRoadmapTask}>
                  {state.currentRoadmapTask}
                </div>
                <div className="text-xs text-amber-600 font-medium">Sprint: {state.currentSprint}</div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold text-xl">
                ⚡
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Overall Progress</span>
                <div className="text-2xl font-black text-emerald-600">{state.overallProgressPercent}%</div>
                <div className="w-28 bg-slate-100 rounded-full h-2 overflow-hidden mt-1">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${state.overallProgressPercent}%` }} />
                </div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold text-xl">
                📈
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Quality Gates</span>
                <div className="flex gap-1.5 pt-1 flex-wrap">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold uppercase">Build</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold uppercase">TS</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold uppercase">Lint</span>
                </div>
                <div className="text-xs text-slate-500">Branch: {state.gitBranch}</div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-xl">
                🛡️
              </div>
            </div>
          </div>

          {/* Health Scores Grid */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Repository Health & Quality Scores</h3>
              <span className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                Overall Score: <strong className="text-emerald-600">{state.scores.overallRepository}%</strong>
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
              {Object.entries(state.scores).map(([key, score]) => (
                <div key={key} className="p-3 bg-slate-50/80 border border-slate-200/60 rounded-xl text-center space-y-1">
                  <span className="text-[11px] uppercase text-slate-500 font-semibold block truncate">{key}</span>
                  <span className="text-lg font-black text-slate-900">{score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ROADMAP TAB */}
      {activeTab === "roadmap" && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Master Implementation Roadmap</h3>
              <p className="text-xs text-slate-500">
                Managed in <code className="bg-slate-100 px-1 py-0.5 rounded">.nebula/mission-control.json</code>.
              </p>
            </div>

            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {["all", "completed", "in_progress", "pending"].map((status) => (
                <button
                  key={status}
                  onClick={() => setRoadmapFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    roadmapFilter === status
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks by ID or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase text-left">
                  <th className="p-4">Task ID</th>
                  <th className="p-4">Task Name</th>
                  <th className="p-4">Epic</th>
                  <th className="p-4">Module</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-mono font-bold text-xs text-slate-900">{task.id}</td>
                    <td className="p-4 font-semibold text-slate-900">{task.name}</td>
                    <td className="p-4 text-slate-500 text-xs">{task.epic}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-bold uppercase">
                        {task.module}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-xs text-slate-700">{task.priority}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${
                          task.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : task.status === "in_progress"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {task.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODULES TAB */}
      {activeTab === "modules" && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Module Health & Completion</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase text-left">
                  <th className="p-4">Module Name</th>
                  <th className="p-4">Health Status</th>
                  <th className="p-4 text-center">Files</th>
                  <th className="p-4 text-center">Services</th>
                  <th className="p-4 text-center">Components</th>
                  <th className="p-4 text-right">Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.modules.map((mod) => (
                  <tr key={mod.name} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-bold text-slate-900 capitalize">{mod.name}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase border bg-emerald-50 text-emerald-700 border-emerald-200">
                        {mod.health}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono text-xs">{mod.files}</td>
                    <td className="p-4 text-center font-mono text-xs">{mod.services}</td>
                    <td className="p-4 text-center font-mono text-xs">{mod.components}</td>
                    <td className="p-4 text-right font-bold text-slate-900">{mod.completion}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CONTEXT TAB */}
      {activeTab === "context" && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">AI Development Context Memory</h3>
              <p className="text-xs text-slate-500">Maintained for developer sessions.</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold uppercase">
              Synchronized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Execution State</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Last Completed:</span>
                  <span className="font-semibold text-emerald-700">{state.lastCompletedTask}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Next Recommended:</span>
                  <span className="font-semibold text-primary">{state.nextRecommendedTask}</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Active Risks</h4>
              <div className="space-y-2">
                {state.risks.map((risk, i) => (
                  <div key={i} className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium">
                    ⚠️ {risk}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
