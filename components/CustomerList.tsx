import React from 'react';
import { Customer } from '../types';
import { Contact2, Mail, MapPin, Phone, ExternalLink, Search } from 'lucide-react';

interface CustomerListProps {
  customers: Customer[];
}

const CustomerList: React.FC<CustomerListProps> = ({ customers }) => {
  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
          <Contact2 size={32} />
        </div>
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">No Client Data</h3>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Register enterprise customers to manage their operations.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-10 py-7 text-left text-[11px] font-black text-slate-700 uppercase tracking-[0.3em] border-b border-slate-200">
                Client Entity
              </th>
              <th className="px-6 py-7 text-left text-[11px] font-black text-slate-700 uppercase tracking-[0.3em] border-b border-slate-200">
                Communication Hub
              </th>
              <th className="px-6 py-7 text-left text-[11px] font-black text-slate-700 uppercase tracking-[0.3em] border-b border-slate-200">
                Primary Locale
              </th>
              <th className="px-10 py-7 text-right text-[11px] font-black text-slate-700 uppercase tracking-[0.3em] border-b border-slate-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="px-10 py-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white mr-4 shadow-xl shadow-slate-950/20 group-hover:scale-110 transition-transform duration-300">
                      <span className="font-black text-sm">{customer.name[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="text-sm font-[1000] text-slate-950 tracking-tight">{customer.name}</div>
                      <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Corporate Account</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex flex-col space-y-1.5">
                    <div className="flex items-center text-xs font-black text-slate-900">
                      <Phone size={14} className="mr-2.5 text-blue-600" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center text-xs font-bold text-slate-500">
                      <Mail size={14} className="mr-2.5 text-slate-400" />
                      {customer.email}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 max-w-[240px]">
                  <div className="flex items-start text-xs font-bold text-slate-600 leading-relaxed">
                    <MapPin size={14} className="mr-2.5 mt-0.5 text-rose-500 shrink-0" />
                    <span className="truncate group-hover:whitespace-normal transition-all">{customer.address}</span>
                  </div>
                </td>
                <td className="px-10 py-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white border border-slate-100 hover:border-blue-200 rounded-xl shadow-sm transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0">
                      <ExternalLink size={18} />
                    </button>
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-950 hover:bg-white border border-slate-100 hover:border-slate-300 rounded-xl shadow-sm transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 delay-75">
                      <Search size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerList;