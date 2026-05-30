import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'motion/react';
import {
  ChevronRight, ChevronLeft, Check, Download,
  Menu, X, FileCheck2, ArrowUpRight, Sparkles,
  AlertCircle, MessageCircle
} from 'lucide-react';
import { briefingData } from './questions';
import { toast } from 'sonner';
import { generateBriefingPDF } from './utils/generatePdf';

const pad = (n: number) => String(n).padStart(2, '0');
const ease = [0.22, 1, 0.36, 1] as const;
const WHATSAPP_NUMBER = '5581989137099';

function CheckIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="var(--bg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AnimCounter({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 80, damping: 18 });
  const display = useTransform(spring, v => Math.round(v));
  const [disp, setDisp] = useState(value);
  useEffect(() => { spring.set(value); }, [value]);
  useEffect(() => display.on('change', v => setDisp(v)), [display]);
  return <>{disp}</>;
}

function RevealLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0, originX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, delay, ease }}
      style={{ height: 1, background: 'linear-gradient(90deg, var(--accent), transparent 60%)', marginTop: 32 }}
    />
  );
}

function OptionBtn({ selected, onClick, indicator, children, delay = 0 }: {
  selected: boolean; onClick: () => void;
  indicator: 'radio' | 'check'; children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay, ease }}
      whileHover={{ x: 4, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
      className={`opt-btn ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {indicator === 'radio' ? (
        <div className="indicator-radio">
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bg)' }}
              />
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="indicator-check">
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              >
                <CheckIcon size={9} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            style={{ marginLeft: 'auto', color: 'var(--accent)', display: 'flex', zIndex: 1 }}
          >
            <Check size={13} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ── Shake animation wrapper ──────────────────────────────────────────────────
function ShakeWrapper({ shake, children }: { shake: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      animate={shake ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
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
  const [direction, setDirection] = useState(1);
  const [shakeBtn, setShakeBtn] = useState(false);
  const [missingIds, setMissingIds] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { localStorage.setItem('bz_step', String(step)); }, [step]);
  useEffect(() => { localStorage.setItem('bz_answers', JSON.stringify(answers)); }, [answers]);

  useEffect(() => {
    const s = localStorage.getItem('bz_answers');
    if (s && Object.keys(JSON.parse(s)).length > 0) {
      setTimeout(() => toast('Rascunho recuperado', {
        description: 'Progresso salvo automaticamente.',
        style: { background: 'var(--bg2)', border: '1px solid var(--line)', color: 'var(--text)' }
      }), 1200);
    }
  }, []);

  const scrollTop = () => setTimeout(() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 40);

  const cat = briefingData[step];

  // Verifica obrigatórias da categoria atual
  const getMissingRequired = () =>
    cat.questions
      .filter(q => q.required)
      .filter(q => {
        const v = answers[q.id];
        return !v || (Array.isArray(v) ? v.length === 0 : String(v).trim() === '');
      })
      .map(q => q.id);

  const next = () => {
    const missing = getMissingRequired();
    if (missing.length > 0) {
      setMissingIds(missing);
      setShakeBtn(true);
      setTimeout(() => setShakeBtn(false), 500);
      toast.error(`Preencha ${missing.length} campo${missing.length > 1 ? 's' : ''} obrigatório${missing.length > 1 ? 's' : ''}`, {
        description: 'Os campos marcados com ★ são essenciais para o briefing.',
        style: { background: 'var(--bg2)', border: '1px solid #ff4444', color: 'var(--text)' }
      });
      // scroll to first missing
      setTimeout(() => {
        const el = document.getElementById(`q-${missing[0]}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    setMissingIds([]);
    setDirection(1);
    if (step < briefingData.length - 1) { setStep(p => p + 1); scrollTop(); }
    else { setDone(true); scrollTop(); }
  };

  const prev = () => {
    setMissingIds([]);
    setDirection(-1);
    if (step > 0) { setStep(p => p - 1); scrollTop(); }
  };

  const goToStep = (i: number) => {
    setMissingIds([]);
    setDirection(i > step ? 1 : -1);
    setStep(i);
    setSidebar(false);
    scrollTop();
  };

  const set = (id: string, val: any) => {
    setAnswers(p => ({ ...p, [id]: val }));
    setMissingIds(prev => prev.filter(x => x !== id));
  };
  const toggle = (id: string, opt: string, on: boolean) => {
    setAnswers(p => {
      const arr = Array.isArray(p[id]) ? p[id] : [];
      const next = on ? [...arr, opt] : arr.filter((x: string) => x !== opt);
      return { ...p, [id]: next };
    });
    setMissingIds(prev => prev.filter(x => x !== id));
  };

  const total = briefingData.reduce((a, c) => a + c.questions.length, 0);
  const filled = Object.values(answers).filter(v => Array.isArray(v) ? v.length > 0 : String(v).trim() !== '').length;
  const pct = Math.round((filled / total) * 100) || 0;

  // catDone = todas as obrigatórias preenchidas
  const catDone = (i: number) =>
    briefingData[i].questions
      .filter(q => q.required)
      .every(q => {
        const v = answers[q.id];
        return v && (Array.isArray(v) ? v.length > 0 : String(v).trim() !== '');
      });

  const pageVariants = {
    initial: (d: number) => ({ opacity: 0, y: d > 0 ? 40 : -40, filter: 'blur(4px)' }),
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: (d: number) => ({ opacity: 0, y: d > 0 ? -30 : 30, filter: 'blur(3px)' }),
  };

  // ── DONE SCREEN ──────────────────────────────────────────────────────────
  const handleDownloadAndWhatsApp = async () => {
    await generateBriefingPDF(answers);

    // Abre WhatsApp após 1.5s (tempo para o download iniciar)
    setTimeout(() => {
      const msg = encodeURIComponent(
        'Olá! Acabei de preencher o briefing do meu site pela plataforma da Brazeo.ai. Estou enviando o PDF gerado agora! 🚀'
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    }, 1500);
  };

  if (done) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', overflow: 'hidden' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease }}
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(200,241,53,0.07) 0%, transparent 65%)', pointerEvents: 'none' }}
      />
      {[...Array(6)].map((_, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 0.6, 0], y: -120, x: (i - 3) * 40 }}
          transition={{ duration: 3 + i * 0.4, delay: 0.3 + i * 0.15, repeat: Infinity, repeatDelay: 2 }}
          style={{ position: 'fixed', bottom: '30%', left: '50%', width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', pointerEvents: 'none', boxShadow: '0 0 8px var(--accent)' }}
        />
      ))}

      <motion.div
        className="finish-card noise"
        initial={{ opacity: 0, y: 48, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease }}
      >
        <div className="corner-tl" /><div className="corner-tr" />
        <div className="corner-bl" /><div className="corner-br" />

        <motion.div
          initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 18 }}
          style={{ width: 72, height: 72, borderRadius: 16, background: 'var(--accent-dim)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', position: 'relative' }}
        >
          <FileCheck2 size={32} color="var(--accent)" strokeWidth={1.5} />
          <motion.div
            animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
            style={{ position: 'absolute', inset: -4, borderRadius: 20, border: '1px solid var(--accent)', pointerEvents: 'none' }}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4, ease }}
          className="cat-tag" style={{ marginBottom: 20, margin: '0 auto 20px' }}
        >
          <div className="pulse-dot" />briefing completo
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5, ease }}
          className="heading-xl" style={{ marginBottom: 16 }}
        >
          Missão<br /><span className="heading-accent">cumprida.</span>
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.5 }}
          style={{ color: 'var(--text-dim)', fontSize: '0.9375rem', lineHeight: 1.75, maxWidth: 360, margin: '0 auto 32px' }}
        >
          Com essas informações em mãos temos a base para construir algo que não vai precisar pedir licença pra ninguém.
        </motion.p>

        {/* WhatsApp instruction box */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.45, ease }}
          style={{
            background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.25)',
            borderRadius: 12, padding: '14px 16px', marginBottom: 24,
            display: 'flex', alignItems: 'flex-start', gap: 12, textAlign: 'left'
          }}
        >
          <MessageCircle size={18} style={{ color: '#25D366', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#25D366', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>
              Próximo passo
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-mid)', lineHeight: 1.6 }}>
              Após baixar o PDF, <strong style={{ color: 'var(--text)' }}>envie o arquivo para o WhatsApp da Brazeo.ai</strong>. O botão abaixo já vai abrir a conversa pra você assim que o download começar.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.78, duration: 0.4, ease }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          {/* Main CTA — download + open WhatsApp */}
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(200,241,53,0.3)' }}
            whileTap={{ scale: 0.97 }}
            style={{ width: '100%', justifyContent: 'center', gap: 10 }}
            onClick={handleDownloadAndWhatsApp}
          >
            <Download size={16} />
            Baixar PDF e abrir WhatsApp
            <ArrowUpRight size={14} style={{ marginLeft: 'auto' }} />
          </motion.button>

          {/* Secondary — only download */}
          <motion.button
            className="btn-ghost"
            whileHover={{ borderColor: 'var(--line2)' }}
            whileTap={{ scale: 0.97 }}
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => generateBriefingPDF(answers)}
          >
            <Download size={13} />
            Só baixar o PDF
          </motion.button>

          <motion.button
            className="btn-ghost"
            whileHover={{ borderColor: 'var(--line2)' }}
            whileTap={{ scale: 0.97 }}
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={() => setDone(false)}
          >
            Revisar respostas
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );

  // ── MAIN LAYOUT ──────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={false} animate={{ opacity: 1 }}
      style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}
    >
      <AnimatePresence>
        {sidebar && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(7,8,10,0.85)', zIndex: 40, backdropFilter: 'blur(8px)' }}
            onClick={() => setSidebar(false)}
          />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ── */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease, delay: 0.1 }}
        style={{ width: 280, flexShrink: 0, background: 'var(--bg2)', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50 }}
        className={`lg-sidebar ${sidebar ? 'sidebar-open' : ''}`}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease }}
          style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <motion.img
            src="/brazeo-logo.png"
            alt="Brazeo.ai"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300 }}
            style={{ height: 28, width: 'auto', objectFit: 'contain', mixBlendMode: 'screen' }}
          />
          <button onClick={() => setSidebar(false)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }} className="lg-hide">
            <X size={18} />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.4 }}
          style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span className="step-counter">progresso geral</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.1em' }}>
              <AnimCounter value={pct} />%
            </span>
          </div>
          <div className="progress-bar">
            <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease }} />
          </div>
          <p style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--text-dim)', marginTop: 8, letterSpacing: '0.06em' }}>
            {filled} / {total} respondidas
          </p>
        </motion.div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
          {briefingData.map((c, i) => {
            const isActive = step === i;
            const isDone = catDone(i);
            return (
              <motion.button key={c.id}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.025, duration: 0.3, ease }}
                whileHover={{ x: 3, transition: { duration: 0.15 } }}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => goToStep(i)}
              >
                <div style={{ width: 18, height: 18, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isDone ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    ><CheckIcon size={9} /></motion.div>
                  ) : isActive ? (
                    <div className="pulse-dot" style={{ width: 8, height: 8 }} />
                  ) : (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--line2)' }} />
                  )}
                </div>
                <span style={{ fontSize: '0.8125rem', color: isActive ? 'var(--text-bright)' : isDone ? 'var(--muted)' : 'var(--text-dim)', fontWeight: isActive ? 500 : 400, flex: 1 }}>
                  {c.title}
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 9, color: isActive ? 'var(--accent)' : 'var(--line2)', letterSpacing: '0.08em' }}>
                  {pad(i + 1)}
                </span>
              </motion.button>
            );
          })}
        </nav>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }}
          style={{ padding: '16px 24px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <div className="pulse-dot" style={{ width: 8, height: 8 }} />
          <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.08em' }}>AUTO-SAVE ATIVO</span>
        </motion.div>
      </motion.aside>

      {/* ── MAIN ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', marginLeft: 280 }}
        className="main-content"
      >
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

        {/* Desktop top bar */}
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease }}
          style={{ height: 48, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', padding: '0 48px', flexShrink: 0, gap: 20 }}
          className="desktop-topbar"
        >
          <span className="step-counter">{pad(step + 1)} / {pad(briefingData.length)}</span>
          <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <AnimatePresence mode="wait">
            <motion.div key={cat.id}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease }}
              className="cat-tag"
            >
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} />
              {cat.id}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Scrollable content */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          <div className="grid-bg" style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, var(--bg) 100%)', pointerEvents: 'none', zIndex: 1 }} />

          <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 48px 160px', position: 'relative', zIndex: 2 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={pageVariants}
                initial="initial" animate="animate" exit="exit"
                transition={{ duration: 0.45, ease }}
              >
                {/* Step header */}
                <div style={{ marginBottom: 60 }}>
                  <motion.div
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="cat-tag" style={{ marginBottom: 24 }}
                  >
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} />
                    módulo {pad(step + 1)}
                  </motion.div>

                  <div className="heading-xl" style={{ overflow: 'hidden', marginBottom: 16 }}>
                    {cat.title.split(' ').map((word, i, arr) => (
                      <motion.span key={i}
                        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.07, ease }}
                        style={{ display: 'inline-block', marginRight: '0.25em' }}
                      >
                        {i === arr.length - 1 ? <span className="heading-accent">{word}</span> : word}
                      </motion.span>
                    ))}
                  </div>

                  {cat.description && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.25, ease }}
                      style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: 1.75, maxWidth: 520, marginTop: 12 }}
                    >
                      {cat.description}
                    </motion.p>
                  )}

                  {/* Required count for this page */}
                  {cat.questions.some(q => q.required) && (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16 }}
                    >
                      <span style={{ color: '#f59e0b', fontSize: 11 }}>★</span>
                      <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.08em' }}>
                        {cat.questions.filter(q => q.required).length} campo{cat.questions.filter(q => q.required).length > 1 ? 's' : ''} obrigatório{cat.questions.filter(q => q.required).length > 1 ? 's' : ''} nesta seção
                      </span>
                    </motion.div>
                  )}

                  <RevealLine delay={0.3} />
                </div>

                {/* Questions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 52 }}>
                  {cat.questions.map((q, qi) => {
                    const isMissing = missingIds.includes(q.id);
                    return (
                      <motion.div key={q.id} id={`q-${q.id}`}
                        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 + qi * 0.08, ease }}
                      >
                        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
                          <motion.span
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 + qi * 0.08 }}
                            style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em', paddingTop: 5, flexShrink: 0 }}
                          >
                            {pad(qi + 1)}
                          </motion.span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                              <label style={{ fontFamily: 'Instrument Sans', fontWeight: 600, fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', color: isMissing ? '#ff6b6b' : 'var(--text-bright)', lineHeight: 1.35, letterSpacing: '-0.015em', transition: 'color 0.2s' }}>
                                {q.label}
                              </label>
                              {q.required && (
                                <motion.span
                                  animate={isMissing ? { scale: [1, 1.3, 1], opacity: [1, 0.6, 1] } : { scale: 1, opacity: 1 }}
                                  transition={isMissing ? { duration: 0.6, repeat: 2 } : {}}
                                  style={{ fontSize: 13, color: isMissing ? '#ff6b6b' : '#f59e0b', flexShrink: 0, paddingTop: 3 }}
                                  title="Campo obrigatório"
                                >
                                  ★
                                </motion.span>
                              )}
                            </div>
                            {/* Error message */}
                            <AnimatePresence>
                              {isMissing && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0, y: -4 }}
                                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}
                                >
                                  <AlertCircle size={11} style={{ color: '#ff6b6b' }} />
                                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#ff6b6b', letterSpacing: '0.06em' }}>
                                    Este campo é obrigatório
                                  </span>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        <div style={{ paddingLeft: 32 }}>
                          {q.type === 'text' && (
                            <motion.input
                              initial={{ opacity: 0, scaleX: 0.95 }} animate={{ opacity: 1, scaleX: 1 }}
                              transition={{ delay: 0.35 + qi * 0.08, duration: 0.3, ease }}
                              className={`q-input ${isMissing ? 'input-error' : ''}`}
                              placeholder={q.placeholder || 'Sua resposta...'}
                              value={answers[q.id] || ''}
                              onChange={e => set(q.id, e.target.value)}
                            />
                          )}

                          {q.type === 'textarea' && (
                            <motion.textarea
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              transition={{ delay: 0.35 + qi * 0.08, duration: 0.3 }}
                              className={`q-textarea ${isMissing ? 'input-error' : ''}`}
                              placeholder={q.placeholder || 'Sinta-se à vontade para detalhar...'}
                              value={answers[q.id] || ''}
                              onChange={e => set(q.id, e.target.value)}
                            />
                          )}

                          {q.type === 'radio' && q.options && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {isMissing && (
                                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                  style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}
                                >
                                  <AlertCircle size={11} style={{ color: '#ff6b6b' }} />
                                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#ff6b6b' }}>Selecione uma opção</span>
                                </motion.div>
                              )}
                              {q.options.map((opt, oi) => (
                                <OptionBtn key={opt} selected={answers[q.id] === opt}
                                  onClick={() => set(q.id, opt)} indicator="radio"
                                  delay={0.35 + qi * 0.08 + oi * 0.04}
                                >
                                  {opt}
                                </OptionBtn>
                              ))}
                            </div>
                          )}

                          {q.type === 'checkbox' && q.options && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {isMissing && (
                                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                  style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}
                                >
                                  <AlertCircle size={11} style={{ color: '#ff6b6b' }} />
                                  <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 10, color: '#ff6b6b' }}>Selecione ao menos uma opção</span>
                                </motion.div>
                              )}
                              {q.options.map((opt, oi) => (
                                <OptionBtn key={opt}
                                  selected={(answers[q.id] || []).includes(opt)}
                                  onClick={() => toggle(q.id, opt, !(answers[q.id] || []).includes(opt))}
                                  indicator="check" delay={0.35 + qi * 0.08 + oi * 0.04}
                                >
                                  {opt}
                                </OptionBtn>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── BOTTOM NAV ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4, ease }}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, background: 'linear-gradient(to top, var(--bg) 50%, transparent 100%)', padding: '40px 48px 32px' }}
        >
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              {briefingData.slice(Math.max(0, step - 3), Math.min(briefingData.length, step + 4)).map((_, di) => {
                const realI = Math.max(0, step - 3) + di;
                const isAct = realI === step;
                return (
                  <motion.div key={realI}
                    animate={{ width: isAct ? 20 : 5, background: isAct ? 'var(--accent)' : catDone(realI) ? '#C8F13540' : 'var(--line2)', boxShadow: isAct ? '0 0 10px var(--accent)' : 'none' }}
                    transition={{ duration: 0.35, ease }}
                    style={{ height: 5, borderRadius: 99 }}
                  />
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <motion.button className="btn-ghost" whileHover={{ x: -3 }} whileTap={{ scale: 0.95 }} onClick={prev} disabled={step === 0}>
                <ChevronLeft size={14} />
                Voltar
              </motion.button>

              <ShakeWrapper shake={shakeBtn}>
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(200,241,53,0.35)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={next}
                >
                  {step === briefingData.length - 1 ? (
                    <><Sparkles size={14} /> Concluir</>
                  ) : (
                    <>Próximo <ChevronRight size={14} /></>
                  )}
                </motion.button>
              </ShakeWrapper>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        .input-error {
          border-bottom-color: #ff6b6b !important;
          caret-color: #ff6b6b;
        }
        @media (min-width: 1024px) {
          .lg-sidebar { position: relative !important; transform: none !important; }
          .lg-hide { display: none !important; }
          .mobile-header { display: none !important; }
          .desktop-topbar { display: flex !important; }
          .main-content { margin-left: 0 !important; }
        }
        @media (max-width: 1023px) {
          .lg-sidebar { transform: translateX(-100%) !important; transition: transform 0.3s cubic-bezier(0.22,1,0.36,1) !important; }
          .lg-sidebar.sidebar-open { transform: translateX(0) !important; }
          .mobile-header { display: flex !important; }
          .desktop-topbar { display: none !important; }
          .main-content { margin-left: 0 !important; }
        }
      `}</style>
    </motion.div>
  );
}
