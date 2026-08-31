export interface BatchLotRecord {
  id: string;
  productId: string;
  productName: string;
  batchNumber: string;
  lotNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  quantity: number;
  warehouseId: string;
  binId?: string;
  status: "active" | "near-expiry" | "expired" | "depleted";
  qualityStatus: "passed" | "pending-inspection" | "quarantined" | "failed";
}

export interface SerialNumberRecord {
  id: string;
  productId: string;
  productName: string;
  serialNumber: string;
  warehouseId: string;
  status: "in-stock" | "allocated" | "dispatched" | "returned" | "damaged";
  batchNumber?: string;
  receivedDate: string;
  warrantyExpiry?: string;
}

export interface StockReservation {
  id: string;
  productId: string;
  productName: string;
  warehouseId: string;
  quantity: number;
  referenceType: "sales-order" | "manufacturing-order" | "transfer";
  referenceId: string;
  reservedAt: string;
  expiresAt: string;
  status: "active" | "fulfilled" | "released";
}

export interface BarcodeScanEvent {
  id: string;
  code: string;
  scanType: "barcode" | "qr" | "rfid";
  entityType: "product" | "bin" | "batch" | "serial" | "shipment";
  entityId: string;
  scannedAt: string;
  operator: string;
  location: string;
}
