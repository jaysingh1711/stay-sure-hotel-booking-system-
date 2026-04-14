import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import React from 'react';

const ReportsContent = () => {


  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: "Scheduled: Catch up",
      description: "Friday, February 10, 2023 at 5:57 PM",
    })
  }
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Reports Management</h2>
      {/* Placeholder for Reports management content */}
      <p className="text-gray-500">Reports management functionality will be implemented here.</p>


      <Button
        onClick={handleClick}
      >
        Show Toast
      </Button>
    </div>
  );
};

export default ReportsContent;