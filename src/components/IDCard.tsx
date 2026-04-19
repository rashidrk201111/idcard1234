import React from 'react';
import { IDCardData, FieldStyle } from '../types';
import { motion } from 'motion/react';
import { User, ShieldCheck, MapPin, Droplets, School } from 'lucide-react';
import Barcode from 'react-barcode';

interface IDCardProps {
  data: IDCardData;
}

export function IDCard({ data }: IDCardProps) {
  const isPortrait = data.orientation === 'portrait';
  
  const getCategoryDefaults = (category: string) => {
    const defaults = {
      school: { accent: '#4ade80', label: 'Student Identity', idLabel: 'Student ID', extraLabel: 'Grade', extraValue: data.grade },
      college: { accent: '#818cf8', label: 'University Pass', idLabel: 'Matriculation No', extraLabel: 'Faculty', extraValue: data.department },
      corporate: { accent: '#00d1ff', label: 'Employee Permit', idLabel: 'Asset ID', extraLabel: 'Department', extraValue: data.department }
    };
    return defaults[category as keyof typeof defaults] || defaults.corporate;
  };

  const categoryDefaults = getCategoryDefaults(data.category || 'corporate');

  const themeColor = data.themeColor || categoryDefaults.accent;

  const cardBackground = data.gradient 
    ? { background: data.gradient } 
    : { background: `linear-gradient(135deg, #25292e 0%, #1a1d21 100%)` };

  const isGlass = data.surfaceEffect === 'glass';

  const applyFieldStyle = (style?: FieldStyle, defaultColor = 'var(--color-text-main)') => {
    if (!style) return { color: defaultColor };
    
    const base: React.CSSProperties = {
      fontFamily: style.fontFamily,
      fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
      fontWeight: style.fontWeight,
      color: style.color || defaultColor,
    };

    if (style.gradient) {
      return {
        ...base,
        background: style.gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      };
    }

    return base;
  };

  const isClassic = data.layoutType === 'classic';

  if (isClassic) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className={`relative rounded-[12px] overflow-hidden shadow-xl border border-gray-200 bg-white ${
          isPortrait ? 'w-[320px] aspect-[320/500]' : 'w-full max-w-[500px] aspect-[500/310]'
        }`}
      >
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }} />
        
        {/* Institutional Header */}
        <div className="w-full p-4 flex items-center gap-4 text-white relative z-10" style={{ background: themeColor }}>
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-lg">
               <School size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <h1 className="text-sm lg:text-base font-black uppercase leading-tight tracking-wider truncate">
                  {data.institutionName || 'Dolphin High School'}
                </h1>
                {data.institutionAddress && (
                  <p className="text-[7px] lg:text-[8px] opacity-80 font-medium truncate uppercase tracking-tighter">
                    {data.institutionAddress}
                  </p>
                )}
            </div>
        </div>

        {/* Identity Title */}
        <div className="w-full py-1.5 flex justify-center border-b border-gray-100">
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-600">
             Identity Card
           </span>
        </div>

        {/* Professional Detail Grid */}
        <div className={`flex p-5 gap-6 ${isPortrait ? 'flex-col items-center' : 'flex-row'}`}>
          {/* Photo Section */}
          <div className="shrink-0 flex flex-col items-center relative">
            <div className={`relative ${isPortrait ? 'w-28 h-32' : 'w-24 h-28'} border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-inner flex items-center justify-center`}>
              {data.photoUrl ? (
                <img 
                  src={data.photoUrl} 
                  alt={data.fullName} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User size={36} className="text-gray-200" />
              )}
              {/* Security Hologram Sticker */}
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-sm border border-white/40 shadow-sm flex items-center justify-center overflow-hidden">
                 <ShieldCheck size={8} className="text-white opacity-40 animate-pulse" />
              </div>
            </div>
            {isPortrait && (
               <div className="mt-6 flex flex-col items-center">
                  <div className="w-24 h-[0.5px] bg-gray-400 mb-1" />
                  <span className="text-[7px] text-gray-400 font-black uppercase tracking-widest">Signature of Student</span>
               </div>
            )}
          </div>

          {/* Details Table */}
          <div className="flex-1 min-w-0 bg-gray-50/50 p-3 rounded-2xl border border-gray-100 flex flex-col justify-center relative overflow-hidden">
             {/* Subtle Watermark */}
             <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none rotate-[-25deg]">
                <span className="text-4xl font-black uppercase tracking-[0.5em] text-gray-900">IDENTITY</span>
             </div>
             
             <div className="grid grid-cols-1 gap-y-2 relative z-10">
               {[
                 { label: 'Name', value: data.fullName, accent: true },
                 { label: 'Father\'s Name', value: data.fathersName },
                 { label: 'D.O.B.', value: data.dob },
                 { label: data.idLabel || (data.category === 'school' ? 'Roll No.' : 'Employee ID'), value: data.rollNo || data.employeeId || data.studentId },
                 { label: 'Class / Branch', value: data.grade || data.branch },
                 { label: 'Contact', value: data.contactNo },
               ].map((field, idx) => (
                  field.value ? (
                    <div key={idx} className="grid grid-cols-[100px_10px_1fr] text-[10px] items-center border-b border-gray-100/50 pb-1 last:border-0 min-h-[16px]">
                      <span className="font-bold text-gray-400 uppercase tracking-tighter truncate">{field.label}</span>
                      <span className="font-bold text-gray-300 mr-2">:</span>
                      <span className={`font-black uppercase truncate ${field.accent ? 'text-blue-900 font-black' : 'text-gray-900 font-extrabold'}`}>
                        {field.value}
                      </span>
                    </div>
                  ) : null
               ))}
             </div>
             
             {data.address && (
                <div className="mt-3 pt-2 border-t border-gray-100 flex flex-col gap-1 relative z-10">
                   <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Current Address :</span>
                   <p className="text-[9px] font-bold text-gray-600 leading-tight">
                     {data.address}
                   </p>
                </div>
             )}
          </div>
          
          {!isPortrait && (
            <div className="flex flex-col items-center justify-end pb-8 gap-1 pt-10">
               <div className="w-20 h-[0.5px] bg-gray-400 mb-1" />
               <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Sign of Student</span>
            </div>
          )}
        </div>

        {/* Footer Area with Barcode and Official Sign */}
        <div className="absolute bottom-0 w-full p-2 h-14 flex items-end justify-between bg-white border-t border-gray-100">
           <div className="flex flex-col items-start gap-1 pb-1">
             <div className="text-[9px] font-black text-red-600">
               {data.session && `Session : ${data.session}`}
             </div>
             {data.showBarcode !== false && (
                <div className="scale-[0.5] origin-left opacity-60 grayscale mt-[-10px]">
                  <Barcode 
                    value={data.employeeId || data.studentId || 'ID'} 
                    height={20} 
                    width={1} 
                    fontSize={10} 
                    margin={0}
                  />
                </div>
              )}
           </div>

           <div className="flex flex-col items-center pb-1">
              <div className="w-24 h-[0.5px] bg-gray-400 mb-1" />
              <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Signature of Principal</span>
           </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`relative rounded-[24px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/5 transition-all duration-700 bg-[#0f1115] ${
        isPortrait ? 'w-[320px] aspect-[320/500]' : 'w-full max-w-[450px] aspect-[450/280]'
      } ${isGlass ? 'backdrop-blur-xl bg-white/5 border-white/20' : ''}`}
      style={!isGlass ? cardBackground : {}}
    >
      {/* Security Mesh Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '12px 12px' }} />
      
      {/* Top Branding Bar - Holographic Tricolor */}
      <div className="absolute top-0 left-0 w-full h-[8px] flex overflow-hidden">
         <div className="flex-1 bg-gradient-to-r from-[#FF9933] to-[#FFCC99] opacity-40 shadow-[0_0_10px_rgba(255,153,51,0.2)]" />
         <div className="flex-1 bg-white opacity-40" />
         <div className="flex-1 bg-gradient-to-r from-[#128807] to-[#34A853] opacity-40 shadow-[0_0_10px_rgba(18,136,7,0.2)]" />
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>

      {/* Category branding stripe - Vertical */}
      <div className="absolute top-0 left-0 w-1 h-full opacity-40 transition-colors duration-500" style={{ backgroundColor: themeColor }} />

      {/* Holographic Security Seal */}
      <div className="absolute top-12 right-12 w-16 h-16 rounded-full bg-gradient-to-tr from-white/5 via-white/20 to-white/5 blur-xl pointer-events-none animate-pulse" />
      <div className="absolute top-16 right-16 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-20 rotate-45">
         <ShieldCheck className="text-white" size={16} />
      </div>

      {/* Decorative accent glow */}
      <div 
        className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] blur-[120px] opacity-10 pointer-events-none transition-colors duration-500" 
        style={{ backgroundColor: themeColor }}
      />
      
      {/* Glossy Overlay */}
      {data.surfaceEffect === 'glossy' && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10" />
      )}

      {/* Card Content */}
      <div className={`relative h-full p-10 flex flex-col z-10 ${isPortrait ? 'items-center text-center' : 'justify-between'}`}>
        
        {/* Header */}
        <div className={`flex w-full mb-8 ${isPortrait ? 'flex-col items-center gap-6' : 'justify-between items-start'}`}>
            <div className="flex items-center gap-3">
               <div className="w-[50px] h-[40px] bg-gradient-to-br from-[#d4af37] via-[#f9f295] to-[#b8860b] rounded-[8px] shadow-2xl relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                  <div className="w-8 h-6 bg-black/5 rounded-sm border border-black/10" />
               </div>
               {isPortrait && (
                 <div className="text-left">
                   <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 block">Electronic Chip Set</span>
                   <span className="text-[10px] font-bold text-accent/60 uppercase">Secured Interface</span>
                 </div>
               )}
            </div>
            <div className={isPortrait ? 'text-center' : 'text-right'}>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent block mb-1">
                 {data.institutionName || 'Electronic Identity Card'}
               </span>
               <span 
                 className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/50" 
                 style={applyFieldStyle(data.headerLabelStyle, 'var(--color-text-dim)')}
               >
                 {categoryDefaults.label}
               </span>
            </div>
        </div>

        <div className={`flex gap-10 w-full ${isPortrait ? 'flex-col items-center' : 'flex-row items-center'}`}>
          {/* User Photo - Professional Presentation */}
          <div className="relative group">
            <div className={`${isPortrait ? 'w-[160px] h-[200px]' : 'w-[120px] h-[150px]'} bg-[#050608] rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center relative shadow-[0_30px_60px_rgba(0,0,0,0.8)]`}>
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent z-10 pointer-events-none" />
              {data.photoUrl ? (
                <img 
                  src={data.photoUrl} 
                  alt={data.fullName} 
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-110" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="text-white/10" size={48} />
              )}
              {/* Scanline effect - Refined */}
              <div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-current to-transparent h-[1px] animate-scan pointer-events-none transition-colors duration-500 opacity-40" 
                style={{ color: themeColor }}
              />
              {/* Micro watermark */}
              <div className="absolute bottom-2 right-2 text-[6px] font-black text-white/10 rotate-[-15deg] select-none">AUTHORIZED DOC</div>
            </div>
            
            {/* Security Indicator */}
            <div 
              className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-[6px] border-[#0f1115] shadow-2xl transition-colors duration-500 flex items-center justify-center" 
              style={{ backgroundColor: themeColor }}
            >
               <ShieldCheck className="text-black/80" size={10} />
            </div>
          </div>

          <div className={`flex-1 min-w-0 space-y-6 w-full ${isPortrait ? 'pt-8' : ''} relative`}>
            {/* High-Tech Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none rotate-[-15deg] select-none">
               <span className="text-6xl font-black uppercase tracking-[1em] text-white">SECURED</span>
            </div>
            
            <div className="relative z-10">
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-4 h-0.5 bg-accent/40" />
                 <span className="text-[8px] font-black text-accent uppercase tracking-widest">Document Holder</span>
               </div>
               <h2 
                 className="text-white font-black tracking-tighter leading-none mb-2 truncate uppercase text-2xl lg:text-3xl"
                 style={applyFieldStyle(data.nameStyle, '#ffffff')}
               >
                 {data.fullName}
               </h2>
               <div className="flex items-center gap-2">
                  <div className="h-4 w-[2px] bg-accent/60" />
                  <p 
                    className="text-white/40 uppercase tracking-[0.25em] text-[10px] font-bold"
                    style={applyFieldStyle(data.roleStyle, 'rgba(255,255,255,0.4)')}
                  >
                    {data.role}
                  </p>
               </div>
            </div>

            {/* Meta Grid - Redesigned with Grid Borders */}
            <div className={`grid gap-x-6 gap-y-5 pt-4 ${isPortrait ? 'grid-cols-2 text-left' : 'grid-cols-2'}`}>
              <div className="flex flex-col relative">
                <div className="absolute -left-3 top-0 w-[1px] h-full bg-white/5" />
                <span 
                  className="text-[8px] uppercase font-black tracking-[0.2em] leading-none mb-2 text-accent/50"
                  style={applyFieldStyle(data.labelStyle, 'rgba(0,209,255,0.5)')}
                >
                  {categoryDefaults.idLabel}
                </span>
                <b 
                  className="tracking-[0.15em] font-mono text-[11px] text-white/90"
                  style={applyFieldStyle(data.idStyle, 'rgba(255,255,255,0.9)')}
                >
                  {data.employeeId || data.studentId}
                </b>
              </div>
              <div className="flex flex-col relative">
                <div className="absolute -left-3 top-0 w-[1px] h-full bg-white/5" />
                <span 
                   className="text-[8px] uppercase font-black tracking-[0.2em] leading-none mb-2 text-accent/50"
                   style={applyFieldStyle(data.labelStyle, 'rgba(0,209,255,0.5)')}
                >
                  VALID THRU
                </span>
                <b 
                  className="tracking-tight text-[11px] text-white/90"
                  style={applyFieldStyle(data.expiryStyle || data.metaStyle, 'rgba(255,255,255,0.9)')}
                >
                  {data.expiryDate}
                </b>
              </div>

              {data.rollNo && (
                <div className="flex flex-col relative">
                  <div className="absolute -left-3 top-0 w-[1px] h-full bg-white/5" />
                  <span 
                    className="text-[8px] uppercase font-black tracking-[0.2em] leading-none mb-2 text-accent/50"
                    style={applyFieldStyle(data.labelStyle, 'rgba(0,209,255,0.5)')}
                  >
                    Roll Number
                  </span>
                  <b 
                    className="tracking-[0.1em] font-mono text-[11px] text-white/90"
                    style={applyFieldStyle(data.metaStyle, 'rgba(255,255,255,0.9)')}
                  >
                    {data.rollNo}
                  </b>
                </div>
              )}

              {data.branch && (
                <div className="flex flex-col relative col-span-1">
                  <div className="absolute -left-3 top-0 w-[1px] h-full bg-white/5" />
                  <span 
                    className="text-[8px] uppercase font-black tracking-[0.2em] leading-none mb-2 text-accent/50"
                    style={applyFieldStyle(data.labelStyle, 'rgba(0,209,255,0.5)')}
                  >
                    Academic Branch
                  </span>
                  <b 
                    className="text-[11px] tracking-tight uppercase text-white/90 font-bold"
                    style={applyFieldStyle(data.metaStyle, 'rgba(255,255,255,0.9)')}
                  >
                    {data.branch || data.grade}
                  </b>
                </div>
              )}

              {data.bloodGroup && (
                <div className="flex flex-col relative">
                  <div className="absolute -left-3 top-0 w-[1px] h-full bg-white/5" />
                  <span 
                    className="text-[8px] uppercase font-black tracking-[0.2em] leading-none mb-2 text-accent/50 flex items-center gap-1"
                    style={applyFieldStyle(data.labelStyle, 'rgba(0,209,255,0.5)')}
                  >
                    <Droplets size={8} className="text-red-500" /> Blood Group
                  </span>
                  <b 
                    className="text-[11px] text-red-500 font-bold"
                    style={applyFieldStyle(data.metaStyle, 'rgba(239,68,68,0.9)')}
                  >
                    {data.bloodGroup}
                  </b>
                </div>
              )}

              {data.address && (
                <div className="flex flex-col relative col-span-2">
                  <div className="absolute -left-3 top-0 w-[1px] h-full bg-white/5" />
                  <span 
                    className="text-[8px] uppercase font-black tracking-[0.2em] leading-none mb-2 text-accent/50 flex items-center gap-1"
                    style={applyFieldStyle(data.labelStyle, 'rgba(0,209,255,0.5)')}
                  >
                    <MapPin size={8} className="opacity-40" /> Resident Address
                  </span>
                  <p 
                    className="text-[9px] leading-tight text-white/60 font-medium"
                    style={applyFieldStyle(data.metaStyle, 'rgba(255,255,255,0.6)')}
                  >
                    {data.address}
                  </p>
                </div>
              )}

              {categoryDefaults.extraValue && !data.branch && (
                <div className="flex flex-col relative col-span-2">
                  <div className="absolute -left-3 top-0 w-[1px] h-full bg-white/5" />
                  <span 
                    className="text-[8px] uppercase font-black tracking-[0.2em] leading-none mb-2 text-accent/50"
                    style={applyFieldStyle(data.labelStyle, 'rgba(0,209,255,0.5)')}
                  >
                    {categoryDefaults.extraLabel}
                  </span>
                  <b 
                    className="tracking-widest uppercase text-[11px] text-white/90"
                    style={applyFieldStyle(data.extraStyle || data.metaStyle, 'rgba(255,255,255,0.9)')}
                  >
                    {categoryDefaults.extraValue}
                  </b>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Logo - Different for Portrait */}
        <div className={`absolute ${isPortrait ? 'bottom-2 w-full flex flex-col items-center gap-2' : 'bottom-4 right-6 flex flex-col items-end gap-2'}`}>
            {/* Barcode Section */}
            {(data.showBarcode !== false) && (
              <div className={`bg-white p-1 rounded-sm shadow-sm ${isPortrait ? 'scale-[0.8]' : 'scale-[0.6] origin-right'}`}>
                <Barcode 
                  value={data.employeeId || data.studentId || 'STUDENT-ID'} 
                  height={25} 
                  width={1} 
                  fontSize={8} 
                  margin={0}
                  background="transparent"
                />
              </div>
            )}
            
            <div className={`flex gap-1 opacity-20 ${isPortrait ? 'flex-row items-center h-4' : 'flex-col items-end'}`}>
               <div className={`${isPortrait ? 'w-4 h-1' : 'w-8 h-1'} bg-text-dim`} />
               <div className={`${isPortrait ? 'w-8 h-1' : 'w-12 h-1'} bg-text-dim`} />
               <div className={`${isPortrait ? 'w-4 h-1' : 'w-6 h-1'} bg-text-dim`} />
            </div>
        </div>
      </div>
    </motion.div>
  );
}
