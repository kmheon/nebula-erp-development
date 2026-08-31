import React, { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import type { ApprovalWorkflowTemplate, ApprovalLevel, ApprovalModuleType, ApproverType } from "../types/approval.types";

interface WorkflowBuilderProps {
  templates: ApprovalWorkflowTemplate[];
  onSaveTemplates: (templates: ApprovalWorkflowTemplate[]) => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  templates,
  onSaveTemplates,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || "");
  const [editingTemplate, setEditingTemplate] = useState<ApprovalWorkflowTemplate | null>(templates[0] || null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const found = templates.find(t => t.id === id);
    if (found) setEditingTemplate(JSON.parse(JSON.stringify(found)));
  };

  const handleAddLevel = () => {
    if (!editingTemplate) return;
    const nextLevelNum = editingTemplate.levels.length + 1;
    const newLevel: ApprovalLevel = {
      levelNumber: nextLevelNum,
      name: `Level ${nextLevelNum} Review`,
      approverType: "role",
      approverName: "Department Head",
      requiresAll: false,
      canSkip: false,
      timeoutHours: 48,
    };
    setEditingTemplate({
      ...editingTemplate,
      levels: [...editingTemplate.levels, newLevel],
    });
  };

  const handleRemoveLevel = (index: number) => {
    if (!editingTemplate) return;
    const updatedLevels = editingTemplate.levels.filter((_, i) => i !== index).map((lvl, idx) => ({
      ...lvl,
      levelNumber: idx + 1,
    }));
    setEditingTemplate({
      ...editingTemplate,
      levels: updatedLevels,
    });
  };

  const handleSave = () => {
    if (!editingTemplate) return;
    const updated = templates.map(t => t.id === editingTemplate.id ? { ...editingTemplate, updatedAt: new Date().toISOString() } : t);
    onSaveTemplates(updated);
    setSuccessMessage("Workflow template successfully updated!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleCreateNew = () => {
    const newTmpl: ApprovalWorkflowTemplate = {
      id: `wf-${Date.now()}`,
      name: "New Enterprise Workflow",
      description: "Custom multi-tier approval workflow template.",
      module: "purchase",
      documentType: "Purchase Requisition",
      isSequential: true,
      isActive: true,
      levels: [
        {
          levelNumber: 1,
          name: "Manager Approval",
          approverType: "manager",
          approverName: "Line Manager",
          requiresAll: false,
          canSkip: false,
          timeoutHours: 24,
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSaveTemplates([...templates, newTmpl]);
    setSelectedTemplateId(newTmpl.id);
    setEditingTemplate(newTmpl);
  };

  return (
    <div className="space-y-6">
      {/* Header & Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-[var(--nebula-text)]">Workflow Designer & Builder</h2>
          <p className="text-xs text-[var(--nebula-muted)] mt-1">
            Configure multi-tier authorization pipelines, escalation rules, and sequential/parallel gates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTemplateId}
            onChange={(e) => handleSelectTemplate(e.target.value)}
            className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] px-3 py-2 text-sm text-[var(--nebula-text)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.module})</option>
            ))}
          </select>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4" /> New Template
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm font-medium text-emerald-600">
          {successMessage}
        </div>
      )}

      {editingTemplate && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Template Meta */}
          <div className="space-y-6 rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
            <h3 className="text-base font-bold text-[var(--nebula-text)]">Workflow Properties</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-[var(--nebula-muted)] mb-1">Workflow Name</label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="w-full rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] px-3 py-2 text-sm text-[var(--nebula-text)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[var(--nebula-muted)] mb-1">Target Module</label>
                <select
                  value={editingTemplate.module}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, module: e.target.value as ApprovalModuleType })}
                  className="w-full rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] px-3 py-2 text-sm text-[var(--nebula-text)] capitalize"
                >
                  {["purchase", "sales", "accounting", "hr", "inventory", "manufacturing", "crm", "payments", "banking", "settlement"].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[var(--nebula-muted)] mb-1">Document Type</label>
                <input
                  type="text"
                  value={editingTemplate.documentType}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, documentType: e.target.value })}
                  className="w-full rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] px-3 py-2 text-sm text-[var(--nebula-text)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[var(--nebula-muted)] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingTemplate.description}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                  className="w-full rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] px-3 py-2 text-sm text-[var(--nebula-text)] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium text-[var(--nebula-text)]">Execution Mode</span>
                <button
                  type="button"
                  onClick={() => setEditingTemplate({ ...editingTemplate, isSequential: !editingTemplate.isSequential })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    editingTemplate.isSequential ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {editingTemplate.isSequential ? "Sequential (Strict Flow)" : "Parallel (Concurrent)"}
                </button>
              </div>

              <button
                onClick={handleSave}
                className="w-full mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
              >
                <Save className="h-4 w-4" /> Save Workflow Definition
              </button>
            </div>
          </div>

          {/* Right Column: Multi-Tier Approval Pipeline */}
          <div className="lg:col-span-2 space-y-6 rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--nebula-border)] pb-4">
              <div>
                <h3 className="text-base font-bold text-[var(--nebula-text)]">Approval Tier Pipeline</h3>
                <p className="text-xs text-[var(--nebula-muted)]">Define sequential or parallel authorization gates</p>
              </div>
              <button
                onClick={handleAddLevel}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] px-3 py-2 text-xs font-semibold text-[var(--nebula-text)] hover:bg-[var(--nebula-surface-hover)] transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Tier Level
              </button>
            </div>

            <div className="space-y-4">
              {editingTemplate.levels.map((level, index) => (
                <div 
                  key={level.levelNumber}
                  className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] p-4 space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                        L{level.levelNumber}
                      </span>
                      <input
                        type="text"
                        value={level.name}
                        onChange={(e) => {
                          const updatedLevels = [...editingTemplate.levels];
                          updatedLevels[index].name = e.target.value;
                          setEditingTemplate({ ...editingTemplate, levels: updatedLevels });
                        }}
                        className="font-semibold text-[var(--nebula-text)] bg-transparent border-b border-transparent hover:border-[var(--nebula-border)] focus:border-blue-500 focus:outline-none px-1 py-0.5 text-sm"
                      />
                    </div>
                    {editingTemplate.levels.length > 1 && (
                      <button
                        onClick={() => handleRemoveLevel(index)}
                        className="text-rose-500 hover:text-rose-600 p-1"
                        title="Remove Level"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-[var(--nebula-muted)] mb-1">Approver Type</label>
                      <select
                        value={level.approverType}
                        onChange={(e) => {
                          const updatedLevels = [...editingTemplate.levels];
                          updatedLevels[index].approverType = e.target.value as ApproverType;
                          setEditingTemplate({ ...editingTemplate, levels: updatedLevels });
                        }}
                        className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-2.5 py-1.5 text-xs text-[var(--nebula-text)] capitalize"
                      >
                        <option value="role">Role / Group</option>
                        <option value="user">Specific User</option>
                        <option value="department">Department Manager</option>
                        <option value="manager">Line Manager</option>
                        <option value="ceo">CEO</option>
                        <option value="finance_head">Finance Head / CFO</option>
                        <option value="procurement_head">Procurement Head</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-[var(--nebula-muted)] mb-1">Approver Name / Role</label>
                      <input
                        type="text"
                        value={level.approverName}
                        onChange={(e) => {
                          const updatedLevels = [...editingTemplate.levels];
                          updatedLevels[index].approverName = e.target.value;
                          setEditingTemplate({ ...editingTemplate, levels: updatedLevels });
                        }}
                        className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-2.5 py-1.5 text-xs text-[var(--nebula-text)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase text-[var(--nebula-muted)] mb-1">Auto-Approve Threshold ($)</label>
                      <input
                        type="number"
                        value={level.autoApproveThreshold || ""}
                        placeholder="Optional max amount"
                        onChange={(e) => {
                          const updatedLevels = [...editingTemplate.levels];
                          updatedLevels[index].autoApproveThreshold = e.target.value ? Number(e.target.value) : undefined;
                          setEditingTemplate({ ...editingTemplate, levels: updatedLevels });
                        }}
                        className="w-full rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-2.5 py-1.5 text-xs text-[var(--nebula-text)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
