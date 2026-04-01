import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { initialMockData } from '../services/mockData';
import { toast } from 'react-toastify';

const AppDataContext = createContext();

export const useAppData = () => useContext(AppDataContext);

export const AppDataProvider = ({ children }) => {
  const [data, setData] = useState({
    staff: [], students: [], complaints: [], gallery: [], attendance: {}
  });
  const [loading, setLoading] = useState(true);

  const seedDatabase = async () => {
    try {
      // Seed users safely
      const usersSnap = await getDocs(collection(db, 'users'));
      if (usersSnap.empty) {
        for (const u of initialMockData.users) await setDoc(doc(db, 'users', u.id.toString()), u);
      }

      // Seed core entity arrays
      for (const col of ['staff', 'students', 'complaints', 'gallery']) {
        const snap = await getDocs(collection(db, col));
        if (snap.empty && initialMockData[col]) {
          for (const item of initialMockData[col]) {
            await setDoc(doc(db, col, item.id.toString()), item);
          }
        }
      }
      
      // Seed nested attendance structure
      const attSnap = await getDocs(collection(db, 'attendance'));
      if (attSnap.empty && initialMockData.attendance) {
        for (const [dateKey, records] of Object.entries(initialMockData.attendance)) {
          await setDoc(doc(db, 'attendance', dateKey), { records });
        }
      }
    } catch (e) {
      console.error("Error seeding Firebase DB:", e);
    }
  };

  const fetchCollection = async (colName) => {
    const querySnapshot = await getDocs(collection(db, colName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      await seedDatabase(); // Run the safety seeding check on mount

      const [staffData, studentsData, complaintsData, galleryData, attData] = await Promise.all([
        fetchCollection('staff'),
        fetchCollection('students'),
        fetchCollection('complaints'),
        fetchCollection('gallery'),
        getDocs(collection(db, 'attendance'))
      ]);

      const attendanceObj = {};
      attData.forEach(d => {
        attendanceObj[d.id] = d.data().records || [];
      });

      setData({
        staff: staffData,
        students: studentsData,
        complaints: complaintsData,
        gallery: galleryData,
        attendance: attendanceObj
      });
    } catch (e) {
      toast.error("Failed to fetch data from Firebase");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addRecord = async (colName, record) => {
    try {
      const newId = Date.now().toString();
      const newRecord = { ...record, id: newId };
      await setDoc(doc(db, colName, newId), newRecord);
      setData(prev => ({ ...prev, [colName]: [...prev[colName], newRecord] }));
      toast.success(`${colName.slice(0, -1)} added successfully!`);
      return newRecord;
    } catch(e) { 
      toast.error('Error adding record'); 
      throw e; 
    }
  };

  const updateRecord = async (colName, id, updatedRecord) => {
    try {
      await setDoc(doc(db, colName, id.toString()), updatedRecord, { merge: true });
      setData(prev => ({
        ...prev, 
        [colName]: prev[colName].map(item => item.id == id ? { ...item, ...updatedRecord } : item)
      }));
      toast.success(`${colName.slice(0, -1)} updated successfully!`);
    } catch(e) { toast.error('Error updating record'); }
  };

  const deleteRecord = async (colName, id) => {
    try {
      await deleteDoc(doc(db, colName, id.toString()));
      setData(prev => ({
        ...prev,
        [colName]: prev[colName].filter(item => item.id != id)
      }));
      toast.success(`${colName.slice(0, -1)} deleted successfully!`);
    } catch(e) { toast.error('Error deleting record'); }
  };

  const updateAttendance = async (dateKey, newRecordList) => {
    try {
      await setDoc(doc(db, 'attendance', dateKey), { records: newRecordList });
      setData(prev => ({
        ...prev,
        attendance: { ...prev.attendance, [dateKey]: newRecordList }
      }));
      toast.success(`Attendance for ${dateKey} saved perfectly!`);
    } catch(e) { toast.error('Error saving attendance'); }
  };

  return (
    <AppDataContext.Provider value={{ data, loading, refreshData, addRecord, updateRecord, deleteRecord, updateAttendance }}>
      {children}
    </AppDataContext.Provider>
  );
};
