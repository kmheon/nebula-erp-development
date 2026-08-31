import { useState } from "react";
import { LayoutDashboard, Workflow, Clock, History, Sliders, BarChart3 } from "lucide-react";
import { useApproval } from "../hooks/useApproval";
import { ApprovalDashboard } from "../components/ApprovalDashboard";
import { WorkflowBuilder } from "../components/WorkflowBuilder";
import { ApprovalInbox } from "../components/ApprovalInbox";
import { ApprovalHistoryView } from "../components/ApprovalHistoryView";
import { ApprovalRuleManager } from "../components/ApprovalRuleManager";
import { ApprovalAnalytics } from "../components/ApprovalAnalytics";

export default function ApprovalPage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const {
    templates,
    rules,
    requests,
    saveTemplates,
    processAction,
  } = useApproval();

  const pendingCount = requests.filter(r => r.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--nebula-border)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
              Enterprise Engine
            </span>
            <span className="text-xs text-[var(--nebula-muted)]">NEB-011 Multi-Tier Governance</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--nebula-text)] mt-1">
            Enterprise Multi-Tier Approvals
          </h1>
          <p className="text-sm text-[var(--nebula-muted)]">
            Universal authorization workflow engine governing purchase, sales, accounting, and operational compliance.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-[var(--nebula-surface)] p-1.5 rounded-xl border border-[var(--nebula-border)] overflow-x-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "inbox", label: `Inbox (${pendingCount})`, icon: Clock },
            { id: "builder", label: "Workflow Designer", icon: Workflow },
            { id: "rules", label: "Rules", icon: Sliders },
            { id: "history", label: "Audit History", icon: History },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-[var(--nebula-text)] hover:bg-[var(--nebula-surface-hover)]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div>
        {activeTab === "dashboard" && (
          <ApprovalDashboard
            requests={requests}
            templates={templates}
            onNavigateTab={setActiveTab}
          />
        )}
        {activeTab === "inbox" && (
          <ApprovalInbox
            requests={requests}
            onProcessAction={processAction}
          />
        )}
        {activeTab === "builder" && (
          <WorkflowBuilder
            templates={templates}
            onSaveTemplates={saveTemplates}
          />
        )}
        {activeTab === "rules" && (
          <ApprovalRuleManager
            rules={rules}
          />
        )}
        {activeTab === "history" && (
          <ApprovalHistoryView
            requests={requests}
          />
        )}
        {activeTab === "analytics" && (
          <ApprovalAnalytics
            requests={requests}
          />
        )}
      </div>
    </div>
  );
}
