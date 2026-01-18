"use client";

import ShippingIntegrationTab from './ShippingIntegrationTab';

export default function UnifiedShippingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Shipping Management</h2>
        <p className="text-gray-600 mt-2">
          Configure Shiprocket integration for automatic shipment creation
        </p>
      </div>

      {/* Integration Section */}
      <ShippingIntegrationTab />
    </div>
  );
}
