"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { shippingService } from '@/lib/services/shippingService';
import ShippingRateModal from './ShippingRateModal';
import ShippingZoneModal from './ShippingZoneModal';
import { 
  Truck, 
  Package, 
  MapPin, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Plus,
  Settings,
  Trash2,
  RefreshCw,
  Search,
  Send,
  Eye,
  ExternalLink
} from 'lucide-react';

interface ShippingRate {
  _id: string;
  id?: string; // Optional for backward compatibility
  name: string;
  description: string;
  baseRate: number;
  perKmRate: number;
  freeShippingThreshold: number;
  estimatedDays: string;
  active: boolean;
}

interface ShippingZone {
  _id: string;
  id?: string; // Optional for backward compatibility
  name: string;
  states: string[];
  rate: number;
  estimatedDays: string;
}

interface ShipmentTracking {
  orderId: string;
  shipmentId: string;
  awb: string;
  status: string;
  courierName: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  currentLocation?: string;
  lastUpdate?: string;
  trackingHistory?: Array<{
    status: string;
    location: string;
    date: string;
    time: string;
  }>;
}

interface ShiprocketStatus {
  status: 'connected' | 'error' | 'token_expired';
  message: string;
  email?: string;
  pickup_locations?: number;
  last_authenticated?: string;
  token_expires?: string;
  requires_reauth?: boolean;
  error?: string;
}

export default function ShippingPage() {
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<ShippingRate | null>(null);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [shiprocketEmail, setShiprocketEmail] = useState('');
  const [shiprocketPassword, setShiprocketPassword] = useState('');  // ✅ CHANGED: Use password instead of token
  const [isSavingIntegration, setIsSavingIntegration] = useState(false);
  const [shiprocketStatus, setShiprocketStatus] = useState<ShiprocketStatus | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  // Shipment Management State
  const [shipments, setShipments] = useState<ShipmentTracking[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentTracking | null>(null);
  const [isCreatingShipment, setIsCreatingShipment] = useState(false);
  const [isTrackingShipment, setIsTrackingShipment] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderIdForShipment, setOrderIdForShipment] = useState('');
  const [trackingAWB, setTrackingAWB] = useState('');
  const [activeTab, setActiveTab] = useState<'configuration' | 'integration' | 'shipments' | 'rates'>('configuration');
  
  // Shiprocket Rate Calculation State
  const [rateCalculation, setRateCalculation] = useState({
    pickup_postcode: '',
    delivery_postcode: '',
    weight: '',
    length: '10',
    breadth: '10', 
    height: '10',
    cod: '0',
    order_amount: '100'
  });
  const [calculatedRates, setCalculatedRates] = useState<any[]>([]);
  const [isCalculatingRates, setIsCalculatingRates] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    loadShippingData();
  }, []);

  const loadShippingData = async () => {
    try {
      setIsLoading(true);
      
      // Load shipping rates and zones from API
      const [ratesResponse, zonesResponse, integrationResponse] = await Promise.all([
        shippingService.getShippingRates(),
        shippingService.getShippingZones(),
        shippingService.getShiprocketIntegration().catch(() => ({ data: null }))
      ]);
      
      setShippingRates(ratesResponse.data || []);
      setShippingZones(zonesResponse.data || []);
      
      // Load existing Shiprocket integration if available
      if (integrationResponse.data) {
        setShiprocketEmail(integrationResponse.data.email || '');
        setShiprocketPassword(''); // ✅ SECURE: Never pre-fill passwords
      }

      // Check Shiprocket status
      await checkShiprocketStatus();
      
    } catch (error: any) {
      console.error('Error loading shipping data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load shipping configuration',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRateStatus = async (rateId: string) => {
    try {
      await shippingService.toggleShippingRateStatus(rateId);
      
      // Update local state
      setShippingRates(prev =>
        prev.map(rate =>
          rate._id === rateId ? { ...rate, active: !rate.active } : rate
        )
      );
      
      toast({
        title: "Success",
        description: "Shipping rate updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating rate:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update shipping rate",
        variant: "destructive",
      });
    }
  };

  const handleEditRate = (rate: ShippingRate) => {
    setEditingRate(rate);
    setIsRateModalOpen(true);
  };

  const handleEditZone = (zone: ShippingZone) => {
    setEditingZone(zone);
    setIsZoneModalOpen(true);
  };

  const handleDeleteRate = async (rateId: string) => {
    if (!confirm('Are you sure you want to delete this shipping rate?')) {
      return;
    }

    try {
      await shippingService.deleteShippingRate(rateId);
      setShippingRates(prev => prev.filter(rate => rate._id !== rateId));
      toast({
        title: "Success",
        description: "Shipping rate deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting rate:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete shipping rate",
        variant: "destructive",
      });
    }
  };

  const handleDeleteZone = async (zoneId: string) => {
    if (!confirm('Are you sure you want to delete this shipping zone?')) {
      return;
    }

    try {
      await shippingService.deleteShippingZone(zoneId);
      setShippingZones(prev => prev.filter(zone => zone._id !== zoneId));
      toast({
        title: "Success",
        description: "Shipping zone deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting zone:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete shipping zone",
        variant: "destructive",
      });
    }
  };

  const handleModalSuccess = () => {
    loadShippingData();
    setEditingRate(null);
    setEditingZone(null);
  };

  const handleSaveShiprocketIntegration = async () => {
    if (!shiprocketEmail.trim() || !shiprocketPassword.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSavingIntegration(true);
      
      // ✅ PRODUCTION SAFE: Send email + password to login-only endpoint
      await shippingService.saveShiprocketIntegration({
        email: shiprocketEmail,
        password: shiprocketPassword  // ✅ CHANGED: Send password for login
      });
      
      // ✅ SECURE: Clear password after successful save
      setShiprocketPassword('');
      
      toast({
        title: "Success",
        description: "Shiprocket integration configured successfully",
      });
      
      // Refresh status after save
      await checkShiprocketStatus();
      
    } catch (error: any) {
      console.error('Error saving Shiprocket integration:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save Shiprocket integration settings",
        variant: "destructive",
      });
    } finally {
      setIsSavingIntegration(false);
    }
  };

  const checkShiprocketStatus = async () => {
    try {
      const response = await shippingService.checkShiprocketStatus();
      setShiprocketStatus(response.data);
    } catch (error: any) {
      console.error('Error checking Shiprocket status:', error);
      setShiprocketStatus({
        status: 'error',
        message: error.message
      });
    }
  };

  const testShiprocketConnection = async () => {
    try {
      setIsTestingConnection(true);
      await checkShiprocketStatus();
      
      if (shiprocketStatus?.status === 'connected') {
        toast({
          title: "Success",
          description: "Shiprocket connection successful!",
        });
      } else {
        toast({
          title: "Warning",
          description: shiprocketStatus?.message || "Connection test completed with issues",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Test Failed",
        description: error.message || "Failed to test Shiprocket connection",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Shipment Management Functions
  const handleCreateShipment = async () => {
    if (!orderIdForShipment.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an order ID',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCreatingShipment(true);
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shiprocket/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ order_id: orderIdForShipment })
      });

      const data = await result.json();
      
      if (data.type === 'success') {
        toast({
          title: 'Success',
          description: 'Shipment created successfully in Shiprocket',
        });
        
        // Add to local shipments list
        const newShipment: ShipmentTracking = {
          orderId: orderIdForShipment,
          shipmentId: data.data.shipment_id,
          awb: data.data.awb_code,
          status: 'NEW',
          courierName: data.data.courier_name,
          trackingUrl: `https://shiprocket.co/tracking/${data.data.awb_code}`,
          estimatedDelivery: data.data.estimated_delivery_date,
          lastUpdate: new Date().toISOString()
        };
        
        setShipments(prev => [newShipment, ...prev]);
        setOrderIdForShipment('');
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error('Error creating shipment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create shipment',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingShipment(false);
    }
  };

  const handleTrackShipment = async () => {
    if (!trackingAWB.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an AWB number',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsTrackingShipment(true);
      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shiprocket/track/${trackingAWB}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await result.json();
      
      if (data.type === 'success' && data.data.tracking_data) {
        const trackingData = data.data.tracking_data;
        const updatedShipment: ShipmentTracking = {
          orderId: trackingData.order_id || trackingAWB,
          shipmentId: trackingData.shipment_id,
          awb: trackingAWB,
          status: trackingData.track_status,
          courierName: trackingData.courier_name,
          currentLocation: trackingData.current_status,
          lastUpdate: new Date().toISOString(),
          trackingHistory: trackingData.shipment_track || []
        };
        
        setSelectedShipment(updatedShipment);
        
        // Update existing shipment if found
        setShipments(prev => {
          const existingIndex = prev.findIndex(s => s.awb === trackingAWB);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = { ...updated[existingIndex], ...updatedShipment };
            return updated;
          } else {
            return [updatedShipment, ...prev];
          }
        });
        
        toast({
          title: 'Success',
          description: 'Shipment tracking updated successfully',
        });
      } else {
        throw new Error(data.message || 'No tracking data found');
      }
    } catch (error: any) {
      console.error('Error tracking shipment:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to track shipment',
        variant: 'destructive',
      });
    } finally {
      setIsTrackingShipment(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'shipped':
      case 'in transit':
        return <Truck className="w-4 h-4 text-blue-600" />;
      case 'order created':
      case 'manifested':
        return <Package className="w-4 h-4 text-orange-600" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium";
    
    switch (status.toLowerCase()) {
      case 'delivered':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'shipped':
      case 'in transit':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'order created':
      case 'manifested':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const filteredShipments = shipments.filter(shipment =>
    shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.awb.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.courierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Shiprocket Rate Calculation Function
  const calculateShiprocketRates = async () => {
    if (!rateCalculation.pickup_postcode || !rateCalculation.delivery_postcode || !rateCalculation.weight) {
      toast({
        title: 'Error',
        description: 'Please fill pickup postcode, delivery postcode, and weight',
        variant: 'destructive',
      });
      return;
    }

    if (shiprocketStatus?.status !== 'connected') {
      toast({
        title: 'Error',
        description: 'Shiprocket integration required. Please connect your account first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCalculatingRates(true);
      
      const queryParams = new URLSearchParams({
        pickup_postcode: rateCalculation.pickup_postcode,
        delivery_postcode: rateCalculation.delivery_postcode,
        weight: rateCalculation.weight,
        length: rateCalculation.length,
        breadth: rateCalculation.breadth,
        height: rateCalculation.height,
        cod: rateCalculation.cod,
        order_amount: rateCalculation.order_amount
      });

      const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shiprocket/rates?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!result.ok) {
        throw new Error(`HTTP ${result.status}: ${result.statusText}`);
      }

      const data = await result.json();
      
      if (data.type === 'success') {
        // Shiprocket API returns rates in data.data.available_courier_companies array
        const rates = data.data?.available_courier_companies || [];
        console.log('📦 Received rates from API:', { 
          dataType: typeof data.data, 
          isArray: Array.isArray(rates), 
          ratesCount: rates.length,
          sampleRate: rates[0] 
        });
        
        // Ensure rates is always an array
        const safeRates = Array.isArray(rates) ? rates : [];
        setCalculatedRates(safeRates);
        
        toast({
          title: 'Success',
          description: `Found ${safeRates.length} shipping options`,
        });
      } else {
        console.error('API Error Response:', data);
        throw new Error(data.message || 'Failed to get shipping rates from Shiprocket');
      }
    } catch (error: any) {
      console.error('Error calculating rates:', error);
      console.error('Rate calculation request details:', {
        pickup_postcode: rateCalculation.pickup_postcode,
        delivery_postcode: rateCalculation.delivery_postcode,
        weight: rateCalculation.weight,
        order_amount: rateCalculation.order_amount,
        cod: rateCalculation.cod,
        shiprocketStatus: shiprocketStatus?.status
      });
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to calculate shipping rates',
        variant: 'destructive',
      });
      setCalculatedRates([]);
    } finally {
      setIsCalculatingRates(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Shipping Management</h2>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shipping Management</h2>
          <p className="text-gray-600 mt-1">Configure shipping rates, manage Shiprocket integration, and track shipments</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'configuration' && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setEditingRate(null);
                setIsRateModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Shipping Rate
            </Button>
          )}
          {activeTab === 'shipments' && (
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setOrderIdForShipment('')}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === 'configuration' ? 'default' : 'outline'}
              onClick={() => setActiveTab('configuration')}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Configuration
            </Button>
            <Button
              variant={activeTab === 'integration' ? 'default' : 'outline'}
              onClick={() => setActiveTab('integration')}
              className="flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              Shiprocket Integration
            </Button>
            <Button
              variant={activeTab === 'rates' ? 'default' : 'outline'}
              onClick={() => setActiveTab('rates')}
              className="flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Live Rates
            </Button>
            <Button
              variant={activeTab === 'shipments' ? 'default' : 'outline'}
              onClick={() => setActiveTab('shipments')}
              className="flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Active Shipments
              {shipments.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {shipments.length}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Tab */}
      {activeTab === 'configuration' && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Rates</p>
                <p className="text-2xl font-bold text-gray-900">
                  {shippingRates.filter(r => r.active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Shipping Zones</p>
                <p className="text-2xl font-bold text-gray-900">{shippingZones.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Free Shipping</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{shippingRates.length > 0 ? Math.min(...shippingRates.map(r => r.freeShippingThreshold)) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Delivery</p>
                <p className="text-2xl font-bold text-gray-900">
                  {shippingRates.length > 0 ? shippingRates[0].estimatedDays : '--'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipping Rates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Shipping Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shippingRates.length === 0 ? (
            <div className="text-center py-8">
              <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No shipping rates configured</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first shipping rate.</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setEditingRate(null);
                  setIsRateModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Shipping Rate
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {shippingRates.map((rate, index) => (
                <div
                  key={rate._id || rate.id || `rate-${index}`}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {rate.name}
                        </h3>
                        <Badge className={rate.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {rate.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{rate.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Base Rate</p>
                          <p className="font-semibold text-gray-900">₹{rate.baseRate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Per Km Rate</p>
                          <p className="font-semibold text-gray-900">₹{rate.perKmRate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Free Shipping</p>
                          <p className="font-semibold text-gray-900">₹{rate.freeShippingThreshold}+</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Estimated Days</p>
                          <p className="font-semibold text-gray-900">{rate.estimatedDays} days</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRateStatus(rate._id || rate.id || '')}
                      >
                        {rate.active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditRate(rate)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteRate(rate._id || rate.id || '')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Zones Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Zones
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setEditingZone(null);
                setIsZoneModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Zone
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shippingZones.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No shipping zones configured</h3>
              <p className="text-gray-600 mb-4">Create shipping zones to organize delivery areas and rates.</p>
              <Button 
                variant="outline"
                onClick={() => {
                  setEditingZone(null);
                  setIsZoneModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Zone
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {shippingZones.map((zone, index) => (
                <div
                  key={zone._id || zone.id || `zone-${index}`}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {zone.name}
                      </h3>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-2">Covered States:</p>
                        <div className="flex flex-wrap gap-2">
                          {zone.states.map((state, stateIndex) => (
                            <Badge key={`${zone._id || zone.id}-${state}-${stateIndex}`} variant="outline" className="text-xs">
                              {state}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Shipping Rate</p>
                          <p className="font-semibold text-gray-900">₹{zone.rate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Estimated Delivery</p>
                          <p className="font-semibold text-gray-900">{zone.estimatedDays} days</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditZone(zone)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteZone(zone._id || zone.id || '')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
        </>
      )}

      {/* Shiprocket Integration Tab */}
      {activeTab === 'integration' && (
        <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Shiprocket Integration
            </span>
            <div className="flex items-center gap-2">
              {shiprocketStatus?.status === 'connected' && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              )}
              {shiprocketStatus?.status === 'error' && (
                <Badge variant="destructive">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Disconnected
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Shiprocket Account Integration</h4>
                <p className="text-sm text-blue-800">
                  Connect your Shiprocket account using your login credentials for secure authentication.
                  {shiprocketStatus?.status === 'connected' && shiprocketStatus.email && (
                    <span className="block mt-1 font-medium">
                      ✅ Connected with: {shiprocketStatus.email}
                    </span>
                  )}
                  {shiprocketStatus?.status === 'token_expired' && (
                    <span className="block mt-1 text-orange-600">
                      ⚠️ Token expired - please re-authenticate
                    </span>
                  )}
                  {shiprocketStatus?.error && (
                    <span className="block mt-1 text-red-600">
                      ❌ Error: {shiprocketStatus.error}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shiprocket Email
                </label>
                <Input
                  type="email"
                  placeholder="your-email@example.com"
                  className="max-w-md"
                  value={shiprocketEmail}
                  onChange={(e) => setShiprocketEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your Shiprocket account password"
                  className="max-w-md"
                  value={shiprocketPassword}
                  onChange={(e) => setShiprocketPassword(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  ✅ Secure: Password is not stored and used only for authentication
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleSaveShiprocketIntegration}
                  disabled={isSavingIntegration}
                >
                  {isSavingIntegration ? 'Authenticating...' : 'Connect Account'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={testShiprocketConnection}
                  disabled={isTestingConnection}
                >
                  {isTestingConnection ? 'Checking...' : 'Check Status'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
        </>
      )}

      {/* Live Rates Tab */}
      {activeTab === 'rates' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Real-time Shiprocket Shipping Rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {shiprocketStatus?.status !== 'connected' && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <span className="font-medium text-amber-800">Shiprocket Integration Required</span>
                    </div>
                    <p className="text-sm text-amber-700 mt-1">
                      Please connect your Shiprocket account in the Integration tab to calculate live shipping rates.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Package Details</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pickup Postcode
                        </label>
                        <Input
                          placeholder="400001"
                          value={rateCalculation.pickup_postcode}
                          onChange={(e) => setRateCalculation(prev => ({ ...prev, pickup_postcode: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Postcode
                        </label>
                        <Input
                          placeholder="110001"
                          value={rateCalculation.delivery_postcode}
                          onChange={(e) => setRateCalculation(prev => ({ ...prev, delivery_postcode: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight (kg)
                        </label>
                        <Input
                          type="number"
                          placeholder="1.0"
                          step="0.1"
                          min="0.1"
                          value={rateCalculation.weight}
                          onChange={(e) => setRateCalculation(prev => ({ ...prev, weight: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Order Amount (₹)
                        </label>
                        <Input
                          type="number"
                          placeholder="100"
                          min="1"
                          value={rateCalculation.order_amount}
                          onChange={(e) => setRateCalculation(prev => ({ ...prev, order_amount: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cash on Delivery
                        </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={rateCalculation.cod}
                          onChange={(e) => setRateCalculation(prev => ({ ...prev, cod: e.target.value }))}
                        >
                          <option value="0">No COD</option>
                          <option value="1">COD Available</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Length (cm)
                          </label>
                          <Input
                            type="number"
                            placeholder="10"
                            value={rateCalculation.length}
                            onChange={(e) => setRateCalculation(prev => ({ ...prev, length: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Width (cm)
                          </label>
                          <Input
                            type="number"
                            placeholder="10"
                            value={rateCalculation.breadth}
                            onChange={(e) => setRateCalculation(prev => ({ ...prev, breadth: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Height (cm)
                          </label>
                          <Input
                            type="number"
                            placeholder="10"
                            value={rateCalculation.height}
                            onChange={(e) => setRateCalculation(prev => ({ ...prev, height: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={calculateShiprocketRates}
                      disabled={isCalculatingRates || shiprocketStatus?.status !== 'connected'}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isCalculatingRates ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4 mr-2" />
                      )}
                      Calculate Shipping Rates
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Available Shipping Options</h3>
                    
                    {!Array.isArray(calculatedRates) || calculatedRates.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No rates calculated yet</p>
                        <p className="text-sm text-gray-500 mt-1">Enter package details and click calculate to see live shipping rates</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {Array.isArray(calculatedRates) && calculatedRates.map((courier, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{courier.courier_name}</h4>
                                <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-600">
                                  <div>
                                    <span className="font-medium">Rate:</span> ₹{courier.rate}
                                  </div>
                                  <div>
                                    <span className="font-medium">COD:</span> {courier.cod ? '✅ Available' : '❌ Not Available'}
                                  </div>
                                  <div>
                                    <span className="font-medium">Estimated Delivery:</span> {courier.etd} days
                                  </div>
                                  <div>
                                    <span className="font-medium">Pickup:</span> {courier.pickup_performance || 'Standard'}
                                  </div>
                                </div>
                                {courier.freight_charge && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    Freight: ₹{courier.freight_charge} | Other: ₹{courier.other_charges || 0}
                                  </div>
                                )}
                              </div>
                              <Badge 
                                variant={courier.rating > 4 ? 'default' : 'secondary'}
                                className={courier.rating > 4 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                              >
                                ⭐ {courier.rating || 'N/A'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Active Shipments Tab */}
      {activeTab === 'shipments' && (
        <>
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Create Shipment */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Create New Shipment</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter Order ID"
                      value={orderIdForShipment}
                      onChange={(e) => setOrderIdForShipment(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleCreateShipment}
                      disabled={isCreatingShipment || shiprocketStatus?.status !== 'connected'}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isCreatingShipment ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Create
                    </Button>
                  </div>
                  {shiprocketStatus?.status !== 'connected' && (
                    <p className="text-sm text-red-600">
                      ⚠️ Shiprocket integration required. Go to Integration tab to connect.
                    </p>
                  )}
                </div>

                {/* Track Shipment */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Track Shipment</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter AWB Number"
                      value={trackingAWB}
                      onChange={(e) => setTrackingAWB(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleTrackShipment}
                      disabled={isTrackingShipment || shiprocketStatus?.status !== 'connected'}
                      variant="outline"
                    >
                      {isTrackingShipment ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4 mr-2" />
                      )}
                      Track
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipment Details */}
          {selectedShipment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Shipment Details - {selectedShipment.awb}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedShipment(null)}
                  >
                    Close
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Order ID:</span>
                        <p className="font-mono">{selectedShipment.orderId}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">AWB:</span>
                        <p className="font-mono">{selectedShipment.awb}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Courier:</span>
                        <p>{selectedShipment.courierName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Status:</span>
                        <div className={getStatusBadge(selectedShipment.status)}>
                          {getStatusIcon(selectedShipment.status)}
                          {selectedShipment.status}
                        </div>
                      </div>
                    </div>
                    
                    {selectedShipment.currentLocation && (
                      <div>
                        <span className="font-medium text-gray-600">Current Location:</span>
                        <p>{selectedShipment.currentLocation}</p>
                      </div>
                    )}
                    
                    {selectedShipment.estimatedDelivery && (
                      <div>
                        <span className="font-medium text-gray-600">Estimated Delivery:</span>
                        <p>{new Date(selectedShipment.estimatedDelivery).toLocaleDateString()}</p>
                      </div>
                    )}
                    
                    {selectedShipment.trackingUrl && (
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(selectedShipment.trackingUrl, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Shiprocket
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {selectedShipment.trackingHistory && selectedShipment.trackingHistory.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-4">Tracking History</h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {selectedShipment.trackingHistory.map((event, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{event.status}</p>
                              <p className="text-sm text-gray-600">{event.location}</p>
                              <p className="text-xs text-gray-500">{event.date} {event.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Shipments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Recent Shipments
                </span>
                {shipments.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search by Order ID, AWB, or Courier..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredShipments.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {shipments.length === 0 ? 'No shipments created yet' : 'No matching shipments'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {shipments.length === 0 
                      ? 'Create your first shipment using the quick actions above.' 
                      : 'Try adjusting your search criteria.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredShipments.map((shipment, index) => (
                    <div
                      key={`${shipment.awb}-${index}`}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">Order #{shipment.orderId}</h3>
                            <div className={getStatusBadge(shipment.status)}>
                              {getStatusIcon(shipment.status)}
                              {shipment.status}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">AWB:</span> {shipment.awb}
                            </div>
                            <div>
                              <span className="font-medium">Courier:</span> {shipment.courierName}
                            </div>
                            {shipment.estimatedDelivery && (
                              <div>
                                <span className="font-medium">Est. Delivery:</span> {
                                  new Date(shipment.estimatedDelivery).toLocaleDateString()
                                }
                              </div>
                            )}
                          </div>
                          
                          {shipment.currentLocation && (
                            <p className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Current:</span> {shipment.currentLocation}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedShipment(shipment)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                          
                          {shipment.trackingUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(shipment.trackingUrl, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Track
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
      
      {/* Modals */}
      <ShippingRateModal
        isOpen={isRateModalOpen}
        onClose={() => {
          setIsRateModalOpen(false);
          setEditingRate(null);
        }}
        onSuccess={handleModalSuccess}
        rate={editingRate}
      />
      
      <ShippingZoneModal
        isOpen={isZoneModalOpen}
        onClose={() => {
          setIsZoneModalOpen(false);
          setEditingZone(null);
        }}
        onSuccess={handleModalSuccess}
        zone={editingZone}
      />
    </div>
  );
}