import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Star, Upload, X, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal.js';
import { Button } from '../common/Button.js';
import { Category, Product, ProductCondition } from '../../types/index.js';
import { createAdminProduct, updateAdminProduct, uploadProductImages } from '../../services/api.js';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  categories: Category[];
  onSuccess: (msg: string) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  categories,
  onSuccess,
}) => {
  const isEditing = !!productToEdit;

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Dell');
  const [model, setModel] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [condition, setCondition] = useState<ProductCondition>('EXCELLENT_REFURBISHED');
  const [description, setDescription] = useState('');
  const [internalCostPrice, setInternalCostPrice] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [warranty, setWarranty] = useState('30 Days Testing Guarantee + 6 Months Service Warranty');
  const [stockQuantity, setStockQuantity] = useState(1);
  const [availabilityStatus, setAvailabilityStatus] = useState('AVAILABLE');
  const [publishStatus, setPublishStatus] = useState('PUBLISHED');
  const [isFeatured, setIsFeatured] = useState(false);

  // Specifications state
  const [processor, setProcessor] = useState('');
  const [generation, setGeneration] = useState('');
  const [ram, setRam] = useState('16 GB');
  const [ramType, setRamType] = useState('DDR4');
  const [storageType, setStorageType] = useState('NVMe SSD');
  const [storageCapacity, setStorageCapacity] = useState('512 GB');
  const [displaySize, setDisplaySize] = useState('14.0 Inch');
  const [resolution, setResolution] = useState('1920 x 1080 Full HD IPS');
  const [graphics, setGraphics] = useState('Intel UHD Graphics');
  const [operatingSystem, setOperatingSystem] = useState('Windows 11 Pro 64-bit');
  const [batteryHealth, setBatteryHealth] = useState('85%+ Health (Up to 4-5 Hours)');
  const [keyboard, setKeyboard] = useState('Backlit Keyboard');
  const [ports, setPorts] = useState('');

  // Images state
  const [images, setImages] = useState<{ url: string; isPrimary: boolean; sortOrder: number }[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when editing product changes
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setBrand(productToEdit.brand);
      setModel(productToEdit.model);
      setCategoryId(productToEdit.categoryId);
      setCondition(productToEdit.condition);
      setDescription(productToEdit.description);
      setInternalCostPrice(productToEdit.internalCostPrice || '');
      setSellingPrice(productToEdit.sellingPrice);
      setOriginalPrice(productToEdit.originalPrice || '');
      setWarranty(productToEdit.warranty || '');
      setStockQuantity(productToEdit.stockQuantity);
      setAvailabilityStatus(productToEdit.availabilityStatus);
      setPublishStatus(productToEdit.publishStatus || 'PUBLISHED');
      setIsFeatured(productToEdit.isFeatured);

      const s = productToEdit.specifications || {};
      setProcessor(s.processor || '');
      setGeneration(s.generation || '');
      setRam(s.ram || '');
      setRamType(s.ramType || '');
      setStorageType(s.storageType || '');
      setStorageCapacity(s.storageCapacity || '');
      setDisplaySize(s.displaySize || '');
      setResolution(s.resolution || '');
      setGraphics(s.graphics || '');
      setOperatingSystem(s.operatingSystem || '');
      setBatteryHealth(s.batteryHealth || '');
      setKeyboard(s.keyboard || '');
      setPorts(s.ports || '');

      setImages(
        productToEdit.images?.map((img, idx) => ({
          url: img.url,
          isPrimary: img.isPrimary,
          sortOrder: idx,
        })) || []
      );
    } else {
      // Default clean values
      setName('');
      setBrand('Dell');
      setModel('');
      setCategoryId(categories[0]?.id || '');
      setCondition('EXCELLENT_REFURBISHED');
      setDescription('');
      setInternalCostPrice('');
      setSellingPrice('');
      setOriginalPrice('');
      setWarranty('30 Days Testing Guarantee + 6 Months Service Warranty');
      setStockQuantity(1);
      setAvailabilityStatus('AVAILABLE');
      setPublishStatus('PUBLISHED');
      setIsFeatured(false);

      setProcessor('Intel Core i5 8th Gen');
      setGeneration('8th Gen');
      setRam('16 GB DDR4');
      setRamType('DDR4');
      setStorageType('NVMe SSD');
      setStorageCapacity('512 GB');
      setDisplaySize('14.0 Inch');
      setResolution('1920 x 1080 Full HD IPS');
      setGraphics('Intel UHD Graphics');
      setOperatingSystem('Windows 11 Pro 64-bit');
      setBatteryHealth('85%+ Health');
      setKeyboard('Backlit Keyboard');
      setPorts('USB-C, USB 3.0, HDMI, Audio Jack');

      setImages([
        {
          url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
          isPrimary: true,
          sortOrder: 0,
        },
      ]);
    }
    setError(null);
  }, [productToEdit, categories, isOpen]);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const isComputerOrLaptop =
    !selectedCategory ||
    selectedCategory.slug === 'laptops' ||
    selectedCategory.slug === 'desktop-pcs';

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages((prev) => [
        ...prev,
        { url: newImageUrl.trim(), isPrimary: prev.length === 0, sortOrder: prev.length },
      ]);
      setNewImageUrl('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      setIsUploading(true);
      const res = await uploadProductImages(formData);
      if (res.success && res.data) {
        setImages((prev) => [
          ...prev,
          ...res.data.map((item, idx) => ({
            url: item.url,
            isPrimary: prev.length === 0 && idx === 0,
            sortOrder: prev.length + idx,
          })),
        ]);
      }
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, idx) => ({
        ...img,
        isPrimary: idx === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, idx) => idx !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Product title is required');
      return;
    }

    if (!categoryId) {
      setError('Please select a product category');
      return;
    }

    if (sellingPrice === '' || Number(sellingPrice) <= 0) {
      setError('Valid selling price is required');
      return;
    }

    if (images.length === 0) {
      setError('At least one product image is required');
      return;
    }

    const specifications: Record<string, any> = {
      processor: processor.trim(),
      generation: generation.trim(),
      ram: ram.trim(),
      ramType: ramType.trim(),
      storageType: storageType.trim(),
      storageCapacity: storageCapacity.trim(),
      displaySize: displaySize.trim(),
      resolution: resolution.trim(),
      graphics: graphics.trim(),
      operatingSystem: operatingSystem.trim(),
      batteryHealth: batteryHealth.trim(),
      keyboard: keyboard.trim(),
      ports: ports.trim(),
    };

    const payload = {
      name: name.trim(),
      brand: brand.trim(),
      model: model.trim() || name.trim(),
      categoryId,
      condition,
      description: description.trim() || `${brand} ${model} certified refurbished system. Tested and functional with warranty.`,
      specifications,
      internalCostPrice: Number(internalCostPrice) || 0,
      sellingPrice: Number(sellingPrice),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      warranty: warranty.trim() || null,
      stockQuantity: Number(stockQuantity),
      availabilityStatus,
      publishStatus,
      isFeatured,
      images,
    };

    try {
      setIsLoading(true);
      if (isEditing && productToEdit) {
        await updateAdminProduct(productToEdit.id, payload);
        onSuccess(`Product "${name}" updated successfully!`);
      } else {
        await createAdminProduct(payload);
        onSuccess(`Product "${name}" added to inventory!`);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Product' : 'Add New Inventory Unit'}
      subtitle={isEditing ? `Editing SKU: ${productToEdit?.sku}` : 'Enter specifications and pricing details'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Basic Information */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
            1. Basic Information
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dell Latitude 7490 Core i7 8th Gen / 16GB / 512GB"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Dell / Lenovo / HP"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Model</label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Latitude 7490 / T480"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="EXCELLENT_REFURBISHED">Refurbished (Grade A+)</option>
                <option value="OPEN_BOX">Open Box (Like New)</option>
                <option value="BRAND_NEW">Brand New</option>
                <option value="VERY_GOOD">Certified Pre-Owned</option>
                <option value="GOOD">Value Pre-Owned</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Commercial Pricing & Inventory */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
            2. Commercial Pricing & Inventory
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/80">
              <label className="block text-[11px] font-bold text-amber-900 mb-1">
                Internal Cost (₹) <span className="text-[10px] text-amber-700 font-normal">(Private)</span>
              </label>
              <input
                type="number"
                value={internalCostPrice}
                onChange={(e) => setInternalCostPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="₹ 15,000"
                className="w-full px-2.5 py-1.5 text-xs border border-amber-300 rounded-md font-bold text-slate-900 bg-white"
              />
            </div>

            <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-200/80">
              <label className="block text-[11px] font-bold text-blue-900 mb-1">
                Selling Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="₹ 24,999"
                className="w-full px-2.5 py-1.5 text-xs border border-blue-300 rounded-md font-bold text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Original MRP (₹)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="₹ 75,000"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Availability</label>
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="AVAILABLE">AVAILABLE (In Stock)</option>
                <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                <option value="SOLD">SOLD</option>
                <option value="RESERVED">RESERVED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Visibility</label>
              <select
                value={publishStatus}
                onChange={(e) => setPublishStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="PUBLISHED">Published (Visible on site)</option>
                <option value="DRAFT">Draft (Hidden)</option>
                <option value="UNPUBLISHED">Unpublished</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <span>Feature on Homepage</span>
              </label>
            </div>
          </div>
        </div>

        {/* 3. Category Specifications */}
        {isComputerOrLaptop ? (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
              3. Computer & Laptop Specifications
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Processor</label>
                <input
                  type="text"
                  value={processor}
                  onChange={(e) => setProcessor(e.target.value)}
                  placeholder="Core i7-8650U"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">RAM</label>
                <input
                  type="text"
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                  placeholder="16 GB DDR4"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Storage</label>
                <input
                  type="text"
                  value={storageCapacity}
                  onChange={(e) => setStorageCapacity(e.target.value)}
                  placeholder="512 GB SSD"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Display Size</label>
                <input
                  type="text"
                  value={displaySize}
                  onChange={(e) => setDisplaySize(e.target.value)}
                  placeholder="14.0 Inch FHD"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Battery Health</label>
                <input
                  type="text"
                  value={batteryHealth}
                  onChange={(e) => setBatteryHealth(e.target.value)}
                  placeholder="85%+ Health"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">OS</label>
                <input
                  type="text"
                  value={operatingSystem}
                  onChange={(e) => setOperatingSystem(e.target.value)}
                  placeholder="Windows 11 Pro Genuine"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Graphics</label>
                <input
                  type="text"
                  value={graphics}
                  onChange={(e) => setGraphics(e.target.value)}
                  placeholder="Intel UHD / NVIDIA"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1">
              3. Specifications
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Key Spec 1</label>
                <input
                  type="text"
                  value={ports}
                  onChange={(e) => setPorts(e.target.value)}
                  placeholder="e.g. Wireless Bluetooth + 2.4GHz"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Key Spec 2</label>
                <input
                  type="text"
                  value={keyboard}
                  onChange={(e) => setKeyboard(e.target.value)}
                  placeholder="e.g. RGB Mechanical Outemu Blue"
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. Product Images Manager */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b pb-1 flex items-center justify-between">
            <span>4. Product Images ({images.length})</span>
            <span className="text-[10px] text-blue-600 font-semibold lowercase">
              ★ Click star to make primary image
            </span>
          </h4>

          {/* Image Previews Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative aspect-square rounded-xl bg-slate-50 border-2 overflow-hidden p-1 group ${
                  img.isPrimary ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200'
                }`}
              >
                <img src={img.url} alt="product" className="w-full h-full object-contain" />

                {/* Primary Badge */}
                <button
                  type="button"
                  onClick={() => handleSetPrimary(idx)}
                  className={`absolute top-1 left-1 p-1 rounded-md shadow-xs transition-colors ${
                    img.isPrimary
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/80 text-slate-400 hover:text-amber-500'
                  }`}
                  title="Make Primary Image"
                >
                  <Star className="w-3 h-3 fill-current" />
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 rounded-md bg-white/80 text-red-500 hover:bg-red-600 hover:text-white transition-colors"
                  title="Delete image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Upload File Input */}
            <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 flex flex-col items-center justify-center cursor-pointer p-2 text-center transition-colors">
              <Upload className="w-5 h-5 text-slate-400 mb-1" />
              <span className="text-[10px] font-bold text-slate-600">
                {isUploading ? 'Uploading...' : 'Upload File'}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Add Image by URL */}
          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Or paste external image URL (e.g. https://...)"
              className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddImageUrl}>
              Add URL
            </Button>
          </div>
        </div>

        {/* 5. Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Detailed Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed overview of physical condition, inclusions, test results, etc."
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
            {isEditing ? 'Save Product Changes' : 'Create & Publish Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
