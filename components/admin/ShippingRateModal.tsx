"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { shippingService } from '@/lib/services/shippingService';

interface ShippingRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  rate?: {
    _id: string;
    id?: string; // Optional for backward compatibility
    name: string;
    description: string;
    baseRate: number;
    perKmRate: number;
    freeShippingThreshold: number;
    estimatedDays: string;
  } | null;
}

export default function ShippingRateModal({ isOpen, onClose, onSuccess, rate }: ShippingRateModalProps) {
  const [formData, setFormData] = useState({
    name: rate?.name || '',
    description: rate?.description || '',
    baseRate: rate?.baseRate?.toString() || '',
    perKmRate: rate?.perKmRate?.toString() || '',
    freeShippingThreshold: rate?.freeShippingThreshold?.toString() || '',
    estimatedDays: rate?.estimatedDays || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.baseRate || 
        !formData.perKmRate || !formData.freeShippingThreshold || !formData.estimatedDays) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const data = {
        name: formData.name,
        description: formData.description,
        baseRate: parseFloat(formData.baseRate),
        perKmRate: parseFloat(formData.perKmRate),
        freeShippingThreshold: parseFloat(formData.freeShippingThreshold),
        estimatedDays: formData.estimatedDays
      };

      if (rate) {
        await shippingService.updateShippingRate(rate._id, data);
        toast({
          title: "Success",
          description: "Shipping rate updated successfully",
        });
      } else {
        await shippingService.createShippingRate(data);
        toast({
          title: "Success",
          description: "Shipping rate created successfully",
        });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving shipping rate:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save shipping rate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        name: '',
        description: '',
        baseRate: '',
        perKmRate: '',
        freeShippingThreshold: '',
        estimatedDays: ''
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {rate ? 'Edit Shipping Rate' : 'Add Shipping Rate'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Rate Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Standard Shipping"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this shipping rate"
              disabled={isLoading}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="baseRate">Base Rate (₹)</Label>
              <Input
                id="baseRate"
                type="number"
                min="0"
                step="0.01"
                value={formData.baseRate}
                onChange={(e) => setFormData(prev => ({ ...prev, baseRate: e.target.value }))}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="perKmRate">Per Km Rate (₹)</Label>
              <Input
                id="perKmRate"
                type="number"
                min="0"
                step="0.01"
                value={formData.perKmRate}
                onChange={(e) => setFormData(prev => ({ ...prev, perKmRate: e.target.value }))}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="freeShippingThreshold">Free Shipping Threshold (₹)</Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                min="0"
                step="0.01"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData(prev => ({ ...prev, freeShippingThreshold: e.target.value }))}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="estimatedDays">Estimated Days</Label>
              <Input
                id="estimatedDays"
                value={formData.estimatedDays}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedDays: e.target.value }))}
                placeholder="e.g., 3-5"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (rate ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}