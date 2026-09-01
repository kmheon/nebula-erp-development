import { useState } from "react";
import { Plus, Package, Layers, TrendingDown, DollarSign } from "lucide-react";
import AssetForm from "../components/AssetForm";
import AssetTable from "../components/AssetTable";
import AssetCategoryForm from "../components/AssetCategoryForm";
import AssetCategoryTable from "../components/AssetCategoryTable";
import DepreciationOverview from "../components/DepreciationOverview";
import {
  AppPageHeader,
  AppStatCard,
  AppTabs,
  AppButton,
} from "../../../components/ui";

import {
  useAssets,
  useAssetMutation,
  useAssetCategories,
  useAssetCategoryMutation,
} from "../hooks/useAssets";

import type {
  Asset,
  AssetCategory,
} from "../types/asset.types";

export default function AssetsPage() {
  const [activeTab, setActiveTab] = useState<string>("register");
  const { data: assets = [] } = useAssets();
  const { data: categories = [] } = useAssetCategories();

  const { remove: removeAsset } = useAssetMutation();
  const { remove: removeCategory } = useAssetCategoryMutation();

  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<AssetCategory | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  function handleEditAsset(asset: Asset) {
    setEditingAsset(asset);
    setShowAssetForm(true);
  }

  function handleDeleteAsset(id: string) {
    if (window.confirm("Delete this asset?")) {
      removeAsset.mutate(id);
    }
  }

  function handleEditCategory(category: AssetCategory) {
    setEditingCategory(category);
    setShowCategoryForm(true);
  }

  function handleDeleteCategory(id: string) {
    if (window.confirm("Delete this category?")) {
      removeCategory.mutate(id);
    }
  }

  const totalCost = assets.reduce((sum, a) => sum + (a.purchaseValue || 0), 0);
  const netBookValue = assets.reduce((sum, a) => sum + (a.currentValue || 0), 0);
  const totalDepreciation = Math.max(0, totalCost - netBookValue);

  return (
    <div className="space-y-8">
      <AppPageHeader
        title="Fixed Asset Management & Depreciation"
        subtitle="Track business capital assets, category lifespans, straight-line/declining balance depreciation, and general ledger capitalisation."
        actions={
          <div className="flex items-center gap-3">
            <AppButton
              variant="outline"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setActiveTab("categories");
                setEditingCategory(null);
                setShowCategoryForm(true);
              }}
            >
              Add Category
            </AppButton>
            <AppButton
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => {
                setActiveTab("register");
                setEditingAsset(null);
                setShowAssetForm(true);
              }}
            >
              Register Asset
            </AppButton>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AppStatCard
          label="Fixed Assets"
          value={assets.length}
          subtext="Capitalised property & equipment"
          icon={<Package size={20} />}
          tone="primary"
        />
        <AppStatCard
          label="Gross Asset Value"
          value={`$${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Historical acquisition cost"
          icon={<DollarSign size={20} />}
          tone="default"
        />
        <AppStatCard
          label="Accumulated Depreciation"
          value={`$${totalDepreciation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Amortised asset life"
          icon={<TrendingDown size={20} />}
          tone="warning"
        />
        <AppStatCard
          label="Net Book Value"
          value={`$${netBookValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtext="Current balance sheet value"
          icon={<Layers size={20} />}
          tone="success"
        />
      </div>

      <AppTabs
        tabs={[
          { id: "register", name: "Asset Register", icon: <Package size={16} /> },
          { id: "categories", name: "Asset Categories", icon: <Layers size={16} /> },
          { id: "depreciation", name: "Depreciation Schedules", icon: <TrendingDown size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pill"
      />

      {activeTab === "register" && (
        <div className="space-y-6">
          {showAssetForm && (
            <AssetForm
              asset={editingAsset}
              onClose={() => {
                setEditingAsset(null);
                setShowAssetForm(false);
              }}
            />
          )}

          <AssetTable
            assets={assets}
            categories={categories}
            onEdit={handleEditAsset}
            onDelete={handleDeleteAsset}
          />
        </div>
      )}

      {activeTab === "categories" && (
        <div className="space-y-6">
          {showCategoryForm && (
            <AssetCategoryForm
              category={editingCategory}
              onClose={() => {
                setEditingCategory(null);
                setShowCategoryForm(false);
              }}
            />
          )}

          <AssetCategoryTable
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        </div>
      )}

      {activeTab === "depreciation" && (
        <div className="space-y-6">
          <DepreciationOverview assets={assets} />
        </div>
      )}
    </div>
  );
}

