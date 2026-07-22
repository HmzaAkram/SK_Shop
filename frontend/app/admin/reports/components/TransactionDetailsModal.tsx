import { X } from 'lucide-react'

export function TransactionDetailsModal({ transaction, onClose }: { transaction: any, onClose: () => void }) {
  if (!transaction) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Transaction Details</h2>
            <p className="text-sm text-gray-500">ID: {transaction.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Entity Name</p>
              <p className="font-bold text-gray-900">{transaction.supplier || transaction.entity}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Date</p>
              <p className="font-bold text-gray-900">{transaction.date}</p>
            </div>
            
            {transaction.product && (
              <div className="col-span-2">
                <p className="text-sm text-gray-500 mb-1">Stock Details</p>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="font-medium text-gray-900">{transaction.product}</p>
                  <p className="text-sm text-gray-600">{transaction.qty} units @ RS {transaction.rate?.toLocaleString()}</p>
                </div>
              </div>
            )}
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="font-bold text-gray-900 text-lg">RS {transaction.totalBill?.toLocaleString() || transaction.amount?.toLocaleString()}</p>
            </div>
            
            {transaction.remaining !== undefined && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Remaining Balance</p>
                <p className="font-bold text-red-600 text-lg">RS {transaction.remaining?.toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Payment History List if it exists */}
          {transaction.history && transaction.history.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Payment History</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 border-b border-gray-200">Date</th>
                      <th className="px-4 py-3 border-b border-gray-200">Method</th>
                      <th className="px-4 py-3 border-b border-gray-200 text-right">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transaction.history.map((h: any, idx: number) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-gray-900">{h.date}</td>
                        <td className="px-4 py-3 text-gray-600">{h.method}</td>
                        <td className="px-4 py-3 text-right font-medium text-green-600">RS {h.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 transition" onClick={onClose}>Close</button>
          {transaction.remaining > 0 && (
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[oklch(0.58_0.235_29.234)] hover:bg-[oklch(0.52_0.235_29.234)] transition" onClick={() => {
              alert('Dummy Action: Open payment form for remaining balance')
            }}>Record Payment</button>
          )}
        </div>
      </div>
    </div>
  )
}
