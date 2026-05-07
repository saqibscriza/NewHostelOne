import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../../../../components/ui/Card';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../components/ui/select';
import {
  addStockApi,
  getAllInventoryItemApi,
} from '../../../../../utils/utils';

export default function AddStockPage() {
  const navigate = useNavigate();
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitError, setSubmitError] = useState('');

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
  fetchIngredients();
}, []);
const selectedItemId = watch('itemId');

const selectedIngredient = ingredientOptions.find(
  (item) => String(item.id) === String(selectedItemId)
);

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
    setSubmitError('');

    const formData = new FormData();
    
        const formattedDate = new Date(data.expiryDate)
  .toISOString()
  .split("T")[0];

    formData.append('itemId', data.itemId);
    formData.append('quantity', data.quantity);
    formData.append('unit', data.unit);
    formData.append('batchNumber', data.batchNumber);
    formData.append('expiryDate', formattedDate);
    formData.append('unitCost', data.unitCost);

    console.log("FORM DATA:");

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const res = await addStockApi(formData);

    console.log("ADD STOCK RESPONSE:", res);

    if (res?.status === 'success') {
      reset();

      navigate('/chef/inventory/stock');
      return;
    }

    setSubmitError(res?.message || 'Failed to add stock.');
  } catch (error) {
    console.log("ADD STOCK ERROR:", error);

    setSubmitError('Something went wrong while adding stock.');
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
          {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-foreground">
                  1
                </div>
                <h2 className="text-lg font-bold text-foreground">Ingredient Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-12">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Select Ingredient
                  </Label>
                  <Controller
                    name="itemId"
                    control={control}
                    rules={{ required: 'Ingredient is required.' }}
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        disabled={loadingOptions}
                      >
                        <SelectTrigger className="w-full bg-transparent border-border rounded-xl h-11">
                          <SelectValue
                            placeholder={
                              loadingOptions
                                ? 'Loading ingredients...'
                                : 'Search or select ingredient...'
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
                    <p className="text-xs text-red-500">{errors.itemId.message}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      Current stock levels will be updated automatically.
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">Category</Label>
                  <Input
                    disabled
                    value={selectedIngredient?.categoryName || ''}
                    placeholder="Auto-filled based on selection"
                    className="bg-muted/30 border-border rounded-xl h-11"
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
                    Quantity Received
                  </Label>
                  <div className="flex h-11 items-center rounded-xl border border-border bg-transparent shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 overflow-hidden transition-all">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-full shadow-none"
                      {...register('quantity', {
                        required: 'Quantity is required.',
                        min: {
                          value: 0.01,
                          message: 'Quantity must be greater than 0.',
                        },
                        valueAsNumber: true,
                      })}
                    />
                    <div className="w-[1px] h-6 bg-border" />
                    <Controller
                      name="unit"
                      control={control}
                      rules={{ required: 'Unit is required.' }}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-[80px] flex-shrink-0 border-0 focus:ring-0 focus:ring-offset-0 bg-muted/30 rounded-none h-full shadow-none px-3">
  <SelectValue placeholder="unit" />
</SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="L">L</SelectItem>
                            <SelectItem value="units">units</SelectItem>
                            <SelectItem value="pacs">pacs</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  {errors.quantity ? (
                    <p className="text-xs text-red-500">{errors.quantity.message}</p>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Batch Number
                  </Label>
                  <Input
                    placeholder="e.g. BATCH-2024-001"
                    className="bg-transparent border-border rounded-xl h-11"
                    {...register('batchNumber', {
                      required: 'Batch number is required.',
                    })}
                  />
                  {errors.batchNumber ? (
                    <p className="text-xs text-red-500">{errors.batchNumber.message}</p>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-foreground">
                    Expiry Date
                  </Label>
                  <Input
                    type="date"
                    className="bg-transparent border-border rounded-xl h-11 text-foreground block w-full"
                    {...register('expiryDate', {
                      required: 'Expiry date is required.',
                    })}
                  />
                  {errors.expiryDate ? (
                    <p className="text-xs text-red-500">{errors.expiryDate.message}</p>
                  ) : null}
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
                    Unit Cost (₹)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      ₹
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-8 pr-12 bg-transparent border-border rounded-xl h-11"
                      {...register('unitCost', {
                        required: 'Unit cost is required.',
                        min: {
                          value: 0.01,
                          message: 'Unit cost must be greater than 0.',
                        },
                        valueAsNumber: true,
                      })}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">
                      INR
                    </span>
                  </div>
                  {errors.unitCost ? (
                    <p className="text-xs text-red-500">{errors.unitCost.message}</p>
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
                {isSubmitting ? 'Adding...' : '+ Add to Inventory'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
