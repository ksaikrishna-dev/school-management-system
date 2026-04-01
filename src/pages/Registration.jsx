import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { FaUserGraduate, FaUserTie, FaEnvelope, FaLock, FaUser, FaBook, FaChalkboardTeacher } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

export const Registration = () => {
  const { addRecord } = useAppData();
  const [activeTab, setActiveTab] = useState('student');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Student', 
    class: '', rollNo: '', subject: '', contact: ''
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({
      name: '', email: '', password: '', role: tab === 'student' ? 'Student' : 'Staff', 
      class: '', rollNo: '', subject: '', contact: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    // 1. Add to auth users in Firestore
    const newUserId = Date.now().toString();
    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };
    await setDoc(doc(db, 'users', newUserId), { id: newUserId, ...newUser });

    // 2. Add to specific entity table
    if (activeTab === 'student') {
      addRecord('students', {
        name: formData.name,
        class: formData.class,
        rollNo: formData.rollNo,
        attendance: 100 // default
      });
    } else {
      addRecord('staff', {
        name: formData.name,
        subject: formData.subject,
        contact: formData.contact,
        attendance: 100 // default
      });
    }

    toast.success(`${formData.role} registered successfully!`);
    handleTabChange(activeTab); // reset form
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">User Registration</h2>
        <p className="text-slate-500 text-sm mt-1">Enroll new students or staff members into the system</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 p-2 gap-2 bg-slate-50/50">
          <button
            onClick={() => handleTabChange('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'student' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FaUserGraduate /> Student Registration
          </button>
          <button
            onClick={() => handleTabChange('staff')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'staff' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FaUserTie /> Staff Registration
          </button>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" placeholder="John Doe" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Email Address (Login ID)</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" placeholder="john@example.com" />
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Temporary Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100 my-6"></div>
            <h4 className="text-sm font-semibold text-slate-800 mb-4">{activeTab === 'student' ? 'Academic Details' : 'Professional Details'}</h4>

            <AnimatePresence mode="wait">
              {activeTab === 'student' ? (
                <motion.div key="student" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Class</label>
                    <div className="relative">
                      <FaBook className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required type="text" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" placeholder="e.g. 10A" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Roll Number</label>
                    <input required type="text" value={formData.rollNo} onChange={e => setFormData({...formData, rollNo: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" placeholder="e.g. 101" />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="staff" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Subject</label>
                    <div className="relative">
                      <FaChalkboardTeacher className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" placeholder="e.g. Mathematics" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Contact Number</label>
                    <input required type="text" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" placeholder="+1 234 567 890" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-6">
              <button 
                type="submit" disabled={isSubmitting}
                className={`w-full py-3 rounded-xl text-white font-medium shadow-sm transition-all active:scale-[0.98] disabled:opacity-75 flex justify-center items-center ${activeTab === 'student' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {isSubmitting ? "Processing..." : `Register ${activeTab === 'student' ? 'Student' : 'Staff'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
