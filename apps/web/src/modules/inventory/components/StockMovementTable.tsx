import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type {
  StockMovement,
} from "../types/inventory.types";


type Props = {
  movements: StockMovement[];
};


export default function StockMovementTable({
  movements,
}: Props) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: movements.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  return (
    <div className="surface overflow-hidden flex flex-col">
      <div className="border-b bg-muted/50">
        <table className="w-full">
          <thead>
            <tr className="border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="p-3 text-left w-1/5">Product</th>
              <th className="p-3 text-left w-28">Warehouse</th>
              <th className="p-3 text-right w-24">Quantity</th>
              <th className="p-3 text-left w-20">Unit</th>
              <th className="p-3 text-right w-28">Base Qty</th>
              <th className="p-3 text-left w-28">Type</th>
              <th className="p-3 text-left flex-1">Reference</th>
              <th className="p-3 text-left w-36">Date</th>
            </tr>
          </thead>
        </table>
      </div>

      <div
        ref={parentRef}
        className="max-h-[650px] overflow-y-auto relative w-full"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          <table className="w-full absolute top-0 left-0">
            <tbody>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const movement = movements[virtualRow.index];
                return (
                  <tr
                    key={movement.id}
                    className="border-b hover:bg-muted/30 transition-colors absolute top-0 left-0 w-full flex items-center"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <td className="p-3 w-1/5 truncate font-medium text-sm">
                      {movement.productName}
                    </td>

                    <td className="p-3 w-28 text-sm text-muted-foreground truncate">
                      {movement.warehouseId}
                    </td>

                    <td className="p-3 w-24 text-right text-sm">
                      {movement.quantity}
                    </td>

                    <td className="p-3 w-20 text-sm text-muted-foreground">
                      {movement.unitId}
                    </td>

                    <td className="p-3 w-28 text-right text-sm font-medium">
                      {movement.baseQuantity}
                    </td>

                    <td className="p-3 w-28 text-sm">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {movement.type}
                      </span>
                    </td>

                    <td className="p-3 flex-1 text-sm truncate text-muted-foreground">
                      {movement.referenceType
                        ? `${movement.referenceType}${
                            movement.referenceId
                              ? `: ${movement.referenceId}`
                              : ""
                          }`
                        : "—"}
                    </td>

                    <td className="p-3 w-36 text-sm text-muted-foreground">
                      {movement.createdAt}
                    </td>
                  </tr>
                );
              })}
              {movements.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    No stock movements recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

