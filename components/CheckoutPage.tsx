import React, { useState } from 'react';
import { useCart, ShippingAddress, SHIPPING_OPTIONS } from '../context/CartContext';
import ShapeThumbnail from './ShapeThumbnail';

type CheckoutStep = 'billing' | 'shipping' | 'payment';

interface CheckoutPageProps {
  onBack: () => void;
  onComplete: () => void;
}

const STEPS: { id: CheckoutStep; label: string; number: number }[] = [
  { id: 'billing', label: 'Billing & Shipping', number: 1 },
  { id: 'shipping', label: 'Shipping Method', number: 2 },
  { id: 'payment', label: 'Payment & Confirmation', number: 3 },
];

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onComplete }) => {
  const {
    items,
    shippingAddress,
    setShippingAddress,
    billingInfo,
    setBillingInfo,
    shippingMethod,
    setShippingMethod,
    subtotal,
    shippingCost,
    total,
  } = useCart();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('billing');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form state for shipping address
  const [addressForm, setAddressForm] = useState<ShippingAddress>(
    shippingAddress || {
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Saudi Arabia',
      phone: '',
    }
  );

  const validateBillingStep = (): boolean => {
    const errors: Record<string, string> = {};
    if (!addressForm.firstName) errors.firstName = 'First name is required';
    if (!addressForm.lastName) errors.lastName = 'Last name is required';
    if (!addressForm.address1) errors.address1 = 'Address is required';
    if (!addressForm.city) errors.city = 'City is required';
    if (!addressForm.postalCode) errors.postalCode = 'Postal code is required';
    if (!addressForm.phone) errors.phone = 'Phone number is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 'billing') {
      if (validateBillingStep()) {
        setShippingAddress(addressForm);
        setCurrentStep('shipping');
      }
    } else if (currentStep === 'shipping') {
      setCurrentStep('payment');
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'shipping') {
      setCurrentStep('billing');
    } else if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else {
      onBack();
    }
  };

  const handlePlaceOrder = () => {
    // In a real app, this would submit to a payment processor
    onComplete();
  };

  const getCurrentStepIndex = () => STEPS.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Progress */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevStep}
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-xl font-bold text-slate-900">Checkout</h1>
            <div className="w-16"></div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    step.id === currentStep
                      ? 'bg-blue-600 text-white'
                      : getCurrentStepIndex() > index
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step.id === currentStep
                      ? 'bg-white text-blue-600'
                      : getCurrentStepIndex() > index
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-300 text-white'
                  }`}>
                    {getCurrentStepIndex() > index ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-12 h-0.5 ${getCurrentStepIndex() > index ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form */}
          <div className="flex-1">
            {currentStep === 'billing' && (
              <BillingShippingForm
                addressForm={addressForm}
                setAddressForm={setAddressForm}
                billingInfo={billingInfo}
                setBillingInfo={setBillingInfo}
                formErrors={formErrors}
              />
            )}

            {currentStep === 'shipping' && (
              <ShippingMethodForm
                shippingMethod={shippingMethod}
                setShippingMethod={setShippingMethod}
              />
            )}

            {currentStep === 'payment' && (
              <PaymentForm
                shippingAddress={addressForm}
                shippingMethod={shippingMethod}
              />
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handlePrevStep}
                className="px-6 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
              >
                Back
              </button>
              {currentStep !== 'payment' ? (
                <button
                  onClick={handleNextStep}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                >
                  Place Order
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-4">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>

              {/* Cart Items Preview */}
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-14 bg-slate-50 rounded flex-shrink-0 flex items-center justify-center">
                      <ShapeThumbnail
                        svgGenerator={item.shape.svg_path_generator}
                        parameters={item.shapeParams}
                        className="w-full h-full"
                        fillColor="#64748b"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{item.shape.name}</p>
                      <p className="text-xs text-slate-500">{item.materialName} - Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      SAR {(item.quote.total * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">SAR {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? 'Free' : `SAR ${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">SAR {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components for each step
const BillingShippingForm: React.FC<{
  addressForm: ShippingAddress;
  setAddressForm: (form: ShippingAddress) => void;
  billingInfo: any;
  setBillingInfo: (info: any) => void;
  formErrors: Record<string, string>;
}> = ({ addressForm, setAddressForm, billingInfo, setBillingInfo, formErrors }) => {
  const updateField = (field: keyof ShippingAddress, value: string) => {
    setAddressForm({ ...addressForm, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Shipping Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
          <input
            type="text"
            value={addressForm.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.firstName ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
          <input
            type="text"
            value={addressForm.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.lastName ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Company (Optional)</label>
          <input
            type="text"
            value={addressForm.company}
            onChange={(e) => updateField('company', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 1 *</label>
          <input
            type="text"
            value={addressForm.address1}
            onChange={(e) => updateField('address1', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.address1 ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {formErrors.address1 && <p className="text-red-500 text-xs mt-1">{formErrors.address1}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 2</label>
          <input
            type="text"
            value={addressForm.address2}
            onChange={(e) => updateField('address2', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
          <input
            type="text"
            value={addressForm.city}
            onChange={(e) => updateField('city', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.city ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">State/Province</label>
          <input
            type="text"
            value={addressForm.state}
            onChange={(e) => updateField('state', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Postal Code *</label>
          <input
            type="text"
            value={addressForm.postalCode}
            onChange={(e) => updateField('postalCode', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.postalCode ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {formErrors.postalCode && <p className="text-red-500 text-xs mt-1">{formErrors.postalCode}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
          <select
            value={addressForm.country}
            onChange={(e) => updateField('country', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="UAE">UAE</option>
            <option value="Kuwait">Kuwait</option>
            <option value="Qatar">Qatar</option>
            <option value="Bahrain">Bahrain</option>
            <option value="Oman">Oman</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            value={addressForm.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.phone ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="+966 50 123 4567"
          />
          {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
        </div>
      </div>

      {/* Billing Options */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Billing Information</h3>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={billingInfo.useShippingAddress}
            onChange={(e) => setBillingInfo({ ...billingInfo, useShippingAddress: e.target.checked })}
            className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-700">Use shipping address for billing</span>
        </label>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">PO Number (Optional)</label>
            <input
              type="text"
              value={billingInfo.poNumber || ''}
              onChange={(e) => setBillingInfo({ ...billingInfo, poNumber: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter PO number"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Order Notes (Optional)</label>
          <textarea
            value={billingInfo.notes || ''}
            onChange={(e) => setBillingInfo({ ...billingInfo, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Special instructions for your order..."
          />
        </div>
      </div>
    </div>
  );
};

const ShippingMethodForm: React.FC<{
  shippingMethod: string;
  setShippingMethod: (method: any) => void;
}> = ({ shippingMethod, setShippingMethod }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-6">Select Shipping Method</h2>

      <div className="space-y-3">
        {SHIPPING_OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              shippingMethod === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-4">
              <input
                type="radio"
                name="shippingMethod"
                checked={shippingMethod === option.id}
                onChange={() => setShippingMethod(option.id)}
                className="w-5 h-5 text-blue-600"
              />
              <div>
                <p className="font-semibold text-slate-900">{option.name}</p>
                <p className="text-sm text-slate-500">{option.estimatedDays}</p>
              </div>
            </div>
            <span className="text-lg font-bold text-slate-900">
              {option.price === 0 ? 'Free' : `SAR ${option.price.toFixed(2)}`}
            </span>
          </label>
        ))}
      </div>

      {/* Shipping Info */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800">Delivery Times</p>
            <p className="text-xs text-amber-700 mt-1">
              Delivery times are estimates and may vary based on order complexity and current production capacity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentForm: React.FC<{
  shippingAddress: ShippingAddress;
  shippingMethod: string;
}> = ({ shippingAddress, shippingMethod }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'cod'>('card');

  return (
    <div className="space-y-6">
      {/* Order Review */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Review Your Order</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Shipping Address</h3>
            <div className="text-sm text-slate-600">
              <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
              {shippingAddress.company && <p>{shippingAddress.company}</p>}
              <p>{shippingAddress.address1}</p>
              {shippingAddress.address2 && <p>{shippingAddress.address2}</p>}
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
              <p>{shippingAddress.country}</p>
              <p className="mt-1">{shippingAddress.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Shipping Method</h3>
            <p className="text-sm text-slate-600">
              {SHIPPING_OPTIONS.find(o => o.id === shippingMethod)?.name}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {SHIPPING_OPTIONS.find(o => o.id === shippingMethod)?.estimatedDays}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Payment Method</h2>

        <div className="space-y-3">
          <label
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentMethod === 'card'
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
              className="w-5 h-5 text-blue-600"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Credit / Debit Card</p>
              <p className="text-sm text-slate-500">Pay securely with your card</p>
            </div>
            <div className="flex gap-2">
              <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-600">VISA</div>
              <div className="w-10 h-6 bg-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-600">MC</div>
            </div>
          </label>

          <label
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentMethod === 'bank'
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === 'bank'}
              onChange={() => setPaymentMethod('bank')}
              className="w-5 h-5 text-blue-600"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Bank Transfer</p>
              <p className="text-sm text-slate-500">Pay via bank transfer (order processed after payment confirmation)</p>
            </div>
          </label>

          <label
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentMethod === 'cod'
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
              className="w-5 h-5 text-blue-600"
            />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">Cash on Delivery</p>
              <p className="text-sm text-slate-500">Pay when you receive your order (local pickup only)</p>
            </div>
          </label>
        </div>

        {/* Card Details Form (shown when card is selected) */}
        {paymentMethod === 'card' && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name on Card</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bank Transfer Info */}
        {paymentMethod === 'bank' && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm font-medium text-slate-700">Bank Transfer Details</p>
            <p className="text-xs text-slate-500 mt-2">
              After placing your order, you will receive bank transfer details via email.
              Your order will be processed once payment is confirmed.
            </p>
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <span className="text-sm text-slate-600">
            I agree to the <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a> and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
          </span>
        </label>
      </div>
    </div>
  );
};

export default CheckoutPage;
