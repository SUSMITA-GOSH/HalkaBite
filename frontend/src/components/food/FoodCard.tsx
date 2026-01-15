import React from 'react';
import { Star, Clock, Plus, Flame, Leaf } from 'lucide-react';
import type { FoodItem } from '../../types';
import FoodModal from './FoodModal';

interface FoodCardProps {
  food: FoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  const [showModal, setShowModal] = React.useState(false);

  const discountedPrice = food.discount
    ? food.price * (1 - food.discount / 100)
    : food.price;

  return (
    <>
      <div
        onClick={() => food.isAvailable && setShowModal(true)}
        className={`card card-hover group overflow-hidden cursor-pointer ${!food.isAvailable ? 'opacity-75' : ''}`}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={food.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Discount Badge */}
          {food.discount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
              -{food.discount}%
            </div>
          )}

          {/* Tags */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {food.isVegetarian && (
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center" title="Vegetarian">
                <Leaf className="w-4 h-4 text-white" />
              </div>
            )}
            {food.isSpicy && (
              <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center" title="Spicy">
                <Flame className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            disabled={!food.isAvailable}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-primary-400 text-sm font-medium mb-1">
            {typeof food.category === 'object' ? food.category.name : 'Category'}
          </p>

          {/* Name */}
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">{food.name}</h3>

          {/* Description */}
          <p className="text-white/60 text-sm mb-3 line-clamp-2">{food.description}</p>

          {/* Rating & Time */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">{food.rating.toFixed(1)}</span>
              <span className="text-white/40 text-xs">({food.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-white/60">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{food.preparationTime} min</span>
            </div>
          </div>

          {/* Price & Add Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary-400">৳{Math.round(discountedPrice)}</span>
              {food.discount && (
                <span className="text-sm text-white/40 line-through">৳{food.price}</span>
              )}
            </div>

            {!food.isAvailable && (
              <span className="badge badge-error">Unavailable</span>
            )}
          </div>
        </div>
      </div>

      <FoodModal
        food={food}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default FoodCard;
