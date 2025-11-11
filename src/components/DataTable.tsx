import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import Pagination from "@/components/Pagination";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  totalCount?: number;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  title,
  totalCount,
  emptyMessage = "Tidak ada data yang ditemukan.",
  className = "",
}: DataTableProps<T>) {
  const getValue = (row: T, key: keyof T | string): any => {
    if (typeof key === "string" && key.includes(".")) {
      // Handle nested properties like 'user.name'
      return key.split(".").reduce((obj, prop) => obj?.[prop], row);
    }
    return row[key as keyof T];
  };

  return (
    <Card className={`gaming-card ${className}`}>
      <div className="p-6">
        {(title || totalCount !== undefined) && (
          <div className="flex items-center justify-between mb-4">
            {title && (
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            )}
            {totalCount !== undefined && (
              <span className="text-sm text-muted-foreground">
                Menampilkan {data.length} dari {totalCount} data
              </span>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={index} className={column.className}>
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column, colIndex) => {
                    const value = getValue(row, column.key);
                    return (
                      <TableCell
                        key={colIndex}
                        className={cn(column.className)}
                      >
                        {column.render ? column.render(value, row) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        )}

        {typeof totalCount === "number" && (
          <div className="mt-6">
            <Pagination total={totalCount} />
          </div>
        )}
      </div>
    </Card>
  );
}

export default DataTable;
