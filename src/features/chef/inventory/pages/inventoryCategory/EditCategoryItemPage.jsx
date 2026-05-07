import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
 updateInventoryItemOnlyApi,
} from '../../../../../utils/utils';

export default function EditCategoryItemPage() {
  const navigate = useNavigate();
  const { categoryId, itemId } = useParams();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    itemName: '',
    skuId: '',
    categoryId: '',
    categoryName: '',
  });

  useEffect(() => {
    const getItemDetails = async () => {
      try {
        setLoading(true);
        setError('');

        console.log('PARAMS:', { categoryId, itemId });

        if (!categoryId || !itemId) {
          setError('Category ID or Item ID is missing.');
          return;
        }

        const res = await getCategoryItemsByIdApi(categoryId);
        console.log('FULL DATA:', res);

        if (res?.status !== 'success') {
          setError('Failed to fetch category details.');
          return;
        }

        const category = res?.categoryDetails?.category;
        const items = res?.categoryDetails?.items || [];
        const item = items.find((entry) => entry.id === Number(itemId));

        console.log('FOUND ITEM:', item);

        if (!item) {
          setError('Item not found.');
          return;
        }

        const nextCategory = {
          id: category?.id ?? item.categoryId,
          categoryName: category?.categoryName ?? item.categoryName ?? '',
        };

        setCategories(nextCategory.id ? [nextCategory] : []);
        setFormData({
          itemName: item.itemName || '',
          skuId: item.skuId || '',
          categoryId: String(item.categoryId || ''),
          categoryName: item.categoryName || '',
        });
      } catch (fetchError) {
        console.error('Error fetching item:', fetchError);
        setError('Something went wrong while fetching item details.');
      } finally {
        setLoading(false);
      }
    };

    getItemDetails();
  }, [categoryId, itemId]);

  const handleCategoryChange = (value) => {
    const selectedCategory = categories.find((cat) => String(cat.id) === value);

    setFormData((prev) => ({
      ...prev,
      categoryId: value,
      categoryName: selectedCategory?.categoryName || '',
    }));
  };

const updateItem = async () => {
  try {
    if (!itemId) {
      setError('Item ID is missing.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      itemName: formData.itemName,
      skuId: formData.skuId,
      categoryId: Number(formData.categoryId),
    };

    const res = await updateInventoryItemOnlyApi(itemId, payload);
    console.log('UPDATE RESPONSE:', res);

    if (res?.status === 'success') {
      navigate(`/chef/inventory/category/${categoryId}`, {
        replace: true,
        state: { refreshAt: Date.now() },
      });
      return;
    }

    setError(res?.message || 'Update failed.');
  } catch (updateError) {
    console.error('Error updating item:', updateError);
    setError('Something went wrong while updating the item.');
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Edit Item Details
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Update specifications and stock parameters for{' '}
          {formData.itemName || 'this item'}.
        </p>
      </div>

      <Card className="border-border shadow-sm rounded-2xl bg-card">
        <CardContent className="p-8 space-y-8">
          <h2 className="text-xl font-bold text-foreground">
            {formData.categoryName || 'Category'} Item
          </h2>

          {error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : null}

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading item details...</p>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Item Name
                </Label>
                <Input
                  value={formData.itemName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      itemName: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Category
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="w-full bg-transparent border-border rounded-xl h-11 text-foreground">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.categoryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    SKU ID
                  </Label>
                  <Input
                    value={formData.skuId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        skuId: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  onClick={updateItem}
                  disabled={saving}
                  className="bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-11 px-8 shadow-sm"
                >
                  {saving ? 'Updating...' : 'Update'}
                </Button>

                <Button
                  variant="secondary"
                  className="h-11 px-8 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}