import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Camera, Printer, RotateCw, Trash2, Maximize, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export function PassportSection() {
  const [image, setImage] = useState<string | null>(null);
  const [photosCount, setPhotosCount] = useState(6);
  const [photosPerRow, setPhotosPerRow] = useState(6);
  const [unit, setUnit] = useState<'mm' | 'cm' | 'inch'>('mm');
  const [photoWidth, setPhotoWidth] = useState(32);
  const [photoHeight, setPhotoHeight] = useState(40);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const A4_WIDTH_MM = 210;

  const toMm = (val: number, u: string) => {
    if (u === 'cm') return val * 10;
    if (u === 'inch') return val * 25.4;
    return val;
  };

  const widthMm = toMm(photoWidth, unit);
  const heightMm = toMm(photoHeight, unit);
  const DEFAULT_MAX_PER_ROW = Math.floor(A4_WIDTH_MM / widthMm);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('passport-print-area');
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: 'passport-photos.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const samplePhotoUrl = 'https://picsum.photos/seed/biometric/400/600';

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-text-dim tracking-[0.2em] mb-2 block">Passport Tool</span>
          <h1 className="text-3xl font-black text-text-main tracking-tight">Passport Photo Studio</h1>
          <p className="text-text-dim font-medium text-sm">Precision layout for biometric documentation.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setImage(null)}
            className="p-3 text-text-dim hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-border-subtle"
          >
            <Trash2 size={20} />
          </button>
          <button 
            onClick={handleDownloadPDF}
            disabled={!image}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:scale-100 disabled:shadow-none uppercase text-xs tracking-widest"
          >
            <Download size={18} />
            Download PDF
          </button>
          <button 
            onClick={handlePrint}
            disabled={!image}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-bg-base rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-accent/20 disabled:opacity-50 disabled:scale-100 disabled:shadow-none uppercase text-xs tracking-widest"
          >
            <Printer size={18} />
            Generate Sheet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls and Upload */}
        <div className="lg:col-span-4 space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`relative group h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${
              image ? 'border-border-subtle bg-bg-surface' : 'border-border-subtle hover:border-accent/40 bg-white/[0.02]'
            }`}
          >
            {image ? (
              <div className="relative w-full h-full group/preview">
                <img src={image} className="w-full h-full object-cover" alt="Source" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-bg-base/60 backdrop-blur-sm opacity-0 group-hover/preview:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       fileInputRef.current?.click();
                     }}
                     className="px-6 py-2.5 bg-accent text-bg-base rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform"
                   >
                     Replace Photo
                   </button>
                   <p className="text-white font-bold text-[9px] uppercase tracking-widest opacity-60">Click to change source</p>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 flex flex-col items-center">
                <div className="w-20 h-20 bg-bg-surface border border-border-subtle rounded-3xl shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-accent transition-all duration-500">
                  <Upload className="text-accent" size={28} />
                </div>
                <div className="space-y-4">
                   <div>
                      <p className="text-text-main font-black text-xs uppercase tracking-[0.2em]">Drop source image</p>
                      <p className="text-text-dim text-[10px] mt-1 font-medium">PNG, JPG up to 10MB</p>
                   </div>
                   
                   <div className="flex items-center gap-3 w-full max-w-[200px]">
                      <div className="h-px bg-border-subtle flex-1" />
                      <span className="text-[9px] font-bold text-text-dim/40 uppercase">OR</span>
                      <div className="h-px bg-border-subtle flex-1" />
                   </div>

                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       fileInputRef.current?.click();
                     }}
                     className="w-full py-3 bg-bg-card hover:bg-bg-card/80 text-text-main rounded-xl border border-border-subtle font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 group-hover:border-accent/40"
                   >
                     <Camera size={14} className="text-accent" />
                     Browse Files
                   </button>
                </div>
              </div>
            )}
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

            <div className="bg-bg-surface p-6 rounded-3xl border border-border-subtle shadow-sm space-y-6">
              <h3 className="font-bold text-text-main text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                <Maximize size={16} className="text-accent" />
                Dimension Settings
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-[9px] uppercase font-black text-text-dim tracking-widest block mb-3 opacity-60">Unit System</label>
                  <div className="flex gap-2">
                    {(['mm', 'cm', 'inch'] as const).map(u => (
                      <button
                        key={u}
                        onClick={() => setUnit(u)}
                        className={`flex-1 py-1.5 rounded-lg font-black text-[10px] uppercase transition-all border ${
                          unit === u 
                            ? 'bg-accent/10 text-accent border-accent/20' 
                            : 'bg-bg-base text-text-dim border-border-subtle'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[8px] font-black text-text-dim uppercase tracking-widest opacity-40">Photo Width</span>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.1"
                        value={photoWidth}
                        onChange={(e) => setPhotoWidth(parseFloat(e.target.value) || 0)}
                        className="w-full bg-bg-base border border-border-subtle rounded-xl px-4 py-2.5 text-xs font-black text-text-main focus:ring-1 focus:ring-accent outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-text-dim/40 uppercase">{unit}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[8px] font-black text-text-dim uppercase tracking-widest opacity-40">Photo Height</span>
                    <div className="relative">
                      <input 
                        type="number" 
                        step="0.1"
                        value={photoHeight}
                        onChange={(e) => setPhotoHeight(parseFloat(e.target.value) || 0)}
                        className="w-full bg-bg-base border border-border-subtle rounded-xl px-4 py-2.5 text-xs font-black text-text-main focus:ring-1 focus:ring-accent outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-text-dim/40 uppercase">{unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-bg-surface p-6 rounded-3xl border border-border-subtle shadow-sm space-y-6">
            <h3 className="font-bold text-text-main text-xs uppercase tracking-[0.2em] flex items-center gap-2">
              <Maximize size={16} className="text-accent" />
              Grid Settings
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-[9px] uppercase font-black text-text-dim tracking-widest block mb-3 opacity-60">Layout Geometry</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <span className="text-[8px] font-black text-text-dim uppercase tracking-widest opacity-40">Photos Per Row</span>
                     <input 
                       type="number" 
                       min="1" 
                       max="10"
                       value={photosPerRow}
                       onChange={(e) => setPhotosPerRow(Math.max(1, parseInt(e.target.value) || 1))}
                       className="w-full bg-bg-base border border-border-subtle rounded-xl px-4 py-2.5 text-xs font-black text-accent focus:ring-1 focus:ring-accent outline-none"
                     />
                  </div>
                  <div className="space-y-2">
                     <span className="text-[8px] font-black text-text-dim uppercase tracking-widest opacity-40">Total Photos</span>
                     <input 
                       type="number" 
                       min="1" 
                       max="100"
                       value={photosCount}
                       onChange={(e) => setPhotosCount(Math.max(1, parseInt(e.target.value) || 1))}
                       className="w-full bg-bg-base border border-border-subtle rounded-xl px-4 py-2.5 text-xs font-black text-accent focus:ring-1 focus:ring-accent outline-none"
                     />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase font-black text-text-dim tracking-widest block mb-3 opacity-60">Quick Presets</label>
                <div className="flex gap-2">
                   {[6, 12, 18, 42].map(num => (
                     <button
                        key={num}
                        onClick={() => {
                          setPhotosCount(num);
                          // Auto-adjust rows if it's a standard preset
                          if (num % 6 === 0) setPhotosPerRow(6);
                        }}
                        className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all border ${
                          photosCount === num 
                            ? 'bg-accent text-bg-base border-accent shadow-[0_5px_15px_rgba(0,209,255,0.2)]' 
                            : 'bg-bg-base text-text-dim border-border-subtle hover:bg-bg-card'
                        }`}
                     >
                       {num}
                     </button>
                   ))}
                </div>
                <div className="mt-2 flex justify-between items-center px-1">
                   <span className="text-[9px] text-text-dim/60 font-medium uppercase italic">A4 Safe Max: {DEFAULT_MAX_PER_ROW} per row</span>
                   {photosCount === 42 && <span className="text-[9px] text-accent font-black uppercase tracking-tighter">Full Sheet</span>}
                </div>
              </div>

              <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10">
                <h4 className="text-accent font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 mb-2">
                   <Camera size={12} /> Batch process
                </h4>
                <p className="text-text-dim/80 text-[10px] leading-relaxed font-medium">
                  Auto-crop {photosCount} instances of passport photos from the primary source image.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Print Preview Area */}
        <div className="lg:col-span-8">
           <div className={`bg-bg-base/50 p-8 border-2 border-dashed border-border-subtle rounded-[40px] shadow-inner min-h-[600px] flex items-center justify-center overflow-auto relative ${photosCount === 42 ? 'py-12' : ''}`}>
              <AnimatePresence mode="wait">
                {image ? (
                  <motion.div 
                    id="passport-print-area"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="grid gap-1 bg-white p-4 shadow-2xl print:p-0 print:shadow-none print:m-0"
                    style={{
                      gridTemplateColumns: `repeat(${photosPerRow}, 1fr)`,
                      width: 'fit-content',
                      backgroundColor: '#fff' // White background for the "paper"
                    }}
                  >
                    {[...Array(photosCount)].map((_, i) => (
                      <div 
                        key={i} 
                        className="relative shadow-sm border border-gray-100"
                        style={{
                          width: `${widthMm}mm`,
                          height: `${heightMm}mm`
                        }}
                      >
                         <img src={image} className="w-full h-full object-cover grayscale-[10%]" alt={`Passport ${i}`} referrerPolicy="no-referrer" />
                         {/* Biometric Guide Line Simulation */}
                         <div className="absolute inset-0 border border-black/5 pointer-events-none" />
                         <div className="absolute top-1/2 left-0 right-0 h-px bg-black/5 pointer-events-none" />
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center gap-12 w-full">
                    {/* Design Preview Overlay */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="w-full max-w-sm space-y-4"
                    >
                       <div className="flex justify-between items-end px-2">
                          <span className="text-[10px] uppercase font-bold text-text-dim tracking-widest">A4 Output Simulation</span>
                          <span className="text-[10px] text-accent font-black uppercase tracking-tighter">{photoWidth}x{photoHeight}{unit} Layout</span>
                       </div>
                       <div className="bg-bg-card rounded-2xl border border-border-subtle p-6 grid grid-cols-3 gap-2">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] bg-bg-base border border-border-subtle overflow-hidden relative opacity-40">
                               <img src={samplePhotoUrl} className="w-full h-full object-cover grayscale" alt="Sample" />
                            </div>
                          ))}
                       </div>
                    </motion.div>

                    <div className="text-center text-text-dim relative z-10 transition-all hover:scale-105">
                       <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-20 h-20 bg-bg-surface border border-accent/40 rounded-3xl flex items-center justify-center mx-auto mb-4 scale-110 shadow-2xl cursor-pointer hover:bg-bg-card transition-colors group"
                        >
                          <Camera size={32} className="text-accent group-hover:scale-110 transition-transform" />
                       </div>
                       <p className="font-bold uppercase tracking-widest text-xs">Upload source image</p>
                       <p className="text-[10px] mt-1 opacity-60">To generate biometric passport sheets</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
