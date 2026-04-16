import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import {
  Scale, Gavel, Heart, Building2, Home as HomeIcon, Globe,
  Phone, Mail, MapPin, ChevronRight, Star, Award, Users,
  Shield, Clock, CheckCircle, Menu, X, MessageCircle,
  BookOpen, Handshake, TrendingUp, Lightbulb, FileText, ArrowRight
} from 'lucide-react';

// DATA
const PRACTICE_AREAS = [
  { icon: Gavel,     label: 'Criminal Law',  tamil: 'குற்றவியல் சட்டம்',  desc: 'Bail applications, trial defense, anticipatory bail, FIR quashing and High Court appeals.', color: '#ef4444', cls: 'card-criminal', bg: 'rgba(239,68,68,0.07)',   border: 'rgba(239,68,68,0.2)',  leftBg: 'linear-gradient(#ef4444,#dc2626)' },
  { icon: Scale,     label: 'Civil Law',     tamil: 'சிவில் சட்டம்',      desc: 'Contract disputes, injunctions, recovery suits, declaratory suits and civil appeals.',       color: '#3b82f6', cls: 'card-civil',    bg: 'rgba(59,130,246,0.07)',  border: 'rgba(59,130,246,0.2)',  leftBg: 'linear-gradient(#3b82f6,#2563eb)' },
  { icon: Heart,     label: 'Family Law',    tamil: 'குடும்ப சட்டம்',     desc: 'Divorce, child custody, maintenance, adoption and matrimonial disputes handled with care.',    color: '#8b5cf6', cls: 'card-family',   bg: 'rgba(139,92,246,0.07)', border: 'rgba(139,92,246,0.2)', leftBg: 'linear-gradient(#8b5cf6,#7c3aed)' },
  { icon: Building2, label: 'Corporate Law', tamil: 'நிறுவன சட்டம்',    desc: 'Company formation, agreements, compliance, mergers and commercial litigation.',              color: '#10b981', cls: 'card-corporate', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)', leftBg: 'linear-gradient(#10b981,#059669)' },
  { icon: HomeIcon,  label: 'Property Law',  tamil: 'சொத்து சட்டம்',     desc: 'Title disputes, partition suits, encumbrance checks, registration and land acquisition.',    color: '#f59e0b', cls: 'card-property',  bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.2)', leftBg: 'linear-gradient(#f59e0b,#d97706)' },
  { icon: Globe,     label: 'Human Rights',  tamil: 'மனித உரிமைகள்',    desc: 'Writ petitions, PIL, consumer rights and fundamental rights enforcement in High Court.',     color: '#ec4899', cls: 'card-rights',   bg: 'rgba(236,72,153,0.07)', border: 'rgba(236,72,153,0.2)', leftBg: 'linear-gradient(#ec4899,#db2777)' },
];

const STATS = [
  { value: 25,   suffix: '+', label: 'Years Experience',  tamil: 'ஆண்டு அனுபவம்',             icon: Award     },
  { value: 5000, suffix: '+', label: 'Cases Handled',     tamil: 'வழக்குகள்',                  icon: FileText  },
  { value: 98,   suffix: '%', label: 'Success Rate',      tamil: 'வெற்றி விகிதம்',             icon: TrendingUp },
  { value: 3000, suffix: '+', label: 'Happy Clients',     tamil: 'மகிழ்ச்சியான வாடிக்கையாளர்கள்', icon: Users    },
];

const TESTIMONIALS = [
  { name: 'Rajesh Kumar',  role: 'Business Owner, Chennai',     text: 'Sahayaraj sir handled my property dispute with exceptional skill. His in-depth knowledge of Tamil Nadu land laws saved my family home. Highly recommended!', stars: 5, avatar: 'R', color: '#f59e0b' },
  { name: 'Priya Sundar',  role: 'IT Professional, Coimbatore', text: 'During my divorce proceedings, he was not just my lawyer but a pillar of support. He got me fair maintenance and custody with minimal stress.',              stars: 5, avatar: 'P', color: '#ec4899' },
  { name: 'Murugan S.',    role: 'Contractor, Madurai',         text: 'Got anticipatory bail within 24 hours. His contacts and courtroom presence in Madras High Court are unmatched. True professional.',                            stars: 5, avatar: 'M', color: '#3b82f6' },
  { name: 'Lakshmi Venkat',role: 'Teacher, Salem',              text: 'My consumer case against a builder was won in just 6 months. Transparent fees, regular updates, and complete dedication to my case.',                          stars: 5, avatar: 'L', color: '#10b981' },
  { name: 'Arjun Nair',    role: 'Startup Founder, Chennai',    text: 'Drafted all my company contracts and shareholder agreements flawlessly. His corporate law expertise helped us avoid costly mistakes.',                          stars: 5, avatar: 'A', color: '#8b5cf6' },
  { name: 'Kavitha Devi',  role: 'Homemaker, Tirunelveli',      text: 'He fought my domestic violence case bravely. Got us a protection order quickly. Very compassionate and professional at the same time.',                         stars: 5, avatar: 'K', color: '#ef4444' },
];

const PROCESS = [
  { step: '01', title: 'Free Consultation', tamil: 'இலவச ஆலோசனை', desc: 'Share your legal issue. We listen, assess, and give you an honest evaluation — no strings attached.', icon: MessageCircle, color: '#f59e0b' },
  { step: '02', title: 'Case Analysis',     tamil: 'வழக்கு ஆய்வு',  desc: 'Deep dive into facts, documents and precedents. We build a bulletproof strategy tailored to you.',    icon: BookOpen,     color: '#3b82f6' },
  { step: '03', title: 'Legal Action',      tamil: 'சட்ட நடவடிக்கை',desc: 'We file, argue, and fight for you in court with full force — keeping you informed at every stage.',    icon: Gavel,        color: '#8b5cf6' },
  { step: '04', title: 'Victory & Closure', tamil: 'வெற்றி & தீர்வு',desc: 'We pursue your case to its best possible conclusion, ensuring justice is served.',                      icon: CheckCircle,  color: '#10b981' },
];

const WHY_US = [
  { icon: Award,      title: '25+ Years Expertise',    desc: 'Decades of courtroom experience across Tamil Nadu courts and Madras High Court.'   },
  { icon: Shield,     title: 'Client Confidentiality', desc: 'Your case details held in strict confidence. Complete privacy guaranteed.'           },
  { icon: Clock,      title: '24/7 Availability',      desc: "Legal emergencies don't wait. Reach us any time — day or night."                    },
  { icon: Handshake,  title: 'Transparent Fees',       desc: 'No hidden charges. Clear fee structure discussed upfront before we begin.'           },
  { icon: Lightbulb,  title: 'Strategic Approach',     desc: 'Every case gets a custom strategy — not a one-size-fits-all solution.'               },
  { icon: TrendingUp, title: 'High Success Rate',      desc: '98% success rate earned through relentless preparation and advocacy.'                },
];

const MARQUEE_ITEMS = [
  '⚖ Madras High Court', '★ 25+ Years Practice', '✦ Criminal Defense', '◎ Family Law Expert',
  '⬡ Property Disputes', '★ 5000+ Cases Won', '⚖ Corporate Counsel', '✦ Human Rights',
  '◎ Bar Council TN', '★ Civil Litigation', '⬡ Free Consultation', '⚖ Anticipatory Bail',
  '⚖ Madras High Court', '★ 25+ Years Practice', '✦ Criminal Defense', '◎ Family Law Expert',
  '⬡ Property Disputes', '★ 5000+ Cases Won', '⚖ Corporate Counsel', '✦ Human Rights',
  '◎ Bar Council TN', '★ Civil Litigation', '⬡ Free Consultation', '⚖ Anticipatory Bail',
];

const BAR_DATA = [30, 50, 42, 70, 58, 88, 65, 80, 72, 96];

// HOOKS
function useCounter(target: number, inView: boolean) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 40, damping: 15 });
  const [display, setDisplay] = useState(0);
  useEffect(() => { if (inView) mv.set(target); }, [inView, target, mv]);
  useEffect(() => spring.on('change', v => setDisplay(Math.round(v))), [spring]);
  return display;
}

function useTypewriter(phrases: string[], speed = 90) {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [del, setDel] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const cur = phrases[idx];
    if (!del && text === cur) { t.current = setTimeout(() => setDel(true), 2000); }
    else if (del && text === '') { setDel(false); setIdx(i => (i + 1) % phrases.length); }
    else { t.current = setTimeout(() => setText(del ? text.slice(0, -1) : cur.slice(0, text.length + 1)), del ? speed / 2 : speed); }
    return () => clearTimeout(t.current);
  }, [text, del, idx, phrases, speed]);
  return text;
}

// PARTICLES
const PCOLS = ['#f59e0b', '#fcd34d', '#ec4899', '#8b5cf6', '#3b82f6'];
function Particles() {
  const list = useRef(Array.from({ length: 20 }, (_, i) => ({
    id: i, left: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 2, color: PCOLS[i % PCOLS.length],
    delay: Math.random() * 15, duration: Math.random() * 10 + 14,
    drift: (Math.random() - 0.5) * 80,
  })));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {list.current.map(p => (
        <div key={p.id} className="particle" style={{
          left: p.left, width: p.size, height: p.size, background: p.color,
          animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
          ['--drift' as string]: `${p.drift}px`,
        }} />
      ))}
    </div>
  );
}

// LEGAL DASHBOARD
const FLOAT_BADGES = [
  { text: '⚖ Criminal Law',  pos: 'top-0 -left-10',      grad: 'from-red-500/20 to-orange-500/20',   border: 'border-red-500/30',    color: 'text-red-300',    anim: 'badgeFloat',  delay: '0s'   },
  { text: '◎ Family Law',    pos: 'top-6 -right-8',       grad: 'from-purple-500/20 to-pink-500/20',  border: 'border-purple-500/30', color: 'text-purple-300', anim: 'badgeFloat2', delay: '0.6s' },
  { text: '✦ Property Law',  pos: '-bottom-4 -left-8',    grad: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/30',  color: 'text-amber-300',  anim: 'badgeFloat3', delay: '1s'   },
  { text: '⬡ Civil Law',     pos: 'bottom-10 -right-10',  grad: 'from-blue-500/20 to-cyan-500/20',    border: 'border-blue-500/30',   color: 'text-blue-300',   anim: 'badgeFloat',  delay: '1.5s' },
  { text: '★ High Court',    pos: 'top-1/2 -left-12',     grad: 'from-green-500/20 to-teal-500/20',   border: 'border-green-500/30',  color: 'text-green-300',  anim: 'badgeFloat2', delay: '0.3s' },
];

function LegalDashboard() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="absolute inset-0 bg-amber-500/10 rounded-3xl blur-3xl scale-110 pointer-events-none" />
      {FLOAT_BADGES.map((b, i) => (
        <div key={i} className={`absolute ${b.pos} bg-gradient-to-r ${b.grad} border ${b.border} ${b.color} text-[11px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-md z-20 whitespace-nowrap mono-tag`}
          style={{ animation: `${b.anim} ${3.5 + i * 0.5}s ease-in-out infinite`, animationDelay: b.delay }}>
          {b.text}
        </div>
      ))}
      <div className="relative glass rounded-2xl p-6 shadow-[0_0_60px_rgba(245,158,11,0.15)] z-10 border border-amber-500/20">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="mono-tag text-[10px] text-slate-500 mb-1">CASE PERFORMANCE</p>
            <p className="text-white font-semibold text-sm">Win Rate — Last 10 Years</p>
          </div>
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Active
          </div>
        </div>
        <div className="flex items-end gap-1.5 h-24 mb-5">
          {BAR_DATA.map((h, i) => (
            <div key={i} className="flex-1 rounded-t bar-grow" style={{
              height: `${h}%`,
              background: i === 9 ? 'linear-gradient(to top,#f59e0b,#fcd34d)' : i >= 7 ? 'linear-gradient(to top,#f59e0b,#fbbf24)' : 'rgba(245,158,11,0.25)',
              animationDelay: `${i * 0.07}s`,
            }} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[{label:'Win Rate',value:'98%'},{label:'Cases',value:'5K+'},{label:'Years',value:'25+'}].map((s,i) => (
            <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[10px] text-slate-500 mb-1 mono-tag">{s.label}</p>
              <p className="text-base font-bold gold-shimmer">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
          {[{l:'Madras H.C.',v:'Active Enroll'},{l:'Clients',v:'3000+'},{l:'Domains',v:'6 Areas'}].map((x,i) => (
            <div key={i} className="flex-1 bg-white/5 rounded-lg p-2.5">
              <p className="text-[10px] text-slate-500 mono-tag">{x.l}</p>
              <p className="text-xs font-bold text-white">{x.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// NAVBAR
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  const links = ['Home','About','Practice','Process','Testimonials','Contact'];
  const scrollTo = useCallback((id: string) => {
    setOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-glass' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('home')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <Scale size={20} className="text-slate-900" />
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm leading-tight">Adv. Sahayaraj</div>
            <div className="mono-tag text-[9px] text-amber-400/70">// MADRAS HIGH COURT</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button key={l} onClick={() => scrollTo(l)} className="text-slate-400 hover:text-amber-400 text-sm font-medium transition-colors">{l}</button>
          ))}
        </div>
        <a href="https://wa.me/919442760535" target="_blank" rel="noreferrer"
          className="hidden md:flex btn-gold px-5 py-2.5 rounded-full text-sm items-center gap-2">
          <span className="flex items-center gap-2"><Phone size={14} /> Free Consultation</span>
        </a>
        <button className="md:hidden text-white" onClick={() => setOpen(o => !o)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden navbar-glass border-t border-amber-400/10 px-6 pb-4">
            {links.map(l => (
              <button key={l} onClick={() => scrollTo(l)} className="block w-full text-left py-3 text-slate-300 hover:text-amber-400 text-sm border-b border-white/5">{l}</button>
            ))}
            <a href="https://wa.me/919442760535" target="_blank" rel="noreferrer"
              className="mt-4 btn-gold flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm w-full">
              <span className="flex items-center gap-2"><Phone size={14} /> Free Consultation</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// HERO
function Hero() {
  const typed = useTypewriter(['Fight Your Case','Protect Your Rights','Win in Court','Defend Your Family','Secure Your Property']);
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden grid-bg pt-20">
      <div className="orb w-[500px] h-[500px] bg-amber-500" style={{ top:'-8%', right:'-10%', animationDuration:'14s', opacity:0.18 }} />
      <div className="orb w-[350px] h-[350px] bg-violet-600" style={{ bottom:'5%', left:'-8%', animationDuration:'18s', animationDelay:'-6s', opacity:0.14 }} />
      <div className="orb w-[250px] h-[250px] bg-cyan-500"  style={{ top:'40%', left:'35%', animationDuration:'11s', animationDelay:'-3s', opacity:0.07 }} />
      <Particles />
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")` }} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity:0, x:-50 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8 }}>
            <div className="flex items-center gap-2 mb-6 section-label">
              <span className="blink-dot" />
              <span className="mono-tag">// Madras High Court Advocate</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">We Help You</span><br />
              <span className="gold-shimmer inline-block min-h-[1.1em]">
                {typed}<span className="tw-cursor" style={{ display:'inline-block', width:3, height:'0.85em', background:'#F59E0B', verticalAlign:'middle', marginLeft:2 }} />
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-4">
              Expert legal representation in Criminal, Civil, Family & Corporate Law.
              25+ years of unwavering dedication to justice in Tamil Nadu courts.
            </p>
            <p className="text-amber-400/80 text-base mb-10 font-display italic">
              "நீதி தாமதமாகலாம், ஆனால் மறுக்கப்படாது"
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a href="https://wa.me/919442760535?text=Hello%20Advocate%20Sahayaraj,%20I%20need%20legal%20consultation"
                target="_blank" rel="noreferrer"
                className="btn-gold flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base">
                <span className="flex items-center gap-2"><MessageCircle size={18} /> Free Consultation</span>
              </a>
              <button onClick={() => document.getElementById('practice')?.scrollIntoView({ behavior:'smooth' })}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base border border-white/20 text-white hover:border-amber-400/50 hover:text-amber-400 transition-all">
                Our Practice Areas <ChevronRight size={16} />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-t border-white/5 pt-6">
              <div className="flex items-center gap-1"><span className="text-amber-400 font-bold">★★★★★</span><span className="ml-1">5.0 Rating</span></div>
              <div className="w-px h-4 bg-white/10" /><span>3000+ Clients Served</span>
              <div className="w-px h-4 bg-white/10" /><span>98% Success Rate</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity:0, x:60 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8, delay:0.25 }}
            className="hidden lg:flex justify-center items-center">
            <LegalDashboard />
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 text-xs">
        <span className="mono-tag text-[10px]">scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-amber-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

// MARQUEE
function MarqueeStrip() {
  return (
    <div className="overflow-hidden py-4 border-y border-amber-400/10 bg-white/[0.02]">
      <div className="marquee-track">
        {MARQUEE_ITEMS.map((item, i) => (
          <span key={i} className="flex items-center gap-2 bg-white/5 border border-amber-400/10 rounded-lg px-4 py-2 mono-tag text-[11px] text-slate-400 whitespace-nowrap">{item}</span>
        ))}
      </div>
    </div>
  );
}

// STATS
function StatCard({ value, suffix, label, tamil, icon: Icon }: typeof STATS[0]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useCounter(value, inView);
  return (
    <div ref={ref} className="glass rounded-2xl p-8 text-center group hover:border-amber-400/30 transition-all duration-300 hover:-translate-y-1">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon size={24} className="text-amber-400" />
      </div>
      <div className="font-display text-5xl font-bold text-white mb-2">{count.toLocaleString()}{suffix}</div>
      <div className="text-white font-semibold text-sm mb-1">{label}</div>
      <div className="text-amber-400/70 mono-tag text-[10px]">{tamil}</div>
    </div>
  );
}
function Stats() {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(s => <StatCard key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}

// PRACTICE AREAS
function PracticeAreas() {
  return (
    <section id="practice" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.6 }} className="text-center mb-16">
          <div className="mono-tag text-[11px] text-amber-400/70 mb-3">// OUR EXPERTISE</div>
          <div className="section-label mx-auto mb-4 inline-flex"><Scale size={12} /> Practice Areas</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Legal Services We <span className="gold-shimmer">Specialize In</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Comprehensive legal services across all major domains — fought with experience and won with strategy.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRACTICE_AREAS.map((area, i) => {
            const Icon = area.icon;
            return (
              <motion.div key={area.label} initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5, delay:i*0.1 }}
                className={`svc-card-adv ${area.cls} glass rounded-2xl p-8 cursor-pointer group transition-all duration-300 hover:-translate-y-1`}
                style={{ background:area.bg, borderColor:area.border, ['--svc-left' as string]:area.leftBg }}>
                <style>{`.svc-card-adv.${area.cls}::before{background:${area.leftBg}}`}</style>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background:`${area.color}20` }}>
                  <Icon size={28} style={{ color:area.color }} />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-1">{area.label}</h3>
                <p className="mono-tag text-[10px] mb-4" style={{ color:area.color }}>{area.tamil}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{area.desc}</p>
                <div className="flex items-center gap-2 mt-6 text-sm font-medium" style={{ color:area.color }}>
                  <span className="svc-arrow">Consult Now</span>
                  <span className="svc-arrow"><ArrowRight size={14} /></span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ABOUT
function About() {
  const milestones = [
    { year: '1999', event: 'Enrolled at Bar Council of Tamil Nadu'                    },
    { year: '2003', event: 'First landmark criminal case victory at Sessions Court'   },
    { year: '2008', event: 'Elevated to Madras High Court practice'                   },
    { year: '2015', event: 'Recognized for outstanding contribution in family law'    },
    { year: '2020', event: 'Appointed as panel advocate for leading corporates'       },
    { year: '2024', event: '5000+ cases successfully closed'                          },
  ];
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-amber-600" style={{ top:'20%', right:'5%', opacity:0.1 }} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity:0, x:-40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
            <div className="mono-tag text-[11px] text-amber-400/70 mb-3">// ABOUT THE ADVOCATE</div>
            <div className="section-label mb-4 inline-flex"><Award size={12} /> 25+ Years Legacy</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">A Legacy of <span className="gold-shimmer">Justice</span></h2>
            <p className="text-slate-400 leading-relaxed mb-6">Advocate Sahayaraj is a distinguished legal practitioner with over 25 years of experience in the Madras High Court and subordinate courts across Tamil Nadu. Known for sharp legal acumen, strategic thinking, and relentless advocacy.</p>
            <p className="text-slate-400 leading-relaxed mb-8">From complex criminal trials to sensitive family matters, property disputes to corporate agreements — his breadth of expertise ensures every client receives the most effective representation possible.</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[{label:'Education',value:'B.L., M.L.'},{label:'Court',value:'Madras High Court'},{label:'Bar Council',value:'Tamil Nadu'},{label:'Languages',value:'Tamil, English'}].map(({ label, value }) => (
                <div key={label} className="glass rounded-xl p-4 hover:border-amber-400/20 transition-all">
                  <div className="mono-tag text-[10px] text-amber-400 mb-1">{label}</div>
                  <div className="text-white text-sm font-medium">{value}</div>
                </div>
              ))}
            </div>
            <a href="https://wa.me/919442760535" target="_blank" rel="noreferrer"
              className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-full">
              <span className="flex items-center gap-2"><Phone size={16} /> Talk to the Advocate</span>
            </a>
          </motion.div>
          <motion.div initial={{ opacity:0, x:40 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.7, delay:0.2 }}>
            <div className="relative pl-8">
              <div className="timeline-line" style={{ left:0, top:0, bottom:0 }} />
              {milestones.map((m, i) => (
                <motion.div key={m.year} initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.12 }}
                  className="relative mb-8 last:mb-0">
                  <div className="absolute -left-[42px] w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <CheckCircle size={14} className="text-slate-900" />
                  </div>
                  <div className="glass rounded-xl p-5 hover:border-amber-400/30 transition-all hover:-translate-x-1">
                    <div className="mono-tag text-[11px] text-amber-400 mb-1">{m.year}</div>
                    <div className="text-white text-sm">{m.event}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// WHY US
function WhyUs() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-16">
          <div className="mono-tag text-[11px] text-amber-400/70 mb-3">// WHY CHOOSE US</div>
          <div className="section-label mx-auto mb-4 inline-flex"><Shield size={12} /> The Advantage</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">The <span className="gold-shimmer">Sahayaraj</span> Advantage</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_US.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                className="glass rounded-2xl p-8 group hover:border-amber-400/30 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon size={22} className="text-amber-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// PROCESS
function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <section id="process" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-16">
          <div className="mono-tag text-[11px] text-amber-400/70 mb-3">// HOW IT WORKS</div>
          <div className="section-label mx-auto mb-4 inline-flex"><ChevronRight size={12} /> Our Process</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">From First Call to <span className="gold-shimmer">Final Verdict</span></h2>
        </motion.div>
        <div ref={ref} className="grid md:grid-cols-4 gap-6 relative">
          {inView && (
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px z-0">
              <div className="process-line w-full h-full" style={{ background:'linear-gradient(90deg,#f59e0b,#8b5cf6,#10b981)' }} />
            </div>
          )}
          {PROCESS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div key={step.step} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.15 }}
                className="relative glass rounded-2xl p-8 text-center group hover:-translate-y-2 transition-all duration-300 z-10">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                  style={{ background:`linear-gradient(135deg,${step.color},${step.color}99)` }}>
                  <Icon size={26} className="text-white" />
                </div>
                <div className="font-bold text-[28px] mb-3" style={{ color:`${step.color}25`, fontFamily:'inherit' }}>{step.step}</div>
                <h3 className="text-white font-semibold text-lg mb-1">{step.title}</h3>
                <p className="mono-tag text-[10px] mb-4" style={{ color:step.color }}>{step.tamil}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// TESTIMONIALS
function Testimonials() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a+1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="orb w-80 h-80 bg-purple-600" style={{ bottom:'10%', left:'10%', opacity:0.08 }} />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-16">
          <div className="mono-tag text-[11px] text-amber-400/70 mb-3">// CLIENT STORIES</div>
          <div className="section-label mx-auto mb-4 inline-flex"><Star size={12} /> Testimonials</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">What Clients <span className="gold-shimmer">Say</span></h2>
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} transition={{ duration:0.4 }}
            className="max-w-3xl mx-auto glass rounded-3xl p-10 text-center mb-8">
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: TESTIMONIALS[active].stars }).map((_,i) => <Star key={i} size={20} className="fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-slate-300 text-lg leading-relaxed italic mb-8">"{TESTIMONIALS[active].text}"</p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-slate-900 font-bold text-lg" style={{ background:TESTIMONIALS[active].color }}>{TESTIMONIALS[active].avatar}</div>
              <div className="text-left">
                <div className="text-white font-semibold">{TESTIMONIALS[active].name}</div>
                <div className="text-slate-400 text-sm">{TESTIMONIALS[active].role}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-2 mb-12">
          {TESTIMONIALS.map((_,i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${i===active ? 'w-8 h-2 bg-amber-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t,i) => (
            <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
              onClick={() => setActive(i)}
              className={`glass rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${i===active ? 'border-amber-400/40' : 'hover:border-white/20'}`}>
              <div className="flex gap-1 mb-3">{Array.from({length:t.stars}).map((_,j) => <Star key={j} size={12} className="fill-amber-400 text-amber-400" />)}</div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-900" style={{ background:t.color }}>{t.avatar}</div>
                <div>
                  <div className="text-white text-xs font-semibold">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA BANNER
function CtaBanner() {
  return (
    <section className="py-16 relative">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="relative rounded-3xl overflow-hidden p-12 text-center"
          style={{ background:'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(245,158,11,0.1) 0%, rgba(139,92,246,0.08) 50%, transparent 80%)', border:'1px solid rgba(245,158,11,0.2)' }}>
          <div className="orb w-60 h-60 bg-amber-500" style={{ top:'-30%', left:'-10%', opacity:0.12 }} />
          <div className="orb w-60 h-60 bg-violet-600" style={{ bottom:'-30%', right:'-10%', opacity:0.1 }} />
          <div className="relative z-10">
            <div className="section-label mx-auto mb-4 inline-flex"><Scale size={12} /> Get Help Now</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Your Legal Problem Has <span className="gold-shimmer">A Solution</span></h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">Don't wait — every hour matters in legal matters. Get a free consultation today.</p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['Criminal Defense','Family Law','Property Disputes','Civil Cases','Corporate Law','Human Rights'].map(t => (
                <span key={t} className="bg-amber-400/10 border border-amber-400/20 text-amber-400/80 text-xs px-4 py-2 rounded-full mono-tag">{t}</span>
              ))}
            </div>
            <a href="https://wa.me/919442760535?text=Hello%20Advocate%20Sahayaraj,%20I%20need%20legal%20consultation"
              target="_blank" rel="noreferrer"
              className="btn-gold inline-flex items-center gap-2 px-10 py-4 rounded-full text-base">
              <span className="flex items-center gap-2"><MessageCircle size={18} /> Start Free Consultation →</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// CONTACT
function Contact() {
  const [form, setForm] = useState({ name:'', phone:'', issue:'', message:'' });
  const handleWA = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Advocate Sahayaraj,\n\nName: ${form.name}\nPhone: ${form.phone}\nLegal Issue: ${form.issue}\n\nMessage: ${form.message}`;
    window.open(`https://wa.me/919442760535?text=${encodeURIComponent(text)}`, '_blank');
  };
  return (
    <section id="contact" className="py-24 relative">
      <div className="orb w-96 h-96 bg-amber-500" style={{ top:'10%', left:'5%', opacity:0.07 }} />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="text-center mb-16">
          <div className="mono-tag text-[11px] text-amber-400/70 mb-3">// GET IN TOUCH</div>
          <div className="section-label mx-auto mb-4 inline-flex"><Phone size={12} /> Contact Us</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Book Your Free <span className="gold-shimmer">Consultation</span></h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Share your legal concern. We'll respond within 2 hours.</p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
            <form onSubmit={handleWA} className="glass rounded-3xl p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mono-tag text-[10px] text-slate-400 mb-2 block">YOUR NAME</label>
                  <input type="text" required placeholder="Full Name" className="form-input" value={form.name} onChange={e => setForm(f => ({...f,name:e.target.value}))} />
                </div>
                <div>
                  <label className="mono-tag text-[10px] text-slate-400 mb-2 block">PHONE NUMBER</label>
                  <input type="tel" required placeholder="+91 XXXXX XXXXX" className="form-input" value={form.phone} onChange={e => setForm(f => ({...f,phone:e.target.value}))} />
                </div>
              </div>
              <div>
                <label className="mono-tag text-[10px] text-slate-400 mb-2 block">TYPE OF LEGAL ISSUE</label>
                <select required className="form-input" value={form.issue} onChange={e => setForm(f => ({...f,issue:e.target.value}))} style={{ background:'rgba(255,255,255,0.05)' }}>
                  <option value="" style={{ background:'#02020F' }}>Select area of law</option>
                  {PRACTICE_AREAS.map(a => <option key={a.label} value={a.label} style={{ background:'#02020F' }}>{a.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mono-tag text-[10px] text-slate-400 mb-2 block">DESCRIBE YOUR ISSUE</label>
                <textarea required rows={4} placeholder="Briefly describe your legal matter..." className="form-input resize-none" value={form.message} onChange={e => setForm(f => ({...f,message:e.target.value}))} />
              </div>
              <button type="submit" className="btn-gold w-full flex items-center justify-center gap-2 py-4 rounded-full text-base">
                <span className="flex items-center gap-2"><MessageCircle size={18} /> Send via WhatsApp →</span>
              </button>
              <p className="text-slate-600 mono-tag text-[10px] text-center">// opens WhatsApp with your message pre-filled</p>
            </form>
          </motion.div>
          <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} className="space-y-5">
            {[
              { icon:Phone,  label:'CALL / WHATSAPP', value:'+91 94427 60535',        sub:'Available 9 AM – 9 PM',       color:'#10b981', href:'tel:+919442760535'              },
              { icon:Mail,   label:'EMAIL',            value:'adv.sahayaraj@gmail.com',sub:'Reply within 24 hours',       color:'#3b82f6', href:'mailto:adv.sahayaraj@gmail.com' },
              { icon:MapPin, label:'OFFICE',           value:'High Court Complex',     sub:'Chennai — 600 104, Tamil Nadu',color:'#f59e0b', href:'#'                              },
              { icon:Clock,  label:'HOURS',            value:'Monday – Saturday',      sub:'10:00 AM – 7:00 PM',          color:'#8b5cf6', href:'#'                              },
            ].map(({ icon: Icon, label, value, sub, color, href }) => (
              <a key={label} href={href}
                className="flex items-start gap-5 glass rounded-2xl p-6 hover:border-white/20 transition-all group hover:-translate-x-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ background:`${color}15`, border:`1px solid ${color}25` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <div className="mono-tag text-[10px] text-slate-500 mb-1">{label}</div>
                  <div className="text-white font-semibold text-sm">{value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
                </div>
              </a>
            ))}
            <div className="glass rounded-2xl overflow-hidden h-44 flex items-center justify-center relative">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="relative text-center">
                <MapPin size={32} className="text-amber-400 mx-auto mb-2" />
                <p className="text-slate-400 text-sm font-semibold">Madras High Court Complex</p>
                <p className="mono-tag text-[10px] text-slate-600 mt-1">// Chennai, Tamil Nadu</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// FOOTER
function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 bg-white/[0.015]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Scale size={20} className="text-slate-900" />
              </div>
              <div>
                <div className="font-display font-bold text-white">Adv. Sahayaraj</div>
                <div className="mono-tag text-[9px] text-amber-400/60">// B.L., M.L. — MADRAS HIGH COURT</div>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">Dedicated to delivering justice with integrity, expertise, and compassion. Your legal rights are our priority.</p>
            <p className="text-amber-400/50 font-display italic text-sm mt-4">"நீதியை நோக்கி, உண்மையுடன்"</p>
          </div>
          <div>
            <h4 className="mono-tag text-[11px] text-white mb-4">PRACTICE AREAS</h4>
            <ul className="space-y-2">
              {PRACTICE_AREAS.map(a => <li key={a.label}><span className="text-slate-500 text-sm hover:text-amber-400 cursor-pointer transition-colors">{a.label}</span></li>)}
            </ul>
          </div>
          <div>
            <h4 className="mono-tag text-[11px] text-white mb-4">CONTACT</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-500 text-sm"><Phone size={14} className="text-amber-400" /> +91 94427 60535</li>
              <li className="flex items-center gap-2 text-slate-500 text-sm"><Mail size={14} className="text-amber-400" /> adv.sahayaraj@gmail.com</li>
              <li className="flex items-start gap-2 text-slate-500 text-sm"><MapPin size={14} className="text-amber-400 mt-0.5 flex-shrink-0" /> High Court Complex, Chennai</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 mono-tag text-[10px]">© 2024 Advocate Sahayaraj. All rights reserved.</p>
          <p className="text-slate-600 mono-tag text-[10px]">Bar Council of Tamil Nadu | Madras High Court</p>
        </div>
      </div>
    </footer>
  );
}

// WHATSAPP FLOAT
function WhatsAppFloat() {
  return (
    <a href="https://wa.me/919442760535?text=Hello%20Advocate%20Sahayaraj,%20I%20need%20legal%20consultation"
      target="_blank" rel="noreferrer" className="wa-float" title="WhatsApp">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

// PAGE
export default function Home() {
  return (
    <div className="min-h-screen bg-[#02020F] text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <MarqueeStrip />
      <Stats />
      <PracticeAreas />
      <About />
      <WhyUs />
      <Process />
      <Testimonials />
      <CtaBanner />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
