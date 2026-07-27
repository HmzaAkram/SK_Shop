import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface QuickFiltersProps {
  onSelect: (type: 'currentMonth' | 'lastMonth' | 'last3Months' | 'last6Months' | 'currentYear' | 'custom') => void;
}

export function QuickFilters({ onSelect }: QuickFiltersProps) {
  const buttons = [
    { label: 'Current Month', type: 'currentMonth' },
    { label: 'Last Month', type: 'lastMonth' },
    { label: 'Last 3 Months', type: 'last3Months' },
    { label: 'Last 6 Months', type: 'last6Months' },
    { label: 'Current Year', type: 'currentYear' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {buttons.map((b) => (
        <Button
          key={b.type}
          variant="outline"
          size="sm"
          onClick={() => onSelect(b.type)}
          className="bg-white/80 backdrop-blur-sm"
        >
          {b.label}
        </Button>
      ))}
    </div>
  );
}
