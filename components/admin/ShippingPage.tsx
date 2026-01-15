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
  Trash2
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

export default function ShippingPage() {
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<ShippingRate | null>(null);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [shiprocketEmail, setShiprocketEmail] = useState('gamecradh@gmail.com');
  const [shiprocketToken, setShiprocketToken] = useState('pg^U*^19!jJOveqTlVXn2L#E%Dccu#ct');
  const [isSavingIntegration, setIsSavingIntegration] = useState(false);
  const [shiprocketStatus, setShiprocketStatus] = useState<any>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
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
        setShiprocketEmail(integrationResponse.data.email || 'gamecradh@gmail.com');
        setShiprocketToken(integrationResponse.data.token || 'pg^U*^19!jJOveqTlVXn2L#E%Dccu#ct');
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
          (rate._id || rate.id) === rateId ? { ...rate, active: !rate.active } : rate
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
      setShippingRates(prev => prev.filter(rate => (rate._id || rate.id) !== rateId));
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
      setShippingZones(prev => prev.filter(zone => (zone._id || zone.id) !== zoneId));
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
    if (!shiprocketEmail.trim() || !shiprocketToken.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both email and API token",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSavingIntegration(true);
      
      // Save Shiprocket integration settings
      await shippingService.saveShiprocketIntegration({
        email: shiprocketEmail,
        token: shiprocketToken
      });
      
      toast({
        title: "Success",
        description: "Shiprocket integration settings saved successfully",
      });
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
        connected: false,
        error: error.message
      });
    }
  };

  const testShiprocketConnection = async () => {
    try {
      setIsTestingConnection(true);
      await checkShiprocketStatus();
      
      if (shiprocketStatus?.connected) {
        toast({
          title: "Success",
          description: "Shiprocket connection is working!",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: shiprocketStatus?.error || "Unable to connect to Shiprocket",
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
          <p className="text-gray-600 mt-1">Configure shipping rates, zones, and delivery options</p>
        </div>
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

      {/* Shiprocket Integration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Shiprocket Integration
            </span>
            <div className="flex items-center gap-2">
              {shiprocketStatus?.connected && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              )}
              {shiprocketStatus?.connected === false && (
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
                <h4 className="font-semibold text-blue-900 mb-1">Shiprocket API Integration</h4>
                <p className="text-sm text-blue-800">
                  Connect your Shiprocket account to automatically calculate shipping rates and create shipments.
                  {shiprocketStatus?.connected && shiprocketStatus.email && (
                    <span className="block mt-1 font-medium">
                      Connected with: {shiprocketStatus.email}
                    </span>
                  )}
                  {shiprocketStatus?.error && (
                    <span className="block mt-1 text-red-600">
                      Error: {shiprocketStatus.error}
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
                  API Token
                </label>
                <Input
                  type="password"
                  placeholder="Enter your Shiprocket API token"
                  className="max-w-md"
                  value={shiprocketToken}
                  onChange={(e) => setShiprocketToken(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleSaveShiprocketIntegration}
                  disabled={isSavingIntegration}
                >
                  {isSavingIntegration ? 'Saving...' : 'Save Integration Settings'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={testShiprocketConnection}
                  disabled={isTestingConnection || !shiprocketEmail || !shiprocketToken}
                >
                  {isTestingConnection ? 'Testing...' : 'Test Connection'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
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