import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { FaFilter, FaDownload, FaChartBar, FaTable } from 'react-icons/fa';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Reports = () => {
  const { data } = useAppData();
  
  const [reportType, setReportType] = useState('student'); // 'student' or 'staff'
  const [classFilter, setClassFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'table'

  const uniqueClasses = useMemo(() => {
    return [...new Set(data.students.map(s => s.class))].sort();
  }, [data.students]);

  const reportData = useMemo(() => {
    if (reportType === 'student') {
      let filtered = data.students;
      if (classFilter) {
        filtered = filtered.filter(s => s.class === classFilter);
      }
      return filtered.map(s => ({
        name: s.name,
        attendance: s.attendance,
        class: s.class,
        category: `Class ${s.class}`
      }));
    } else {
      return data.staff.map(s => ({
        name: s.name,
        attendance: s.attendance,
        subject: s.subject,
        category: s.subject
      }));
    }
  }, [data.students, data.staff, reportType, classFilter]);

  // Aggregate for chart
  const chartData = useMemo(() => {
    // Top 10 by default or map all if few
    return reportData.slice(0, 15).map(item => ({
      name: item.name.split(' ')[0], // first name for brevity
      attendance: item.attendance
    }));
  }, [reportData]);

  const handleExport = () => {
    // Dummy export functionality
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(reportData[0]).join(",") + "\n"
      + reportData.map(e => Object.values(e).join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportType}_attendance_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const title = reportType === 'student' ? 'Student Attendance Report' : 'Staff Attendance Report';
    
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text(title, 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    if (classFilter && reportType === 'student') {
      doc.text(`Class Filter: ${classFilter}`, 14, 36);
    }

    const tableColumn = ["Name", reportType === 'student' ? "Class" : "Subject", "Attendance %"];
    const tableRows = [];

    reportData.forEach(item => {
      tableRows.push([
        item.name,
        item.category,
        `${item.attendance}%`
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: (classFilter && reportType === 'student') ? 42 : 36,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 4, textColor: [51, 65, 85] },
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    doc.save(`${reportType}_attendance_report.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Attendance Reports</h2>
          <p className="text-slate-500 text-sm mt-1">Generate and analyze attendance data</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExportPDF}
            className="bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            <FaDownload /> Export PDF
          </button>
          <button 
            onClick={handleExport}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Report Type</label>
            <select 
              value={reportType} 
              onChange={e => { setReportType(e.target.value); setClassFilter(''); }}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="student">Student Attendance</option>
              <option value="staff">Staff Attendance</option>
            </select>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Filter by Class</label>
            <select 
              value={classFilter} 
              onChange={e => setClassFilter(e.target.value)}
              disabled={reportType === 'staff'}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:bg-slate-100 outline-none"
            >
              <option value="">All Classes</option>
              {uniqueClasses.map(cls => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Date Range (Optional)</label>
            <div className="flex items-center gap-2">
              <input 
                type="date" 
                value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <span className="text-slate-400">-</span>
              <input 
                type="date" 
                value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-semibold text-slate-700 flex items-center gap-2">
            <FaFilter className="text-indigo-500" /> 
            {reportType === 'student' ? (classFilter ? `Class ${classFilter} Students` : 'All Students') : 'All Staff'} Report
          </h3>
          <div className="flex bg-slate-200/50 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('chart')}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'chart' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FaChartBar />
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <FaTable />
            </button>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {viewMode === 'chart' ? (
              <motion.div 
                key="chart"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="h-80 w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dx={-10} domain={[0, 100]} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#F8FAFC' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="attendance" name="Attendance %" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            ) : (
              <motion.div 
                key="table"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="overflow-x-auto"
              >
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">{reportType === 'student' ? 'Class' : 'Subject'}</th>
                      <th className="px-4 py-3 font-medium text-right">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-medium text-slate-700">{item.name}</td>
                        <td className="px-4 py-3 text-slate-600">{item.category}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`px-2.5 py-1 rounded-lg text-sm font-medium ${
                            item.attendance >= 85 ? 'bg-emerald-100 text-emerald-700' : 
                            item.attendance >= 75 ? 'bg-orange-100 text-orange-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {item.attendance}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
