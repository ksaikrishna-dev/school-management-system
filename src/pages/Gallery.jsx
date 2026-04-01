import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { FaTimes, FaExpand } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const Gallery = () => {
  const { data } = useAppData();
  const [activeTab, setActiveTab] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['All', 'School Events', 'Staff', 'Students'];

  const filteredImages = data.gallery.filter(
    img => activeTab === 'All' || img.category === activeTab
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">School Gallery</h2>
          <p className="text-slate-500 text-sm mt-1">Explore memories and events</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 custom-scrollbar">
        <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border border-slate-100 min-w-max">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === cat 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((item, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              className="group relative bg-slate-200 rounded-2xl overflow-hidden aspect-[4/3] shadow-sm cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              <img 
                src={item.url} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-medium truncate">{item.title}</p>
                  <p className="text-indigo-300 text-xs mt-1">{item.category}</p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <FaExpand size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-100">
          <p className="text-slate-500">No images found for this category.</p>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm cursor-pointer" 
              onClick={() => setSelectedImage(null)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-transparent flex flex-col items-center pointer-events-none"
            >
              <button 
                onClick={() => setSelectedImage(null)} 
                className="pointer-events-auto absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md"
              >
                <FaTimes size={24} />
              </button>
              
              <div className="pointer-events-auto w-full rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.title} 
                  className="w-full h-auto max-h-[75vh] object-contain bg-black"
                />
              </div>
              
              <div className="pointer-events-auto mt-4 px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-center">
                <h3 className="text-white text-lg font-medium">{selectedImage.title}</h3>
                <p className="text-indigo-300 text-sm">{selectedImage.category}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
