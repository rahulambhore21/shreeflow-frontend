"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { shippingService } from '@/lib/services/shippingService';
import { 
  Settings, 
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Loader2,
  Key,
  Mail
} from 'lucide-react';

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

export default function ShippingIntegrationTab() {
  const [shiprocketEmail, setShiprocketEmail] = useState('');
  const [shiprocketPassword, setShiprocketPassword] = useState('');
  const [isSavingIntegration, setIsSavingIntegration] = useState(false);
  const [shiprocketStatus, setShiprocketStatus] = useState<ShiprocketStatus | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadIntegrationData();
  }, []);

  const loadIntegrationData = async () => {
    try {
      setIsLoading(true);
      
      // Load existing Shiprocket integration
      const integrationResponse = await shippingService.getShiprocketIntegration().catch(() => ({ data: null }));
      
      if (integrationResponse.data) {
        setShiprocketEmail(integrationResponse.data.email || '');
        setShiprocketPassword(''); // Never pre-fill passwords
      }

      // Check Shiprocket status
      await checkShiprocketStatus();
      
    } catch (error: any) {
      console.error('Error loading integration data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load integration settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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
      
      await shippingService.saveShiprocketIntegration({
        email: shiprocketEmail,
        password: shiprocketPassword
      });
      
      // Clear password after successful save
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
      
      // Show notification if token expired
      if (response.data.status === 'token_expired' || response.data.requires_reauth) {
        toast({
          title: 'Authentication Required',
          description: 'Shiprocket token has expired. Please log in again to continue using shipping features.',
          variant: 'destructive',
        });
      }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      {shiprocketStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {shiprocketStatus.status === 'connected' ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Shiprocket Connected
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Shiprocket Status
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">
                    Status: <Badge variant={shiprocketStatus.status === 'connected' ? 'default' : 'destructive'}>
                      {shiprocketStatus.status}
                    </Badge>
                  </p>
                  <p className="text-sm text-gray-600">{shiprocketStatus.message}</p>
                  {shiprocketStatus.email && (
                    <p className="text-sm text-gray-500">Email: {shiprocketStatus.email}</p>
                  )}
                  {shiprocketStatus.status === 'connected' && (
                    <>
                      <p className="text-sm text-green-600 font-medium mt-1">
                        ✓ Ready for automatic shipments. Manage pickup locations in your Shiprocket dashboard.
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        🔄 Auto-refresh enabled - Token will refresh automatically before expiration
                      </p>
                    </>
                  )}
                </div>
                <Button
                  onClick={testShiprocketConnection}
                  variant="outline"
                  size="sm"
                  disabled={isTestingConnection}
                  className="gap-2"
                >
                  {isTestingConnection ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  Test Connection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Shiprocket API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="shiprocket-email">Shiprocket Email *</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="shiprocket-email"
                    type="email"
                    value={shiprocketEmail}
                    onChange={(e) => setShiprocketEmail(e.target.value)}
                    placeholder="your-email@example.com"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Your Shiprocket account email
                </p>
              </div>

              <div>
                <Label htmlFor="shiprocket-password">Shiprocket Password *</Label>
                <div className="relative mt-2">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="shiprocket-password"
                    type="password"
                    value={shiprocketPassword}
                    onChange={(e) => setShiprocketPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Your Shiprocket account password (never stored, only used for authentication)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleSaveShiprocketIntegration}
                disabled={isSavingIntegration}
                className="gap-2"
              >
                {isSavingIntegration ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Save & Connect
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium text-blue-900">About Shiprocket Integration</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your password is used only for authentication and is never stored</li>
                <li>• After successful login, a secure token is stored for API operations</li>
                <li>• Shipments are created automatically when customers place orders</li>
                <li>• <strong>Manage pickup locations directly in your <a href="https://app.shiprocket.in/seller/settings/pickup-address" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Shiprocket dashboard</a></strong></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
