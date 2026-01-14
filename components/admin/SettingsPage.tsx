"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings,
  Store,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Save,
  Key,
  Lock
} from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Business Settings
  const [businessSettings, setBusinessSettings] = useState({
    businessName: 'Shree Flow',
    tagline: 'Automatic Water Level Controllers',
    email: 'contact@shreeflow.com',
    phone: '+91 9876543210',
    address: '123 Main Street, Mumbai, Maharashtra, India',
    gst: 'GSTIN123456789',
    pan: 'ABCDE1234F'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    customerMessages: true,
    weeklyReports: false
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    razorpayEnabled: true,
    razorpayKeyId: 'rzp_test_***********',
    razorpayKeySecret: '*********************',
    codEnabled: true,
    minOrderAmount: 500
  });

  const handleSaveBusinessSettings = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Business settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Notification settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePaymentSettings = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Payment settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your application settings and preferences</p>
      </div>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessSettings.businessName}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={businessSettings.tagline}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, tagline: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={businessSettings.email}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phone"
                    value={businessSettings.phone}
                    onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Business Address</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <Textarea
                  id="address"
                  value={businessSettings.address}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
                  className="pl-10"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gst">GST Number</Label>
                <Input
                  id="gst"
                  value={businessSettings.gst}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, gst: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="pan">PAN Number</Label>
                <Input
                  id="pan"
                  value={businessSettings.pan}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, pan: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSaveBusinessSettings}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Business Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Receive email updates about your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Order Alerts</p>
                <p className="text-sm text-gray-600">Get notified when new orders are placed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.orderAlerts}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, orderAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Low Stock Alerts</p>
                <p className="text-sm text-gray-600">Receive alerts when products are running low</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.lowStockAlerts}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, lowStockAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Customer Messages</p>
                <p className="text-sm text-gray-600">Notifications for customer inquiries</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.customerMessages}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, customerMessages: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Weekly Reports</p>
                <p className="text-sm text-gray-600">Get weekly analytics and performance reports</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.weeklyReports}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReports: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSaveNotificationSettings}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Razorpay Settings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Razorpay Integration</h3>
                  <p className="text-sm text-gray-600">Configure Razorpay payment gateway</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.razorpayEnabled}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpayEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {paymentSettings.razorpayEnabled && (
                <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                  <div>
                    <Label htmlFor="razorpayKeyId">Razorpay Key ID</Label>
                    <div className="relative mt-1">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="razorpayKeyId"
                        value={paymentSettings.razorpayKeyId}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpayKeyId: e.target.value })}
                        className="pl-10"
                        type="password"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="razorpayKeySecret">Razorpay Key Secret</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="razorpayKeySecret"
                        value={paymentSettings.razorpayKeySecret}
                        onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpayKeySecret: e.target.value })}
                        className="pl-10"
                        type="password"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* COD Settings */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Cash on Delivery (COD)</h3>
                  <p className="text-sm text-gray-600">Allow customers to pay on delivery</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.codEnabled}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, codEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {paymentSettings.codEnabled && (
                <div className="pl-4 border-l-2 border-green-200">
                  <Label htmlFor="minOrderAmount">Minimum Order Amount for COD</Label>
                  <div className="relative mt-1 max-w-xs">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <Input
                      id="minOrderAmount"
                      type="number"
                      value={paymentSettings.minOrderAmount}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, minOrderAmount: parseInt(e.target.value) })}
                      className="pl-8"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSavePaymentSettings}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Payment Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Change Password</h3>
              <p className="text-sm text-gray-600 mb-4">Update your admin account password</p>
              <Button variant="outline">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
              <Button variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Enable 2FA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}