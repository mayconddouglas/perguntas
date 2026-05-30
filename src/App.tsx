import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Download, 
  Menu,
  CheckCircle2,
  Circle,
  FileCheck2,
  X,
  Zap
} from 'lucide-react';
import { briefingData } from './questions';
import { toast } from "sonner";
import { generateBriefingPDF } from './utils/generatePdf';

export default function App() {
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem("brazeo_step");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem("brazeo_answers");
    return saved ? JSON.parse(saved) : {};
  });
  const [isFinished, setIsFinished] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("brazeo_step", currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem("brazeo_answers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    const saved = localStorage.getItem("brazeo_answers");
    if (saved && Object.keys(JSON.parse(saved)).length > 0) {
      toast.success("Rascunho recuperado", {
        description: "Seu progresso foi salvo automaticamente.",
        style: { background: '#131316', border: '1px solid #232328', color: '#F0EDE8' }
      });
    }
  }, []);

  const category = briefingData[currentStep];

  const handleNext = () => {
    if (currentStep < briefingData.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsFinished(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    setAnswers(prev => {
      const currentObj = prev[questionId] || [];
      const currentArray = Array.isArray(currentObj) ? currentObj : [];
      const newArray = checked
        ? [...currentArray, option]
        : currentArray.filter((item: string) => item !== option);
      return { ...prev, [questionId]: newArray };
    });
  };

  const totalQuestions = briefingData.reduce((acc, cat) => acc + cat.questions.length, 0);
  const answeredCount = Object.values(answers).filter(v => {
    if (Array.isArray(v)) return v.length > 0;
    return String(v).trim() !== '';
  }).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100) || 0;

  const isCategoryComplete = (catIndex: number) => {
    const cat = briefingData[catIndex];
    return cat.questions.every(q => {
      const ans = answers[q.id];
      return ans && (Array.isArray(ans) ? ans.length > 0 : String(ans).trim() !== '');
    });
  };

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0C0C0E' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-lg w-full text-center"
          style={{ 
            background: '#0F0F12', 
            border: '1px solid #232328', 
            borderRadius: '24px', 
            padding: '56px 48px' 
          }}
        >
          <div className="relative mx-auto mb-10 w-24 h-24 flex items-center justify-center" style={{ 
            background: 'linear-gradient(135deg, #F59E0B22, #F59E0B08)',
            borderRadius: '20px',
            border: '1px solid #F59E0B33'
          }}>
            <FileCheck2 size={44} style={{ color: '#F59E0B' }} strokeWidth={1.5} />
            <div style={{
              position: 'absolute', inset: '-1px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #F59E0B44 0%, transparent 60%)',
              pointerEvents: 'none'
            }} />
          </div>

          <div style={{ 
            display: 'inline-block', 
            background: '#F59E0B18', 
            border: '1px solid #F59E0B33',
            borderRadius: '999px',
            padding: '4px 16px',
            marginBottom: '20px'
          }}>
            <span style={{ color: '#F59E0B', fontSize: '11px', fontFamily: 'JetBrains Mono', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Briefing Completo
            </span>
          </div>

          <h2 style={{ 
            fontFamily: 'Syne', fontSize: '2.75rem', fontWeight: 800, 
            color: '#F0EDE8', letterSpacing: '-0.03em', lineHeight: 1.1,
            marginBottom: '16px'
          }}>
            Obrigado.
          </h2>
          <p style={{ color: '#6B6760', fontSize: '1.0625rem', lineHeight: 1.7, marginBottom: '40px' }}>
            Com essas informações em mãos, temos uma base sólida para criar algo marcante. Um projeto superior precisa de um alicerce forte.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => generateBriefingPDF(answers)}
              style={{
                height: '52px', width: '100%', borderRadius: '12px',
                background: '#F59E0B', color: '#0C0C0E', border: 'none',
                fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9375rem',
                letterSpacing: '-0.01em', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'opacity 0.15s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <Download size={18} />
              Baixar Documento em PDF
            </button>
            <button
              onClick={() => setIsFinished(false)}
              style={{
                height: '52px', width: '100%', borderRadius: '12px',
                background: 'transparent', color: '#6B6760',
                border: '1px solid #232328',
                fontFamily: 'DM Sans', fontWeight: 500, fontSize: '0.9375rem',
                cursor: 'pointer', transition: 'border-color 0.15s ease, color 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#3A3A42'; e.currentTarget.style.color = '#A09B92'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#232328'; e.currentTarget.style.color = '#6B6760'; }}
            >
              Revisar Respostas
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0C0C0E', overflow: 'hidden' }}>

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: '#0C0C0Ecc', zIndex: 40, backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside style={{
        position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50,
        width: '300px',
        background: '#0F0F12',
        borderRight: '1px solid #1C1C20',
        display: 'flex', flexDirection: 'column',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
      }}
        className="lg:relative lg:translate-x-0"
      >
        {/* Logo */}
        <div style={{ padding: '28px 28px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1C1C20' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '8px', 
              background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap size={16} color="#0C0C0E" fill="#0C0C0E" />
            </div>
            <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.25rem', color: '#F0EDE8', letterSpacing: '-0.04em' }}>
              brazeo<span style={{ color: '#F59E0B' }}>.ai</span>
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ color: '#6B6760', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Progress */}
        <div style={{ padding: '20px 28px 20px', borderBottom: '1px solid #1C1C20' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#6B6760', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Progresso</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#F59E0B', fontWeight: 500 }}>{progressPercent}%</span>
          </div>
          <div style={{ height: '2px', background: '#1C1C20', borderRadius: '999px', overflow: 'hidden' }}>
            <motion.div 
              style={{ height: '100%', background: '#F59E0B', borderRadius: '999px' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <p style={{ fontSize: '11px', color: '#3A3A42', marginTop: '8px', fontFamily: 'JetBrains Mono' }}>
            {answeredCount} / {totalQuestions} respondidas
          </p>
        </div>

        {/* Navigation list */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }} className="custom-scrollbar">
          {briefingData.map((cat, index) => {
            const isActive = currentStep === index;
            const isDone = isCategoryComplete(index);
            return (
              <button
                key={cat.id}
                onClick={() => { setCurrentStep(index); setSidebarOpen(false); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  background: isActive ? '#F59E0B12' : 'transparent',
                  marginBottom: '2px',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#1C1C2080'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ flexShrink: 0, width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isDone ? (
                    <CheckCircle2 size={16} style={{ color: '#F59E0B' }} />
                  ) : isActive ? (
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
                  ) : (
                    <Circle size={16} style={{ color: '#2A2A30' }} />
                  )}
                </div>
                <span style={{ 
                  fontSize: '0.8125rem', 
                  color: isActive ? '#F0EDE8' : isDone ? '#6B6760' : '#3A3A42',
                  fontFamily: 'DM Sans', fontWeight: isActive ? 500 : 400,
                  textAlign: 'left', lineHeight: 1.3
                }}>
                  {cat.title}
                </span>
                <span style={{ 
                  marginLeft: 'auto', fontFamily: 'JetBrains Mono', fontSize: '10px',
                  color: isActive ? '#F59E0B' : '#2A2A30'
                }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', background: '#0C0C0E' }}
        className="lg:ml-[300px]"
      >
        {/* Mobile header */}
        <header style={{ 
          display: 'flex', alignItems: 'center', height: '60px', 
          padding: '0 20px', borderBottom: '1px solid #1C1C20',
          background: '#0C0C0E', flexShrink: 0
        }} className="lg:hidden">
          <button onClick={() => setSidebarOpen(true)} style={{ color: '#6B6760', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', marginLeft: '-4px' }}>
            <Menu size={22} />
          </button>
          <span style={{ marginLeft: '14px', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9375rem', color: '#F0EDE8', letterSpacing: '-0.02em' }}>
            O Briefing
          </span>
        </header>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto' }} id="main-scroll-area" className="custom-scrollbar">
          <div style={{ maxWidth: '760px', margin: '0 auto', padding: '60px 32px 140px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Step header */}
                <div style={{ marginBottom: '56px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <span style={{ 
                      fontFamily: 'JetBrains Mono', fontSize: '11px', 
                      color: '#F59E0B', letterSpacing: '0.12em', textTransform: 'uppercase'
                    }}>
                      {String(currentStep + 1).padStart(2, '0')} / {String(briefingData.length).padStart(2, '0')}
                    </span>
                    <div style={{ flex: 1, height: '1px', background: '#1C1C20' }} />
                  </div>
                  <h1 style={{ 
                    fontFamily: 'Syne', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, 
                    color: '#F0EDE8', letterSpacing: '-0.04em', lineHeight: 1.05,
                    marginBottom: '14px'
                  }}>
                    {category.title}
                  </h1>
                  {category.description && (
                    <p style={{ color: '#6B6760', fontSize: '1rem', lineHeight: 1.7, maxWidth: '560px' }}>
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Questions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '52px' }}>
                  {category.questions.map((question) => (
                    <div key={question.id} style={{ display: 'flex', flexDirection: 'column' }}>
                      <label style={{ 
                        fontFamily: 'Syne', fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)', fontWeight: 700, 
                        color: '#F0EDE8', letterSpacing: '-0.025em', lineHeight: 1.3,
                        marginBottom: '20px', display: 'block'
                      }}>
                        {question.label}
                      </label>

                      {question.type === 'text' && (
                        <input
                          type="text"
                          className="input-underline"
                          placeholder={question.placeholder || 'Sua resposta...'}
                          value={answers[question.id] || ''}
                          onChange={(e) => updateAnswer(question.id, e.target.value)}
                        />
                      )}

                      {question.type === 'textarea' && (
                        <textarea
                          className="input-underline"
                          style={{ minHeight: '120px', resize: 'vertical', lineHeight: 1.7 }}
                          placeholder={question.placeholder || 'Sinta-se à vontade para detalhar...'}
                          value={answers[question.id] || ''}
                          onChange={(e) => updateAnswer(question.id, e.target.value)}
                        />
                      )}

                      {question.type === 'radio' && question.options && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {question.options.map((option) => {
                            const isSelected = answers[question.id] === option;
                            return (
                              <button
                                key={option}
                                onClick={() => updateAnswer(question.id, option)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '14px',
                                  padding: '14px 18px', borderRadius: '12px', cursor: 'pointer',
                                  border: isSelected ? '1px solid #F59E0B44' : '1px solid #1C1C20',
                                  background: isSelected ? '#F59E0B0C' : '#0F0F12',
                                  textAlign: 'left', transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#2A2A30'; e.currentTarget.style.background = '#131316'; }}}
                                onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#1C1C20'; e.currentTarget.style.background = '#0F0F12'; }}}
                              >
                                <div style={{ 
                                  width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                                  border: isSelected ? '5px solid #F59E0B' : '2px solid #2A2A30',
                                  transition: 'all 0.15s ease'
                                }} />
                                <span style={{ 
                                  fontSize: '0.9375rem', color: isSelected ? '#F0EDE8' : '#6B6760',
                                  fontWeight: isSelected ? 500 : 400,
                                  transition: 'color 0.15s ease'
                                }}>
                                  {option}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {question.type === 'checkbox' && question.options && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {question.options.map((option) => {
                            const isChecked = (answers[question.id] || []).includes(option);
                            return (
                              <button
                                key={option}
                                onClick={() => handleCheckboxChange(question.id, option, !isChecked)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: '14px',
                                  padding: '14px 18px', borderRadius: '12px', cursor: 'pointer',
                                  border: isChecked ? '1px solid #F59E0B44' : '1px solid #1C1C20',
                                  background: isChecked ? '#F59E0B0C' : '#0F0F12',
                                  textAlign: 'left', transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={e => { if (!isChecked) { e.currentTarget.style.borderColor = '#2A2A30'; e.currentTarget.style.background = '#131316'; }}}
                                onMouseLeave={e => { if (!isChecked) { e.currentTarget.style.borderColor = '#1C1C20'; e.currentTarget.style.background = '#0F0F12'; }}}
                              >
                                <div style={{ 
                                  width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                                  background: isChecked ? '#F59E0B' : 'transparent',
                                  border: isChecked ? '2px solid #F59E0B' : '2px solid #2A2A30',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  transition: 'all 0.15s ease'
                                }}>
                                  {isChecked && <Check size={11} color="#0C0C0E" strokeWidth={3} />}
                                </div>
                                <span style={{ 
                                  fontSize: '0.9375rem', color: isChecked ? '#F0EDE8' : '#6B6760',
                                  fontWeight: isChecked ? 500 : 400,
                                  transition: 'color 0.15s ease'
                                }}>
                                  {option}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* BOTTOM NAV */}
        <div style={{ 
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
          background: 'linear-gradient(to top, #0C0C0E 60%, transparent)',
          padding: '32px 32px 28px'
        }}>
          <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => { handlePrev(); setTimeout(() => document.getElementById('main-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' }), 50); }}
              disabled={currentStep === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                height: '44px', padding: '0 18px', borderRadius: '10px',
                border: '1px solid #1C1C20', background: 'transparent',
                color: currentStep === 0 ? '#2A2A30' : '#6B6760',
                fontFamily: 'DM Sans', fontSize: '0.875rem', fontWeight: 500,
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => { if (currentStep > 0) { e.currentTarget.style.borderColor = '#2A2A30'; e.currentTarget.style.color = '#A09B92'; }}}
              onMouseLeave={e => { if (currentStep > 0) { e.currentTarget.style.borderColor = '#1C1C20'; e.currentTarget.style.color = '#6B6760'; }}}
            >
              <ChevronLeft size={16} />
              <span>Anterior</span>
            </button>

            <button
              onClick={() => { handleNext(); setTimeout(() => document.getElementById('main-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' }), 50); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                height: '48px', padding: '0 28px', borderRadius: '12px',
                border: 'none', background: '#F59E0B', color: '#0C0C0E',
                fontFamily: 'Syne', fontSize: '0.9375rem', fontWeight: 700,
                letterSpacing: '-0.01em', cursor: 'pointer',
                boxShadow: '0 0 32px rgba(245,158,11,0.25)',
                transition: 'opacity 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.boxShadow = '0 0 48px rgba(245,158,11,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.boxShadow = '0 0 32px rgba(245,158,11,0.25)'; }}
            >
              <span>{currentStep === briefingData.length - 1 ? 'Concluir' : 'Continuar'}</span>
              {currentStep === briefingData.length - 1 ? <Check size={18} strokeWidth={2.5} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
