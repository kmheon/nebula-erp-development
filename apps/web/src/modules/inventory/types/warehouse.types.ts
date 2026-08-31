export interface WarehouseZone {
  id: string;
  warehouseId: string;
  name: string;
  code: string;
  type: "storage" | "receiving" | "dispatch" | "quarantine" | "returns" | "cold-storage";
  temperatureControlled: boolean;
  status: "active" | "maintenance" | "inactive";
  createdAt: string;
}

export interface WarehouseRack {
  id: string;
  zoneId: string;
  name: string;
  aisle: string;
  levelsCount: number;
}

export interface WarehouseBin {
  id: string;
  rackId: string;
  code: string;
  level: number;
  position: string;
  capacityKg: number;
  currentWeightKg: number;
  status: "available" | "full" | "reserved" | "damaged";
}

export interface CycleCountSession {
  id: string;
  warehouseId: string;
  zoneId?: string;
  status: "planned" | "in-progress" | "reconciled" | "approved";
  assignedAuditor: string;
  scheduledDate: string;
  completedDate?: string;
  discrepancyCount: number;
  notes: string;
}

export interface ReceivingOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  warehouseId: string;
  status: "expected" | "inspecting" | "received" | "quarantined";
  expectedDate: string;
  receivedDate?: string;
  itemCount: number;
  inspectionPassed: boolean;
  notes: string;
}

export interface DispatchOrder {
  id: string;
  soNumber: string;
  customerName: string;
  warehouseId: string;
  status: "picking" | "packed" | "dispatched" | "delivered";
  pickingMethod: "FIFO" | "LIFO" | "FEFO";
  carrier: string;
  trackingNumber: string;
  dispatchDate: string;
}
