import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { FaPaperPlane, FaExclamationCircle, FaUser, FaCheckCircle, FaClock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const Complaints = () => {
  const { data, addRecord } = useAppData();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({ name: user?.name || '', role: user?.role || 'Student', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    setIsSubmitting(true);
    // Simulate slight network delay
    await new Promise(resolve => setTimeout(resolve, 600));

    addRecord('complaints', {
      ...formData,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    });
    
    setFormData(prev => ({ ...prev, text: '' }));
    setIsSubmitting(false);
  };

  const statusColors = {
    'Pending': 'text-orange-600 bg-orange-100',
    'Resolved': 'text-emerald-600 bg-emerald-100',
    'In Progress': 'text-blue-600 bg-blue-100'
  };

  const statusIcons = {
    'Pending': <FaClock className="text-orange-500" />,
    'Resolved': <FaCheckCircle className="text-emerald-500" />,
    'In Progress': <FaExclamationCircle className="text-blue-500" />
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Support & Complaints</h2>
          <p className="text-slate-500 text-sm mt-1">Submit tickets or report issues to the administration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Complaint Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <FaExclamationCircle className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">New Ticket</h3>
                <p className="text-xs text-slate-500">We usually respond within 24h</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    required type="text" value={formData.name} readOnly={!!user}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 read-only:bg-slate-100"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select 
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  disabled={!!user}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100"
                >
                  <option value="Student">Student</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  required rows="4" placeholder="Please describe the issue in detail..."
                  value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" disabled={isSubmitting || !formData.text.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : (
                  <>
                    <span>Submit Ticket</span>
                    <FaPaperPlane className="text-indigo-200 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Complaints List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-lg font-semibold text-slate-800">Recent Tickets</h3>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{data.complaints.length} Total</span>
          </div>

          <AnimatePresence>
            {data.complaints.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-100">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <FaCheckCircle size={24} />
                </div>
                <h4 className="text-slate-700 font-medium">All caught up!</h4>
                <p className="text-slate-500 text-sm mt-1">There are no pending complaints at the moment.</p>
              </div>
            ) : (
              data.complaints.slice().reverse().map((complaint, idx) => (
                <motion.div 
                  key={complaint.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start"
                >
                  <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full bg-slate-50 items-center justify-center border border-slate-100">
                    {statusIcons[complaint.status] || <FaExclamationCircle className="text-slate-400" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 text-base">{complaint.name}</span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-medium rounded-md">{complaint.role}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                          {complaint.date}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[complaint.status] || 'bg-slate-100 text-slate-600'}`}>
                          {complaint.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{complaint.text}</p>
                    
                    {user?.role === 'Admin' && complaint.status !== 'Resolved' && (
                       <div className="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                         <button className="text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">Mark Resolved</button>
                         <button className="text-xs font-medium text-slate-500 hover:text-slate-700 px-3 py-1.5 transition-colors">Add Note</button>
                       </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};
