import React, { useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { FaGraduationCap, FaUserTie, FaChartLine } from 'react-icons/fa';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-shadow"
  >
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
    </div>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${color}`}>
      <Icon />
    </div>
  </motion.div>
);

export const Dashboard = () => {
  const { data } = useAppData();

  const stats = useMemo(() => {
    const totalStudents = data.students.length;
    const totalStaff = data.staff.length;
    const avgStudentAtt = data.students.reduce((acc, curr) => acc + curr.attendance, 0) / (totalStudents || 1);
    const avgStaffAtt = data.staff.reduce((acc, curr) => acc + curr.attendance, 0) / (totalStaff || 1);
    const totalAvg = ((avgStudentAtt + avgStaffAtt) / 2).toFixed(1);

    return { totalStudents, totalStaff, attendance: `${totalAvg}%` };
  }, [data]);

  const studentChartData = useMemo(() => {
    return data.students.slice(0, 10).map(s => ({
      name: s.name.split(' ')[0],
      attendance: s.attendance
    }));
  }, [data]);

  const staffChartData = useMemo(() => {
    return data.staff.map(s => ({
      name: s.name.split(' ')[0],
      attendance: s.attendance
    }));
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Students" 
          value={stats.totalStudents} 
          icon={FaGraduationCap} 
          color="bg-blue-100 text-blue-600" 
          delay={0.1}
        />
        <StatCard 
          title="Total Staff" 
          value={stats.totalStaff} 
          icon={FaUserTie} 
          color="bg-emerald-100 text-emerald-600" 
          delay={0.2} 
        />
        <StatCard 
          title="Avg Attendance" 
          value={stats.attendance} 
          icon={FaChartLine} 
          color="bg-purple-100 text-purple-600" 
          delay={0.3} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-6 font-sans">Student Attendance Trends</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dx={-10} domain={[0, 100]} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#F1F5F9', strokeWidth: 2 }}
                />
                <Line type="monotone" dataKey="attendance" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, stroke: '#4F46E5', strokeWidth: 2, fill: 'white' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-6 font-sans">Staff Attendance</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dx={-10} domain={[0, 100]} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#F8FAFC' }}
                />
                <Bar dataKey="attendance" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
