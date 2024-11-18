"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import Image from "next/image";
import VanPng from "@/assets/pngs/van.png";
import TruckPng from "@/assets/pngs/truck.png";
import { MultiSelect } from "./ui/multi-select";
import { type Shipment } from "./ShipmentList";
import { useMutation, useQuery } from "@tanstack/react-query";
import { env } from "@/env";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { type Maintenance } from "./MaintenanceList";
import React from "react";

export const partsOptions = [
  {
    label: "Engine",
    value: "engine",
  },
  {
    label: "Transmission",
    value: "transmission",
  },
  {
    label: "Brakes",
    value: "brakes",
  },
  {
    label: "Tires",
    value: "tires",
  },
  {
    label: "Fuel",
    value: "fuel",
  },
  {
    label: "Maintenance",
    value: "maintenance",
  },
  {
    label: "Parts",
    value: "parts",
  },
];

export const maintenanceTypes = ["general", "repair", "annual"];

const formSchema = z.object({
  remarks: z.string(),
  parts: z.array(z.string()),
  type: z.string(),
  dueDate: z.coerce.date(),
  scheduledDate: z.coerce.date(),
});

export type CreateMaintenanceSchedule = {
  vehicleSlug: string;
  remarks: string;
  dueDate: Date;
  parts: string[];
  scheduledDate: Date;
};

export type UpdateMaintenanceSchedule = {
  remarks: string;
  parts: string[];
  dueDate: Date;
  scheduledDate: Date;
};

export default function MaintenanceScheduleForm({
  editingMaintenance,
  editingShipment,
  submitCallback,
}: {
  editingShipment?: Shipment;
  editingMaintenance?: Maintenance;
  submitCallback: () => void;
}) {
  const [vehicle, setVehicle] = React.useState<any>(
    editingShipment
      ? editingShipment.vehicle
      : editingMaintenance
        ? editingMaintenance.vehicle
        : null,
  );

  const {
    mutateAsync: scheduleMaintenance,
    isPending: isSchedulingMaintenancePending,
    isError: isSchedulingMaintenanceError,
  } = useMutation({
    mutationFn: (body: CreateMaintenanceSchedule) =>
      axios.post(env.NEXT_PUBLIC_API_URL + "/maintenances/maintenances", body),
    onSuccess: () => {
      toast.success("Maintenance scheduled successfully");
    },
    onError: (error) => {
      toast.error("Failed to schedule maintenance");
    },
  });

  const {
    mutateAsync: updateMaintenance,
    isPending: isUpdatingMaintenancePending,
    isError: isUpdatingMaintenanceError,
  } = useMutation({
    mutationFn: (body: UpdateMaintenanceSchedule) =>
      axios.patch(
        env.NEXT_PUBLIC_API_URL +
          "/maintenances/maintenances/" +
          editingMaintenance?.id,
        body,
      ),
    onSuccess: () => {
      toast.success("Maintenance scheduled successfully");
    },
    onError: (error) => {
      toast.error("Failed to schedule maintenance");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      scheduledDate: new Date(),
      dueDate: new Date(),
      ...(editingMaintenance
        ? {
            remarks: editingMaintenance.remarks,
            parts: editingMaintenance.parts,
            type: editingMaintenance.type,
            dueDate: new Date(editingMaintenance.dueDate),
            scheduledDate: new Date(editingMaintenance.scheduledDate),
          }
        : undefined),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (editingShipment) {
        await scheduleMaintenance({
          vehicleSlug: editingShipment.vehicle.slug,
          ...values,
        });
      } else if (editingMaintenance) {
        await updateMaintenance({
          ...values,
        });
      }

      submitCallback();
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-3xl space-y-8"
      >
        <Card className="relative flex w-full flex-row justify-between p-4">
          <h4 className="flex flex-row items-center justify-center text-sm font-semibold text-black">
            Vehicle ID{" "}
            <Badge variant="outline" className="ml-2">
              # {vehicle.slug}
            </Badge>
          </h4>

          {vehicle.vehicleType === "truck" ? (
            <Image src={TruckPng} alt="Truck" width={75} height={75} />
          ) : (
            <Image src={VanPng} alt="Van" width={75} height={75} />
          )}
        </Card>

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Input placeholder="Enter remarks" {...field} />
              </FormControl>
              <FormDescription>
                Any remarks to the maintenance team
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parts</FormLabel>
              <FormControl>
                <MultiSelect
                  options={partsOptions}
                  placeholder="What is/was the sickness?"
                  defaultValue={form.watch("parts")}
                  onValueChange={(currentValue: any) => {
                    console.log(currentValue);
                    form.setValue("parts", currentValue);
                  }}
                />
              </FormControl>
              <FormDescription>
                Mention broken parts to be prioritized
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maintenance Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select maintenance type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {maintenanceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduledDate"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>Schedule Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
