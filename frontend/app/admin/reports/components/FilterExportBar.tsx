import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Download, Filter } from 'lucide-react'

export function FilterExportBar() {
  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
        
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-foreground/50" />
            <input 
              type="text" 
              placeholder="Search by name, invoice, method..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option>All Time</option>
              <option>Today</option>
              <option>Yesterday</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Custom Range</option>
            </select>
          </div>

          <div>
            <select className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option>All Categories</option>
              <option>Sales</option>
              <option>Purchases</option>
              <option>Expenses</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition inline-flex items-center justify-center">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
          <button 
            className="flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium text-white bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] transition inline-flex items-center justify-center"
            onClick={() => alert('Export functionality will connect to backend API.')}
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
        </div>

      </div>
    </Card>
  )
}
