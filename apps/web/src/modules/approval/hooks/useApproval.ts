import { useState, useEffect, useCallback } from "react";
import type {
  ApprovalWorkflowTemplate,
  ApprovalRule,
  ApprovalRequest,
  ApprovalDelegation,
  ApprovalNotificationEvent,
} from "../types/approval.types";
import {
  getApprovalTemplates,
  saveApprovalTemplates,
  getApprovalRules,
  saveApprovalRules,
  getApprovalRequests,
  getApprovalDelegations,
  saveApprovalDelegations,
  getApprovalNotifications,
  submitForApproval,
  processApprovalAction,
} from "../services/approval.service";
import type { SubmitApprovalInput, ProcessApprovalActionInput } from "../services/approval.service";

export function useApproval() {
  const [templates, setTemplates] = useState<ApprovalWorkflowTemplate[]>([]);
  const [rules, setRules] = useState<ApprovalRule[]>([]);
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [delegations, setDelegations] = useState<ApprovalDelegation[]>([]);
  const [notifications, setNotifications] = useState<ApprovalNotificationEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshData = useCallback(() => {
    setLoading(true);
    try {
      setTemplates(getApprovalTemplates().data);
      setRules(getApprovalRules().data);
      setRequests(getApprovalRequests().data);
      setDelegations(getApprovalDelegations().data);
      setNotifications(getApprovalNotifications().data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const submitNewRequest = (input: SubmitApprovalInput) => {
    const res = submitForApproval(input);
    refreshData();
    return res;
  };

  const processAction = (input: ProcessApprovalActionInput) => {
    const res = processApprovalAction(input);
    refreshData();
    return res;
  };

  const saveTemplates = (newTemplates: ApprovalWorkflowTemplate[]) => {
    saveApprovalTemplates(newTemplates);
    setTemplates(newTemplates);
  };

  const saveRules = (newRules: ApprovalRule[]) => {
    saveApprovalRules(newRules);
    setRules(newRules);
  };

  const saveDelegationsList = (newList: ApprovalDelegation[]) => {
    saveApprovalDelegations(newList);
    setDelegations(newList);
  };

  return {
    templates,
    rules,
    requests,
    delegations,
    notifications,
    loading,
    refreshData,
    submitNewRequest,
    processAction,
    saveTemplates,
    saveRules,
    saveDelegationsList,
  };
}
