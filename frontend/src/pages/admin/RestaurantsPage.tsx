import React, { useState } from 'react';
import { useGetRestaurantsQuery, useDeleteRestaurantMutation } from '../../store/api/restaurantApi';
import { useApproveRestaurantMutation } from '../../store/api/adminApi';
import { Edit, Trash2, Power } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AddRestaurantModal from '../../components/admin/AddRestaurantModal';

const RestaurantsPage: React.FC = () => {
    const { data: restaurants, isLoading } = useGetRestaurantsQuery({});
    const [approveRestaurant] = useApproveRestaurantMutation();
    const [deleteRestaurant, { isLoading: isDeleting }] = useDeleteRestaurantMutation();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleToggleStatus = async (id: string) => {
        try {
            await approveRestaurant(id).unwrap();
            toast.success('Restaurant status updated');
        } catch (error) {
            toast.error('Failed to update restaurant status');
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This will also delete all its food items.`)) {
            try {
                await deleteRestaurant(id).unwrap();
                toast.success('Restaurant deleted successfully');
            } catch (error) {
                toast.error('Failed to delete restaurant');
            }
        }
    };

    if (isLoading) {
        return <div className="text-center py-8">Loading restaurants...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Restaurants Management</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn btn-primary"
                >
                    Add Restaurant
                </button>
            </div>

            <div className="grid gap-6">
                {restaurants?.data?.restaurants?.map((restaurant) => (
                    <div key={restaurant._id} className="card p-6 flex items-center gap-6">
                        <img
                            src={restaurant.image || 'https://via.placeholder.com/100'}
                            alt={restaurant.name}
                            className="w-24 h-24 rounded-xl object-cover bg-white/5"
                        />

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-xl font-bold">{restaurant.name}</h3>
                                    <p className="text-white/60 text-sm">{restaurant.address.street}, {restaurant.address.city}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${restaurant.isActive
                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                        {restaurant.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-white/60">
                                <div>Rating: <span className="text-yellow-400 font-bold">{restaurant.rating}</span> ({restaurant.reviewCount} reviews)</div>
                                <div>Delivery: {restaurant.deliveryTime}</div>
                                <div>Min Order: ৳{restaurant.minimumOrder}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 border-l border-white/10 pl-6">
                            <button
                                onClick={() => handleToggleStatus(restaurant._id)}
                                className={`p-2 rounded-lg transition-colors ${restaurant.isActive
                                    ? 'hover:bg-red-500/10 text-red-400'
                                    : 'hover:bg-green-500/10 text-green-400'
                                    }`}
                                title={restaurant.isActive ? 'Deactivate' : 'Activate'}
                            >
                                <Power className="w-5 h-5" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                                <Edit className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleDelete(restaurant._id, restaurant.name)}
                                disabled={isDeleting}
                                className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors disabled:opacity-50"
                                title="Delete restaurant"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <AddRestaurantModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
};

export default RestaurantsPage;
