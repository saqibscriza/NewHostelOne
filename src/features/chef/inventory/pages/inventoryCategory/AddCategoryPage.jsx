import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, List, Upload, Plus, X } from 'lucide-react';
import { Card, CardContent } from '../../../../../components/ui/Card';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { useForm, useFieldArray } from 'react-hook-form';
import { addInventoryCategoryApi, getSkuIdAPI } from '../../../../../utils/utils';

export default function AddCategoryPage() {

  const [iconFileName, setIconFileName] = useState('');
  const navigate = useNavigate();

  const {
  register,
  handleSubmit,
  control,
  setValue,
  formState: { errors },
} = useForm({
  defaultValues: {
    categoryName: "",
    items: [{ name: "", sku: "Generating..." }],
    icon: null,
  },
});

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

    useEffect(() => {
    const fetchInitialSku = async () => {
      try {
        const res = await getSkuIdAPI();
        const sku = res?.data || res?.skuId || res?.sku || (typeof res === 'string' ? res : "");
        setValue("items.0.sku", sku);
      } catch (err) {
        setValue("items.0.sku", "");
      }
    };
    fetchInitialSku();
  }, [setValue]);


    const handleAppendItem = async () => {
    // Show a temporary generating state
    append({ name: "", sku: "Generating..." });
    const lastIndex = fields.length; // index of the newly added item
    try {
      const res = await getSkuIdAPI();
      const sku = res?.data || res?.skuId || res?.sku || (typeof res === 'string' ? res : "");
      setValue(`items.${lastIndex}.sku`, sku);
    } catch (e) {
      setValue(`items.${lastIndex}.sku`, "");
    }
  };



  const addInventoryCategory = async (data) => {
    console.log("FORM DATA 👉", data); 
    const formData = new FormData();
    formData.append('categoryName', data.categoryName);

  data.items.forEach((item) => {
    formData.append("itemName", item.name);
    formData.append("skuId", item.sku);
  });

  if (data.icon?.[0]) {
    formData.append("icon", data.icon[0]);
  }

  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    const response = await addInventoryCategoryApi(formData);

    if (response?.status === "success") {
      navigate("/chef/inventory/category");
      console.log("Category added successfully");
    } else {
      console.error("Failed to add category");
    }
  } catch (error) {
    console.error("Error adding category:", error);
  }
};
    

  return (
    <form onSubmit={handleSubmit(addInventoryCategory)}>
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Create New Category</h1>
        <p className="text-muted-foreground mt-1 text-sm">Define a new inventory</p>
      </div>

      <div className="space-y-6">
        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Category Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-14">
              <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category Name</Label>
                <Input
                placeholder="Enter Category Name"
                {...register("categoryName", {
                  required: "Category name is required",
                })}
              />
              {errors.categoryName && (
                <p className="text-red-500 text-xs">
                  {errors.categoryName.message}
                </p>
              )}
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Primary Icon</Label>
                <div 
                  className="relative cursor-pointer" 
                  onClick={() => document.getElementById('icon-upload')?.click()}
                >
                  <Input 
                    type="text" 
                    placeholder="Upload Icon" 
                    className="bg-transparent border-border rounded-xl h-11 pr-10 cursor-pointer"
                    value={iconFileName}
                    readOnly
                  />
<input
  type="file"
  id="icon-upload"
  className="hidden"
  accept="image/*"
  {...register("icon", {
    onChange: (e) => {
      setIconFileName(
        e.target.files?.[0]?.name || ""
      );
    },
  })}
/>
                {/* {errors.icon && (
  <p className="text-red-500 text-xs">
    {errors.icon.message}
  </p>
)} */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors pointer-events-none">
                    <Upload className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <List className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Initial Items in Category</h2>
            </div>
            
            <div className="space-y-6 pl-0 md:pl-14">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-6 items-end relative">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Item Name</Label>
                    <Input 
                      placeholder="Enter Item Name" 
                      className="bg-transparent border-border rounded-xl h-11"
                      {...register(`items.${index}.name`, {
                      required: "Item name required",
                    })}
                    />
                    {errors.items?.[index]?.name && (
                    <p className="text-red-500 text-xs">
                      {errors.items[index].name.message}
                    </p>
                  )}
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">SKU ID</Label>
                    <Input 
                      disabled
                      placeholder="SKU"
                      className="bg-transparent border-border rounded-xl h-11"
                    {...register(`items.${index}.sku`, {
                    })}
                      
                    />
                  </div>
                  {fields.length > 1 && (
                    <button 
                    type='button'
                      onClick={() => remove(index)}
                      className="h-11 w-11 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-colors"
                      title="Remove Item"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              <button 
              type='button'
               onClick={handleAppendItem}
                className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-2 hover:underline mt-2"
              >
                <Plus className="w-4 h-4" /> ADD MORE ITEM
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <Button 
          type="button"
            variant="outline" 
            className="h-11 px-8 rounded-xl border-border text-foreground font-medium hover:bg-muted/50"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-11 px-8 shadow-sm">
            + Add Category
          </Button>
        </div>
      </div>
    </div>
    </form>
  );
}
