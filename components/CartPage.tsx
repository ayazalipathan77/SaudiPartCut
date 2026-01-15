import React from 'react';
import { useCart, CartItem, SHIPPING_OPTIONS } from '../context/CartContext';
import ShapeThumbnail from './ShapeThumbnail';

interface CartPageProps {
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const CartItemRow: React.FC<{
  item: CartItem;
  onRemove: () => void;
  onQuantityChange: (qty: number) => void;
}> = ({ item, onRemove, onQuantityChange }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 flex gap-4">
      {/* Shape Thumbnail */}
      <div className="w-24 h-24 bg-slate-50 rounded-lg flex-shrink-0 flex items-center justify-center border border-slate-100">
        <ShapeThumbnail
          svgGenerator={item.shape.svg_path_generator}
          parameters={item.shapeParams}
          className="w-full h-full"
          fillColor="#64748b"
        />
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-slate-900 truncate">{item.shape.name}</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {item.materialName} - {item.thickness}mm
            </p>
          </div>
          <button
            onClick={onRemove}
            className="text-slate-400 hover:text-red-500 p-1"
            title="Remove item"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
            {item.serviceName}
          </span>
          {item.finishingId !== 'none' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
              {item.finishingName}
            </span>
          )}
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Qty:</span>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => onQuantityChange(item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
                disabled={item.quantity <= 1}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
              <button
                onClick={() => onQuantityChange(item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">SAR {item.quote.total.toFixed(2)} each</p>
            <p className="text-lg font-bold text-slate-900">SAR {(item.quote.total * item.quantity).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage: React.FC<CartPageProps> = ({ onContinueShopping, onCheckout }) => {
  const { items, removeItem, updateQuantity, subtotal, shippingMethod, setShippingMethod, shippingCost, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 mb-6 max-w-md">
          Looks like you haven't added any parts yet. Start by configuring your first custom part.
        </p>
        <button
          onClick={onContinueShopping}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Start Configuring
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Cart</h1>
          <p className="text-slate-500">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={onContinueShopping}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add More Parts
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onRemove={() => removeItem(item.id)}
              onQuantityChange={(qty) => updateQuantity(item.id, qty)}
            />
          ))}

          {/* Clear Cart */}
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={clearCart}
              className="text-sm text-slate-500 hover:text-red-500 font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-96">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>

            {/* Shipping Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Shipping Method</label>
              <div className="space-y-2">
                {SHIPPING_OPTIONS.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      shippingMethod === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === option.id}
                        onChange={() => setShippingMethod(option.id)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{option.name}</p>
                        <p className="text-xs text-slate-500">{option.estimatedDays}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {option.price === 0 ? 'Free' : `SAR ${option.price.toFixed(2)}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">SAR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Shipping</span>
                <span className="font-medium text-slate-900">
                  {shippingCost === 0 ? 'Free' : `SAR ${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-xl font-bold text-slate-900">SAR {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-blue-600/20 transition-all"
            >
              Continue to Checkout
            </button>

            {/* Additional Actions */}
            <div className="mt-4 flex gap-3">
              <button className="flex-1 py-2.5 px-4 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Save Cart
              </button>
              <button className="flex-1 py-2.5 px-4 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Get Quote
              </button>
            </div>

            {/* Delivery Estimate */}
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-800">Estimated Delivery</p>
                  <p className="text-xs text-green-700">
                    {SHIPPING_OPTIONS.find(o => o.id === shippingMethod)?.estimatedDays}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
