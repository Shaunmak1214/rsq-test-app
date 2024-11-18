"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  MoreHorizontal,
  Calendar1Icon,
  CalendarCheck,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { env } from "@/env";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MaintenanceScheduleForm from "./MaintenanceScheduleForm";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type Maintenance = {
  id: string;
  slug: string;
  remarks: string;
  dueDate: string;
  status: "pending" | "processing" | "success" | "failed";
  type: "annual" | "monthly";
  parts: string[];
  vehicle: {
    vehicleHealth: {
      overall: string;
      engine: string;
      transmission: string;
      brakes: string;
      tires: string;
      fuel: string;
      maintenance: string;
      parts: string;
      total: string;
    };
    name: string;
    slug: string;
  };
  scheduledDate: string;
  scheduledBy: string;
  completedDate: string;
  createdAt: string;
};

export default function MaintenanceList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [maintenanceColumnVisibility, setMaintenanceColumnVisibility] =
    React.useState<VisibilityState>({});
  const [maintenanceRowSelection, setMaintenanceRowSelection] = React.useState(
    {},
  );

  const [maintenanceDetailsSheetOpen, setMaintenanceDetailsSheetOpen] =
    React.useState(false);
  const [editingMaintenance, setEditingMaintenance] =
    React.useState<Maintenance>();

  const [
    maintenanceCancellationSheetOpen,
    setMaintenanceCancellationSheetOpen,
  ] = React.useState(false);

  const { toast } = useToast();

  const {
    isPending: maintenanceDataIsPending,
    error: maintenanceError,
    data: maintenanceData,
  } = useQuery({
    queryKey: ["maintenanceData"],
    queryFn: () =>
      fetch(env.NEXT_PUBLIC_API_URL + "/maintenances/maintenances").then(
        (res) => res.json(),
      ),
  });

  const {
    mutateAsync: removeMaintenance,
    isPending: isRemovingMaintenancePending,
    isError: isRemovingMaintenanceError,
  } = useMutation({
    mutationFn: () =>
      axios.delete(
        env.NEXT_PUBLIC_API_URL +
          "/maintenances/maintenances/" +
          editingMaintenance?.id,
      ),
    onSuccess: () => {
      setMaintenanceDetailsSheetOpen(false);
      setMaintenanceCancellationSheetOpen(false);
      toast({
        title: "Maintenance cancelled successfully",
        description: "If you wish to revert this, please contact support",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to cancel maintenance",
        description: "Please try again later",
      });
    },
  });

  const maintenanceListColumns: ColumnDef<Maintenance>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: "slug",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Slug
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="">{row.getValue("slug")}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "parts",
      header: "Parts",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          {Array.isArray(row.getValue("parts"))
            ? /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
              /* @ts-ignore */
              row.getValue("parts").map((part: string) => (
                <Badge
                  key={part}
                  variant="outline"
                  className="border-b-2 border-gray-600"
                >
                  {part}
                </Badge>
              ))
            : null}
        </div>
      ),
    },
    {
      accessorKey: "scheduledDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Scheduled Date
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">
          {row.getValue("scheduledDate")
            ? new Date(row.getValue("scheduledDate")).toLocaleDateString()
            : null}
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Due Date
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">
          {row.getValue("dueDate")
            ? new Date(row.getValue("dueDate")).toLocaleDateString()
            : null}
        </div>
      ),
      enableSorting: true,
      sortDescFirst: false,
      sortingFn: (a, b) =>
        new Date(a.original.dueDate).getTime() -
        new Date(b.original.dueDate).getTime(),
    },
    {
      id: "actions",
      enableHiding: true,
      header: "Actions",
      cell: ({ row }) => {
        const maintenance = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(maintenance.slug)}
              >
                Copy maintenance slug
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setEditingMaintenance(maintenance);
                  setMaintenanceDetailsSheetOpen(true);
                }}
              >
                View maintenance details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditingMaintenance(maintenance);
                  setMaintenanceCancellationSheetOpen(true);
                }}
              >
                Cancel maintenance
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const maintenanceTable = useReactTable({
    data: maintenanceData ? maintenanceData.results : [],
    columns: maintenanceListColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setMaintenanceColumnVisibility,
    onRowSelectionChange: setMaintenanceRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility: maintenanceColumnVisibility,
      rowSelection: maintenanceRowSelection,
    },
  });

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Card className="relative w-full">
        <CardHeader>
          <CardTitle className="flex flex-col items-start justify-start space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-row items-center justify-start space-x-4">
              <Card className="flex h-10 w-10 flex-row items-center justify-center">
                <Calendar1Icon className="h-5 w-5 text-blue-600" />
              </Card>
              <h4>Scheduled Maintenance</h4>
            </div>

            <div className="flex flex-row items-center justify-end space-x-4">
              <Input
                placeholder="Search slugs..."
                value={
                  (maintenanceTable
                    .getColumn("slug")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  maintenanceTable
                    .getColumn("slug")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Columns <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {maintenanceTable
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {maintenanceTable.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {maintenanceTable.getRowModel().rows?.length ? (
                    maintenanceTable.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={maintenanceListColumns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {maintenanceTable.getFilteredSelectedRowModel().rows.length} of{" "}
                {maintenanceTable.getFilteredRowModel().rows.length} row(s)
                selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => maintenanceTable.previousPage()}
                  disabled={!maintenanceTable.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => maintenanceTable.nextPage()}
                  disabled={!maintenanceTable.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={maintenanceDetailsSheetOpen}
        onOpenChange={setMaintenanceDetailsSheetOpen}
      >
        <DialogContent className="overflow-scroll">
          <DialogHeader>
            <DialogTitle className="flex flex-row items-start justify-start space-x-2">
              <CalendarCheck className="h-5 w-5 text-black" />
              <h4>
                Edit Maintenance -{" "}
                {editingMaintenance ? editingMaintenance.slug : ""}
              </h4>
            </DialogTitle>
          </DialogHeader>

          {editingMaintenance && (
            <MaintenanceScheduleForm
              editingMaintenance={editingMaintenance}
              submitCallback={() => {
                setMaintenanceDetailsSheetOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={maintenanceCancellationSheetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure to cancel this maintenance?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              maintenance from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => removeMaintenance()}>
              Yes, cancel maintenance
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
