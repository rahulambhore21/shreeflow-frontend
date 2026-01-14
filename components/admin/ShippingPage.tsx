"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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
  Settings
} from 'lucide-react';

interface ShippingRate {
  id: string;
  name: string;
  description: string;
  baseRate: number;
  perKmRate: number;
  freeShippingThreshold: number;
  estimatedDays: string;
  active: boolean;
}

interface ShippingZone {
  id: string;
  name: string;
  states: string[];
  rate: number;
  estimatedDays: string;
}

export default function ShippingPage() {
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadShippingData();
  }, []);

  const loadShippingData = async () => {
    try {
      setIsLoading(true);
      
      // For now, we'll use default local data since Shiprocket integration requires actual orders
      // These could be fetched from a settings API or configured in admin panel
      const defaultRates: ShippingRate[] = [
        {
          id: '1',
          name: 'Standard Shipping',
          description: 'Regular delivery within 5-7 business days',
          baseRate: 50,
          perKmRate: 0.5,
          freeShippingThreshold: 1000,
          estimatedDays: '5-7',
          active: true
        },
        {
          id: '2',
          name: 'Express Shipping',
          description: 'Fast delivery within 2-3 business days',
          baseRate: 100,
          perKmRate: 1.0,
          freeShippingThreshold: 2000,
          estimatedDays: '2-3',
          active: true
        }
      ];

      const defaultZones: ShippingZone[] = [
        {
          id: '1',
          name: 'Zone A - Local',
          states: ['Maharashtra', 'Gujarat', 'Goa'],
          rate: 50,
          estimatedDays: '2-3'
        },
        {
          id: '2',
          name: 'Zone B - Regional',
          states: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh'],
          rate: 75,
          estimatedDays: '3-5'
        },
        {
          id: '3',
          name: 'Zone C - National',
          states: ['Delhi', 'Uttar Pradesh', 'Rajasthan', 'Punjab', 'Haryana'],
          rate: 100,
          estimatedDays: '5-7'
        }
      ];

      setShippingRates(defaultRates);
      setShippingZones(defaultZones);
      
      toast({
        title: 'Info',
        description: 'Displaying default shipping configuration. Shiprocket integration available for real orders.',
      });
    } catch (error: any) {
      console.error('Error loading shipping data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load shipping configuration',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRateStatus = async (rateId: string) => {
    try {
      setShippingRates(prev =>
        prev.map(rate =>
          rate.id === rateId ? { ...rate, active: !rate.active } : rate
        )
      );
      toast({
        title: "Success",
        description: "Shipping rate updated successfully",
      });
    } catch (error) {
      console.error('Error updating rate:', error);
      toast({
        title: "Error",
        description: "Failed to update shipping rate",
        variant: "destructive",
      });
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
        <Button className="bg-blue-600 hover:bg-blue-700">
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
                <p className="text-2xl font-bold text-gray-900">₹1000+</p>
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
                <p className="text-2xl font-bold text-gray-900">3-5 Days</p>
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
          <div className="space-y-4">
            {shippingRates.map((rate) => (
              <div
                key={rate.id}
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
                      onClick={() => toggleRateStatus(rate.id)}
                    >
                      {rate.active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Zone
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shippingZones.map((zone) => (
              <div
                key={zone.id}
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
                        {zone.states.map((state) => (
                          <Badge key={state} variant="outline" className="text-xs">
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
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shiprocket Integration Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Shiprocket Integration
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
                />
              </div>

              <div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Save Integration Settings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}