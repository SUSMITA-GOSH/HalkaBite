import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGetMyRestaurantQuery } from '../../store/api/restaurantApi';
import { useGetFoodItemsQuery, useDeleteFoodItemMutation, useUpdateFoodItemMutation } from '../../store/api/foodApi';
import AddItemModal from '../../components/admin/AddItemModal';

const RestaurantMenuPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Get owner's restaurant
    const { data: restaurantData, isLoading: isRestaurantLoading } = useGetMyRestaurantQuery();
    const restaurant = restaurantData?.data;
    const restaurantId = restaurant?._id;

    const { data: foodData, isLoading, refetch } = useGetFoodItemsQuery(
        { restaurant: restaurantId },
        { skip: !restaurantId }
    );

    const [deleteFood] = useDeleteFoodItemMutation();
    const [updateFood] = useUpdateFoodItemMutation();

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await deleteFood(id).unwrap();
                toast.success('Menu item deleted successfully');
            } catch (error) {
                toast.error('Failed to delete menu item');
            }
        }
    };

    const handleToggleAvailability = async (id: string, currentStatus: boolean) => {
        try {
            await updateFood({ id, data: { isAvailable: !currentStatus } }).unwrap();
            toast.success('Availability updated');
        } catch (error) {
            toast.error('Failed to update availability');
        }
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        refetch(); // Refetch menu items when modal closes
    };

    if (isRestaurantLoading) {
        return <div className="text-center py-12">Loading restaurant data...</div>;
    }

    if (!restaurantId) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="card p-8">
                    <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🏪</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No Restaurant Assigned</h2>
                    <p className="text-white/60 mb-6">
                        Your account doesn't have a restaurant assigned yet. Please contact an administrator to set up your restaurant.
                    </p>
                    <div className="bg-white/5 rounded-xl p-4 text-left space-y-2">
                        <p className="text-sm font-semibold text-white/80">For Testing:</p>
                        <p className="text-sm text-white/60">
                            Run this command in the backend directory to create a test restaurant owner:
                        </p>
                        <code className="block bg-dark-300 px-3 py-2 rounded-lg text-xs text-primary-400 mt-2">
                            npx ts-node src/seedRestaurantOwner.ts
                        </code>
                        <p className="text-xs text-white/40 mt-2">
                            Then login with: owner@halkabite.com / password123
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const items = foodData?.data?.foodItems || [];
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return <div className="text-center py-12">Loading menu...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Menu Management</h1>
                    <p className="text-white/60">
                        {restaurant ? `Managing menu for ${restaurant.name}` : 'Add and manage your menu items'}
                    </p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Food Item
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input pl-12 w-full"
                />
            </div>

            {filteredItems.length === 0 ? (
                <div className="card p-12 text-center">
                    <p className="text-white/60">
                        {items.length === 0 ? 'No menu items yet. Add your first item!' : 'No items found'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => {
                        const category = item.category as any;
                        return (
                            <div key={item._id} className="card p-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-48 object-cover rounded-xl mb-4"
                                />

                                <div className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs ${item.isAvailable
                                            ? 'bg-green-500/10 text-green-400'
                                            : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {item.isAvailable ? 'Available' : 'Unavailable'}
                                        </span>
                                    </div>

                                    {/* Restaurant Name Badge */}
                                    {restaurant && (
                                        <div className="mb-2">
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-500/10 text-primary-400 text-xs font-medium">
                                                🏪 {restaurant.name}
                                            </span>
                                        </div>
                                    )}

                                    <p className="text-sm text-white/60 mb-2 line-clamp-2">{item.description}</p>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xl font-bold text-primary-400">৳{item.price}</p>
                                        <span className="text-sm text-white/60">{category?.name || 'Uncategorized'}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggleAvailability(item._id, item.isAvailable)}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${item.isAvailable
                                            ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                                            : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                            }`}
                                    >
                                        {item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                                    </button>
                                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id, item.name)}
                                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showAddModal && restaurantId && (
                <AddItemModal
                    isOpen={showAddModal}
                    onClose={handleCloseModal}
                    defaultRestaurantId={restaurantId}
                />
            )}
        </div>
    );
};

export default RestaurantMenuPage;
