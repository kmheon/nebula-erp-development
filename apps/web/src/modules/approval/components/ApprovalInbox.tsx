import React, { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, UserPlus, Shield } from "lucide-react";
import type { ApprovalRequest, ApprovalActionType } from "../types/approval.types";

interface ApprovalInboxProps {
  requests: ApprovalRequest[];
  onProcessAction: (input: { requestId: string; actorId: string; actorName: string; action: ApprovalActionType; comments: string }) => void;
}

export const ApprovalInbox: React.FC<ApprovalInboxProps> = ({
  requests,
  onProcessAction,
}) => {
  const [selectedRequestId, setSelectedRequestId] = useState<string>(requests[0]?.id || "");
  const [commentInput, setCommentInput] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const selectedRequest = requests.find(r => r.id === selectedRequestId) || requests[0];
  const pendingRequests = requests.filter(r => r.status === "pending");

  const handleActionClick = (action: ApprovalActionType) => {
    if (!selectedRequest) return;
    try {
      onProcessAction({
        requestId: selectedRequest.id,
        actorId: "usr-current-admin",
        actorName: "Arthur Pendelton (Executive Reviewer)",
        action,
        comments: commentInput || `Executed action: ${action}`,
      });
      setCommentInput("");
      setActionSuccess(`Successfully processed action: ${action.toUpperCase()}`);
      setTimeout(() => setActionSuccess(""), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to process approval action");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Pending Inbox List */}
      <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
        <div className="p-4 border-b border-[var(--nebula-border)] bg-[var(--nebula-background)]/50">
          <h3 className="text-base font-bold text-[var(--nebula-text)]">Approval Inbox</h3>
          <p className="text-xs text-[var(--nebula-muted)]">{pendingRequests.length} pending items requiring action</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[var(--nebula-border)]">
          {requests.map((req) => (
            <div
              key={req.id}
              onClick={() => setSelectedRequestId(req.id)}
              className={`p-4 cursor-pointer transition-colors ${
                selectedRequestId === req.id 
                  ? "bg-blue-500/10 border-l-4 border-blue-600" 
                  : "hover:bg-[var(--nebula-surface-hover)]"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-blue-600 uppercase">{req.module}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  req.status === "approved" ? "bg-emerald-500/10 text-emerald-600" :
                  req.status === "rejected" ? "bg-rose-500/10 text-rose-600" :
                  "bg-amber-500/10 text-amber-600"
                }`}>
                  {req.status.toUpperCase()}
                </span>
              </div>
              <div className="font-semibold text-sm text-[var(--nebula-text)]">{req.documentNumber}</div>
              <div className="text-xs text-[var(--nebula-muted)] line-clamp-1 mt-0.5">{req.documentTitle}</div>
              <div className="mt-2 flex items-center justify-between text-xs text-[var(--nebula-muted)]">
                <span className="font-mono font-medium text-[var(--nebula-text)]">
                  ${req.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {req.currency}
                </span>
                <span>Level {req.currentLevel}/{req.totalLevels}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Selected Request Review & Actions */}
      <div className="lg:col-span-2 space-y-6">
        {selectedRequest ? (
          <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--nebula-border)] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 uppercase">
                    {selectedRequest.module}
                  </span>
                  <span className="text-xs text-[var(--nebula-muted)]">ID: {selectedRequest.documentId}</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--nebula-text)] mt-1">
                  {selectedRequest.documentNumber}: {selectedRequest.documentTitle}
                </h2>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold font-mono text-[var(--nebula-text)]">
                  ${selectedRequest.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {selectedRequest.currency}
                </div>
                <div className="text-xs text-[var(--nebula-muted)]">Requested by {selectedRequest.requestedByName}</div>
              </div>
            </div>

            {actionSuccess && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm font-medium text-emerald-600">
                {actionSuccess}
              </div>
            )}

            {/* Workflow Tier Status Bar */}
            <div className="rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--nebula-muted)] uppercase">
                <span>Multi-Tier Authorization Pipeline</span>
                <span>Current Gate: Level {selectedRequest.currentLevel} of {selectedRequest.totalLevels}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: selectedRequest.totalLevels }).map((_, i) => {
                  const levelNum = i + 1;
                  const isPassed = levelNum < selectedRequest.currentLevel || selectedRequest.status === "approved";
                  const isCurrent = levelNum === selectedRequest.currentLevel && selectedRequest.status === "pending";
                  return (
                    <div 
                      key={levelNum} 
                      className={`p-3 rounded-lg border text-center transition-all ${
                        isPassed ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-semibold" :
                        isCurrent ? "bg-blue-500/10 border-blue-500/30 text-blue-600 font-bold ring-2 ring-blue-500/20" :
                        "bg-[var(--nebula-surface)] border-[var(--nebula-border)] text-[var(--nebula-muted)]"
                      }`}
                    >
                      <div className="text-xs">Level {levelNum}</div>
                      <div className="text-[11px] mt-0.5">
                        {isPassed ? "Approved" : isCurrent ? "Active Review" : "Pending"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Form */}
            {selectedRequest.status === "pending" ? (
              <div className="space-y-4 rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] p-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-[var(--nebula-muted)] mb-1">
                    Reviewer Comments & Audit Notes
                  </label>
                  <textarea
                    rows={3}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Enter approval justification, compliance notes, or rejection rationale..."
                    className="w-full rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-3 py-2 text-sm text-[var(--nebula-text)] resize-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => handleActionClick("approve")}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve Level
                  </button>
                  <button
                    onClick={() => handleActionClick("reject")}
                    className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 transition-colors"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                  <button
                    onClick={() => handleActionClick("return")}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--nebula-text)] hover:bg-[var(--nebula-surface-hover)] transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" /> Return for Revision
                  </button>
                  <button
                    onClick={() => handleActionClick("delegate")}
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--nebula-text)] hover:bg-[var(--nebula-surface-hover)] transition-colors"
                  >
                    <UserPlus className="h-4 w-4" /> Delegate
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-[var(--nebula-background)] p-6 text-center border border-[var(--nebula-border)]">
                <span className="text-sm font-semibold text-[var(--nebula-muted)] capitalize">
                  This request has been finalized as: <strong className="text-[var(--nebula-text)]">{selectedRequest.status}</strong>
                </span>
              </div>
            )}

            {/* Audit History Timeline */}
            <div className="space-y-3 pt-4">
              <h4 className="text-sm font-bold text-[var(--nebula-text)] uppercase tracking-wider">Audit Trail & History</h4>
              <div className="space-y-3">
                {selectedRequest.history.map((hist) => (
                  <div key={hist.id} className="flex items-start gap-3 rounded-xl border border-[var(--nebula-border)] bg-[var(--nebula-background)] p-3">
                    <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 mt-0.5">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--nebula-text)]">{hist.actorName}</span>
                        <span className="text-[10px] text-[var(--nebula-muted)]">{new Date(hist.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-blue-600 font-semibold capitalize mt-0.5">Action: {hist.action}</div>
                      <p className="text-xs text-[var(--nebula-muted)] mt-1">{hist.comments}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-12 text-center">
            <p className="text-sm text-[var(--nebula-muted)]">Select an approval request from the inbox to review.</p>
          </div>
        )}
      </div>
    </div>
  );
};
