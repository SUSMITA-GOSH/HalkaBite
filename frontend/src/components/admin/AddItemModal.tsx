import React, { useState } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { useCreateFoodItemMutation } from '../../store/api/foodApi';
import { useUploadImageMutation } from '../../store/api/uploadApi';
import { useGetRestaurantsQuery } from '../../store/api/restaurantApi';
import { useGetCategoriesQuery } from '../../store/api/categoryApi';
import { toast } from 'react-hot-toast';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultRestaurantId?: string; // Optional: pre-select restaurant for restaurant owners
}

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, defaultRestaurantId }) => {
    const [createFoodItem, { isLoading }] = useCreateFoodItemMutation();
    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
    const { data: restaurantsData } = useGetRestaurantsQuery({});
    const { data: categoriesData } = useGetCategoriesQuery();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        preparationTime: '',
        isVegetarian: false,
        isSpicy: false,
        restaurant: defaultRestaurantId || '', // Auto-populate if provided
    });

    if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            try {
                const res = await uploadImage(formData).unwrap();
                setFormData(prev => ({ ...prev, image: res.filePath }));
                toast.success('Image uploaded successfully');
            } catch (err) {
                toast.error('Failed to upload image');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.restaurant) {
            toast.error('Please select a restaurant');
            return;
        }
        if (!formData.category) {
            toast.error('Please select a category');
            return;
        }
        try {
            await createFoodItem({
                ...formData,
                price: Number(formData.price),
                preparationTime: Number(formData.preparationTime),
            }).unwrap();
            toast.success('Food item added successfully');
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                image: '',
                preparationTime: '',
                isVegetarian: false,
                isSpicy: false,
                restaurant: defaultRestaurantId || '',
            });
            onClose();
        } catch (error: any) {
            const errorMessage = error?.data?.message || error?.message || 'Failed to add food item';
            toast.error(errorMessage);
            console.error('Add food item error:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-dark-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10">
                <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-dark-200 z-10">
                    <h2 className="text-xl font-bold">Add New Item</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60">Item Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="e.g. Spicy Chicken Burger"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60">Price (৳)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                value={formData.price}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="e.g. 250"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">Description</label>
                        <textarea
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            className="input w-full h-24 resize-none"
                            placeholder="Describe the item..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60">Category</label>
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="input w-full"
                            >
                                <option value="">Select Category</option>
                                {categoriesData?.data?.map((category: any) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60">Restaurant</label>
                            <select
                                name="restaurant"
                                required
                                value={formData.restaurant}
                                onChange={handleChange}
                                disabled={!!defaultRestaurantId}
                                className="input w-full"
                            >
                                <option value="">Select Restaurant</option>
                                {restaurantsData?.data?.restaurants?.map((restaurant: any) => (
                                    <option key={restaurant._id} value={restaurant._id}>
                                        {restaurant.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60">Prep Time (mins)</label>
                            <input
                                type="number"
                                name="preparationTime"
                                required
                                value={formData.preparationTime}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="e.g. 20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/60">Image</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="image"
                                    required
                                    value={formData.image}
                                    onChange={handleChange}
                                    className="input w-full"
                                    placeholder="Image URL or Upload"
                                    readOnly
                                />
                                <label className="btn btn-secondary px-4 cursor-pointer">
                                    {isUploading ? <Loader className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isVegetarian"
                                checked={formData.isVegetarian}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="text-sm">Vegetarian</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isSpicy"
                                checked={formData.isSpicy}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary-500 focus:ring-primary-500"
                            />
                            <span className="text-sm">Spicy</span>
                        </label>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || isUploading}
                            className="btn btn-primary"
                        >
                            {isLoading ? 'Adding...' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddItemModal;
