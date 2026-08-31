/* ---------------------------------------------------------------- */
/* Enterprise Approval Engine Service                               */
/* ---------------------------------------------------------------- */

import type {
  ApprovalWorkflowTemplate,
  ApprovalRule,
  ApprovalRequest,
  ApprovalDelegation,
  ApprovalNotificationEvent,
  ApprovalActionType,
  ApprovalRequestStatus,
} from "../types/approval.types";

const STORAGE_TEMPLATES_KEY = "nebula-approval-templates-v1";
const STORAGE_RULES_KEY = "nebula-approval-rules-v1";
const STORAGE_REQUESTS_KEY = "nebula-approval-requests-v1";
const STORAGE_DELEGATIONS_KEY = "nebula-approval-delegations-v1";
const STORAGE_NOTIFICATIONS_KEY = "nebula-approval-notifications-v1";

const DEFAULT_TEMPLATES: ApprovalWorkflowTemplate[] = [
  {
    id: "wf-purchase-standard",
    name: "Standard Purchase Approval Workflow",
    description: "Multi-tier approval for enterprise purchase orders and requisitions.",
    module: "purchase",
    documentType: "Purchase Order",
    isSequential: true,
    isActive: true,
    levels: [
      {
        levelNumber: 1,
        name: "Department Manager",
        approverType: "department",
        approverName: "Dept Manager (Operations)",
        requiresAll: false,
        canSkip: false,
        autoApproveThreshold: 1000,
        timeoutHours: 48,
        escalateToLevel: 2,
      },
      {
        levelNumber: 2,
        name: "Finance Manager",
        approverType: "finance_head",
        approverName: "CFO / Finance Head",
        requiresAll: false,
        canSkip: false,
        autoApproveThreshold: 10000,
        timeoutHours: 72,
        escalateToLevel: 3,
      },
      {
        levelNumber: 3,
        name: "Chief Executive Officer",
        approverType: "ceo",
        approverName: "CEO",
        requiresAll: true,
        canSkip: false,
        timeoutHours: 120,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "wf-expense-standard",
    name: "Expense Claim Approval Workflow",
    description: "Two-tier workflow for corporate travel and operational expenses.",
    module: "accounting",
    documentType: "Expense Claim",
    isSequential: true,
    isActive: true,
    levels: [
      {
        levelNumber: 1,
        name: "Direct Supervisor",
        approverType: "manager",
        approverName: "Reporting Line Manager",
        requiresAll: false,
        canSkip: false,
        autoApproveThreshold: 500,
      },
      {
        levelNumber: 2,
        name: "Controller",
        approverType: "role",
        approverName: "Financial Controller",
        requiresAll: false,
        canSkip: false,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_RULES: ApprovalRule[] = [
  {
    id: "rule-po-high",
    name: "High Value Purchase Orders (> $10k)",
    description: "Routes purchase orders exceeding $10,000 through full executive approval.",
    module: "purchase",
    documentType: "Purchase Order",
    priority: 10,
    conditions: [
      { field: "amount", operator: "greater_than", value: 10000 },
    ],
    workflowTemplateId: "wf-purchase-standard",
    isActive: true,
  },
];

const DEFAULT_REQUESTS: ApprovalRequest[] = [
  {
    id: "req-101",
    module: "purchase",
    documentType: "Purchase Order",
    documentId: "po-8821",
    documentNumber: "PO-2026-089",
    documentTitle: "Enterprise Cloud Infrastructure Servers - Dell R750",
    amount: 18450.00,
    currency: "USD",
    requestedBy: "usr-procurement",
    requestedByName: "Sarah Jenkins (Procurement Lead)",
    currentLevel: 2,
    totalLevels: 3,
    status: "pending",
    workflowTemplateId: "wf-purchase-standard",
    history: [
      {
        id: "hist-1",
        requestId: "req-101",
        levelNumber: 1,
        actorId: "usr-mgr-1",
        actorName: "David Miller (Dept Manager)",
        action: "approve",
        comments: "Approved for Q3 infrastructure upgrade budget.",
        previousState: "pending",
        newState: "pending",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "req-102",
    module: "accounting",
    documentType: "Expense Claim",
    documentId: "exp-331",
    documentNumber: "EXP-2026-112",
    documentTitle: "Q3 Executive Leadership Summit Travel & Hotel",
    amount: 3420.50,
    currency: "USD",
    requestedBy: "usr-sales",
    requestedByName: "Marcus Vance (Sales Director)",
    currentLevel: 1,
    totalLevels: 2,
    status: "pending",
    workflowTemplateId: "wf-expense-standard",
    history: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_DELEGATIONS: ApprovalDelegation[] = [
  {
    id: "del-1",
    userId: "usr-cfo",
    userName: "Arthur Pendelton (CFO)",
    delegateUserId: "usr-controller",
    delegateUserName: "Elena Rostova (Senior Controller)",
    startDate: "2026-09-01",
    endDate: "2026-09-07",
    reason: "Annual Vacation Leave",
    mode: "vacation",
    isActive: true,
  },
];

const DEFAULT_NOTIFICATIONS: ApprovalNotificationEvent[] = [
  {
    id: "notif-1",
    requestId: "req-101",
    eventType: "approval_requested",
    recipientId: "usr-cfo",
    recipientRole: "CFO",
    title: "Action Required: PO-2026-089 ($18,450.00)",
    message: "Purchase order approval requested by Sarah Jenkins. Level 2 review pending.",
    timestamp: new Date().toISOString(),
    isRead: false,
  },
];

/* Storage Getters & Setters */

export function getApprovalTemplates(): { data: ApprovalWorkflowTemplate[] } {
  if (typeof window === "undefined") return { data: DEFAULT_TEMPLATES };
  const stored = window.localStorage.getItem(STORAGE_TEMPLATES_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_TEMPLATES_KEY, JSON.stringify(DEFAULT_TEMPLATES));
    return { data: DEFAULT_TEMPLATES };
  }
  return { data: JSON.parse(stored) };
}

export function saveApprovalTemplates(items: ApprovalWorkflowTemplate[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_TEMPLATES_KEY, JSON.stringify(items));
  }
}

export function getApprovalRules(): { data: ApprovalRule[] } {
  if (typeof window === "undefined") return { data: DEFAULT_RULES };
  const stored = window.localStorage.getItem(STORAGE_RULES_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_RULES_KEY, JSON.stringify(DEFAULT_RULES));
    return { data: DEFAULT_RULES };
  }
  return { data: JSON.parse(stored) };
}

export function saveApprovalRules(items: ApprovalRule[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_RULES_KEY, JSON.stringify(items));
  }
}

export function getApprovalRequests(): { data: ApprovalRequest[] } {
  if (typeof window === "undefined") return { data: DEFAULT_REQUESTS };
  const stored = window.localStorage.getItem(STORAGE_REQUESTS_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(DEFAULT_REQUESTS));
    return { data: DEFAULT_REQUESTS };
  }
  return { data: JSON.parse(stored) };
}

export function saveApprovalRequests(items: ApprovalRequest[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(items));
  }
}

export function getApprovalDelegations(): { data: ApprovalDelegation[] } {
  if (typeof window === "undefined") return { data: DEFAULT_DELEGATIONS };
  const stored = window.localStorage.getItem(STORAGE_DELEGATIONS_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_DELEGATIONS_KEY, JSON.stringify(DEFAULT_DELEGATIONS));
    return { data: DEFAULT_DELEGATIONS };
  }
  return { data: JSON.parse(stored) };
}

export function saveApprovalDelegations(items: ApprovalDelegation[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_DELEGATIONS_KEY, JSON.stringify(items));
  }
}

export function getApprovalNotifications(): { data: ApprovalNotificationEvent[] } {
  if (typeof window === "undefined") return { data: DEFAULT_NOTIFICATIONS };
  const stored = window.localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
  if (!stored) {
    window.localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
    return { data: DEFAULT_NOTIFICATIONS };
  }
  return { data: JSON.parse(stored) };
}

export function saveApprovalNotifications(items: ApprovalNotificationEvent[]): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(items));
  }
}

/* Core Workflow Engine Operations */

export interface SubmitApprovalInput {
  module: ApprovalRequest["module"];
  documentType: string;
  documentId: string;
  documentNumber: string;
  documentTitle: string;
  amount: number;
  currency?: string;
  requestedBy: string;
  requestedByName: string;
}

export function submitForApproval(input: SubmitApprovalInput): ApprovalRequest {
  const { data: templates } = getApprovalTemplates();
  const { data: rules } = getApprovalRules();
  const { data: requests } = getApprovalRequests();

  // Find matching rule or fallback to first template for module
  let matchedTemplate = templates.find(t => t.module === input.module && t.isActive);
  const applicableRule = rules.find(r => r.module === input.module && r.isActive);
  if (applicableRule) {
    const tmpl = templates.find(t => t.id === applicableRule.workflowTemplateId);
    if (tmpl) matchedTemplate = tmpl;
  }

  if (!matchedTemplate) {
    throw new Error(`No active approval workflow template found for module: ${input.module}`);
  }

  // Check auto-approve threshold on level 1
  const level1 = matchedTemplate.levels[0];
  let initialStatus: ApprovalRequestStatus = "pending";
  if (level1?.autoApproveThreshold && input.amount <= level1.autoApproveThreshold) {
    initialStatus = "approved";
  }

  const newRequest: ApprovalRequest = {
    id: `req-${Date.now()}`,
    module: input.module,
    documentType: input.documentType,
    documentId: input.documentId,
    documentNumber: input.documentNumber,
    documentTitle: input.documentTitle,
    amount: input.amount,
    currency: input.currency || "USD",
    requestedBy: input.requestedBy,
    requestedByName: input.requestedByName,
    currentLevel: initialStatus === "approved" ? matchedTemplate.levels.length : 1,
    totalLevels: matchedTemplate.levels.length,
    status: initialStatus,
    workflowTemplateId: matchedTemplate.id,
    history: [
      {
        id: `hist-${Date.now()}`,
        requestId: `req-${Date.now()}`,
        levelNumber: 1,
        actorId: input.requestedBy,
        actorName: input.requestedByName,
        action: initialStatus === "approved" ? "skip" : "approve",
        comments: initialStatus === "approved" ? "Auto-approved by threshold rule." : "Submitted for approval.",
        previousState: "pending",
        newState: initialStatus,
        timestamp: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveApprovalRequests([newRequest, ...requests]);

  // Generate notification event
  const { data: notifs } = getApprovalNotifications();
  const newNotif: ApprovalNotificationEvent = {
    id: `notif-${Date.now()}`,
    requestId: newRequest.id,
    eventType: "approval_requested",
    recipientId: "approver-pool",
    recipientRole: matchedTemplate.levels[0]?.name || "Approver",
    title: `Approval Requested: ${input.documentNumber} ($${input.amount.toLocaleString()})`,
    message: `${input.requestedByName} submitted ${input.documentType} for review.`,
    timestamp: new Date().toISOString(),
    isRead: false,
  };
  saveApprovalNotifications([newNotif, ...notifs]);

  return newRequest;
}

export interface ProcessApprovalActionInput {
  requestId: string;
  actorId: string;
  actorName: string;
  action: ApprovalActionType;
  comments: string;
}

export function processApprovalAction(input: ProcessApprovalActionInput): ApprovalRequest {
  const { data: requests } = getApprovalRequests();
  const { data: templates } = getApprovalTemplates();

  const reqIndex = requests.findIndex(r => r.id === input.requestId);
  if (reqIndex === -1) throw new Error("Approval request not found.");

  const req = requests[reqIndex];
  const template = templates.find(t => t.id === req.workflowTemplateId);
  const previousState = req.status;

  let nextStatus: ApprovalRequestStatus = req.status;
  let nextLevel = req.currentLevel;

  if (input.action === "approve") {
    if (template && req.currentLevel < template.levels.length) {
      nextLevel += 1;
      nextStatus = "pending";
    } else {
      nextStatus = "approved";
    }
  } else if (input.action === "reject") {
    nextStatus = "rejected";
  } else if (input.action === "return") {
    nextStatus = "returned";
  } else if (input.action === "request_changes") {
    nextStatus = "request_changes";
  } else if (input.action === "delegate") {
    nextStatus = "delegated";
  } else if (input.action === "escalate") {
    nextStatus = "escalated";
    if (template && req.currentLevel < template.levels.length) {
      nextLevel += 1;
    }
  }

  const historyItem = {
    id: `hist-${Date.now()}`,
    requestId: req.id,
    levelNumber: req.currentLevel,
    actorId: input.actorId,
    actorName: input.actorName,
    action: input.action,
    comments: input.comments,
    previousState,
    newState: nextStatus,
    timestamp: new Date().toISOString(),
  };

  const updatedReq: ApprovalRequest = {
    ...req,
    currentLevel: nextLevel,
    status: nextStatus,
    history: [historyItem, ...req.history],
    updatedAt: new Date().toISOString(),
  };

  requests[reqIndex] = updatedReq;
  saveApprovalRequests(requests);
  return updatedReq;
}
