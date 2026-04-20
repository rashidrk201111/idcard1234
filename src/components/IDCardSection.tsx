import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileSpreadsheet, Download, Search, LayoutGrid, List as ListIcon, Trash2, CircleCheck as CheckCircle2, GraduationCap, School as SchoolIcon, Building2, Smartphone, Monitor, Palette, Type, FileSliders as Sliders, ChevronDown, Wand as Wand2, Upload, Camera, User } from 'lucide-react';
import { IDCard } from './IDCard';
import { IDCardData, CardCategory, CardOrientation, FieldStyle } from '../types';
import { parseIDCardExcel } from '../lib/excelProcessor';
import confetti from 'canvas-confetti';
import html2pdf from 'html2pdf.js';
import jsPDF from 'jspdf';

import * as XLSX from 'xlsx';

export function IDCardSection() {
  const [data, setData] = useState<IDCardData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>('corporate');
  const [orientation, setOrientation] = useState<CardOrientation>('landscape');
  const [activeColor, setActiveColor] = useState<string>('');
  const [activeGradient, setActiveGradient] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'visual' | 'fonts'>('visual');
  const [surfaceEffect, setSurfaceEffect] = useState<'standard' | 'matte' | 'glossy' | 'glass'>('standard');
  const [layoutType, setLayoutType] = useState<'modern' | 'classic'>('modern');
  
  // Institutional Data (for Classic Layout)
  const [instName, setInstName] = useState('DOLPHIN HIGH SCHOOL');
  const [instAddress, setInstAddress] = useState('CRPF Gate, Hingna Road, Nagpur-16');
  const [instPhone, setInstPhone] = useState('07104-645711');
  const [session, setSession] = useState('2025-26');
  const [nameStyle, setNameStyle] = useState<FieldStyle>({ fontFamily: 'Inter', fontSize: 24, color: '#e0e6ed', fontWeight: '900' });
  const [roleStyle, setRoleStyle] = useState<FieldStyle>({ fontFamily: 'Inter', fontSize: 10, color: '#94a3b8', fontWeight: '800' });
  const [idStyle, setIdStyle] = useState<FieldStyle>({ fontFamily: 'monospace', fontSize: 10, color: '#e0e6ed', fontWeight: '400' });
  const [metaStyle, setMetaStyle] = useState<FieldStyle>({ fontFamily: 'Inter', fontSize: 10, color: '#e0e6ed', fontWeight: '800' });
  const [expiryStyle, setExpiryStyle] = useState<FieldStyle>({ fontFamily: 'Inter', fontSize: 10, color: '#e0e6ed', fontWeight: '800' });
  const [extraStyle, setExtraStyle] = useState<FieldStyle>({ fontFamily: 'Inter', fontSize: 10, color: '#e0e6ed', fontWeight: '800' });
  const [labelStyle, setLabelStyle] = useState<FieldStyle>({ fontFamily: 'Inter', fontSize: 7, color: '#94a3b8', fontWeight: '900' });
  const [headerLabelStyle, setHeaderLabelStyle] = useState<FieldStyle>({ fontFamily: 'Inter', fontSize: 9, color: '', fontWeight: '900' });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<{[key: string]: string}>({});
  const [selectedCardForPhoto, setSelectedCardForPhoto] = useState<string | null>(null);

  const fontFamilies = ['Inter', 'Space Grotesk', 'Outfit', 'Playfair Display', 'JetBrains Mono', 'Cormorant Garamond', 'Montserrat', 'Anton', 'monospace', 'serif', 'sans-serif'];

  const colorPresets = [
    // 50+ Modern Colors organized by mood
    '#00d1ff', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', // Blues & Purples
    '#d946ef', '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#f59e0b', // Pinks & Oranges
    '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', // Yellows & Greens
    '#00ff00', '#ff00ff', '#ffff00', '#ff0000', '#0000ff', '#00ffff', // Neons
    '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', // Grays & Slates
    '#475569', '#334155', '#1e293b', '#0f172a', '#020617', '#000000', // Deep Dark
    '#c2410c', '#b91c1c', '#be185d', '#a21caf', '#7e22ce', '#6d28d9', // Deep Rich
    '#4338ca', '#1d4ed8', '#0369a1', '#0e7490', '#0f766e', '#15803d', // Deep Forest/Sea
    '#4d7c0f', '#a16207', '#a52a2a', '#8b0000', '#4b0082', '#2f4f4f'  // Earth & Classic
  ];

  const gradients = [
    { name: 'Technical Slate', value: 'linear-gradient(135deg, #0f1115 0%, #1a1d23 100%)' },
    { name: 'Security Carbon', value: 'linear-gradient(135deg, #020617 0%, #1e293b 100%)' },
    { name: 'Sophisticated Tricolor', value: 'linear-gradient(135deg, #1a1d23 0%, rgba(255,153,51,0.05) 30%, rgba(255,255,255,0.05) 50%, rgba(18,136,7,0.05) 70%, #0f1115 100%)' },
    { name: 'Cyber Mesh', value: 'linear-gradient(135deg, #0f1113 0%, #00d1ff11 100%)' },
    { name: 'Midnight Aurora', value: 'linear-gradient(135deg, #0a0c10 0%, #312e81 100%)' },
    { name: 'Crimson Peak', value: 'linear-gradient(135deg, #1A0505 0%, #450a0a 100%)' },
    { name: 'Forest Deep', value: 'linear-gradient(135deg, #061612 0%, #064e3b 100%)' },
    { name: 'Royal Purple', value: 'linear-gradient(135deg, #120721 0%, #2e1065 100%)' },
    { name: 'Premium Gold', value: 'linear-gradient(135deg, #1A1405 0%, #422006 100%)' },
    { name: 'Vibrant Mesh', value: 'linear-gradient(135deg, #00d1ff11 0%, #a855f711 100%)' },
    { name: 'Technical White', value: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' },
    { name: 'Soft Mint', value: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }
  ];

  const textGradients = [
    { name: 'None', value: '' },
    { name: 'Golden', value: 'linear-gradient(to bottom, #fde68a, #d97706)' },
    { name: 'Ice', value: 'linear-gradient(to bottom, #7dd3fc, #0ea5e9)' },
    { name: 'Fire', value: 'linear-gradient(to bottom, #fdba74, #ef4444)' },
    { name: 'Silver', value: 'linear-gradient(to bottom, #f1f5f9, #94a3b8)' },
    { name: 'Neon', value: 'linear-gradient(to right, #00ff00, #00ffff)' },
    { name: 'Purple', value: 'linear-gradient(to bottom, #c084fc, #7e22ce)' }
  ];

  const downloadSampleTemplate = () => {
    const templates = {
      school: [
        { 'Full Name': 'Julian Vane', 'Role': 'Student', 'Grade': 'Grade 10-A', 'Student ID': 'SCH-2026-X01', 'Issue Date': '04/16/2026', 'Expiry Date': '04/2027', 'Photo URL': 'https://picsum.photos/seed/julian/200/300' },
        { 'Full Name': 'Elena Rodriguez', 'Role': 'Student', 'Grade': 'Grade 9-B', 'Student ID': 'SCH-2026-X02', 'Issue Date': '04/16/2026', 'Expiry Date': '04/2027', 'Photo URL': 'https://picsum.photos/seed/elena/200/300' }
      ],
      college: [
        { 'Full Name': 'Julian Vane', 'Role': 'Undergraduate', 'Department': 'Comp. Science', 'Student ID': 'UNI-882-01', 'Issue Date': '04/16/2026', 'Expiry Date': '04/2030', 'Photo URL': 'https://picsum.photos/seed/julian/200/300' },
        { 'Full Name': 'Elena Rodriguez', 'Role': 'Postgraduate', 'Department': 'Quantum Physics', 'Student ID': 'UNI-882-02', 'Issue Date': '04/16/2026', 'Expiry Date': '04/2028', 'Photo URL': 'https://picsum.photos/seed/elena/200/300' }
      ],
      corporate: [
        { 'Full Name': 'Julian Vane', 'Role': 'Senior Engineer', 'Department': 'Infrastructure', 'Employee ID': 'CORP-900-X', 'Issue Date': '04/16/2026', 'Expiry Date': '12/2028', 'Photo URL': 'https://picsum.photos/seed/julian/200/300' },
        { 'Full Name': 'Elena Rodriguez', 'Role': 'Security Lead', 'Department': 'CyberOps', 'Employee ID': 'CORP-901-Y', 'Issue Date': '04/16/2026', 'Expiry Date': '12/2028', 'Photo URL': 'https://picsum.photos/seed/elena/200/300' }
      ]
    };

    const worksheet = XLSX.utils.json_to_sheet(templates[selectedCategory]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${selectedCategory}_Template`);
    XLSX.writeFile(workbook, `ID_Studio_${selectedCategory}_Template.xlsx`);
  };

  const downloadCardsAsPDF = () => {
    const element = document.getElementById('id-cards-print-area');
    if (!element) {
      console.error('ID cards print area not found');
      alert('Print area not found. Please try again.');
      return;
    }

    if (data.length === 0) {
      alert('No ID cards to export. Please upload data first.');
      return;
    }

    console.log('Starting PDF generation for ID cards');
    console.log('Element found:', element);

    // Ensure all images are loaded before generating PDF
    const images = element.querySelectorAll('img');
    const imagePromises = Array.from(images).map(img => {
      return new Promise((resolve) => {
        if (img.complete) {
          resolve(true);
        } else {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true); // Continue even if image fails
        }
      });
    });

    Promise.all(imagePromises).then(() => {
      const opt = {
        margin: 0.5,
        filename: `id-cards-${selectedCategory}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: element.scrollWidth,
          height: element.scrollHeight,
          ignoreElements: (element: any) => {
            // Skip elements that might cause issues
            return element.tagName === 'CANVAS' ||
                   element.classList.contains('confetti') ||
                   element.classList.contains('animate-pulse') ||
                   element.classList.contains('hover:');
          },
          onclone: (clonedDoc: any) => {
            // Remove or simplify problematic CSS in the cloned document
            try {
              const allElements = clonedDoc.querySelectorAll('*');
              allElements.forEach((el: any) => {
                // Remove problematic CSS properties
                const style = el.style;
                if (style) {
                  // Remove CSS custom properties and problematic functions
                  style.cssText = style.cssText
                    .replace(/--[^;]+;?/g, '') // Remove CSS variables
                    .replace(/oklab\([^)]+\)/g, '#666666') // Replace oklab
                    .replace(/lab\([^)]+\)/g, '#666666') // Replace lab
                    .replace(/lch\([^)]+\)/g, '#666666') // Replace lch
                    .replace(/hwb\([^)]+\)/g, '#666666') // Replace hwb
                    .replace(/color\([^)]+\)/g, '#666666') // Replace color()
                    .replace(/backdrop-blur[^;]*;?/g, '') // Remove backdrop-blur
                    .replace(/filter:[^;]*;?/g, '') // Remove filters
                    .replace(/transform:[^;]*;?/g, '') // Remove transforms
                    .replace(/animation:[^;]*;?/g, '') // Remove animations
                    .replace(/transition:[^;]*;?/g, ''); // Remove transitions
                }

                // Remove problematic classes
                el.className = el.className
                  .replace(/hover:[^\s]*/g, '')
                  .replace(/focus:[^\s]*/g, '')
                  .replace(/active:[^\s]*/g, '')
                  .replace(/animate-[^\s]*/g, '')
                  .replace(/transition-[^\s]*/g, '')
                  .replace(/transform-[^\s]*/g, '');
              });

              // Force white background
              clonedDoc.body.style.backgroundColor = '#ffffff';
              const container = clonedDoc.getElementById('id-cards-print-area');
              if (container) {
                container.style.backgroundColor = '#ffffff';
                container.style.color = '#000000';
              }
            } catch (e) {
              console.warn('CSS preprocessing error:', e);
            }
          }
        },
        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: orientation === 'landscape' ? 'landscape' : 'portrait',
          compress: true
        }
      };

      html2pdf().set(opt).from(element).save().then(() => {
        console.log('PDF generated successfully');
      }).catch((error: any) => {
        console.error('PDF generation failed:', error);
        alert('PDF generation failed. Please try again or contact support.');
      });
    });
  };

  const createSimplifiedIDCardsHTML = (cards: IDCardData[]) => {
    if (!cards || cards.length === 0) return null;

    return `
      <div style="font-family: Arial, sans-serif; background: white; padding: 20px;">
        <h1 style="text-align: center; color: #333; margin-bottom: 30px; font-size: 24px;">
          ${selectedCategory.toUpperCase()} ID CARDS
        </h1>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
          ${cards.map(card => `
            <div style="border: 2px solid #333; border-radius: 10px; padding: 15px; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                ${card.photoUrl ? `<img src="${card.photoUrl}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-right: 15px; border: 2px solid #333;" />` : '<div style="width: 60px; height: 60px; border-radius: 50%; background: #ccc; margin-right: 15px;"></div>'}
                <div>
                  <div style="font-size: 18px; font-weight: bold; color: #333;">${card.fullName}</div>
                  <div style="font-size: 12px; color: #666;">${card.role}</div>
                </div>
              </div>
              <div style="border-top: 1px solid #ddd; padding-top: 10px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
                  <div><strong>ID:</strong> ${card.studentId || card.employeeId || card.id}</div>
                  <div><strong>Category:</strong> ${card.category}</div>
                  ${card.grade ? `<div><strong>Grade:</strong> ${card.grade}</div>` : ''}
                  ${card.department ? `<div><strong>Dept:</strong> ${card.department}</div>` : ''}
                  ${card.expiryDate ? `<div><strong>Expires:</strong> ${card.expiryDate}</div>` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  };

  const generatePDFWithJsPDF = (cards: IDCardData[]) => {
    try {
      const pdf = new jsPDF({
        orientation: orientation === 'landscape' ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const cardWidth = (pageWidth - 2 * margin) / 2;
      const cardHeight = 50;

      let yPosition = margin;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text(`${selectedCategory.toUpperCase()} ID CARDS`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      cards.forEach((card, index) => {
        if (yPosition + cardHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }

        // Draw card border
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.5);
        pdf.rect(margin, yPosition, cardWidth - 5, cardHeight);

        // Add photo placeholder
        pdf.setFillColor(200, 200, 200);
        pdf.circle(margin + 15, yPosition + 15, 8, 'F');

        // Add text
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text(card.fullName, margin + 30, yPosition + 12);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(card.role || '', margin + 30, yPosition + 20);

        pdf.setFontSize(8);
        pdf.text(`ID: ${card.studentId || card.employeeId || card.id}`, margin + 10, yPosition + 35);
        pdf.text(`Category: ${card.category}`, margin + 10, yPosition + 42);

        yPosition += cardHeight + 5;
      });

      pdf.save(`id-cards-${selectedCategory}.pdf`);
      console.log('Fallback PDF generated successfully');
    } catch (error) {
      console.error('Fallback PDF generation also failed:', error);
      alert('PDF generation failed. Please try a different browser or contact support.');
    }
  };

  const samplePreviewData: Record<CardCategory, IDCardData> = {
    school: {
      id: 's1',
      fullName: 'KASHISH ARAV CHAUDHARY',
      role: 'Student',
      category: 'school',
      grade: '4th - A',
      studentId: 'SCH-1004',
      rollNo: '14AMM310',
      fathersName: 'Mr. Deepak Singhal',
      mothersName: 'Mrs. Mogana',
      dob: '23-09-2015',
      contactNo: '9423515764',
      address: 'CRPF Camp Type-2, Qtr. No- 257',
      bloodGroup: 'B+',
      session: '2025-26',
      institutionName: 'DOLPHIN HIGH SCHOOL',
      institutionAddress: 'CRPF Gate, Hingna Road, Nagpur-16',
      institutionPhone: '07104-645711',
      showBarcode: true,
      expiryDate: '04/2026',
      photoUrl: 'https://picsum.photos/seed/kashish/200/300'
    },
    college: {
      id: 'c1',
      fullName: 'JULIAN VANE',
      role: 'Undergraduate',
      category: 'college',
      department: 'Computer Science',
      studentId: 'UNI-882-01',
      expiryDate: '04/2030',
      photoUrl: 'https://picsum.photos/seed/c1/200/300'
    },
    corporate: {
      id: 'co1',
      fullName: 'JULIAN VANE',
      role: 'Senior Engineer',
      category: 'corporate',
      department: 'Infrastructure',
      employeeId: 'CORP-900-X',
      expiryDate: '12/2028',
      photoUrl: 'https://picsum.photos/seed/co1/200/300'
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      try {
        const results = await parseIDCardExcel(file);
        // Map the selected category to the imported data
        const categorizedResults = results.map(item => ({
          ...item,
          category: selectedCategory,
          orientation: orientation,
          themeColor: activeColor || undefined,
          gradient: activeGradient || undefined,
          surfaceEffect,
          nameStyle,
          roleStyle,
          idStyle,
          metaStyle,
          expiryStyle,
          extraStyle,
          labelStyle,
          headerLabelStyle
        }));
        setData(categorizedResults);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: [activeColor || '#00d1ff', '#4ade80', '#818cf8']
        });
      } catch (err) {
        console.error('Failed to parse excel:', err);
        alert('Invalid Excel file. Please ensure it has columns like "Full Name" and "Role".');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedCardForPhoto) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoUrl = event.target?.result as string;
        setUploadedPhotos(prev => ({
          ...prev,
          [selectedCardForPhoto]: photoUrl
        }));
        
        // Update the card data with the photo
        setData(prev => prev.map(card => 
          card.id === selectedCardForPhoto 
            ? { ...card, photoUrl } 
            : card
        ));
        
        setSelectedCardForPhoto(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Update existing data when settings change
  const updateVisualSettings = (params: { orient?: CardOrientation, color?: string, grad?: string, effect?: typeof surfaceEffect, layout?: typeof layoutType }) => {
    const newOrientation = params.orient ?? orientation;
    const newColor = params.color ?? activeColor;
    const newGradient = params.grad ?? activeGradient;
    const newEffect = params.effect ?? surfaceEffect;
    const newLayout = params.layout ?? layoutType;
    
    setOrientation(newOrientation);
    setActiveColor(newColor);
    setActiveGradient(newGradient);
    setSurfaceEffect(newEffect);
    setLayoutType(newLayout);

    if (data.length > 0) {
      setData(prev => prev.map(item => ({
        ...item,
        orientation: newOrientation,
        themeColor: newColor || undefined,
        gradient: newGradient || undefined,
        surfaceEffect: newEffect,
        layoutType: newLayout,
        institutionName: instName,
        institutionAddress: instAddress,
        institutionPhone: instPhone,
        session: session,
        nameStyle,
        roleStyle,
        idStyle,
        metaStyle,
        expiryStyle,
        extraStyle,
        labelStyle,
        headerLabelStyle
      })));
    }
  };

  const updateFontStyle = (field: 'name' | 'role' | 'id' | 'meta' | 'expiry' | 'extra' | 'label' | 'headerLabel', style: Partial<FieldStyle>) => {
    if (field === 'name') {
      const updated = { ...nameStyle, ...style };
      setNameStyle(updated);
      if (data.length > 0) setData(prev => prev.map(item => ({ ...item, nameStyle: updated })));
    } else if (field === 'role') {
      const updated = { ...roleStyle, ...style };
      setRoleStyle(updated);
      if (data.length > 0) setData(prev => prev.map(item => ({ ...item, roleStyle: updated })));
    } else if (field === 'id') {
      const updated = { ...idStyle, ...style };
      setIdStyle(updated);
      if (data.length > 0) setData(prev => prev.map(item => ({ ...item, idStyle: updated })));
    } else if (field === 'expiry') {
      const updated = { ...expiryStyle, ...style };
      setExpiryStyle(updated);
      if (data.length > 0) setData(prev => prev.map(item => ({ ...item, expiryStyle: updated })));
    } else if (field === 'extra') {
      const updated = { ...extraStyle, ...style };
      setExtraStyle(updated);
      if (data.length > 0) setData(prev => prev.map(item => ({ ...item, extraStyle: updated })));
    } else if (field === 'label') {
      const updated = { ...labelStyle, ...style };
      setLabelStyle(updated);
      if (data.length > 0) setData(prev => prev.map(item => ({ ...item, labelStyle: updated })));
    } else if (field === 'headerLabel') {
      const updated = { ...headerLabelStyle, ...style };
      setHeaderLabelStyle(updated);
      if (data.length > 0) setData(prev => prev.map(item => ({ ...item, headerLabelStyle: updated })));
    } else if (field === 'meta') {
      const updated = { ...metaStyle, ...style };
      setMetaStyle(updated);
      // Meta (All) updates id, expiry, and extra for bulk convenience
      setIdStyle(prev => ({ ...prev, ...style }));
      setExpiryStyle(prev => ({ ...prev, ...style }));
      setExtraStyle(prev => ({ ...prev, ...style }));
      
      if (data.length > 0) {
        setData(prev => prev.map(item => ({ 
          ...item, 
          metaStyle: updated,
          idStyle: { ...(item.idStyle || idStyle), ...style },
          expiryStyle: { ...(item.expiryStyle || expiryStyle), ...style },
          extraStyle: { ...(item.extraStyle || extraStyle), ...style }
        })));
      }
    }
  };

  const filteredData = data.filter(item => 
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-text-dim tracking-[0.2em] mb-2 block">Identification Designer</span>
          <h1 className="text-4xl font-black text-text-main tracking-tighter">ID Card System</h1>
          <p className="text-text-dim font-medium text-sm">Automated high-fidelity corporate ID generation.</p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {data.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setData([])}
                className="p-3 text-text-dim hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-border-subtle"
              >
                <Trash2 size={20} />
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {data.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => {
                  console.log('Download PDF button clicked for ID cards');
                  downloadCardsAsPDF();
                }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-blue-600/20 uppercase text-xs tracking-widest"
              >
                <Download size={18} />
                Download PDF
              </motion.button>
            )}
          </AnimatePresence>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="group relative flex items-center gap-3 px-8 py-4 bg-bg-surface text-text-main border border-border-subtle rounded-xl font-bold hover:border-accent transition-all shadow-xl shadow-black/20 overflow-hidden"
          >
            <div className="relative flex items-center gap-3">
              <FileSpreadsheet size={20} className={`text-accent ${isProcessing ? 'animate-bounce' : ''}`} />
              <span className="text-sm uppercase tracking-widest">{isProcessing ? 'Processing...' : 'Upload Data'}</span>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
            />
          </button>
        </div>
      </div>

      {/* Photo Upload Section - Only show when cards exist */}
      {data.length > 0 && (
        <div className="bg-bg-surface p-6 rounded-3xl border border-border-subtle shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-text-main text-sm uppercase tracking-[0.2em] flex items-center gap-2">
                <User size={18} className="text-accent" />
                ID Card Photos
              </h3>
              <p className="text-text-dim text-xs font-medium mt-1">Upload individual photos for each ID card</p>
            </div>
            <div className="text-xs text-text-dim font-bold">
              {Object.keys(uploadedPhotos).length} / {data.length} photos uploaded
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((card) => (
              <div key={card.id} className="bg-bg-card/50 p-4 rounded-2xl border border-border-subtle">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                    <User size={14} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-main font-bold text-xs truncate">{card.fullName}</p>
                    <p className="text-text-dim text-[10px] uppercase tracking-widest">{card.role}</p>
                  </div>
                </div>

                <div 
                  onClick={() => {
                    setSelectedCardForPhoto(card.id);
                    photoInputRef.current?.click();
                  }}
                  className={`relative h-20 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all group ${
                    uploadedPhotos[card.id] 
                      ? 'border-accent bg-accent/5' 
                      : 'border-border-subtle hover:border-accent/40 bg-bg-base/30'
                  }`}
                >
                  {uploadedPhotos[card.id] ? (
                    <div className="relative w-full h-full group/photo">
                      <img 
                        src={uploadedPhotos[card.id]} 
                        className="w-full h-full object-cover rounded-lg" 
                        alt={`${card.fullName} photo`}
                      />
                      <div className="absolute inset-0 bg-bg-base/60 backdrop-blur-sm opacity-0 group-hover/photo:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button className="px-3 py-1 bg-accent text-bg-base rounded-lg font-bold text-[10px] uppercase tracking-widest">
                          Change Photo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload size={16} className="text-text-dim/60 group-hover:text-accent transition-colors mx-auto mb-1" />
                      <p className="text-[9px] text-text-dim font-bold uppercase tracking-widest">Upload Photo</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <input 
            ref={photoInputRef}
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handlePhotoUpload}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-8">
        <div className="flex flex-col gap-8">
          {/* Controls Tabs */}
          <div className="flex bg-bg-surface p-1 rounded-2xl border border-border-subtle max-w-fit">
            {[
              { id: 'visual', label: 'Visuals', icon: Sliders },
              { id: 'fonts', label: 'Typography', icon: Type }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? 'bg-bg-card text-accent shadow-lg' : 'opacity-40 hover:opacity-100'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-bg-base/30 p-8 rounded-[2.5rem] border border-border-subtle">
            {activeTab === 'visual' && (
              <div className="space-y-10">
                <div className="flex flex-wrap gap-8">
                  {/* Category */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim opacity-60">Identity Purpose</span>
                    <div className="flex bg-bg-surface p-1.5 rounded-2xl border border-border-subtle overflow-hidden">
                      {[
                        { id: 'school', icon: SchoolIcon, color: 'text-green-400' },
                        { id: 'college', icon: GraduationCap, color: 'text-indigo-400' },
                        { id: 'corporate', icon: Building2, color: 'text-cyan-400' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id as CardCategory);
                            if (data.length > 0) {
                              setData(prev => prev.map(item => ({ ...item, category: cat.id as CardCategory })));
                            }
                          }}
                          className={`p-3 rounded-xl transition-all ${
                            selectedCategory === cat.id ? 'bg-bg-card shadow-lg ring-1 ring-white/5' : 'opacity-40 hover:opacity-100'
                          }`}
                        >
                          <cat.icon size={20} className={selectedCategory === cat.id ? cat.color : ''} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Orientation */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim opacity-60">Layout Orientation</span>
                    <div className="flex bg-bg-surface p-1.5 rounded-2xl border border-border-subtle overflow-hidden">
                      {[
                        { id: 'landscape', icon: Monitor },
                        { id: 'portrait', icon: Smartphone }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => updateVisualSettings({ orient: opt.id as CardOrientation })}
                          className={`p-3 rounded-xl transition-all ${
                            orientation === opt.id ? 'bg-bg-card shadow-lg ring-1 ring-white/5 text-accent' : 'opacity-40 hover:opacity-100'
                          }`}
                        >
                          <opt.icon size={20} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Layout Style */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim opacity-60">Layout Design</span>
                    <div className="flex bg-bg-surface p-1.5 rounded-2xl border border-border-subtle overflow-hidden gap-1">
                      {[
                        { id: 'modern', label: 'PREMIUM' },
                        { id: 'classic', label: 'CLASSIC' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => updateVisualSettings({ layout: opt.id as any })}
                          className={`px-4 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all ${
                            layoutType === opt.id ? 'bg-bg-card shadow-lg text-accent' : 'opacity-40 hover:opacity-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Surface Finish */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim opacity-60">Surface Finish</span>
                    <div className="flex bg-bg-surface p-1.5 rounded-2xl border border-border-subtle overflow-hidden gap-1">
                      {[
                        { id: 'standard', label: 'STD' },
                        { id: 'matte', label: 'MAT' },
                        { id: 'glossy', label: 'GLS' },
                        { id: 'glass', label: 'GLA' }
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => updateVisualSettings({ effect: opt.id as any })}
                          className={`px-4 py-3 rounded-xl text-[9px] font-black tracking-widest transition-all ${
                            surfaceEffect === opt.id ? 'bg-bg-card shadow-lg text-accent' : 'opacity-40 hover:opacity-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gradient Presets */}
                  <div className="space-y-4 flex-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim opacity-60">Card Background Gradient</span>
                    <div className="flex bg-bg-surface p-2 rounded-2xl border border-border-subtle gap-2 overflow-x-auto custom-scrollbar">
                       <button
                         onClick={() => updateVisualSettings({ grad: '' })}
                         className={`min-w-[44px] h-11 rounded-lg border-2 transition-all shrink-0 ${!activeGradient ? 'border-accent scale-110 shadow-lg' : 'border-transparent'}`}
                         style={{ background: 'linear-gradient(135deg, #25292e 0%, #1a1d21 100%)' }}
                       />
                       {gradients.map(grad => (
                         <button
                           key={grad.name}
                           onClick={() => updateVisualSettings({ grad: grad.value })}
                           className={`min-w-[44px] h-11 rounded-lg border-2 transition-all shrink-0 ${activeGradient === grad.value ? 'border-accent scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`}
                           style={{ background: grad.value }}
                           title={grad.name}
                         />
                       ))}
                    </div>
                  </div>
                </div>

                {/* Institutional Info - Only for Classic */}
                {layoutType === 'classic' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-bg-surface/30 p-6 rounded-3xl border border-border-subtle">
                     <div className="space-y-2">
                        <label className="text-[8px] font-black text-accent uppercase tracking-widest">Institution Name</label>
                        <input 
                          type="text" value={instName}
                          onChange={(e) => {
                            setInstName(e.target.value);
                            if (data.length > 0) setData(prev => prev.map(item => ({ ...item, institutionName: e.target.value })));
                          }}
                          className="w-full bg-bg-card text-text-main text-[10px] font-bold py-2.5 px-3 rounded-xl border border-border-subtle focus:ring-1 focus:ring-accent outline-none"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[8px] font-black text-accent uppercase tracking-widest">Institution Address</label>
                        <input 
                          type="text" value={instAddress}
                          onChange={(e) => {
                            setInstAddress(e.target.value);
                            if (data.length > 0) setData(prev => prev.map(item => ({ ...item, institutionAddress: e.target.value })));
                          }}
                          className="w-full bg-bg-card text-text-main text-[10px] font-bold py-2.5 px-3 rounded-xl border border-border-subtle focus:ring-1 focus:ring-accent outline-none"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[8px] font-black text-accent uppercase tracking-widest">Contact Details</label>
                        <input 
                          type="text" value={instPhone}
                          onChange={(e) => {
                            setInstPhone(e.target.value);
                            if (data.length > 0) setData(prev => prev.map(item => ({ ...item, institutionPhone: e.target.value })));
                          }}
                          className="w-full bg-bg-card text-text-main text-[10px] font-bold py-2.5 px-3 rounded-xl border border-border-subtle focus:ring-1 focus:ring-accent outline-none"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[8px] font-black text-accent uppercase tracking-widest">Current Session</label>
                        <input 
                          type="text" value={session}
                          onChange={(e) => {
                            setSession(e.target.value);
                            if (data.length > 0) setData(prev => prev.map(item => ({ ...item, session: e.target.value })));
                          }}
                          className="w-full bg-bg-card text-text-main text-[10px] font-bold py-2.5 px-3 rounded-xl border border-border-subtle focus:ring-1 focus:ring-accent outline-none"
                        />
                     </div>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim opacity-60 flex items-center gap-2">
                      <Palette size={14} /> Primary Accent Theme (55+ Pro Presets)
                    </span>
                    <span className="text-[10px] text-accent font-black tracking-widest">{activeColor || 'Auto'}</span>
                  </div>
                  <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-20 lg:grid-cols-28 gap-2 bg-bg-surface p-5 rounded-3xl border border-border-subtle">
                    <button
                      onClick={() => updateVisualSettings({ color: '' })}
                      className={`aspect-square rounded-lg border-2 flex items-center justify-center bg-bg-card transition-all ${!activeColor ? 'border-accent scale-110 shadow-lg' : 'border-transparent hover:scale-110'}`}
                    >
                      <Wand2 size={12} className="opacity-40" />
                    </button>
                    {colorPresets.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateVisualSettings({ color })}
                        className={`aspect-square rounded-lg border-2 transition-all ${
                          activeColor === color ? 'scale-110 border-white shadow-lg z-10' : 'border-transparent hover:scale-110'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fonts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { id: 'name', label: 'Full Name', state: nameStyle },
                  { id: 'role', label: 'Role/Title', state: roleStyle },
                  { id: 'id', label: 'ID Number', state: idStyle },
                  { id: 'expiry', label: 'Expiry Date', state: expiryStyle },
                  { id: 'extra', label: 'Extra Field', state: extraStyle },
                  { id: 'meta', label: 'Meta (All)', state: metaStyle },
                  { id: 'label', label: 'Micro Labels', state: labelStyle },
                  { id: 'headerLabel', label: 'Card Branding', state: headerLabelStyle }
                ].map(field => (
                  <div key={field.id} className="space-y-6 bg-bg-surface/50 p-6 rounded-3xl border border-border-subtle flex flex-col justify-between">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-6">{field.label}</h4>
                      
                      <div className="space-y-4">
                        {/* Font Family */}
                        <div className="space-y-2">
                          <label className="text-[8px] font-black text-text-dim uppercase tracking-widest opacity-40">Family</label>
                          <select 
                            value={field.state.fontFamily}
                            onChange={(e) => updateFontStyle(field.id as any, { fontFamily: e.target.value })}
                            className="w-full bg-bg-card text-text-main text-[10px] font-bold py-2.5 px-3 rounded-xl border border-border-subtle focus:outline-none focus:ring-1 focus:ring-accent appearance-none transition-all"
                          >
                            {fontFamilies.map(font => <option key={font} value={font}>{font}</option>)}
                          </select>
                        </div>

                        {/* Font Size */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-[8px] font-black text-text-dim uppercase tracking-widest opacity-40">Size</label>
                            <span className="text-[10px] font-black text-accent">{field.state.fontSize}px</span>
                          </div>
                          <input 
                            type="range" min="4" max="64"
                            value={field.state.fontSize}
                            onChange={(e) => updateFontStyle(field.id as any, { fontSize: parseInt(e.target.value) })}
                            className="w-full h-1 bg-bg-card rounded-lg appearance-none cursor-pointer accent-accent"
                          />
                        </div>

                        {/* Weight */}
                        <div className="space-y-2">
                          <label className="text-[8px] font-black text-text-dim uppercase tracking-widest opacity-40">Weight</label>
                          <select 
                            value={field.state.fontWeight || '400'}
                            onChange={(e) => updateFontStyle(field.id as any, { fontWeight: e.target.value })}
                            className="w-full bg-bg-card text-text-main text-[10px] font-bold py-2.5 px-3 rounded-xl border border-border-subtle focus:outline-none focus:ring-1 focus:ring-accent appearance-none"
                          >
                            {[
                              { label: 'Thin', value: '100' },
                              { label: 'Extra Light', value: '200' },
                              { label: 'Light', value: '300' },
                              { label: 'Normal', value: '400' },
                              { label: 'Medium', value: '500' },
                              { label: 'Semi Bold', value: '600' },
                              { label: 'Bold', value: '700' },
                              { label: 'Extra Bold', value: '800' },
                              { label: 'Black', value: '900' }
                            ].map(w => <option key={w.value} value={w.value}>{w.label} ({w.value})</option>)}
                          </select>
                        </div>

                        {/* Text Gradient */}
                        <div className="space-y-2">
                          <label className="text-[8px] font-black text-text-dim uppercase tracking-widest opacity-40">Text Effect</label>
                          <div className="flex flex-wrap gap-1.5 p-2 bg-bg-card/50 rounded-xl border border-border-subtle shadow-inner">
                            {textGradients.map(grad => (
                              <button
                                key={grad.name}
                                onClick={() => updateFontStyle(field.id as any, { gradient: grad.value })}
                                className={`w-6 h-6 rounded-md border transition-all ${field.state.gradient === grad.value ? 'border-accent scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                style={{ background: grad.value || '#ffffff' }}
                                title={grad.name}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Color */}
                    <div className="pt-6 border-t border-border-subtle/30 mt-auto space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="relative group">
                          <input 
                            type="color"
                            value={field.state.color || '#ffffff'}
                            onChange={(e) => updateFontStyle(field.id as any, { color: e.target.value })}
                            className="w-10 h-10 rounded-xl bg-bg-card border border-border-subtle cursor-pointer p-0.5"
                          />
                          <Palette size={10} className="absolute inset-0 m-auto text-white/20 group-hover:text-accent pointer-events-none" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-black text-text-dim uppercase tracking-widest opacity-40 mb-1">Color</span>
                          <span className="text-[10px] font-mono font-bold text-text-main/60 uppercase">{field.state.color || 'Auto'}</span>
                        </div>
                      </div>

                      {/* Quick swatches */}
                      <div className="flex flex-wrap gap-1">
                        {['#ffffff', '#000000', '#94a3b8', '#00d1ff', '#4ade80', '#fbbf24', '#f87171'].map(c => (
                          <button
                            key={c}
                            onClick={() => updateFontStyle(field.id as any, { color: c })}
                            className={`w-4 h-4 rounded-full border border-white/10 transition-transform hover:scale-125 ${field.state.color === c ? 'ring-1 ring-accent scale-110' : ''}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {data.length > 0 ? (
          <>
            {/* Search & Stats */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-bg-surface p-4 rounded-2xl border border-border-subtle shadow-sm">
              <div className="relative flex-1 w-full md:w-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
                <input 
                  type="text" 
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3 bg-bg-base border border-border-subtle rounded-xl focus:ring-1 focus:ring-accent focus:border-accent transition-all font-medium text-text-main text-sm"
                />
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-accent/10 border border-accent/20 text-accent rounded-xl font-black text-xs uppercase tracking-tighter">
                <CheckCircle2 size={14} />
                {filteredData.length} {selectedCategory} Cards
              </div>
            </div>

            {/* Grid */}
            <div id="id-cards-print-area" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence>
                {filteredData.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex justify-center"
                  >
                    <IDCard data={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        ) : (
          /* Empty State - Stylish Dark Upload Zone */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="h-[400px] border-2 border-dashed border-border-subtle rounded-[2rem] flex flex-col items-center justify-center space-y-6 bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group"
            >
              <div className="w-24 h-24 bg-bg-surface rounded-3xl border border-border-subtle shadow-2xl flex items-center justify-center relative group-hover:scale-110 transition-transform">
                <FileSpreadsheet size={32} className="text-text-dim/40 group-hover:text-accent transition-colors" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-xl shadow-[0_0_15px_rgba(0,209,255,0.4)] flex items-center justify-center text-bg-base">
                   <Download size={16} className="animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-text-main uppercase tracking-widest">Awaiting Data Sheet</h3>
                <p className="text-text-dim font-medium text-sm max-w-xs mx-auto">Drop your <span className="text-accent font-black uppercase">{selectedCategory} Data</span> here or browse files</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadSampleTemplate();
                  }}
                  className="mt-4 px-6 py-2 bg-accent/10 hover:bg-accent/20 text-accent text-[10px] font-black uppercase tracking-widest rounded-lg border border-accent/30 transition-all flex items-center gap-2 mx-auto"
                >
                  <Download size={12} />
                  {selectedCategory} Template
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-[10px] uppercase font-bold text-text-dim tracking-[0.2em] block">Design Preview</span>
              <div className="p-8 bg-bg-surface/50 border border-border-subtle rounded-[2.5rem] flex items-center justify-center min-h-[600px]">
                  <IDCard data={{
                    ...samplePreviewData[selectedCategory],
                    orientation: orientation,
                    themeColor: activeColor || undefined,
                    gradient: activeGradient || undefined,
                    surfaceEffect,
                    layoutType,
                    institutionName: instName,
                    institutionAddress: instAddress,
                    institutionPhone: instPhone,
                    session: session,
                    nameStyle,
                    roleStyle,
                    idStyle,
                    metaStyle,
                    expiryStyle,
                    extraStyle,
                    labelStyle,
                    headerLabelStyle
                  }} />
              </div>
              <div className="p-6 bg-accent/5 border border-accent/10 rounded-2xl">
                 <p className="text-[10px] text-text-dim font-medium leading-relaxed italic">
                   "The design automatically adapts to your {selectedCategory} data, orientation preference, and color theme, generating production-ready biometric ID cards."
                 </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
