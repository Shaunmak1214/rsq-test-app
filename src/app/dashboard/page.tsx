"use client";

import * as React from "react";

import { Truck, Wrench, Container, ShieldX } from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { env } from "@/env";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ShipmentList from "@/components/ShipmentList";
import MaintenanceList from "@/components/MaintenanceList";

export default function Dashboard() {
  const [analyticsData, setAnalyticsData] = React.useState<
    {
      key: string;
      title: string;
      desc: string;
      value: number;
      icon: any;
      classNames: string;
    }[]
  >([]);

  const { isPending: isAnalyticsPending } = useQuery({
    queryKey: ["analyticsData"],
    queryFn: () =>
      fetch(env.NEXT_PUBLIC_API_URL + "/shipments/analytics/").then(
        async (res) => {
          const jsonData = await res.json();

          setAnalyticsData([
            {
              key: "totalVehicles",
              title: "Total Vehicles",
              desc: "Total trucks, vans running on the road",
              value: jsonData?.totalVehicles || 0,
              icon: Truck,
              classNames: "text-slate-600",
            },
            {
              key: "totalMaintenance",
              title: "Total Maintenance",
              desc: "Total vehicles under maintenance",
              value: jsonData?.totalMaintenance || 0,
              icon: Wrench,
              classNames: "text-blue-600",
            },
            {
              key: "totalCouriers",
              title: "Total Couriers",
              desc: "Total couriers order processed",
              value: jsonData?.totalShipments || 0,
              icon: Container,
              classNames: "text-blue-600",
            },
            {
              key: "totalDeadVehicles",
              title: "Total Dead Vehicles",
              desc: "Total vehicles that died",
              value: jsonData?.totalDead || 0,
              icon: ShieldX,
              classNames: "text-red-600",
            },
          ]);
        },
      ),
  });

  return (
    <div className="mt-5 flex w-full flex-col items-start justify-start space-y-5 px-4 py-4">
      <div className="grid w-full grid-cols-1 grid-rows-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isAnalyticsPending ? (
          <div className="flex w-full flex-col items-center justify-center">
            <Skeleton count={5} />
          </div>
        ) : (
          analyticsData.map((card, idx: number) => (
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
                  <card.icon
                    className={
                      card?.classNames ? cn(card?.classNames, "h-6 w-6") : ""
                    }
                  />
                </Card>
              </div>
            </Card>
          ))
        )}
      </div>

      <ShipmentList />
      <MaintenanceList />
    </div>
  );
}
