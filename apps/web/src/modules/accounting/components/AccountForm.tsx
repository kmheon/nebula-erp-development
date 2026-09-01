import { useEffect, useState } from "react";
import { Plus, Edit3 } from "lucide-react";
import { useAccountMutation } from "../hooks/useAccounts";
import {
  AppCard,
  AppInput,
  AppSelect,
  AppButton,
} from "../../../components/ui";

import type {
  Account,
  AccountStatus,
  AccountType,
  CreateAccountInput,
} from "../types/accounting.types";

type AccountFormProps = {
  accounts: Account[];
  account?: Account;
  onCancel?: () => void;
};

type AccountFormState = {
  code: string;
  name: string;
  type: AccountType;
  parentId: string;
  status: AccountStatus;
};

const ACCOUNT_TYPES: AccountType[] = [
  "asset",
  "liability",
  "equity",
  "income",
  "expense",
];

const initialState: AccountFormState = {
  code: "",
  name: "",
  type: "asset",
  parentId: "",
  status: "active",
};

export default function AccountForm({
  accounts,
  account,
  onCancel,
}: AccountFormProps) {
  const { create, update } = useAccountMutation();

  const [form, setForm] =
    useState<AccountFormState>(initialState);

  const editMode = Boolean(account);

  useEffect(() => {
    if (!account) {
      setForm(initialState);
      return;
    }

    setForm({
      code: account.code,
      name: account.name,
      type: account.type,
      parentId: account.parentId ?? "",
      status: account.status,
    });
  }, [account]);

  function updateField<K extends keyof AccountFormState>(
    key: K,
    value: AccountFormState[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function submit() {
    const payload: CreateAccountInput = {
      code: form.code,
      name: form.name,
      type: form.type,
      parentId: form.parentId || undefined,
      status: form.status,
    };

    if (editMode && account) {
      update.mutate({
        id: account.id,
        ...payload,
      });
    } else {
      create.mutate(payload);
    }

    setForm(initialState);
    onCancel?.();
  }

  const parentCandidates = accounts.filter(
    (candidate) => candidate.id !== account?.id,
  );

  return (
    <AppCard
      title={
        <span className="flex items-center gap-2">
          {editMode ? <Edit3 size={18} /> : <Plus size={18} />}
          {editMode ? "Edit Account" : "Add New Account"}
        </span>
      }
      subtitle="Define general ledger hierarchy, account code, and category."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AppInput
          label="Account Code"
          placeholder="e.g. 1010"
          value={form.code}
          onChange={(e) => updateField("code", e.target.value)}
        />

        <AppInput
          label="Account Name"
          placeholder="e.g. Operating Checking Account"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />

        <AppSelect
          label="Account Type"
          value={form.type}
          onChange={(e) =>
            updateField("type", e.target.value as AccountType)
          }
        >
          {ACCOUNT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </AppSelect>

        <AppSelect
          label="Parent Account"
          value={form.parentId}
          onChange={(e) => updateField("parentId", e.target.value)}
        >
          <option value="">No Parent (Root)</option>
          {parentCandidates.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.code} - {candidate.name}
            </option>
          ))}
        </AppSelect>

        <AppSelect
          label="Status"
          value={form.status}
          onChange={(e) =>
            updateField("status", e.target.value as AccountStatus)
          }
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </AppSelect>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        {onCancel && (
          <AppButton variant="outline" onClick={onCancel}>
            Cancel
          </AppButton>
        )}

        <AppButton variant="primary" onClick={submit}>
          {editMode ? "Update Account" : "Create Account"}
        </AppButton>
      </div>
    </AppCard>
  );
}

