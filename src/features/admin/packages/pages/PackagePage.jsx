import React, { useEffect, useState } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { getAllPackageData } from "../../../../utils/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/Table";

const historyRows = [
  ["Basic", "₹49.00", "22 Aug 2024", "SC23654125478", "Monthly", "21 Aug 2025"],
  [
    "Premium",
    "₹99.00",
    "03 Feb 2023",
    "SC23654122563",
    "Monthly",
    "02 Feb 2024",
  ],
  [
    "Premium",
    "₹99.00",
    "03 Feb 2023",
    "SC23654122563",
    "Monthly",
    "02 Feb 2024",
  ],
  [
    "Premium",
    "₹99.00",
    "03 Feb 2023",
    "SC23654122563",
    "Monthly",
    "02 Feb 2024",
  ],
];

const detailRows = [
  ["Basic", "₹49.00", "50", "124"],
  ["Premium", "₹99.00", "200", "432"],
  ["Enterprise", "₹249.00", "Unlimited", "86"],
];

const PlanCard = ({ plan }) => (
  <Card
    className={`h-full rounded-2xl ${
      plan.active ? "border-primary shadow-md" : "border-border shadow-sm"
    }`}
  >
    <CardContent className="flex h-full flex-col p-6">
      <div>
        <h3 className="text-xl font-semibold text-foreground">₹{plan?.name}</h3>
        <div className="mt-3 flex items-end gap-1">
          <span className="text-4xl font-bold tracking-tight text-foreground">
            {plan.price}
          </span>
          <span className="pb-1 text-sm text-muted-foreground">
            {plan.period}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {plan?.features?.map((feature, index) => (
          <div
            key={index}
            className="flex items-start gap-2 text-sm text-muted-foreground"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button
          variant={plan.current ? "outline" : "default"}
          className="w-full"
        >
          {plan.cta}
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function PackagePage() {
  const [plans, setPlans] = useState([]);
  const [loaderCheck, setLoaderCheck] = useState(false);

  const PackageGetAllApi = async () => {
    setLoaderCheck(true);
    console.log(response?.data);
    try {
      const response = await getAllPackageData();

      console.log("package data", response);

      if (response?.data?.status === "success") {
        setPlans(response?.data?.packages || []);
        setLoaderCheck(false);
      } else {
        toast.error(response?.data?.message);
        setLoaderCheck(false);
      }
    } catch (error) {
      console.log(error);
      setLoaderCheck(false);
    }
  };
  useEffect(() => {
    PackageGetAllApi();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Subscription Package
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Upgrade your plan to unlock advanced features, increase service
            limits, and manage your hostel more efficiently.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans?.map((plan, index) => (
            <PlanCard key={index} plan={plan} />
          ))}
        </div>

        <section className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              Subscription History
            </h2>
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Transaction ID" className="pl-9" />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PACKAGE NAME</TableHead>
                <TableHead>PRICE</TableHead>
                <TableHead>PURCHASE DATE</TableHead>
                <TableHead>TXN. NUMBER</TableHead>
                <TableHead>BILLING CYCLE</TableHead>
                <TableHead>EXPIRY DATE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyRows.map((row, index) => (
                <TableRow key={`${row[0]}-${index}`}>
                  {row.map((cell) => (
                    <TableCell key={`${cell}-${index}`}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Detailed Package List
          </h2>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PACKAGE NAME</TableHead>
                <TableHead>PRICE</TableHead>
                <TableHead>MAX STUDENTS</TableHead>
                <TableHead>ACTIVE SUBSCRIPTION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailRows.map((row, index) => (
                <TableRow key={`${row[0]}-${index}`}>
                  {row.map((cell) => (
                    <TableCell key={`${cell}-${index}`}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  );
}
