import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight, ChevronLeft, Check, Download,
  Menu, X, FileCheck2, ArrowUpRight
} from 'lucide-react';
import { briefingData } from './questions';
import { toast } from 'sonner';
import { generateBriefingPDF } from './utils/generatePdf';

// ─── tiny helpers ───────────────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, '0');

function CheckIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="var(--bg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState<number>(() => {
    const s = localStorage.getItem('bz_step');
    return s ? parseInt(s, 10) : 0;
  });
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    const s = localStorage.getItem('bz_answers');
    return s ? JSON.parse(s) : {};
  });
  const [done, setDone] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { localStorage.setItem('bz_step', String(step)); }, [step]);
  useEffect(() => { localStorage.setItem('bz_answers', JSON.stringify(answers)); }, [answers]);

  useEffect(() => {
    const s = localStorage.getItem('bz_answers');
    if (s && Object.keys(JSON.parse(s)).length > 0) {
      toast('Rascunho recuperado', {
        description: 'Progresso salvo automaticamente.',
        style: { background: 'var(--bg2)', border: '1px solid var(--line)', color: 'var(--text)' }
      });
    }
  }, []);

  const scrollTop = () => setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 40);

  const next = () => {
    if (step < briefingData.length - 1) { setStep(p => p + 1); scrollTop(); }
    else { setDone(true); scrollTop(); }
  };
  const prev = () => { if (step > 0) { setStep(p => p - 1); scrollTop(); } };

  const set = (id: string, val: any) => setAnswers(p => ({ ...p, [id]: val }));
  const toggle = (id: string, opt: string, on: boolean) => {
    setAnswers(p => {
      const arr = Array.isArray(p[id]) ? p[id] : [];
      return { ...p, [id]: on ? [...arr, opt] : arr.filter((x: string) => x !== opt) };
    });
  };

  const total = briefingData.reduce((a, c) => a + c.questions.length, 0);
  const filled = Object.values(answers).filter(v => Array.isArray(v) ? v.length > 0 : String(v).trim() !== '').length;
  const pct = Math.round((filled / total) * 100) || 0;

  const catDone = (i: number) =>
    briefingData[i].questions.every(q => {
      const v = answers[q.id];
      return v && (Array.isArray(v) ? v.length > 0 : String(v).trim() !== '');
    });

  const cat = briefingData[step];

  // ── DONE SCREEN ──────────────────────────────────────────────────────────
  if (done) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      {/* big radial glow */}
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(200,241,53,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div
        className="finish-card noise"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="corner-tl" /><div className="corner-tr" />
        <div className="corner-bl" /><div className="corner-br" />

        {/* icon */}
        <div style={{ width: 72, height: 72, borderRadius: 16, background: 'var(--accent-dim)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
          <FileCheck2 size={32} color="var(--accent)" strokeWidth={1.5} />
        </div>

        <div className="cat-tag" style={{ marginBottom: 20, margin: '0 auto 20px' }}>
          <div className="pulse-dot" />
          briefing completo
        </div>

        <h2 className="heading-xl" style={{ marginBottom: 16 }}>
          Missão<br /><span className="heading-accent">cumprida.</span>
        </h2>

        <p style={{ color: 'var(--text-dim)', fontSize: '0.9375rem', lineHeight: 1.75, marginBottom: 40, maxWidth: 360, margin: '0 auto 40px' }}>
          Com essas informações em mãos temos a base para construir algo que não vai precisar pedir licença pra ninguém.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => generateBriefingPDF(answers)}>
            <Download size={16} />
            Exportar PDF
            <ArrowUpRight size={14} style={{ marginLeft: 'auto' }} />
          </button>
          <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setDone(false)}>
            Revisar respostas
          </button>
        </div>
      </motion.div>
    </div>
  );

  // ── MAIN LAYOUT ──────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* mobile overlay */}
      <AnimatePresence>
        {sidebar && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(7,8,10,0.8)', zIndex: 40, backdropFilter: 'blur(6px)' }}
            onClick={() => setSidebar(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <motion.aside
        animate={{ x: sidebar ? 0 : undefined }}
        style={{
          width: 280, flexShrink: 0,
          background: 'var(--bg2)',
          borderRight: '1px solid var(--line)',
          display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50,
        }}
        className={`lg-sidebar ${sidebar ? 'sidebar-open' : ''}`}
        initial={false}
      >
        {/* Logo */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* logo mark */}
            <div style={{ width: 28, height: 28, position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', inset: 0, border: '1px solid var(--accent)', borderRadius: 6, transform: 'rotate(8deg)', opacity: 0.4 }} />
              <div style={{ position: 'absolute', inset: 2, background: 'var(--accent)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 500, fontSize: 11, color: 'var(--bg)', lineHeight: 1 }}>B</span>
              </div>
            </div>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-bright)', letterSpacing: '-0.01em' }}>
              brazeo<span style={{ color: 'var(--accent)' }}>.ai</span>
            </span>
          </div>
          <button onClick={() => setSidebar(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }} className="lg-hide">
            <X size={18} />
          </button>
        </div>

        {/* Progress */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span className="step-counter">progresso geral</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em' }}>{pct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--text-dim)', marginTop: 8, letterSpacing: '0.06em' }}>
            {filled} / {total} respondidas
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
          {briefingData.map((c, i) => {
            const isActive = step === i;
            const isDone = catDone(i);
            return (
              <button key={c.id} className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => { setStep(i); setSidebar(false); scrollTop(); }}>
                {/* indicator */}
                <div style={{ width: 18, height: 18, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isDone
                    ? <div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckIcon size={9} /></div>
                    : isActive
                      ? <div className="pulse-dot" style={{ width: 8, height: 8 }} />
                      : <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--line2)' }} />
                  }
                </div>
                <span style={{ fontSize: '0.8125rem', color: isActive ? 'var(--text-bright)' : isDone ? 'var(--muted)' : 'var(--text-dim)', fontWeight: isActive ? 500 : 400, flex: 1 }}>
                  {c.title}
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: isActive ? 'var(--accent)' : 'var(--line2)', letterSpacing: '0.08em' }}>
                  {pad(i + 1)}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom status */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="pulse-dot" style={{ width: 8, height: 8 }} />
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.08em' }}>AUTO-SAVE ATIVO</span>
        </div>
      </motion.aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', marginLeft: 280 }} className="main-content">

        {/* Mobile header */}
        <div style={{ display: 'none', alignItems: 'center', height: 56, padding: '0 20px', borderBottom: '1px solid var(--line)', flexShrink: 0, background: 'var(--bg)' }} className="mobile-header">
          <button onClick={() => setSidebar(true)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <Menu size={20} />
          </button>
          <span style={{ marginLeft: 14, fontFamily: 'IBM Plex Mono', fontSize: '0.8125rem', color: 'var(--text)', letterSpacing: '0.04em' }}>
            brazeo.ai
          </span>
          <div className="cat-tag" style={{ marginLeft: 'auto' }}>
            {pad(step + 1)} / {pad(briefingData.length)}
          </div>
        </div>

        {/* Top bar — desktop */}
        <div style={{ height: 48, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', padding: '0 48px', flexShrink: 0, gap: 20 }} className="desktop-topbar">
          {/* breadcrumb */}
          <span className="step-counter">{pad(step + 1)} / {pad(briefingData.length)}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <div className="cat-tag">
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} />
            {cat.id}
          </div>
        </div>

        {/* Scrollable content */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>

          {/* subtle grid bg */}
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }} />

          {/* radial vignette */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, var(--bg) 100%)', pointerEvents: 'none', zIndex: 1 }} />

          <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 48px 160px', position: 'relative', zIndex: 2 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Step header */}
                <div style={{ marginBottom: 60 }}>
                  <div className="cat-tag" style={{ marginBottom: 24 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} />
                    módulo {pad(step + 1)}
                  </div>

                  <h1 className="heading-xl" style={{ marginBottom: 16 }}>
                    {cat.title.split(' ').map((word, i, arr) =>
                      i === arr.length - 1
                        ? <span key={i} className="heading-accent">{word}</span>
                        : <span key={i}>{word} </span>
                    )}
                  </h1>

                  {cat.description && (
                    <p style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: 1.75, maxWidth: 520, marginTop: 12 }}>
                      {cat.description}
                    </p>
                  )}

                  {/* thin accent line */}
                  <div style={{ marginTop: 32, height: 1, background: 'linear-gradient(90deg, var(--accent), transparent 60%)' }} />
                </div>

                {/* Questions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 52 }}>
                  {cat.questions.map((q, qi) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: qi * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {/* question number + label */}
                      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
                        <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em', paddingTop: 5, flexShrink: 0 }}>
                          {pad(qi + 1)}
                        </span>
                        <label style={{ fontFamily: 'Instrument Sans', fontWeight: 600, fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', color: 'var(--text-bright)', lineHeight: 1.35, letterSpacing: '-0.015em' }}>
                          {q.label}
                        </label>
                      </div>

                      {/* inputs */}
                      <div style={{ paddingLeft: 32 }}>
                        {q.type === 'text' && (
                          <input
                            className="q-input"
                            placeholder={q.placeholder || 'Sua resposta...'}
                            value={answers[q.id] || ''}
                            onChange={e => set(q.id, e.target.value)}
                          />
                        )}

                        {q.type === 'textarea' && (
                          <textarea
                            className="q-textarea"
                            placeholder={q.placeholder || 'Sinta-se à vontade para detalhar...'}
                            value={answers[q.id] || ''}
                            onChange={e => set(q.id, e.target.value)}
                          />
                        )}

                        {q.type === 'radio' && q.options && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {q.options.map(opt => {
                              const sel = answers[q.id] === opt;
                              return (
                                <button key={opt} className={`opt-btn ${sel ? 'selected' : ''}`} onClick={() => set(q.id, opt)}>
                                  <div className="indicator-radio">
                                    {sel && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bg)' }} />}
                                  </div>
                                  <span style={{ position: 'relative', zIndex: 1 }}>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {q.type === 'checkbox' && q.options && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {q.options.map(opt => {
                              const chk = (answers[q.id] || []).includes(opt);
                              return (
                                <button key={opt} className={`opt-btn ${chk ? 'selected' : ''}`} onClick={() => toggle(q.id, opt, !chk)}>
                                  <div className="indicator-check">
                                    {chk && <CheckIcon size={9} />}
                                  </div>
                                  <span style={{ position: 'relative', zIndex: 1 }}>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── BOTTOM NAV ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10,
          background: 'linear-gradient(to top, var(--bg) 50%, transparent 100%)',
          padding: '40px 48px 32px'
        }}>
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* step dots */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {briefingData.slice(Math.max(0, step - 3), Math.min(briefingData.length, step + 4)).map((_, di) => {
                const realI = Math.max(0, step - 3) + di;
                return (
                  <div key={realI} style={{
                    width: realI === step ? 20 : 5, height: 5, borderRadius: 99,
                    background: realI === step ? 'var(--accent)' : catDone(realI) ? 'var(--accent-dim)' : 'var(--line2)',
                    transition: 'all 0.3s ease',
                    boxShadow: realI === step ? '0 0 8px var(--accent)' : 'none'
                  }} />
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button className="btn-ghost" onClick={prev} disabled={step === 0}>
                <ChevronLeft size={14} />
                Voltar
              </button>
              <button className="btn-primary" onClick={next}>
                {step === briefingData.length - 1 ? (
                  <>Concluir <Check size={14} /></>
                ) : (
                  <>Próximo <ChevronRight size={14} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive overrides */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar { position: relative !important; transform: none !important; }
          .lg-hide { display: none !important; }
          .mobile-header { display: none !important; }
          .desktop-topbar { display: flex !important; }
          .main-content { margin-left: 0 !important; }
        }
        @media (max-width: 1023px) {
          .lg-sidebar { transform: translateX(-100%) !important; }
          .lg-sidebar.sidebar-open { transform: translateX(0) !important; }
          .mobile-header { display: flex !important; }
          .desktop-topbar { display: none !important; }
          .main-content { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
