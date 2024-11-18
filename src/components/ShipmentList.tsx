"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Truck,
  Wrench,
  Container,
  Squircle,
  MapPinCheckInside,
  MoveRight,
  BadgeInfo,
  CalendarCheck,
  FileWarningIcon,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { env } from "@/env";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

import EnginePng from "@/assets/pngs/engine.png";
import TransmissionPng from "@/assets/pngs/transmission.png";
import TiresPng from "@/assets/pngs/tires.png";
import VanPng from "@/assets/pngs/van.png";
import FuelPng from "@/assets/pngs/fuel.png";
import TruckPng from "@/assets/pngs/truck.png";
import EmptyJpg from "@/assets/jpgs/empty.jpg";
import MaintenanceScheduleForm from "./MaintenanceScheduleForm";

import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Input } from "./ui/input";

export type Shipment = {
  id: string;
  slug: string;
  vehicleId: string;
  shipmentId: string;
  driverName: string;
  weight: number;
  weightUnit: string;
  vehicleType: string;
  status: string;
  fromTo: {
    from: {
      name: string;
      time: string;
    };
    to: {
      name: string;
      time: string;
    };
  };
  courierType: string;
  courierName: string;
  eta: string;
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
};

const vehicleListColumns: ColumnDef<Shipment>[] = [
  {
    accessorKey: "slug",
    header: "Shipment ID",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("shipmentId")}</div>
    ),
  },
  {
    accessorKey: "vehicleType",
    header: "Vehicle Type",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("vehicleType")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "fromTo.from.name",
    header: "From",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("fromTo.from.name")}</div>
    ),
  },
  {
    accessorKey: "fromTo.to.name",
    header: "To",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("fromTo.to.name")}</div>
    ),
  },
  {
    accessorKey: "courierType",
    header: "Courier Type",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("courierType")}</div>
    ),
  },
  {
    accessorKey: "eta",
    header: "ETA",
    cell: ({ row }) => <div className="lowercase">{row.getValue("eta")}</div>,
  },
  {
    accessorKey: "vehicleHealth.overall",
    header: "Overall Health",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("vehicleHealth.overall")}</div>
    ),
  },
  {
    accessorKey: "driverName",
    header: "Driver Name",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("driverName")}</div>
    ),
  },
  {
    accessorKey: "weight",
    header: "Weight",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("weight")}</div>
    ),
  },
  {
    accessorKey: "weightUnit",
    header: "Weight Unit",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("weightUnit")}</div>
    ),
  },
];

export default function ShipmentList() {
  const isMobile = useIsMobile();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [vehicleColumnVisibility, setVehicleColumnVisibility] =
    React.useState<VisibilityState>({});
  const [vehicleRowSelection, setVehicleRowSelection] = React.useState({});
  const [shipmentDetailsSheetOpen, setShipmentDetailsSheetOpen] =
    React.useState(false);
  const [scheduleDetailsSheetOpen, setScheduleDetailsSheetOpen] =
    React.useState(false);

  const [editingShipment, setEditingShipment] = React.useState<Shipment>();
  const [shipmentCancellationSheetOpen, setShipmentCancellationSheetOpen] =
    React.useState(false);

  const { toast } = useToast();

  const {
    isPending: shipmentDataIsPending,
    error: shipmentError,
    data: shipmentData,
    refetch: refetchShipmentData,
  } = useQuery({
    queryKey: ["shipmentsData"],
    queryFn: () =>
      fetch(env.NEXT_PUBLIC_API_URL + "/shipments/shipments").then((res) =>
        res.json(),
      ),
  });

  const {
    mutateAsync: removeShipment,
    isPending: isRemovingShipmentPending,
    isError: isRemovingShipmentError,
  } = useMutation({
    mutationFn: () =>
      axios.delete(
        env.NEXT_PUBLIC_API_URL + "/shipments/shipments/" + editingShipment?.id,
      ),
    onSuccess: async () => {
      setShipmentCancellationSheetOpen(false);
      toast({
        title: "Shipment cancelled successfully",
        description: "If you wish to revert this, please contact support",
      });
      await refetchShipmentData();
    },
    onError: (error) => {
      toast({
        title: "Failed to cancel shipment",
        description: "Please try again later",
      });
    },
  });

  const shipmentsTable = useReactTable({
    data: shipmentData ? shipmentData.results : [],
    columns: vehicleListColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setVehicleColumnVisibility,
    onRowSelectionChange: setVehicleRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility: vehicleColumnVisibility,
      rowSelection: vehicleRowSelection,
    },
  });

  const ShipmentDetailsContent = ({
    selectedShipmentDetails,
  }: {
    selectedShipmentDetails: Shipment | null | undefined;
  }) => {
    if (!selectedShipmentDetails) {
      return <div></div>;
    }

    return (
      <div className="h-full w-full flex-col items-start justify-start space-y-10 p-0 md:p-4">
        <div className="flex w-full flex-col items-start justify-between space-x-4 space-y-4 md:flex-row">
          <div className="flex flex-row items-center justify-center space-x-2">
            <Card className="flex h-10 w-10 flex-row items-center justify-center">
              <Truck className="h-5 w-5 text-gray-600" />
            </Card>

            <h4 className="flex flex-row items-center justify-center text-lg font-semibold text-black">
              Shipment ID{" "}
              <Badge variant="outline" className="ml-2">
                # {selectedShipmentDetails.slug}
              </Badge>
            </h4>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 grid-rows-1 gap-4 sm:grid-cols-2 sm:gap-4 md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-4">
          <div className="flex flex-col items-start justify-center space-y-2 border-r-2 border-gray-200">
            <div className="flex flex-row items-center justify-center space-x-1">
              <Truck className="h-5 w-5 text-gray-600" />
              <h4 className="text-sm text-gray-500">Vehicle Type</h4>
            </div>

            <h2 className="text-md font-bold text-gray-900">
              {selectedShipmentDetails.vehicle?.name
                ? selectedShipmentDetails.vehicle?.name
                : "Loading..."}
            </h2>
          </div>

          <div className="flex flex-col items-start justify-center space-y-2 border-r-2 border-gray-200">
            <div className="flex flex-row items-center justify-center space-x-1">
              <div className="rounded-full bg-gray-50 p-2">
                <Squircle className="h-3 w-3 text-gray-600" />
              </div>
              <h4 className="text-sm text-gray-500">Status</h4>
            </div>
            <h2 className="text-md font-bold text-gray-900">
              {selectedShipmentDetails.status
                ? selectedShipmentDetails.status
                : "Loading..."}
            </h2>
          </div>

          <div className="flex flex-col items-start justify-center space-y-2 border-r-2 border-gray-200">
            <div className="flex flex-row items-center justify-center space-x-1">
              <Container className="h-3 w-3 text-gray-600" />
              <h4 className="text-sm text-gray-500">Courier Type</h4>
            </div>
            <h2 className="text-md font-bold text-gray-900">
              {selectedShipmentDetails.courierType
                ? selectedShipmentDetails.courierType
                : "Loading..."}
            </h2>
          </div>

          <div className="flex flex-col items-start justify-center space-y-2">
            <div className="flex flex-row items-center justify-center space-x-1">
              <Wrench className="h-3 w-3 text-gray-600" />
              <h4 className="text-sm text-gray-500">Vehicle Health</h4>
            </div>
            <h2 className="text-md font-bold text-gray-900">
              {selectedShipmentDetails.vehicle?.vehicleHealth?.overall
                ? selectedShipmentDetails.vehicle?.vehicleHealth?.overall
                : "Loading..."}
            </h2>
          </div>
        </div>

        <div className="flex w-full flex-col items-start justify-start space-x-0 space-y-2 md:space-x-4">
          <h4 className="text-md font-semibold text-gray-700">
            Shipment Timeline
          </h4>
          <Card className="flex w-full flex-row items-center justify-between p-4">
            <div className="flex w-full flex-col items-center justify-center space-y-4">
              <div className="flex w-full flex-row items-center justify-between space-x-5">
                <div className="flex flex-col items-start justify-start space-y-2">
                  <div className="flex flex-row items-center justify-center space-x-2">
                    <div className="rounded-full bg-green-50 p-2">
                      <Squircle className="h-3 w-3 text-green-600" />
                    </div>

                    <p className="text-sm text-gray-600">
                      {selectedShipmentDetails.fromTo.from.name}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500">
                    Depart Time{" "}
                    <b>
                      {selectedShipmentDetails.fromTo.from.time
                        ? new Date(
                            selectedShipmentDetails.fromTo.from.time,
                          ).toLocaleTimeString()
                        : new Date().toLocaleTimeString()}
                    </b>
                  </p>
                </div>

                <MoveRight className="h-5 w-5 text-gray-600" />

                <div className="flex flex-col items-start justify-start space-y-2">
                  <div className="flex flex-row items-center justify-center space-x-2">
                    <div className="rounded-full bg-blue-50 p-2">
                      <MapPinCheckInside className="h-3 w-3 text-blue-600" />
                    </div>

                    <p className="text-sm text-gray-600">
                      {selectedShipmentDetails.fromTo.to.name}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500">
                    ETA Time{" "}
                    <b>
                      {selectedShipmentDetails.fromTo.to.time
                        ? new Date(
                            selectedShipmentDetails.fromTo.to.time,
                          ).toLocaleTimeString()
                        : new Date().toLocaleTimeString()}
                    </b>
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex w-full flex-col items-start justify-start space-x-0 space-y-2 md:space-x-4">
          <h4 className="text-md font-semibold text-gray-700">
            Vehicle Health
          </h4>

          <div className="grid w-full grid-cols-2 grid-rows-1 gap-4">
            <Card className="flex w-full flex-col items-start justify-start space-y-2 border-none bg-gray-50 p-4 shadow-none">
              <Image src={EnginePng} alt="Engine" width={50} height={50} />
              <h4 className="text-sm text-gray-500">Engine</h4>
              <h2 className="text-lg font-bold capitalize text-gray-900">
                {selectedShipmentDetails.vehicle.vehicleHealth?.engine
                  ? selectedShipmentDetails.vehicle.vehicleHealth?.engine
                  : "Loading..."}
              </h2>
            </Card>

            <Card className="flex w-full flex-col items-start justify-start space-y-2 border-none bg-gray-50 p-4 shadow-none">
              <Image
                src={TransmissionPng}
                alt="Transmission"
                width={50}
                height={50}
              />
              <h4 className="text-sm text-gray-500">Transmission</h4>
              <h2 className="text-lg font-bold capitalize text-gray-900">
                {selectedShipmentDetails.vehicle.vehicleHealth?.transmission
                  ? selectedShipmentDetails.vehicle.vehicleHealth?.transmission
                  : "Loading..."}
              </h2>
            </Card>

            <Card className="flex w-full flex-col items-start justify-start space-y-2 border-none bg-gray-50 p-4 shadow-none">
              <Image src={TiresPng} alt="Tires" width={50} height={50} />
              <h4 className="text-sm text-gray-500">Tires</h4>
              <h2 className="text-lg font-bold capitalize text-gray-900">
                {" "}
                {selectedShipmentDetails.vehicle.vehicleHealth?.tires
                  ? selectedShipmentDetails.vehicle.vehicleHealth?.tires
                  : "Loading..."}
              </h2>
            </Card>

            <Card className="flex w-full flex-col items-start justify-start space-y-2 border-none bg-gray-50 p-4 shadow-none">
              <Image src={FuelPng} alt="Fuel" width={50} height={50} />
              <h4 className="text-sm text-gray-500">Fuel</h4>
              <h2 className="text-lg font-bold capitalize text-gray-900">
                {selectedShipmentDetails.vehicle.vehicleHealth?.fuel
                  ? selectedShipmentDetails.vehicle.vehicleHealth?.fuel
                  : "Loading..."}
              </h2>
            </Card>
          </div>
        </div>

        <Button
          variant="outline"
          className="flex flex-row items-center justify-center px-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShipmentCancellationSheetOpen(true);
            setEditingShipment(selectedShipmentDetails);
          }}
        >
          <span className="text-center text-sm text-gray-700">
            Cancel Shipment
          </span>

          <FileWarningIcon className="h-5 w-5 text-red-600" />
        </Button>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Card className="relative w-full">
        <CardHeader>
          <CardTitle className="flex flex-col items-start justify-start space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex flex-row items-center justify-start space-x-4">
              <Card className="flex h-10 w-10 flex-row items-center justify-center">
                <Truck className="h-5 w-5 text-blue-600" />
              </Card>
              <h4>On-going shipments</h4>
            </div>

            <div className="flex flex-row items-center justify-end space-x-4">
              <Input
                placeholder="Search shipment id..."
                value={
                  (shipmentsTable
                    .getColumn("slug")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  shipmentsTable
                    .getColumn("slug")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Sorter <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {shipmentsTable
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={!!column.getIsSorted()}
                          onCheckedChange={(value) =>
                            column.toggleSorting(!!value)
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
          <div className="grid w-full grid-cols-1 grid-rows-1 gap-4 lg:grid-cols-2 lg:gap-4">
            <div className="flex flex-col">
              <div className="flex h-full max-h-[700px] w-full flex-col space-y-4 overflow-auto scroll-smooth px-4 py-4">
                {shipmentsTable.getRowModel().rows?.length ? (
                  shipmentsTable.getRowModel().rows.map((row) => (
                    <Card
                      key={row.id}
                      className={`border-1 cursor-pointer ${row.getIsSelected() ? "border-2 border-blue-600" : ""}`}
                      onClick={() => {
                        row.toggleSelected();
                        shipmentsTable.getRowModel().rows.forEach((row) => {
                          row.toggleSelected(false);
                        });
                      }}
                    >
                      <CardContent>
                        <div className="grid w-full grid-cols-2 grid-rows-1 gap-4 pt-4">
                          <div className="flex w-full flex-col items-start justify-start space-y-3">
                            <h4 className="text-sm text-gray-500">
                              Shipment ID
                            </h4>
                            <h2 className="text-xl font-bold text-gray-900">
                              {row.original.slug}
                            </h2>

                            <div className="flex w-full flex-row items-center justify-start space-x-5">
                              <div className="flex flex-row items-center justify-center space-x-2">
                                <div className="rounded-full bg-green-50 p-2">
                                  <Squircle className="h-3 w-3 text-green-600" />
                                </div>

                                <p className="text-sm text-gray-600">
                                  {row.original.fromTo.from.name}
                                </p>
                              </div>

                              <MoveRight className="h-5 w-5 text-gray-600" />

                              <div className="flex flex-row items-center justify-center space-x-2">
                                <div className="rounded-full bg-blue-50 p-2">
                                  <MapPinCheckInside className="h-3 w-3 text-blue-600" />
                                </div>

                                <p className="text-sm text-gray-600">
                                  {row.original.fromTo.to.name}
                                </p>
                              </div>
                            </div>

                            <div className="flex w-full flex-col items-start justify-start space-y-3 md:flex-row md:items-center md:justify-start md:space-x-2">
                              <Button
                                variant="outline"
                                className="flex flex-row items-center justify-center px-4"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setScheduleDetailsSheetOpen(true);
                                  setEditingShipment(row.original);
                                }}
                              >
                                <span className="text-center text-sm text-gray-700">
                                  Schedule Maintenance
                                </span>

                                <Wrench className="h-5 w-5 text-blue-600" />
                              </Button>

                              <Button
                                variant="outline"
                                className="flex flex-row items-center justify-center px-4 lg:hidden"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setShipmentDetailsSheetOpen(true);
                                  row.toggleSelected(true);
                                }}
                              >
                                <span className="text-center text-sm text-gray-700">
                                  Show Details
                                </span>

                                <BadgeInfo className="h-5 w-5 text-gray-600" />
                              </Button>
                            </div>
                          </div>

                          <div className="lg:w-50 hidden flex-col items-end justify-center lg:flex">
                            {row.original.vehicleType === "truck" ? (
                              <Image
                                src={TruckPng}
                                alt="Truck"
                                width={200}
                                height={200}
                              />
                            ) : (
                              <Image
                                src={VanPng}
                                alt="Van"
                                width={200}
                                height={200}
                              />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="no-results">
                    <p>No results found.</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {shipmentsTable.getFilteredSelectedRowModel().rows.length} of{" "}
                  {shipmentsTable.getFilteredRowModel().rows.length} row(s)
                  selected.
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shipmentsTable.previousPage()}
                    disabled={!shipmentsTable.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shipmentsTable.nextPage()}
                    disabled={!shipmentsTable.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex">
              {shipmentsTable.getSelectedRowModel().rows[0]?.original ? (
                <ShipmentDetailsContent
                  selectedShipmentDetails={
                    shipmentsTable.getSelectedRowModel().rows[0]?.original
                      ? shipmentsTable.getSelectedRowModel().rows[0]?.original
                      : undefined
                  }
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
                  <Image src={EmptyJpg} width={150} height={"auto"} />
                  <h4>No shipment selected</h4>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isMobile && (
        <Dialog
          open={shipmentDetailsSheetOpen}
          onOpenChange={setShipmentDetailsSheetOpen}
        >
          <DialogContent className="h-[80vh] overflow-scroll">
            <DialogHeader>
              <DialogTitle>Shipment Details</DialogTitle>
              <ShipmentDetailsContent
                selectedShipmentDetails={
                  shipmentsTable.getSelectedRowModel().rows[0]?.original
                    ? shipmentsTable.getSelectedRowModel().rows[0]?.original
                    : undefined
                }
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}

      <Dialog
        open={scheduleDetailsSheetOpen}
        onOpenChange={setScheduleDetailsSheetOpen}
      >
        <DialogContent className="overflow-scroll">
          <DialogHeader>
            <DialogTitle className="flex flex-row items-start justify-start space-x-2">
              <CalendarCheck className="h-5 w-5 text-black" />
              <h4>Schedule Maintenance</h4>
            </DialogTitle>
          </DialogHeader>

          {editingShipment && (
            <MaintenanceScheduleForm
              editingShipment={editingShipment}
              submitCallback={() => {
                setScheduleDetailsSheetOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={shipmentCancellationSheetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure to cancel this shipment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              maintenance from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => removeShipment()}>
              Yes, cancel shipment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
