import { redirect } from 'next/navigation';

export default function PickupLocationsRedirect() {
  // Redirect to unified shipping page
  // Users will need to click the "Pickup Locations" tab
  redirect('/admin/shipping');
}
