import api from './api';

export const shippingService = {
  // Shipping Rates
  getShippingRates: async () => {
    const response = await api.get('/shipping/rates');
    return response.data;
  },

  createShippingRate: async (rateData: {
    name: string;
    description: string;
    baseRate: number;
    perKmRate: number;
    freeShippingThreshold: number;
    estimatedDays: string;
  }) => {
    const response = await api.post('/shipping/rates', rateData);
    return response.data;
  },

  updateShippingRate: async (id: string, rateData: any) => {
    const response = await api.put(`/shipping/rates/${id}`, rateData);
    return response.data;
  },

  toggleShippingRateStatus: async (id: string) => {
    const response = await api.patch(`/shipping/rates/${id}/toggle`);
    return response.data;
  },

  deleteShippingRate: async (id: string) => {
    const response = await api.delete(`/shipping/rates/${id}`);
    return response.data;
  },

  // Shipping Zones
  getShippingZones: async () => {
    const response = await api.get('/shipping/zones');
    return response.data;
  },

  createShippingZone: async (zoneData: {
    name: string;
    states: string[];
    rate: number;
    estimatedDays: string;
  }) => {
    const response = await api.post('/shipping/zones', zoneData);
    return response.data;
  },

  updateShippingZone: async (id: string, zoneData: any) => {
    const response = await api.put(`/shipping/zones/${id}`, zoneData);
    return response.data;
  },

  deleteShippingZone: async (id: string) => {
    const response = await api.delete(`/shipping/zones/${id}`);
    return response.data;
  },

  // Calculate shipping cost (public endpoint)
  calculateShippingCost: async (data: {
    state: string;
    pincode?: string;
    orderAmount: number;
    totalWeight?: number;
  }) => {
    const response = await api.post('/shipping/calculate', data);
    return response.data;
  },

  // ✅ PRODUCTION SAFE: Shiprocket Integration
  saveShiprocketIntegration: async (integrationData: {
    email: string;
    password: string;  // ✅ CHANGED: Use password instead of token
  }) => {
    const response = await api.post('/shipping/shiprocket/integration', integrationData);
    return response.data;
  },

  getShiprocketIntegration: async () => {
    const response = await api.get('/shipping/shiprocket/integration');
    return response.data;
  },

  checkShiprocketStatus: async () => {
    const response = await api.get('/shipping/shiprocket/status');  // ✅ CHANGED: Use new status endpoint
    return response.data;
  },

  // Order Shiprocket Integration
  createShipment: async (orderId: string) => {
    const response = await api.post(`/orders/admin/${orderId}/shipment`, {
      order_id: orderId
    });
    return response.data;
  },

  trackShipment: async (orderId: string) => {
    const response = await api.get(`/orders/admin/${orderId}/track`);
    return response.data;
  },

  // Direct Shiprocket API methods
  getShiprocketRates: async (data: {
    pickup_postcode: string;
    delivery_postcode: string;
    weight: number;
    length?: number;
    breadth?: number;
    height?: number;
  }) => {
    const response = await api.post('/shiprocket/rates', data);
    return response.data;
  },

  createShiprocketOrder: async (orderData: any) => {
    const response = await api.post('/shiprocket/orders', orderData);
    return response.data;
  },

  trackShiprocketShipment: async (awb: string) => {
    const response = await api.get(`/shiprocket/track/${awb}`);
    return response.data;
  },

  getPickupLocations: async () => {
    const response = await api.get('/shiprocket/pickup-locations');
    return response.data;
  },

  getAvailableCouriers: async (params: {
    pickup_postcode: string;
    delivery_postcode: string;
    weight: number;
    length?: number;
    breadth?: number;
    height?: number;
  }) => {
    const response = await api.get('/shiprocket/couriers', { params });
    return response.data;
  },

  cancelShiprocketShipment: async (awb: string) => {
    const response = await api.post('/shiprocket/cancel', { awb });
    return response.data;
  },

  // Generate invoice
  generateInvoice: async (orderId: string) => {
    const response = await api.get(`/shiprocket/invoice/${orderId}`);
    return response.data;
  },
};