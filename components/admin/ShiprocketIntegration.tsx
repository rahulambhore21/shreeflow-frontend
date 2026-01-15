"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { shippingService } from '@/lib/services/shippingService';
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Send,
  Search,
  RefreshCw,
  Activity
} from 'lucide-react';

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
  status: 'connected' | 'error';
  message: string;
  pickupLocations?: any[];
}

export default function ShiprocketIntegration() {
  const [shipments, setShipments] = useState<ShipmentTracking[]>([]);
  const [shiprocketStatus, setShiprocketStatus] = useState<ShiprocketStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<ShipmentTracking | null>(null);
  const [isCreatingShipment, setIsCreatingShipment] = useState(false);
  const [isTrackingShipment, setIsTrackingShipment] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadShiprocketData();
  }, []);

  const loadShiprocketData = async () => {
    try {
      setIsLoading(true);
      const status = await shippingService.checkShiprocketStatus();
      setShiprocketStatus(status.data);
    } catch (error: any) {
      console.error('Error loading Shiprocket data:', error);
      setShiprocketStatus({
        status: 'error',
        message: 'Failed to connect to Shiprocket'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateShipment = async (orderId: string) => {
    try {
      setIsCreatingShipment(true);
      const result = await shippingService.createShipment(orderId);
      
      if (result.type === 'success') {
        toast({
          title: 'Success',
          description: 'Shipment created successfully in Shiprocket',
        });
        
        // Add to local shipments list
        const newShipment: ShipmentTracking = {
          orderId: result.data.orderId,
          shipmentId: result.data.shipmentId,
          awb: result.data.awb || 'Pending',
          status: 'Order Created',
          courierName: 'To be assigned',
        };
        setShipments(prev => [newShipment, ...prev]);
      }
    } catch (error: any) {
      console.error('Error creating shipment:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create shipment',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingShipment(false);
    }
  };

  const handleTrackShipment = async (orderId: string) => {
    try {
      setIsTrackingShipment(true);
      const result = await shippingService.trackShipment(orderId);
      
      if (result.type === 'success') {
        const trackingData = result.data.trackingData;
        
        setSelectedShipment({
          orderId: result.data.orderId,
          shipmentId: result.data.shipmentId,
          awb: result.data.awb,
          status: trackingData.current_status || 'Unknown',
          courierName: trackingData.courier_name || 'Unknown',
          trackingUrl: trackingData.track_url,
          estimatedDelivery: trackingData.edd,
          currentLocation: trackingData.last_location,
          lastUpdate: trackingData.last_update_date_time,
          trackingHistory: trackingData.scans || []
        });
        
        toast({
          title: 'Tracking Updated',
          description: `Current status: ${trackingData.current_status}`,
        });
      }
    } catch (error: any) {
      console.error('Error tracking shipment:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to track shipment',
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
        return <Package className="w-4 h-4 text-yellow-600" />;
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
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Shiprocket integration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shiprocket Integration</h2>
          <p className="text-gray-600 mt-1">Manage shipments and track deliveries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={loadShiprocketData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${
              shiprocketStatus?.status === 'connected' 
                ? 'bg-green-100' 
                : 'bg-red-100'
            }`}>
              {shiprocketStatus?.status === 'connected' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Integration Status
              </h3>
              <p className={`text-sm ${
                shiprocketStatus?.status === 'connected' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {shiprocketStatus?.message || 'Unknown status'}
              </p>
              {shiprocketStatus?.pickupLocations && shiprocketStatus.pickupLocations.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {shiprocketStatus.pickupLocations.length} pickup location(s) configured
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Create Shipment for Order ID
              </label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter Order ID"
                  className="flex-1"
                  id="create-shipment-order-id"
                />
                <Button 
                  onClick={() => {
                    const input = document.getElementById('create-shipment-order-id') as HTMLInputElement;
                    if (input?.value) {
                      handleCreateShipment(input.value);
                      input.value = '';
                    }
                  }}
                  disabled={isCreatingShipment}
                  className="flex items-center gap-2"
                >
                  {isCreatingShipment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Create
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Track Shipment by Order ID
              </label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter Order ID"
                  className="flex-1"
                  id="track-shipment-order-id"
                />
                <Button 
                  onClick={() => {
                    const input = document.getElementById('track-shipment-order-id') as HTMLInputElement;
                    if (input?.value) {
                      handleTrackShipment(input.value);
                      input.value = '';
                    }
                  }}
                  disabled={isTrackingShipment}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isTrackingShipment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  Track
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Details Modal */}
      {selectedShipment && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Shipment Details
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedShipment(null)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{selectedShipment.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Shipment ID</p>
                <p className="font-medium">{selectedShipment.shipmentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">AWB Number</p>
                <p className="font-medium">{selectedShipment.awb}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Courier</p>
                <p className="font-medium">{selectedShipment.courierName}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">Current Status:</p>
              <Badge className={getStatusBadge(selectedShipment.status)}>
                {getStatusIcon(selectedShipment.status)}
                {selectedShipment.status}
              </Badge>
            </div>
            
            {selectedShipment.currentLocation && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <p className="text-sm">
                  <span className="text-gray-500">Current Location:</span>{' '}
                  <span className="font-medium">{selectedShipment.currentLocation}</span>
                </p>
              </div>
            )}
            
            {selectedShipment.estimatedDelivery && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <p className="text-sm">
                  <span className="text-gray-500">Estimated Delivery:</span>{' '}
                  <span className="font-medium">{selectedShipment.estimatedDelivery}</span>
                </p>
              </div>
            )}
            
            {selectedShipment.trackingUrl && (
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(selectedShipment.trackingUrl, '_blank')}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Full Tracking
                </Button>
              </div>
            )}
            
            {selectedShipment.trackingHistory && selectedShipment.trackingHistory.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Tracking History
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedShipment.trackingHistory.map((scan, index) => (
                    <div key={index} className="flex items-start gap-3 p-2 bg-gray-50 rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{scan.status}</p>
                        <p className="text-xs text-gray-500">{scan.location}</p>
                        <p className="text-xs text-gray-400">{scan.date} {scan.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Shipments */}
      {shipments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Recent Shipments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {shipments.map((shipment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(shipment.status)}
                    <div>
                      <p className="font-medium">Order #{shipment.orderId.slice(-8)}</p>
                      <p className="text-sm text-gray-500">AWB: {shipment.awb}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadge(shipment.status)}>
                      {shipment.status}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleTrackShipment(shipment.orderId)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}