"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { shippingService } from '@/lib/services/shippingService';

interface ShippingZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  zone?: {
    _id: string;
    id?: string; // Optional for backward compatibility
    name: string;
    states: string[];
    rate: number;
    estimatedDays: string;
  } | null;
}

// Indian states list
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

export default function ShippingZoneModal({ isOpen, onClose, onSuccess, zone }: ShippingZoneModalProps) {
  const [formData, setFormData] = useState({
    name: zone?.name || '',
    rate: zone?.rate?.toString() || '',
    estimatedDays: zone?.estimatedDays || ''
  });
  const [selectedStates, setSelectedStates] = useState<string[]>(zone?.states || []);
  const [stateSearch, setStateSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const filteredStates = INDIAN_STATES.filter(state => 
    state.toLowerCase().includes(stateSearch.toLowerCase()) &&
    !selectedStates.includes(state)
  );

  const addState = (state: string) => {
    setSelectedStates(prev => [...prev, state]);
    setStateSearch('');
  };

  const removeState = (state: string) => {
    setSelectedStates(prev => prev.filter(s => s !== state));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.rate || !formData.estimatedDays || selectedStates.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select at least one state",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      const data = {
        name: formData.name,
        states: selectedStates,
        rate: parseFloat(formData.rate),
        estimatedDays: formData.estimatedDays
      };

      if (zone) {
        await shippingService.updateShippingZone(zone._id || zone.id || '', data);
        toast({
          title: "Success",
          description: "Shipping zone updated successfully",
        });
      } else {
        await shippingService.createShippingZone(data);
        toast({
          title: "Success",
          description: "Shipping zone created successfully",
        });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving shipping zone:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save shipping zone",
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
        rate: '',
        estimatedDays: ''
      });
      setSelectedStates([]);
      setStateSearch('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {zone ? 'Edit Shipping Zone' : 'Add Shipping Zone'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Zone Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., North India"
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rate">Shipping Rate (₹)</Label>
              <Input
                id="rate"
                type="number"
                min="0"
                step="0.01"
                value={formData.rate}
                onChange={(e) => setFormData(prev => ({ ...prev, rate: e.target.value }))}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="estimatedDays">Estimated Days</Label>
              <Input
                id="estimatedDays"
                value={formData.estimatedDays}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedDays: e.target.value }))}
                placeholder="e.g., 2-4"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <Label>States/UTs</Label>
            <div className="space-y-2">
              {selectedStates.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-md">
                  {selectedStates.map(state => (
                    <Badge key={state} variant="secondary" className="flex items-center gap-1">
                      {state}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeState(state)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              
              <Input
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                placeholder="Search and select states..."
                disabled={isLoading}
              />
              
              {stateSearch && filteredStates.length > 0 && (
                <div className="border rounded-md max-h-32 overflow-y-auto">
                  {filteredStates.slice(0, 8).map(state => (
                    <div
                      key={state}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => addState(state)}
                    >
                      {state}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (zone ? 'Update' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}