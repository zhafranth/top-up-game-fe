import React from 'react';

interface ProductCardSkeletonProps {
  count?: number;
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ count = 8 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="relative">
          <div className="relative overflow-hidden p-4 rounded-xl border-2 border-gray-600/50 bg-black/20 animate-pulse">
            {/* Skeleton for discount badge */}
            <div className="absolute top-0 left-0 w-0 h-0 border-l-[65px] border-l-gray-600/30 border-b-[65px] border-b-transparent opacity-50" />
            
            <div className="text-center space-y-3">
              {/* Skeleton for diamond amount */}
              <div className="h-8 bg-gray-600/30 rounded-md mx-auto w-24" />
              
              {/* Skeleton for product name */}
              <div className="h-4 bg-gray-600/30 rounded-md mx-auto w-20" />
              
              {/* Skeleton for prices */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-600/30 rounded-md mx-auto w-16" />
                <div className="h-5 bg-gray-600/30 rounded-md mx-auto w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductCardSkeleton;