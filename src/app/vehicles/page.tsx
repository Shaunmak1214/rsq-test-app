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
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Truck,
  Wrench,
  Container,
  ShieldX,
  Calendar1Icon,
  Squircle,
  MapPinCheckInside,
  MoveRight,
  Clock8Icon,
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import TruckPng from "@/assets/pngs/truck.png";
import VanPng from "@/assets/pngs/van.png";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
];

const cardsData = [
  {
    key: "totalVehicles",
    title: "Total Vehicles",
    desc: "Total trucks, vans running on the road",
    value: 4000,
    icon: Truck,
    classNames: "text-slate-600",
  },
  {
    key: "totalMaintenance",
    title: "Total Maintenance",
    desc: "Total vehicles under maintenance",
    value: 350,
    icon: Wrench,
    classNames: "text-blue-600",
  },
  {
    key: "totalCouriers",
    title: "Total Couriers",
    desc: "Total couriers order processed",
    value: 2450,
    icon: Container,
    classNames: "text-blue-600",
  },
  {
    key: "totalDeadVehicles",
    title: "Total Dead Vehicles",
    desc: "Total vehicles that died",
    value: 2,
    icon: ShieldX,
    classNames: "text-red-600",
  },
];

const vehicleListData: Vehicle[] = [
  {
    vehicleId: "1",
    shipmentId: "SYP-763561",
    vehicleType: "Van",
    status: "Delivering",
    fromTo: {
      from: "New York",
      to: "Los Angeles",
    },
    courierType: "Courier",
    courierName: "Courier Name",
    eta: "2024-11-16T00:00:00.000Z",
    vehicleHealth: {
      overall: "Good",
      engine: "Good",
      transmission: "Good",
      brakes: "Good",
      tires: "Good",
      fuel: "Good",
      maintenance: "Good",
      parts: "Good",
      total: "Good",
    },
    driverName: "Driver Name",
    weight: 100,
    weightUnit: "kg",
  },
  {
    vehicleId: "2",
    shipmentId: "SYP-894572",
    vehicleType: "Truck",
    status: "In Transit",
    fromTo: {
      from: "Miami",
      to: "Chicago",
    },
    courierType: "Freight",
    courierName: "FastFreight Co",
    eta: "2024-11-17T14:30:00.000Z",
    vehicleHealth: {
      overall: "Fair",
      engine: "Good",
      transmission: "Fair",
      brakes: "Good",
      tires: "Fair",
      fuel: "Good",
      maintenance: "Fair",
      parts: "Good",
      total: "Fair",
    },
    driverName: "John Doe",
    weight: 5000,
    weightUnit: "kg",
  },
  {
    vehicleId: "3",
    shipmentId: "SYP-435812",
    vehicleType: "Van",
    status: "Delivering",
    fromTo: {
      from: "Houston",
      to: "Austin",
    },
    courierType: "Courier",
    courierName: "QuickDeliver",
    eta: "2024-11-15T09:00:00.000Z",
    vehicleHealth: {
      overall: "Good",
      engine: "Good",
      transmission: "Good",
      brakes: "Good",
      tires: "Good",
      fuel: "Good",
      maintenance: "Good",
      parts: "Good",
      total: "Good",
    },
    driverName: "Jane Smith",
    weight: 300,
    weightUnit: "kg",
  },
  {
    vehicleId: "4",
    shipmentId: "SYP-128390",
    vehicleType: "SUV",
    status: "Idle",
    fromTo: {
      from: "Boston",
      to: "Philadelphia",
    },
    courierType: "Courier",
    courierName: "SafeCourier",
    eta: "2024-11-18T10:15:00.000Z",
    vehicleHealth: {
      overall: "Excellent",
      engine: "Excellent",
      transmission: "Good",
      brakes: "Excellent",
      tires: "Good",
      fuel: "Good",
      maintenance: "Excellent",
      parts: "Good",
      total: "Excellent",
    },
    driverName: "Mike Johnson",
    weight: 200,
    weightUnit: "kg",
  },
  {
    vehicleId: "5",
    shipmentId: "SYP-657921",
    vehicleType: "Truck",
    status: "Delivering",
    fromTo: {
      from: "San Francisco",
      to: "Seattle",
    },
    courierType: "Freight",
    courierName: "Northwest Freight",
    eta: "2024-11-19T18:00:00.000Z",
    vehicleHealth: {
      overall: "Good",
      engine: "Good",
      transmission: "Good",
      brakes: "Good",
      tires: "Good",
      fuel: "Good",
      maintenance: "Good",
      parts: "Good",
      total: "Good",
    },
    driverName: "Alice Lee",
    weight: 4500,
    weightUnit: "kg",
  },
  {
    vehicleId: "6",
    shipmentId: "SYP-947820",
    vehicleType: "Motorcycle",
    status: "In Transit",
    fromTo: {
      from: "Las Vegas",
      to: "Phoenix",
    },
    courierType: "Express",
    courierName: "QuickRide",
    eta: "2024-11-15T11:45:00.000Z",
    vehicleHealth: {
      overall: "Good",
      engine: "Good",
      transmission: "Good",
      brakes: "Good",
      tires: "Good",
      fuel: "Good",
      maintenance: "Good",
      parts: "Good",
      total: "Good",
    },
    driverName: "Tom Hardy",
    weight: 50,
    weightUnit: "kg",
  },
  {
    vehicleId: "7",
    shipmentId: "SYP-342519",
    vehicleType: "Van",
    status: "Idle",
    fromTo: {
      from: "Denver",
      to: "Salt Lake City",
    },
    courierType: "Courier",
    courierName: "RockyExpress",
    eta: "2024-11-20T07:00:00.000Z",
    vehicleHealth: {
      overall: "Fair",
      engine: "Good",
      transmission: "Fair",
      brakes: "Good",
      tires: "Fair",
      fuel: "Good",
      maintenance: "Fair",
      parts: "Good",
      total: "Fair",
    },
    driverName: "Chris Evans",
    weight: 250,
    weightUnit: "kg",
  },
  {
    vehicleId: "8",
    shipmentId: "SYP-783465",
    vehicleType: "Truck",
    status: "In Transit",
    fromTo: {
      from: "San Diego",
      to: "Sacramento",
    },
    courierType: "Freight",
    courierName: "CaliHaul",
    eta: "2024-11-16T12:00:00.000Z",
    vehicleHealth: {
      overall: "Good",
      engine: "Good",
      transmission: "Good",
      brakes: "Good",
      tires: "Good",
      fuel: "Good",
      maintenance: "Good",
      parts: "Good",
      total: "Good",
    },
    driverName: "Diana Prince",
    weight: 6000,
    weightUnit: "kg",
  },
  {
    vehicleId: "9",
    shipmentId: "SYP-293847",
    vehicleType: "Van",
    status: "Delivering",
    fromTo: {
      from: "Atlanta",
      to: "Charlotte",
    },
    courierType: "Courier",
    courierName: "Southeast Deliveries",
    eta: "2024-11-15T13:00:00.000Z",
    vehicleHealth: {
      overall: "Good",
      engine: "Good",
      transmission: "Good",
      brakes: "Good",
      tires: "Good",
      fuel: "Good",
      maintenance: "Good",
      parts: "Good",
      total: "Good",
    },
    driverName: "Bruce Wayne",
    weight: 150,
    weightUnit: "kg",
  },
];

export type Vehicle = {
  vehicleId: string;
  shipmentId: string;
  driverName: string;
  weight: number;
  weightUnit: string;
  vehicleType: string;
  status: string;
  fromTo: {
    from: string;
    to: string;
  };
  courierType: string;
  courierName: string;
  eta: string;
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
};

export const vehicleListColumns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "vehicleId",
    header: "Vehicle ID",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("vehicleId")}</div>
    ),
  },
  {
    accessorKey: "shipmentId",
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
    accessorKey: "fromTo.from",
    header: "From",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("fromTo.from")}</div>
    ),
  },
  {
    accessorKey: "fromTo.to",
    header: "To",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("fromTo.to")}</div>
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

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

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
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [maintenanceColumnVisibility, setMaintenanceColumnVisibility] =
    React.useState<VisibilityState>({});
  const [maintenanceRowSelection, setMaintenanceRowSelection] = React.useState(
    {},
  );
  const [vehicleColumnVisibility, setVehicleColumnVisibility] =
    React.useState<VisibilityState>({});
  const [vehicleRowSelection, setVehicleRowSelection] = React.useState({});

  const maintenanceTable = useReactTable({
    data,
    columns,
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

  const vehicleTable = useReactTable({
    data: vehicleListData,
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

  return (
    <div className="mt-5 flex w-full flex-col items-start justify-start space-y-5 px-4 py-4">
      <div className="grid w-full grid-cols-4 grid-rows-1 gap-4">
        {cardsData.map((card, idx) => (
          <Card key={idx} className="relative">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
            </CardContent>
            <CardFooter>
              <p>{card.desc}</p>
            </CardFooter>

            <div className="absolute right-5 top-5 flex items-center gap-2">
              <Card className="flex h-12 w-12 flex-row items-center justify-center">
                <card.icon className={cn(card.classNames, "h-6 w-6")} />
              </Card>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex w-full flex-col items-center justify-center">
        <Card className="relative w-full">
          <CardHeader>
            <CardTitle className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-start space-x-4">
                <Card className="flex h-10 w-10 flex-row items-center justify-center">
                  <Truck className="h-5 w-5 text-blue-600" />
                </Card>
                <h4>Vehicle Lists</h4>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full grid-cols-2 grid-rows-1 gap-4">
              <div>
                <div className="flex h-full max-h-[400px] w-full flex-col space-y-4 overflow-auto scroll-smooth px-4 py-4">
                  {vehicleTable.getRowModel().rows?.length ? (
                    vehicleTable.getRowModel().rows.map((row) => (
                      <Card
                        key={row.id}
                        className={`border-1 cursor-pointer ${row.getIsSelected() ? "border-2 border-blue-600" : ""}`}
                        onClick={() => {
                          row.toggleSelected();
                          vehicleTable.getRowModel().rows.forEach((row) => {
                            row.toggleSelected(false);
                          });
                        }}
                      >
                        <CardContent>
                          <div className="grid w-full grid-cols-2 grid-rows-1 gap-4 pt-4">
                            <div className="flex w-full flex-col items-start justify-start space-y-2">
                              <h4 className="text-sm text-gray-500">
                                Shipment ID
                              </h4>
                              <h2 className="text-xl font-bold text-gray-900">
                                {row.original.shipmentId}
                              </h2>

                              <div className="flex w-full flex-row items-center justify-start space-x-5">
                                <div className="flex flex-row items-center justify-center space-x-2">
                                  <div className="rounded-full bg-green-50 p-2">
                                    <Squircle className="h-3 w-3 text-green-600" />
                                  </div>

                                  <p className="text-sm text-gray-600">
                                    {row.original.fromTo.from}
                                  </p>
                                </div>

                                <MoveRight className="h-5 w-5 text-gray-600" />

                                <div className="flex flex-row items-center justify-center space-x-2">
                                  <div className="rounded-full bg-blue-50 p-2">
                                    <MapPinCheckInside className="h-3 w-3 text-blue-600" />
                                  </div>

                                  <p className="text-sm text-gray-600">
                                    {row.original.fromTo.to}
                                  </p>
                                </div>
                              </div>

                              <div className="flex w-full flex-row items-center justify-center space-x-2">
                                <Button
                                  variant="outline"
                                  className="flex flex-row items-center justify-center px-4"
                                >
                                  <span className="text-center text-sm text-gray-700">
                                    Schedule Maintenance
                                  </span>

                                  <Wrench className="h-5 w-5 text-blue-600" />
                                </Button>
                              </div>
                            </div>

                            <div className="w-50 flex flex-col items-end justify-center">
                              {row.original.vehicleType === "Truck" ? (
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
                    {vehicleTable.getFilteredSelectedRowModel().rows.length} of{" "}
                    {vehicleTable.getFilteredRowModel().rows.length} row(s)
                    selected.
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => vehicleTable.previousPage()}
                      disabled={!vehicleTable.getCanPreviousPage()}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => vehicleTable.nextPage()}
                      disabled={!vehicleTable.getCanNextPage()}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex h-full w-full flex-col items-start justify-start space-y-10 p-4">
                <div className="flex w-full flex-row items-center justify-between space-x-4">
                  <div className="flex flex-row items-center justify-center space-x-2">
                    <Card className="flex h-10 w-10 flex-row items-center justify-center">
                      <Truck className="h-5 w-5 text-gray-600" />
                    </Card>

                    <h4 className="flex flex-row items-center justify-center text-lg font-semibold text-black">
                      Shipment ID{" "}
                      <Badge variant="outline" className="ml-2">
                        # SYP-763561
                      </Badge>
                    </h4>
                  </div>

                  <Badge
                    variant={"outline"}
                    className="flex flex-row items-center justify-center space-x-2"
                  >
                    <Clock8Icon className="h-3 w-3 text-gray-600" />

                    <p className="text-xs font-light text-gray-500">
                      Status last updated at <b>12:00 AM</b>
                    </p>
                  </Badge>
                </div>

                <div className="grid w-full grid-cols-4 grid-rows-1 gap-4">
                  <div className="flex flex-col items-center justify-center space-y-2 border-r-2 border-gray-200">
                    <div className="flex flex-row items-center justify-center space-x-1">
                      <Truck className="h-5 w-5 text-gray-600" />
                      <h4 className="text-sm text-gray-500">Vehicle Type</h4>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900">
                      {vehicleTable.getRowModel().rows?.length
                        ? vehicleTable.getRowModel().rows[0].original
                            .vehicleType
                        : "Loading..."}
                    </h2>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-2 border-r-2 border-gray-200">
                    <div className="flex flex-row items-center justify-center space-x-1">
                      <div className="rounded-full bg-gray-50 p-2">
                        <Squircle className="h-3 w-3 text-gray-600" />
                      </div>
                      <h4 className="text-sm text-gray-500">Status</h4>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {vehicleTable.getRowModel().rows?.length
                        ? vehicleTable.getRowModel().rows[0].original.status
                        : "Loading..."}
                    </h2>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-2 border-r-2 border-gray-200">
                    <div className="flex flex-row items-center justify-center space-x-1">
                      <Container className="h-3 w-3 text-gray-600" />
                      <h4 className="text-sm text-gray-500">Courier Type</h4>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {vehicleTable.getRowModel().rows?.length
                        ? vehicleTable.getRowModel().rows[0].original
                            .courierType
                        : "Loading..."}
                    </h2>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="flex flex-row items-center justify-center space-x-1">
                      <Wrench className="h-3 w-3 text-gray-600" />
                      <h4 className="text-sm text-gray-500">Vehicle Health</h4>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {vehicleTable.getRowModel().rows?.length
                        ? vehicleTable.getRowModel().rows[0].original
                            .vehicleHealth.overall
                        : "Loading..."}
                    </h2>
                  </div>
                </div>

                <div className="flex w-full flex-col items-start justify-start space-x-4 space-y-2">
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

                            <p className="text-sm text-gray-600">New York</p>
                          </div>

                          <p className="text-xs text-gray-500">
                            Depart Time <b>12:00 AM</b>
                          </p>
                        </div>

                        <MoveRight className="h-5 w-5 text-gray-600" />

                        <div className="flex flex-col items-start justify-start space-y-2">
                          <div className="flex flex-row items-center justify-center space-x-2">
                            <div className="rounded-full bg-blue-50 p-2">
                              <MapPinCheckInside className="h-3 w-3 text-blue-600" />
                            </div>

                            <p className="text-sm text-gray-600">Los Angeles</p>
                          </div>

                          <p className="text-xs text-gray-500">
                            ETA Time <b>12:00 AM</b>
                          </p>
                        </div>
                      </div>

                      {/* <div className="h-[1px] w-full bg-gray-200"></div> */}
                    </div>
                  </Card>
                </div>

                <div className="flex w-full flex-col items-start justify-start space-x-4 space-y-2">
                  <h4 className="text-md font-semibold text-gray-700">
                    Vehicle Health
                  </h4>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex w-full flex-col items-center justify-center">
        <Card className="relative w-full">
          <CardHeader>
            <CardTitle className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-start space-x-4">
                <Card className="flex h-10 w-10 flex-row items-center justify-center">
                  <Calendar1Icon className="h-5 w-5 text-blue-600" />
                </Card>
                <h4>Total Maintainence Scheduled</h4>
              </div>

              <div className="flex flex-row items-center justify-end space-x-4">
                <Input
                  placeholder="Filter emails..."
                  value={
                    (maintenanceTable
                      .getColumn("email")
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    maintenanceTable
                      .getColumn("email")
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
                          colSpan={columns.length}
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
                  {maintenanceTable.getFilteredSelectedRowModel().rows.length}{" "}
                  of {maintenanceTable.getFilteredRowModel().rows.length} row(s)
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
      </div>
    </div>
  );
}
