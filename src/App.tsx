import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles, 
  Download, 
  Menu, 
  CheckCircle2,
  Circle,
  FileCheck2,
  X
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
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    setAnswers(prev => {
      const currentObj = prev[questionId] || [];
      const currentArray = Array.isArray(currentObj) ? currentObj : [];
      let newArray;
      if (checked) {
        newArray = [...currentArray, option];
      } else {
        newArray = currentArray.filter((item: string) => item !== option);
      }
      return { ...prev, [questionId]: newArray };
    });
  };

  // Metrics
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
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6 font-tech text-slate-800">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full bg-white p-12 lg:p-16 rounded-[32px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] text-center border border-slate-100"
        >
          <div className="w-24 h-24 bg-slate-900 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
           <FileCheck2 size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl font-display font-medium text-slate-900 mb-4 tracking-tight">Obrigado.</h2>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed font-sans">
            Com essas informações em mãos, temos uma base sólida para criar algo marcante. Um projeto superior precisa de um alicerce forte, e você acabou de nos entregar isso.
          </p>
          <div className="space-y-4">
             <button
                onClick={() => generateBriefingPDF(answers)}
                className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-medium text-lg rounded-full flex items-center justify-center gap-3 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
              >
                <Download size={20} />
                Baixar Documento em PDF
              </button>
             <button
                onClick={() => setIsFinished(false)}
                className="w-full h-14 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 font-medium text-lg rounded-full flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                Revisar Respostas
              </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-slate-900 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-[#FAFAFA] border-r border-[#EFEFEF] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-8 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-2xl tracking-tighter">
            <Sparkles className="text-slate-900" size={24} />
            brazeo<span className="text-slate-400 font-normal">.ai</span>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-slate-900" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="px-8 pb-6 border-b border-[#EFEFEF]">
          <div className="flex justify-between text-xs font-mono font-medium text-slate-500 mb-3 uppercase tracking-wider">
            <span>Progresso total</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className="bg-slate-900 h-1.5 rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-tech">{answeredCount} de {totalQuestions} respondidas</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-1 custom-scrollbar">
          {briefingData.map((cat, idx) => {
            const isCurrent = currentStep === idx;
            const isCompleted = isCategoryComplete(idx);
            
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setCurrentStep(idx);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all duration-200 flex items-start gap-4 outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                  isCurrent ? 'bg-white shadow-sm ring-1 ring-slate-200/60' : 'hover:bg-slate-100/50 text-slate-500'
                }`}
              >
                 <div className="mt-0.5">
                   {isCompleted ? (
                     <CheckCircle2 size={18} className={isCurrent ? "text-slate-900" : "text-slate-400"} />
                   ) : (
                     <Circle size={18} className={isCurrent ? "text-slate-900" : "text-slate-300"} />
                   )}
                 </div>
                 <div>
                   <span className={`block text-sm font-semibold tracking-tight ${isCurrent ? 'text-slate-900' : ''}`}>
                     {cat.title}
                   </span>
                   {isCurrent && <span className="block text-xs font-tech text-slate-500 mt-1">Etapa atual</span>}
                 </div>
              </button>
            );
          })}
        </div>
        
        <div className="p-6 border-t border-[#EFEFEF] bg-[#FAFAFA]">
          <button 
             onClick={() => generateBriefingPDF(answers)}
             className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Download size={16} />
            Baixar Resumo (PDF)
          </button>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full bg-white relative">
        <header className="lg:hidden flex items-center h-16 px-6 border-b border-[#EFEFEF] shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-slate-600 p-2 -ml-2 rounded-lg hover:bg-slate-100">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-display font-medium text-slate-900 tracking-tight">O Briefing</span>
        </header>

        <div className="flex-1 overflow-y-auto w-full flex justify-center pb-32" id="main-scroll-area">
          <div className="w-full max-w-3xl px-6 lg:px-16 pt-12 lg:pt-24 pb-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-16">
                  <span className="font-mono font-semibold tracking-tighter text-slate-400 text-lg mb-4 block block">
                    {String(currentStep + 1).padStart(2, '0')} / {String(briefingData.length).padStart(2, '0')}
                  </span>
                  <h1 className="text-4xl lg:text-5xl font-display font-medium text-slate-900 mb-6 leading-tight tracking-tight">
                    {category.title}
                  </h1>
                  {category.description && (
                    <p className="text-xl text-slate-500 font-sans font-light leading-relaxed max-w-2xl">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="space-y-16">
                  {category.questions.map((question, index) => (
                    <div key={question.id} className="group flex flex-col">
                      <label className="text-2xl font-display font-medium text-slate-800 mb-8 leading-snug tracking-tight">
                        {question.label}
                      </label>

                      {question.type === 'text' && (
                        <input
                          type="text"
                          className="w-full text-xl lg:text-2xl font-tech font-light py-4 border-b-2 border-slate-200 bg-transparent focus:outline-none focus:border-slate-900 placeholder-slate-300 transition-colors"
                          placeholder={question.placeholder || 'Sua resposta aqui...'}
                          value={answers[question.id] || ''}
                          onChange={(e) => updateAnswer(question.id, e.target.value)}
                        />
                      )}

                      {question.type === 'textarea' && (
                        <textarea
                          className="w-full min-h-[160px] text-xl lg:text-2xl font-tech font-light py-4 border-b-2 border-slate-200 bg-transparent focus:outline-none focus:border-slate-900 placeholder-slate-300 transition-colors resize-y leading-relaxed"
                          placeholder={question.placeholder || 'Sinta-se à vontade para detalhar...'}
                          value={answers[question.id] || ''}
                          onChange={(e) => updateAnswer(question.id, e.target.value)}
                        />
                      )}

                      {question.type === 'radio' && question.options && (
                        <div className="flex flex-col space-y-3">
                          {question.options.map((option) => {
                            const isSelected = answers[question.id] === option;
                            return (
                              <button
                                key={option}
                                onClick={() => updateAnswer(question.id, option)}
                                className={`flex items-center text-left gap-5 px-6 py-5 rounded-[20px] border-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${
                                  isSelected 
                                    ? 'border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                                    : 'border-slate-200/60 bg-[#FAFAFA] text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                                }`}
                              >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isSelected ? 'border-white' : 'border-slate-300'
                                }`}>
                                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className={`text-lg tracking-tight ${isSelected ? 'font-medium' : 'font-normal'}`}>{option}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {question.type === 'checkbox' && question.options && (
                        <div className="flex flex-col space-y-3">
                          {question.options.map((option) => {
                            const isChecked = (answers[question.id] || []).includes(option);
                            return (
                              <button
                                key={option}
                                onClick={() => handleCheckboxChange(question.id, option, !isChecked)}
                                className={`flex items-center text-left gap-5 px-6 py-5 rounded-[20px] border-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ${
                                  isChecked 
                                    ? 'border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/10' 
                                    : 'border-slate-200/60 bg-[#FAFAFA] text-slate-600 hover:border-slate-400 hover:bg-slate-50'
                                }`}
                              >
                                <div className={`w-7 h-7 rounded-[8px] border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isChecked ? 'border-transparent bg-slate-800' : 'border-slate-300 bg-white'
                                }`}>
                                  {isChecked && <Check size={18} strokeWidth={2.5} className="text-white" />}
                                </div>
                                <span className={`text-lg tracking-tight ${isChecked ? 'font-medium' : 'font-normal'}`}>{option}</span>
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

        {/* BOTTOM NAVIGATION BAR */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 p-4 lg:p-6 flex items-center justify-center z-10">
          <div className="w-full max-w-3xl flex items-center justify-between px-2 lg:px-8">
            <button
              onClick={() => {
                handlePrev();
                setTimeout(() => document.getElementById('main-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' }), 50);
              }}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 h-14 px-6 rounded-full font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                currentStep === 0 
                  ? 'text-slate-300 cursor-not-allowed hidden sm:flex' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline font-tech tracking-tight">Anterior</span>
            </button>
            
            <button
              onClick={() => {
                handleNext();
                setTimeout(() => document.getElementById('main-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' }), 50);
              }}
              className="flex items-center gap-3 h-14 px-8 md:px-12 rounded-full bg-slate-900 text-white font-medium text-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 ml-auto group"
            >
              <span className="font-tech tracking-tight leading-none pt-0.5">
                {currentStep === briefingData.length - 1 ? 'Concluir' : 'Continuar'}
              </span>
              {currentStep === briefingData.length - 1 ? (
                <Check size={20} />
              ) : (
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </div>
        </div>
      </main>

    </div>
  );
}
