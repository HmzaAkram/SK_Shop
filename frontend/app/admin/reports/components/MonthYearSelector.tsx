import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface MonthYearSelectorProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

export function MonthYearSelector({ month, year, onChange }: MonthYearSelectorProps) {
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);

  useEffect(() => {
    onChange(selectedMonth, selectedYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  const currentYear = new Date().getFullYear();
  const years = [] as number[];
  for (let y = currentYear - 5; y <= currentYear + 1; y++) {
    years.push(y);
  }

  return (
    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm border border-border">
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        className="appearance-none bg-transparent border-none text-foreground font-medium focus:outline-none"
      >
        {[...Array(12)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {new Date(0, i).toLocaleString(undefined, { month: 'long' })}
          </option>
        ))}
      </select>
      <span className="text-foreground/70">/</span>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        className="appearance-none bg-transparent border-none text-foreground font-medium focus:outline-none"
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-foreground/50" />
    </div>
  );
}
