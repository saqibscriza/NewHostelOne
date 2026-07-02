import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../../components/ui/Card";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { CalendarDays } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import {
  addStockApi,
  getAllInventoryItemApi,
} from "../../../../../utils/utils";

export default function AddStockPage() {
  const navigate = useNavigate();
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [fetchingSku, setFetchingSku] = useState(true);
  const [submitError, setSubmitError] = useState("");
  // const [unit, setUnit] = useState("");


  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const selectedUnit = watch("unit");
  useEffect(() => {
    fetchIngredients();
    // fetchSkuId();
  }, []);

  const selectedItemId = watch("itemId");

  const selectedIngredient = ingredientOptions.find(
    (item) => String(item.id) === String(selectedItemId),
  );

  useEffect(() => {
    if (selectedIngredient) {
      setValue("skuId", selectedIngredient.skuId || "");
    }
  }, [selectedIngredient, setValue]);

  const fetchIngredients = async () => {
    try {
      setLoadingOptions(true);

      const res = await getAllInventoryItemApi();

      console.log("INGREDIENTS:", res);

      if (res?.status === "success") {
        setIngredientOptions(res?.items || []);
      }
    } catch (error) {
      console.log("INGREDIENT FETCH ERROR:", error);
    } finally {
      setLoadingOptions(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitError("");

      const formData = new FormData();


      const date = new Date(data.expiryDate);

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      const formattedDate = `${day}/${month}/${year}`;

      formData.append("itemId", data.itemId);
      formData.append("quantity", data.quantity);
      formData.append("unit", data.unit);
      formData.append("skuId", data.skuId);
      formData.append("expiryDate", formattedDate);
      formData.append("unitCost", data.unitCost);

      console.log("FORM DATA:");

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await addStockApi(formData);

      console.log("ADD STOCK RESPONSE:", res);

      if (res?.status === "success") {
        reset();

        navigate("/chef/inventory/details");
        return;
      }

      setSubmitError(res?.message || "Failed to add stock.");
    } catch (error) {
      console.log("ADD STOCK ERROR:", error);

      setSubmitError("Something went wrong while adding stock.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Add New Stock
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Record new arrivals of kitchen ingredients and supplies.
        </p>
      </div>

      <Card className="border-border shadow-sm rounded-2xl bg-card">
        <CardContent className="p-8 sm:p-10 space-y-12">
          {submitError ? (
            <p className="text-sm text-red-500">{submitError}</p>
          ) : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-foreground">
                  1
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  Ingredient Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-12">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Select Ingredient <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="itemId"
                    control={control}
                    rules={{ required: "Ingredient is required." }}
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        disabled={loadingOptions}
                      >
                        <SelectTrigger className="w-full h-12 rounded-[var(--field-radius)] border border-border bg-background px-4 text-[15px] text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-[border-color,box-shadow,background-color] focus:ring-4 focus:ring-slate-200/80 focus:border-slate-300">                          <SelectValue
                          placeholder={
                            loadingOptions
                              ? "Loading ingredients..."
                              : "Search or select ingredient..."
                          }
                        />
                        </SelectTrigger>
                        <SelectContent>
                          {ingredientOptions.map((item) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.itemName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.itemId ? (
                    <p className="text-xs text-red-500">
                      {errors.itemId.message}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Current stock levels will be updated automatically.
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    disabled
                    value={selectedIngredient?.categoryName || ""}
                    placeholder="Auto-filled based on selection"
                    className="bg-muted/30"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-foreground">
                  2
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  Arrival & Expiry Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-0 md:pl-12">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Quantity Received <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex h-12 items-center rounded-[var(--field-radius)] border border-border bg-background shadow-[0_1px_2px_rgba(15,23,42,0.03)] overflow-hidden transition-all focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-slate-200/80">
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-full shadow-none"
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e" || e.key === "E") {
                          e.preventDefault();
                        }
                      }}
                      {...register("quantity", {
                        required: "Quantity is required.",
                        valueAsNumber: true,
                        validate: (value) =>
                          value > 0 || "Quantity must be greater than 0.",
                      })}
                    />
                    <div className="w-[1px] h-6 bg-border" />
                    <Controller
                      name="unit"
                      control={control}
                      rules={{ required: "Unit is required." }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-[80px] flex-shrink-0 border-0 focus:ring-0 focus:ring-offset-0 bg-muted/30 rounded-none h-full shadow-none px-3">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="kg">Kg</SelectItem>
                            <SelectItem value="L">L</SelectItem>
                            <SelectItem value="units">Units</SelectItem>
                            <SelectItem value="pacs">Pacs</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {/* <Controller
                      name="unit"
                      control={control}
                      rules={{ required: "Unit is required." }}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}>
                          <SelectTrigger className="w-[80px] flex-shrink-0 border-0 focus:ring-0 focus:ring-offset-0 bg-muted/30 rounded-none h-full shadow-none px-3">                            <SelectValue placeholder="unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Kg</SelectItem>
                            <SelectItem value="L">L</SelectItem>
                            <SelectItem value="units">Units</SelectItem>
                            <SelectItem value="pacs">Pacs</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    /> */}
                  </div>
                  {errors.quantity ? (
                    <p className="text-xs text-red-500">
                      {errors.quantity.message}
                    </p>
                  ) : null}
                  {errors.unit ? (
                    <p className="text-xs text-red-500">
                      {errors.unit.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    SKU ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    disabled
                    readOnly
                    placeholder={
                      fetchingSku ? "Fetching..." : "e.g. Enter SKU ID"
                    }
                    className="bg-muted/30 "
                    {...register("skuId", {
                      required: "SKU ID number is required.",
                    })}
                  />
                  {errors.skuId ? (
                    <p className="text-xs text-red-500">
                      {errors.skuId.message}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Expiry Date <span className="text-red-500">*</span>
                  </Label>

                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none z-10" />

                    <Input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      {...register("expiryDate", {
                        required: "Expiry date is required",
                        validate: (value) =>
                          new Date(value) >
                          new Date(new Date().setHours(0, 0, 0, 0)) ||
                          "Past date not allowed",
                      })}
                      className="w-full pl-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                  </div>

                  {errors?.expiryDate && (
                    <p className="text-sm text-red-500">
                      {errors.expiryDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-foreground">
                  3
                </div>
                <h2 className="text-lg font-bold text-foreground">
                  Financial & Sourcing
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-12">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                   Per {selectedUnit || "Unit"} Cost (₹){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  {/* <Label className="text-sm font-semibold text-foreground">
                    Unit Cost (₹) <span className="text-red-500">*</span>
                  </Label> */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      ₹
                    </span>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-8 pr-12 bg-transparent border-border rounded-xl h-11"
                      onKeyDown={(e) => {
                        if (["-", "+", "e", "E"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      {...register("unitCost", {
                        required: "Unit cost is required.",
                        valueAsNumber: true,
                        validate: (value) =>
                          Number(value) > 0 || "Unit cost must be greater than 0.",
                      })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
                      INR
                    </span>
                  </div>
                  {errors.unitCost ? (
                    <p className="text-xs text-red-500">
                      {errors.unitCost.message}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 mt-10">
              <Button
                type="button"
                variant="outline"
                className="h-11 px-8 rounded-xl border-border text-foreground font-medium hover:bg-muted/50"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || loadingOptions}
                className="bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-11 px-8 shadow-sm"
              >
                {isSubmitting ? "Adding..." : "+ Add to Inventory"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
