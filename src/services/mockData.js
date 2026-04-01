export const initialMockData = {
  users: [
    { id: 1, name: 'Admin User', email: 'admin@school.com', password: 'password123', role: 'Admin' },
    { id: 2, name: 'John Doe', email: 'john@school.com', password: 'password123', role: 'Staff', subject: 'Mathematics' },
    { id: 3, name: 'Jane Smith', email: 'jane@school.com', password: 'password123', role: 'Staff', subject: 'Science' },
    { id: 4, name: 'Alice Walker', email: 'alice@school.com', password: 'password123', role: 'Student', class: '10A', rollNo: '101' },
    { id: 5, name: 'Bob Marley', email: 'bob@school.com', password: 'password123', role: 'Student', class: '10A', rollNo: '102' }
  ],
  staff: [
    { id: 1, name: 'John Doe', subject: 'Mathematics', contact: '555-0101', attendance: 95 },
    { id: 2, name: 'Jane Smith', subject: 'Science', contact: '555-0102', attendance: 92 },
    { id: 3, name: 'Robert Brown', subject: 'History', contact: '555-0103', attendance: 98 },
    { id: 4, name: 'Emily White', subject: 'English', contact: '555-0104', attendance: 90 },
  ],
  students: [
    { id: 1, name: 'Alice Walker', class: '10A', rollNo: '101', attendance: 85 },
    { id: 2, name: 'Bob Marley', class: '10A', rollNo: '102', attendance: 90 },
    { id: 3, name: 'Charlie Chaplin', class: '10B', rollNo: '103', attendance: 78 },
    { id: 4, name: 'Diana Prince', class: '10B', rollNo: '104', attendance: 95 },
    { id: 5, name: 'Evan Davis', class: '9A', rollNo: '105', attendance: 88 }
  ],
  complaints: [
    { id: 1, name: 'Alice Walker', role: 'Student', text: 'AC in class 10A is not working.', status: 'Pending', date: '2023-10-01' },
    { id: 2, name: 'John Doe', role: 'Staff', text: 'Projector in lab needs repair.', status: 'Resolved', date: '2023-09-28' }
  ],
  attendance: {
    '2023-10-01': [
      { studentId: 1, status: 'Present' },
      { studentId: 2, status: 'Present' },
      { studentId: 3, status: 'Absent' },
    ]
  },
  gallery: [
    { id: 1, url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop', category: 'School Events', title: 'Annual Day' },
    { id: 2, url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop', category: 'Students', title: 'Classroom' },
    { id: 3, url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1974&auto=format&fit=crop', category: 'Staff', title: 'Teachers Meeting' },
    { id: 4, url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop', category: 'School Events', title: 'Sports Meet' },
  ]
};

// Simulated Local API
export const getLocalData = (key) => {
  const data = localStorage.getItem(key);
  if (data) return JSON.parse(data);
  return initialMockData[key] || [];
};

export const setLocalData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize if empty
export const initializeMockData = () => {
  Object.keys(initialMockData).forEach(key => {
    if (!localStorage.getItem(key)) {
      setLocalData(key, initialMockData[key]);
    }
  });
};
