/* ---------------------------------------------------------------- */
/* Enterprise Multi-Tier Approval Workflow Engine Types             */
/* ---------------------------------------------------------------- */

export type ApprovalModuleType =
  | "purchase"
  | "sales"
  | "accounting"
  | "hr"
  | "inventory"
  | "manufacturing"
  | "crm"
  | "payments"
  | "banking"
  | "settlement";

export type ApproverType = "role" | "user" | "department" | "manager" | "ceo" | "procurement_head" | "finance_head";

export interface ApprovalLevel {
  levelNumber: number;
  name: string;
  approverType: ApproverType;
  approverId?: string;
  approverName: string;
  requiresAll: boolean; // if true, all approvers at this level must approve
  canSkip: boolean;
  autoApproveThreshold?: number; // amount under which this level auto-approves
  timeoutHours?: number;
  escalateToLevel?: number;
}

export interface ApprovalWorkflowTemplate {
  id: string;
  name: string;
  description: string;
  module: ApprovalModuleType;
  documentType: string;
  isSequential: boolean; // true = sequential, false = parallel
  isActive: boolean;
  levels: ApprovalLevel[];
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRuleCondition {
  field: 
    | "amount" 
    | "currency" 
    | "department" 
    | "branch" 
    | "vendor" 
    | "customer" 
    | "product_category" 
    | "warehouse" 
    | "risk_score"
    | "document_type";
  operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains" | "in";
  value: string | number;
}

export interface ApprovalRule {
  id: string;
  name: string;
  description: string;
  module: ApprovalModuleType;
  documentType: string;
  priority: number;
  conditions: ApprovalRuleCondition[];
  workflowTemplateId: string;
  isActive: boolean;
}

export type ApprovalRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "returned"
  | "request_changes"
  | "escalated"
  | "delegated"
  | "expired";

export type ApprovalActionType =
  | "approve"
  | "reject"
  | "return"
  | "request_changes"
  | "skip"
  | "delegate"
  | "escalate";

export interface ApprovalHistoryItem {
  id: string;
  requestId: string;
  levelNumber: number;
  actorId: string;
  actorName: string;
  action: ApprovalActionType;
  comments: string;
  previousState: ApprovalRequestStatus;
  newState: ApprovalRequestStatus;
  timestamp: string;
}

export interface ApprovalRequest {
  id: string;
  module: ApprovalModuleType;
  documentType: string;
  documentId: string;
  documentNumber: string;
  documentTitle: string;
  amount: number;
  currency: string;
  requestedBy: string;
  requestedByName: string;
  currentLevel: number;
  totalLevels: number;
  status: ApprovalRequestStatus;
  workflowTemplateId: string;
  history: ApprovalHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalDelegation {
  id: string;
  userId: string;
  userName: string;
  delegateUserId: string;
  delegateUserName: string;
  startDate: string;
  endDate: string;
  reason: string;
  mode: "temporary" | "permanent" | "vacation" | "emergency";
  isActive: boolean;
}

export interface ApprovalNotificationEvent {
  id: string;
  requestId: string;
  eventType: 
    | "approval_requested" 
    | "approved" 
    | "rejected" 
    | "returned" 
    | "expired" 
    | "escalated" 
    | "delegated";
  recipientId: string;
  recipientRole: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
