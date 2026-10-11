import { useState } from "react";
import { LayoutDashboard, Workflow, Clock, History, Sliders, BarChart3 } from "lucide-react";
import { useApproval } from "../hooks/useApproval";
import { ApprovalDashboard } from "../components/ApprovalDashboard";
import { WorkflowBuilder } from "../components/WorkflowBuilder";
import { ApprovalInbox } from "../components/ApprovalInbox";
import { ApprovalHistoryView } from "../components/ApprovalHistoryView";
import { ApprovalRuleManager } from "../components/ApprovalRuleManager";
import { ApprovalAnalytics } from "../components/ApprovalAnalytics";
import { AppPageHeader, AppTabs } from "../../../components/ui";

export default function ApprovalPage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const {
    templates,
    rules,
    requests,
    saveTemplates,
    processAction,
  } = useApproval();

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-8">
      <AppPageHeader
        title="Enterprise Multi-Tier Approvals"
        subtitle="Universal authorization workflow engine governing purchase, sales, accounting, and operational compliance."
      />

      {/* Tab Navigation */}
      <AppTabs
        tabs={[
          { id: "dashboard", name: "Dashboard", icon: <LayoutDashboard size={16} /> },
          { id: "inbox", name: `Inbox (${pendingCount})`, icon: <Clock size={16} /> },
          { id: "builder", name: "Workflow Designer", icon: <Workflow size={16} /> },
          { id: "rules", name: "Rules Matrix", icon: <Sliders size={16} /> },
          { id: "history", name: "Audit Trail", icon: <History size={16} /> },
          { id: "analytics", name: "SLA Analytics", icon: <BarChart3 size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
      />

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
