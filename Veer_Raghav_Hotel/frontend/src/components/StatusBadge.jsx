import React from 'react';
import { Badge } from '@/components/ui/badge';

const StatusBadge = ({ status }) => {
  const getVariantAndClasses = () => {
    switch (status) {
      case 'Cancelled':
        return {
          variant: 'destructive',
          className: 'bg-red-500 hover:bg-red-600 text-white'
        };
      case 'Pending':
        return {
          variant: 'default',
          className: 'bg-green-500 hover:bg-green-600 text-white'
        };
      case 'Completed':
        return {
          variant: 'secondary',
          className: 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        };
      default:
        return {
          variant: 'outline',
          className: ''
        };
    }
  };

  const { variant, className } = getVariantAndClasses();

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
};

export default StatusBadge;