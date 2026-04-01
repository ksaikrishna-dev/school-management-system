import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { FaCalendarAlt, FaCheck, FaTimes, FaSave } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

export const Attendance = () => {
  const { data, updateAttendance } = useAppData();
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Create a local map for the current day's attendance
  const [attendanceState, setAttendanceState] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const uniqueClasses = useMemo(() => {
    return [...new Set(data.students.map(s => s.class))].sort();
  }, [data.students]);

  const studentsInClass = useMemo(() => {
    return data.students.filter(s => s.class === selectedClass);
  }, [data.students, selectedClass]);

  // When class or date changes, try to load existing attendance data for that day
  React.useEffect(() => {
    if (!selectedClass) return;

    const existingRecord = data.attendance[selectedDate] || [];
    const newState = {};
    
    // Default all to Present if no record exists for the student on this day
    studentsInClass.forEach(student => {
      const existing = existingRecord.find(r => r.studentId === student.id);
      newState[student.id] = existing ? existing.status : 'Present';
    });
    
    setAttendanceState(newState);
  }, [selectedClass, selectedDate, studentsInClass, data.attendance]);

  const toggleStatus = (studentId) => {
    setAttendanceState(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    // Save attendance payload to app data (custom logic since it's a nested object keyed by date)
    // Normally we'd pass this to a provider function. We'll simulate by fetching and updating directly.
    const newRecordList = studentsInClass.map(s => ({
      studentId: s.id,
      status: attendanceState[s.id]
    }));

    const completeRecordList = [
      ...(data.attendance[selectedDate] || []).filter(item => !studentsInClass.find(s => s.id === item.studentId)), 
      ...newRecordList
    ];
    
    await updateAttendance(selectedDate, completeRecordList);
    
    setIsSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Mark Attendance</h2>
          <p className="text-slate-500 text-sm mt-1">Record daily attendance by selecting class and date</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6">
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium text-slate-700">Select Class</label>
          <select 
            value={selectedClass} 
            onChange={e => setSelectedClass(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none text-slate-700 font-medium"
          >
            <option value="" disabled>-- Select a class --</option>
            {uniqueClasses.map(cls => (
              <option key={cls} value={cls}>Class {cls}</option>
            ))}
          </select>
        </div>
        
        <div className="flex-1 space-y-1">
          <label className="text-sm font-medium text-slate-700">Date</label>
          <div className="relative">
            <input 
              type="date" 
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium appearance-none"
            />
            <FaCalendarAlt className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {selectedClass ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-semibold text-slate-700">Student Roster ({studentsInClass.length} students)</h3>
            <button
              onClick={handleSave}
              disabled={isSaving || studentsInClass.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-70"
            >
              {isSaving ? "Saving..." : <><FaSave /> Save Attendance</>}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium w-16">Roll</th>
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium text-right w-48">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {studentsInClass.map((student) => {
                    const status = attendanceState[student.id] || 'Present';
                    const isPresent = status === 'Present';
                    
                    return (
                      <motion.tr 
                        key={student.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-slate-500 font-mono text-sm">{student.rollNo}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs">
                              {student.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-700">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => toggleStatus(student.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ml-auto transition-all ${
                              isPresent 
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            {isPresent ? <><FaCheck /> Present</> : <><FaTimes /> Absent</>}
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
                {studentsInClass.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                      No students found in this class.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-100 border-dashed">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <FaCalendarAlt size={32} />
          </div>
          <h4 className="text-slate-700 font-medium text-lg">Select a Class</h4>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto">Please choose a class and date from the top menu to start marking attendance.</p>
        </div>
      )}
    </div>
  );
};
