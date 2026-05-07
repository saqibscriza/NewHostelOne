import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Info, List, Plus, X } from 'lucide-react';
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
  getCategoryItemsByIdApi,
  updateCategoryItemsApi,
} from '../../../../../utils/utils';

export default function AddCategoryItemPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [category, setCategory] = useState(null);
  const [items, setItems] = useState([{ id: Date.now(), name: '', sku: '' }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getCategoryDetails = async () => {
      try {
        setLoading(true);
        setError('');

        if (!categoryId) {
          setError('Category ID is missing.');
          return;
        }

        const res = await getCategoryItemsByIdApi(categoryId);
        console.log('CATEGORY DETAILS:', res);

        if (res?.status !== 'success') {
          setError(res?.message || 'Failed to fetch category details.');
          return;
        }

        setCategory(res?.categoryDetails?.category || null);
      } catch (fetchError) {
        console.error('Error fetching category:', fetchError);
        setError('Something went wrong while fetching category details.');
      } finally {
        setLoading(false);
      }
    };

    getCategoryDetails();
  }, [categoryId]);

  const handleAddItem = () => {
    setItems((prev) => [...prev, { id: Date.now(), name: '', sku: '' }]);
  };

  const handleRemoveItem = (idToRemove) => {
    setItems((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  const handleItemChange = (idToUpdate, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === idToUpdate ? { ...item, [field]: value } : item
      )
    );
  };

const handleSubmit = async () => {
  try {
    if (!categoryId) {
      setError('Category ID is missing.');
      return;
    }

    setSaving(true);
    setError('');

    const validItems = items.filter(
      (item) => item.name.trim() && item.sku.trim()
    );

    if (validItems.length === 0) {
      setError('Please add at least one valid item.');
      return;
    }

    const payload = {
      itemName: validItems.map((item) => item.name.trim()),
      skuId: validItems.map((item) => item.sku.trim()),
    };

    const res = await updateCategoryItemsApi(categoryId, payload);
    console.log('ADD ITEMS RESPONSE:', res);

    if (res?.status === 'success') {
      navigate(`/chef/inventory/category/${categoryId}/edit`, {
        replace: true,
        state: { refreshAt: Date.now() },
      });
      return;
    }

    setError(res?.message || 'Failed to add items.');
  } catch (submitError) {
    console.error('Error adding items:', submitError);
    setError('Something went wrong while adding items.');
  } finally {
    setSaving(false);
  }
};



  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Add New Items
        </h1>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="space-y-6">
        <Card className="border-border shadow-sm rounded-2xl bg-card">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Category Details
              </h2>
            </div>

            <div className="pl-0 md:pl-14">
              <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Category Name
                </Label>
                <Select
                  value={category ? String(category.id) : ''}
                  disabled
                >
                  <SelectTrigger className="w-full bg-transparent border-border rounded-xl h-11 text-foreground">
                    <SelectValue
                      placeholder={
                        loading ? 'Loading category...' : 'Select Category'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {category ? (
                      <SelectItem value={String(category.id)}>
                        {category.categoryName}
                      </SelectItem>
                    ) : null}
                  </SelectContent>
                </Select>
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
              <h2 className="text-xl font-bold text-foreground">
                Initial Items in Category
              </h2>
            </div>

            <div className="space-y-6 pl-0 md:pl-14">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-6 items-end relative"
                >
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Item Name
                    </Label>
                    <Input
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(item.id, 'name', e.target.value)
                      }
                      placeholder="Enter Item Name"
                      className="bg-transparent border-border rounded-xl h-11 text-foreground"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      SKU ID
                    </Label>
                    <Input
                      value={item.sku}
                      onChange={(e) =>
                        handleItemChange(item.id, 'sku', e.target.value)
                      }
                      placeholder="Enter SKU Id"
                      className="bg-transparent border-border rounded-xl h-11 text-foreground"
                    />
                  </div>

                  {items.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="h-11 w-11 flex items-center justify-center rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-colors"
                      title="Remove Item"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  ) : null}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddItem}
                className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-2 hover:underline mt-2"
              >
                <Plus className="w-4 h-4" /> ADD MORE ITEM
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            variant="outline"
            className="h-11 px-8 rounded-xl border-border text-foreground font-medium hover:bg-muted/50"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving || loading}
            className="bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-11 px-8 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            {saving ? 'Adding...' : 'Add New Item'}
          </Button>
        </div>
      </div>
    </div>
  );
}
