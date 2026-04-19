/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IdCard as IDIcon, Camera, Settings as SettingsIcon, Menu, X, Github, ExternalLink, LayoutDashboard, ArrowRight, Shield, Image as ImageIcon, FileText, Lock, Scale } from 'lucide-react';
import { IDCardSection } from './components/IDCardSection';
import { PassportSection } from './components/PassportSection';
import { AppSection } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('hub');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'hub', label: 'Main Menu', icon: LayoutDashboard },
    { id: 'id-card', label: 'ID Card System', icon: IDIcon },
    { id: 'passport-photo', label: 'Passport Photos', icon: Camera },
  ];

  return (
    <div className="min-h-screen bg-bg-base flex font-sans text-text-main selection:bg-accent/20 selection:text-accent">
      {/* Sidebar - Matching Designer's Surface Color */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-80' : 'w-24'
        } bg-bg-surface border-r border-border-subtle transition-all duration-500 ease-in-out hidden lg:flex flex-col z-50`}
      >
        <div className="p-8 flex items-center justify-between overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <SettingsIcon className="text-bg-base" size={24} />
            </div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-black text-xl tracking-tighter"
              >
                ID<span className="text-accent underline decoration-accent/30 underline-offset-4 font-extrabold uppercase ml-1">Systems</span>
              </motion.span>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-4 mt-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as AppSection)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all relative group overflow-hidden ${
                activeSection === item.id 
                  ? 'bg-bg-card text-text-main border border-border-subtle' 
                  : 'text-text-dim hover:text-text-main hover:bg-bg-card/50'
              }`}
            >
              <item.icon size={22} className={activeSection === item.id ? 'text-accent' : ''} />
              {isSidebarOpen && (
                <span className="font-bold tracking-tight text-xs uppercase letter-spacing-[0.1em]">{item.label}</span>
              )}
              {activeSection === item.id && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-accent rounded-r-full"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-border-subtle space-y-6">
          {isSidebarOpen && (
            <div className="bg-bg-card/30 p-6 rounded-2xl border border-border-subtle">
               <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(0,209,255,0.6)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">System Live</span>
               </div>
               <p className="text-[9px] leading-relaxed text-text-dim font-bold uppercase tracking-wider opacity-60">
                 Secure encryption enabled. Local data focus.
               </p>
            </div>
          )}
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-3 bg-bg-card/50 rounded-xl text-text-dim hover:text-text-main transition-colors border border-border-subtle"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto relative bg-bg-base print:bg-white print:h-auto">
        {/* Glow effect matching background-accent blending */}
        <div className="absolute top-0 right-0 p-24 opacity-10 pointer-events-none overflow-hidden">
           <div className="w-[800px] h-[800px] bg-accent rounded-full blur-[150px]" />
        </div>

        {/* Top Header matching Design */}
        <div className="sticky top-0 z-40 p-6 flex justify-between items-center bg-bg-base/80 backdrop-blur-xl border-b border-border-subtle no-print">
           <div className="lg:hidden flex items-center gap-2">
             <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <SettingsIcon className="text-bg-base" size={18} />
             </div>
             <span className="font-black text-lg tracking-tighter">ID<span className="text-accent underline decoration-accent/30 underline-offset-4 ml-1 uppercase">Systems</span></span>
           </div>
           
           <div className="flex-1" />
           
           <div className="flex items-center gap-4">
              <button className="hidden md:flex items-center border border-border-subtle px-4 py-2 rounded-lg text-xs font-bold text-text-dim hover:text-text-main transition-colors uppercase tracking-widest">
                Settings
              </button>
              <button className="flex items-center gap-2 bg-accent text-bg-base px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_10px_30px_-5px_rgba(0,209,255,0.3)]">
                Export Data
              </button>
           </div>
        </div>

        <div className="px-8 pb-24 md:px-16 pt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'circOut' }}
            >
              {activeSection === 'hub' && (
                <div className="max-w-4xl mx-auto py-12 space-y-12">
                  <div className="text-center space-y-4">
                    <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em]">Studio Dashboard</span>
                    <h1 className="text-5xl font-black text-text-main tracking-tighter">Welcome to Studio</h1>
                    <p className="text-text-dim max-w-lg mx-auto font-medium">Select a specialized tool to begin project processing.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* ID System Card */}
                    <button 
                      onClick={() => setActiveSection('id-card')}
                      className="group relative bg-bg-surface border border-border-subtle rounded-[2.5rem] p-10 text-left hover:border-accent transition-all hover:bg-bg-card/50 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <IDIcon size={120} />
                      </div>
                      <div className="relative space-y-6">
                        <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                          <Shield size={28} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-text-main mb-2">ID Card System</h2>
                          <p className="text-text-dim text-sm leading-relaxed">Bulk generate professional identification cards from Excel data sheets with one click.</p>
                        </div>
                        <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest">
                          Launch System <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </button>

                    {/* Passport Card */}
                    <button 
                      onClick={() => setActiveSection('passport-photo')}
                      className="group relative bg-bg-surface border border-border-subtle rounded-[2.5rem] p-10 text-left hover:border-accent transition-all hover:bg-bg-card/50 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Camera size={120} />
                      </div>
                      <div className="relative space-y-6">
                        <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                          <ImageIcon size={28} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-text-main mb-2">Passport Photos</h2>
                          <p className="text-text-dim text-sm leading-relaxed">Format source images into standardized biometric grids for professional printing.</p>
                        </div>
                        <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest">
                          Start Formatting <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
              {activeSection === 'id-card' && <IDCardSection />}
              {activeSection === 'passport-photo' && <PassportSection />}
              
              {/* Privacy Policy View */}
              {activeSection === 'privacy' && (
                <div className="max-w-3xl mx-auto py-12 space-y-12">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                      <Lock size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-text-main tracking-tighter uppercase">Privacy Policy</h1>
                    <p className="text-text-dim font-medium italic">Effective Date: April 16, 2026</p>
                  </div>
                  
                  <div className="space-y-8 text-text-dim leading-relaxed">
                    <section className="space-y-4">
                      <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-accent rounded-full" />
                        Data Sovereignty & Local Processing
                      </h2>
                      <p>
                        Your privacy is our primary engineering priority. Unlike traditional SaaS platforms, **ID Studio processes all data locally within your browser context**. Your Excel sheets, personnel data, and source images are never uploaded to our servers for processing.
                      </p>
                    </section>

                    <section className="space-y-4">
                      <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-accent rounded-full" />
                        No Data Retention
                      </h2>
                      <p>
                        We do not store, archive, or retain any of the information you process through the ID Card System or Passport Photo Studio. Once you refresh your browser session, all temporary data is purged from memory.
                      </p>
                    </section>

                    <section className="space-y-4">
                      <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-accent rounded-full" />
                        Third-Party APIs
                      </h2>
                      <p>
                        The application utilizes standard web APIs (FileReader, WebAssembly) for processing. If you provide a Photo URL in your data sheet, that specific image is requested via your browser directly from the source host.
                      </p>
                    </section>

                    <div className="pt-12">
                      <button 
                        onClick={() => setActiveSection('hub')}
                        className="px-8 py-3 bg-bg-surface border border-border-subtle rounded-xl text-xs font-black uppercase tracking-[0.2em] text-accent hover:bg-bg-card transition-all"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms & Conditions View */}
              {activeSection === 'terms' && (
                <div className="max-w-3xl mx-auto py-12 space-y-12">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                      <Scale size={32} />
                    </div>
                    <h1 className="text-4xl font-black text-text-main tracking-tighter uppercase">Terms & Conditions</h1>
                    <p className="text-text-dim font-medium italic">Last Updated: April 16, 2026</p>
                  </div>
                  
                  <div className="space-y-8 text-text-dim leading-relaxed">
                    <section className="space-y-4">
                      <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-accent rounded-full" />
                        Acceptance of Terms
                      </h2>
                      <p>
                        By accessing and using ID Studio, you agree to be bound by these Terms and Conditions. This software is provided "as is" for professional design and formatting purposes.
                      </p>
                    </section>

                    <section className="space-y-4">
                      <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-accent rounded-full" />
                        Permitted Use
                      </h2>
                      <p>
                        You are granted a non-exclusive license to use this software for generating identification cards and formatting passport photos. You are responsible for ensuring you have the legal right to process the data and images you upload.
                      </p>
                    </section>

                    <section className="space-y-4">
                      <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-accent rounded-full" />
                        Limitation of Liability
                      </h2>
                      <p>
                        ID Studio shall not be liable for any errors, biometric non-compliance, or printing inaccuracies. It is the user's responsibility to verify that the generated outputs meet the specific requirements of their school, college, or corporation.
                      </p>
                    </section>

                    <div className="pt-12">
                      <button 
                        onClick={() => setActiveSection('hub')}
                        className="px-8 py-3 bg-bg-surface border border-border-subtle rounded-xl text-xs font-black uppercase tracking-[0.2em] text-accent hover:bg-bg-card transition-all"
                      >
                        Accept & Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="px-16 py-12 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-8 text-text-dim no-print">
           <div className="flex items-center gap-4 text-xs font-bold tracking-tight uppercase">
              <span className="opacity-40">© 2026 ID Studio</span>
              <span className="h-4 w-px bg-border-subtle" />
              <button 
                onClick={() => setActiveSection('privacy')}
                className="hover:text-accent transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setActiveSection('terms')}
                className="hover:text-accent transition-colors cursor-pointer"
              >
                Terms
              </button>
           </div>
           <div className="flex items-center gap-6">
              <Github size={20} className="hover:text-text-main cursor-pointer transition-colors" />
           </div>
        </footer>
      </main>
    </div>
  );
}
