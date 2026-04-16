import { useEffect, useRef, useState, useCallback, createContext, useContext } from 'react';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import {
  Scale, Gavel, Heart, Building2, Home as HomeIcon, Globe,
  Phone, Mail, MapPin, ChevronRight, Star, Award, Users,
  Shield, Clock, CheckCircle, Menu, X, MessageCircle,
  BookOpen, Handshake, TrendingUp, Lightbulb, FileText, ArrowRight
} from 'lucide-react';

// ─── LANGUAGE CONTEXT ────────────────────────────────────────────────────────
type Lang = 'en' | 'ta';
const LangCtx = createContext<{ lang: Lang; toggle: () => void }>({ lang: 'en', toggle: () => {} });
const useLang = () => useContext(LangCtx);

// ─── DATA ────────────────────────────────────────────────────────────────────

const PRACTICE_AREAS = [
  {
    icon: Gavel, cls: 'card-criminal', color: '#ef4444',
    bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.2)', leftBg: 'linear-gradient(#ef4444,#dc2626)',
    en: { label: 'Criminal Law',  desc: 'Bail applications, trial defense, anticipatory bail, FIR quashing and High Court appeals.' },
    ta: { label: 'குற்றவியல் சட்டம்',  desc: 'ஜாமீன் மனு, விசாரணை பாதுகாப்பு, ஊகிக்கப்பட்ட ஜாமீன், FIR ரத்து மற்றும் உயர் நீதிமன்ற மேல்முறையீடு.' },
  },
  {
    icon: Scale, cls: 'card-civil', color: '#3b82f6',
    bg: 'rgba(59,130,246,0.07)', border: 'rgba(59,130,246,0.2)', leftBg: 'linear-gradient(#3b82f6,#2563eb)',
    en: { label: 'Civil Law',     desc: 'Contract disputes, injunctions, recovery suits, declaratory suits and civil appeals.' },
    ta: { label: 'சிவில் சட்டம்',      desc: 'ஒப்பந்த தகராறுகள், தடை உத்தரவுகள், மீட்பு வழக்குகள், அறிவிப்பு வழக்குகள் மற்றும் சிவில் மேல்முறையீடுகள்.' },
  },
  {
    icon: Heart, cls: 'card-family', color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.07)', border: 'rgba(139,92,246,0.2)', leftBg: 'linear-gradient(#8b5cf6,#7c3aed)',
    en: { label: 'Family Law',    desc: 'Divorce, child custody, maintenance, adoption and matrimonial disputes handled with care.' },
    ta: { label: 'குடும்ப சட்டம்',     desc: 'விவாகரத்து, குழந்தை காவல், ஜீவனாம்சம், தத்தெடுப்பு மற்றும் திருமண தகராறுகள் அன்புடன் கையாளப்படும்.' },
  },
  {
    icon: Building2, cls: 'card-corporate', color: '#10b981',
    bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)', leftBg: 'linear-gradient(#10b981,#059669)',
    en: { label: 'Corporate Law', desc: 'Company formation, agreements, compliance, mergers and commercial litigation.' },
    ta: { label: 'நிறுவன சட்டம்',    desc: 'நிறுவன உருவாக்கம், ஒப்பந்தங்கள், இணங்குதல், இணைப்புகள் மற்றும் வணிக வழக்காடல்.' },
  },
  {
    icon: HomeIcon, cls: 'card-property', color: '#f59e0b',
    bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.2)', leftBg: 'linear-gradient(#f59e0b,#d97706)',
    en: { label: 'Property Law',  desc: 'Title disputes, partition suits, encumbrance checks, registration and land acquisition.' },
    ta: { label: 'சொத்து சட்டம்',     desc: 'பட்டா தகராறுகள், பிரிவினை வழக்குகள், வரையறை சோதனைகள், பதிவு மற்றும் நில கையகப்படுத்தல்.' },
  },
  {
    icon: Globe, cls: 'card-rights', color: '#ec4899',
    bg: 'rgba(236,72,153,0.07)', border: 'rgba(236,72,153,0.2)', leftBg: 'linear-gradient(#ec4899,#db2777)',
    en: { label: 'Human Rights',  desc: 'Writ petitions, PIL, consumer rights and fundamental rights enforcement in High Court.' },
    ta: { label: 'மனித உரிமைகள்',    desc: 'ரிட் மனு, பொது நல வழக்கு, நுகர்வோர் உரிமைகள் மற்றும் அடிப்படை உரிமைகள் உயர் நீதிமன்றத்தில் செயல்படுத்தல்.' },
  },
];

const STATS = [
  { value: 25,   suffix: '+', en: 'Years Experience',  ta: 'ஆண்டு அனுபவம்',                   icon: Award      },
  { value: 5000, suffix: '+', en: 'Cases Handled',     ta: 'வழக்குகள் கையாளப்பட்டன',          icon: FileText   },
  { value: 98,   suffix: '%', en: 'Success Rate',      ta: 'வெற்றி விகிதம்',                   icon: TrendingUp },
  { value: 3000, suffix: '+', en: 'Happy Clients',     ta: 'மகிழ்ச்சியான வாடிக்கையாளர்கள்',   icon: Users      },
];

const TESTIMONIALS = [
  { name: 'Rajesh Kumar',  role: { en: 'Business Owner, Chennai',     ta: 'வணிகர், சென்னை'         }, text: { en: 'Sahayaraj sir handled my property dispute with exceptional skill. His in-depth knowledge of Tamil Nadu land laws saved my family home. Highly recommended!', ta: 'சாகயராஜ் சார் என் சொத்து தகராற்றை அசாதாரண திறனோடு கையாண்டார். தமிழ்நாடு நில சட்டங்கள் பற்றிய அவரது ஆழமான அறிவு என் குடும்ப வீட்டைக் காப்பாற்றியது. மிகவும் பரிந்துரைக்கிறேன்!' }, stars: 5, avatar: 'R', color: '#f59e0b' },
  { name: 'Priya Sundar',  role: { en: 'IT Professional, Coimbatore', ta: 'IT நிபுணர், கோயம்புத்தூர்'}, text: { en: 'During my divorce proceedings, he was not just my lawyer but a pillar of support. He got me fair maintenance and custody with minimal stress.',              ta: 'என் விவாகரத்து வழக்கின் போது, அவர் வெறும் வக்கீல் மட்டுமல்ல, ஒரு தூண் போல் ஆதரவாக இருந்தார். குறைந்த மன அழுத்தத்துடன் நியாயமான ஜீவனாம்சமும் காவலும் பெற்றேன்.' }, stars: 5, avatar: 'P', color: '#ec4899' },
  { name: 'Murugan S.',    role: { en: 'Contractor, Madurai',         ta: 'ஒப்பந்ததாரர், மதுரை'      }, text: { en: 'Got anticipatory bail within 24 hours. His contacts and courtroom presence in Madras High Court are unmatched. True professional.',                            ta: '24 மணி நேரத்தில் ஊகிக்கப்பட்ட ஜாமீன் கிடைத்தது. மெட்ராஸ் உயர் நீதிமன்றத்தில் அவரது தொடர்புகளும் நீதிமன்ற முன்னிலையும் தனித்துவமானது.' }, stars: 5, avatar: 'M', color: '#3b82f6' },
  { name: 'Lakshmi Venkat',role: { en: 'Teacher, Salem',              ta: 'ஆசிரியை, சேலம்'           }, text: { en: 'My consumer case against a builder was won in just 6 months. Transparent fees, regular updates, and complete dedication to my case.',                          ta: 'கட்டிட ஒப்பந்தக்காரர் மீதான என் நுகர்வோர் வழக்கு 6 மாதத்தில் வெற்றி பெற்றது. வெளிப்படையான கட்டணம், தொடர் தகவல்கள் மற்றும் முழு அர்ப்பணிப்பு.' }, stars: 5, avatar: 'L', color: '#10b981' },
  { name: 'Arjun Nair',    role: { en: 'Startup Founder, Chennai',    ta: 'தொடக்கநிலை நிறுவனர், சென்னை'}, text: { en: 'Drafted all my company contracts and shareholder agreements flawlessly. His corporate law expertise helped us avoid costly mistakes.',                          ta: 'என் நிறுவன ஒப்பந்தங்கள் மற்றும் பங்குதாரர் உடன்படிக்கைகளை குறைபாடின்றி வரைந்தார். அவரது நிறுவன சட்ட நிபுணத்துவம் விலையுயர்ந்த தவறுகளை தவிர்க்க உதவியது.' }, stars: 5, avatar: 'A', color: '#8b5cf6' },
  { name: 'Kavitha Devi',  role: { en: 'Homemaker, Tirunelveli',      ta: 'இல்லத்தரசி, திருநெல்வேலி'  }, text: { en: 'He fought my domestic violence case bravely. Got us a protection order quickly. Very compassionate and professional at the same time.',                         ta: 'என் குடும்ப வன்முறை வழக்கை தைரியமாக போராடினார். விரைவாக பாதுகாப்பு உத்தரவு பெற்றுத் தந்தார். மிகவும் அன்பானவர் மற்றும் தொழில்முறையானவர்.' }, stars: 5, avatar: 'K', color: '#ef4444' },
];

const PROCESS = [
  { step: '01', en: { title: 'Free Consultation', desc: 'Share your legal issue. We listen, assess, and give you an honest evaluation — no strings attached.' }, ta: { title: 'இலவச ஆலோசனை', desc: 'உங்கள் சட்ட பிரச்சினையை பகிருங்கள். நாங்கள் கேட்கிறோம், மதிப்பிடுகிறோம், நேர்மையான மதிப்பீடு தருகிறோம் — எந்த கட்டுப்பாடும் இல்லை.' }, icon: MessageCircle, color: '#f59e0b' },
  { step: '02', en: { title: 'Case Analysis',     desc: 'Deep dive into facts, documents and precedents. We build a bulletproof strategy tailored to you.'    }, ta: { title: 'வழக்கு ஆய்வு',    desc: 'உண்மைகள், ஆவணங்கள், முன்மாதிரிகளை ஆழமாக ஆராய்கிறோம். உங்களுக்கான தனிப்பயனாக்கப்பட்ட உத்தியை உருவாக்குகிறோம்.' }, icon: BookOpen,     color: '#3b82f6' },
  { step: '03', en: { title: 'Legal Action',      desc: 'We file, argue, and fight for you in court with full force — keeping you informed at every stage.'    }, ta: { title: 'சட்ட நடவடிக்கை',  desc: 'நாங்கள் தாக்கல் செய்கிறோம், வாதிடுகிறோம், நீதிமன்றத்தில் உங்களுக்காக போராடுகிறோம் — ஒவ்வொரு கட்டத்திலும் தெரிவிக்கிறோம்.' }, icon: Gavel,        color: '#8b5cf6' },
  { step: '04', en: { title: 'Victory & Closure', desc: 'We pursue your case to its best possible conclusion, ensuring justice is served.'                      }, ta: { title: 'வெற்றி & தீர்வு',  desc: 'உங்கள் வழக்கை சிறந்த முடிவை நோக்கி நாங்கள் தொடர்கிறோம் — நீதி வழங்கப்படுவதை உறுதி செய்கிறோம்.' }, icon: CheckCircle,  color: '#10b981' },
];

const WHY_US = [
  { icon: Award,      en: { title: '25+ Years Expertise',    desc: 'Decades of courtroom experience across Tamil Nadu courts and Madras High Court.'   }, ta: { title: '25+ ஆண்டு நிபுணத்துவம்',  desc: 'தமிழ்நாடு நீதிமன்றங்கள் மற்றும் மெட்ராஸ் உயர் நீதிமன்றத்தில் பல தசாப்தங்கள் நீதிமன்ற அனுபவம்.' } },
  { icon: Shield,     en: { title: 'Client Confidentiality', desc: 'Your case details held in strict confidence. Complete privacy guaranteed.'           }, ta: { title: 'வாடிக்கையாளர் இரகசியம்',   desc: 'உங்கள் வழக்கு விவரங்கள் கடுமையான இரகசியத்தில் வைக்கப்படும். முழு தனியுரிமை உத்தரவாதம்.' } },
  { icon: Clock,      en: { title: '24/7 Availability',      desc: "Legal emergencies don't wait. Reach us any time — day or night."                    }, ta: { title: '24/7 கிடைக்கும்',            desc: 'சட்ட அவசரநிலைகள் காத்திருக்காது. எந்த நேரமும் — பகல் அல்லது இரவு — எங்களை தொடர்பு கொள்ளலாம்.' } },
  { icon: Handshake,  en: { title: 'Transparent Fees',       desc: 'No hidden charges. Clear fee structure discussed upfront before we begin.'           }, ta: { title: 'வெளிப்படையான கட்டணம்',       desc: 'மறைமுக கட்டணம் இல்லை. தொடங்குவதற்கு முன் தெளிவான கட்டண கட்டமைப்பு விவாதிக்கப்படும்.' } },
  { icon: Lightbulb,  en: { title: 'Strategic Approach',     desc: 'Every case gets a custom strategy — not a one-size-fits-all solution.'               }, ta: { title: 'மூலோபாய அணுகுமுறை',          desc: 'ஒவ்வொரு வழக்கும் தனிப்பயன் உத்தி பெறும் — ஒரே மாதிரி தீர்வு இல்லை.' } },
  { icon: TrendingUp, en: { title: 'High Success Rate',      desc: '98% success rate earned through relentless preparation and advocacy.'                }, ta: { title: 'உயர் வெற்றி விகிதம்',         desc: 'இடைவிடாத தயாரிப்பு மற்றும் வாதாட்டத்தின் மூலம் 98% வெற்றி விகிதம் பெறப்பட்டது.' } },
];

const MARQUEE_ITEMS = [
  '⚖ மெட்ராஸ் உயர் நீதிமன்றம்', '★ 25+ ஆண்டு பயிற்சி', '✦ குற்றவியல் பாதுகாப்பு', '◎ குடும்ப சட்ட நிபுணர்',
  '⬡ சொத்து தகராறுகள்', '★ 5000+ வழக்குகள் வெற்றி', '⚖ நிறுவன ஆலோசகர்', '✦ மனித உரிமைகள்',
  '◎ தமிழ்நாடு பார் கவுன்சில்', '★ சிவில் வழக்காடல்', '⬡ இலவச ஆலோசனை', '⚖ ஊகிக்கப்பட்ட ஜாமீன்',
  '⚖ மெட்ராஸ் உயர் நீதிமன்றம்', '★ 25+ ஆண்டு பயிற்சி', '✦ குற்றவியல் பாதுகாப்பு', '◎ குடும்ப சட்ட நிபுணர்',
  '⬡ சொத்து தகராறுகள்', '★ 5000+ வழக்குகள் வெற்றி', '⚖ நிறுவன ஆலோசகர்', '✦ மனித உரிமைகள்',
  '◎ தமிழ்நாடு பார் கவுன்சில்', '★ சிவில் வழக்காடல்', '⬡ இலவச ஆலோசனை', '⚖ ஊகிக்கப்பட்ட ஜாமீன்',
];

const BAR_DATA = [30, 50, 42, 70, 58, 88, 65, 80, 72, 96];

// ─── HOOKS ───────────────────────────────────────────────────────────────────

function useCounter(target: number, inView: boolean) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 40, damping: 15 });
  const [display, setDisplay] = useState(0);
  useEffect(() => { if (inView) mv.set(target); }, [inView, target, mv]);
  useEffect(() => spring.on('change', v => setDisplay(Math.round(v))), [spring]);
  return display;
}

function useTypewriter(en: string[], ta: string[], speed = 90) {
  const { lang } = useLang();
  const phrases = lang === 'ta' ? ta : en;
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [del, setDel] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // reset on lang change
  useEffect(() => { setText(''); setIdx(0); setDel(false); }, [lang]);

  useEffect(() => {
    const cur = phrases[idx];
    if (!del && text === cur) { timer.current = setTimeout(() => setDel(true), 2000); }
    else if (del && text === '') { setDel(false); setIdx(i => (i + 1) % phrases.length); }
    else { timer.current = setTimeout(() => setText(del ? text.slice(0, -1) : cur.slice(0, text.length + 1)), del ? speed / 2 : speed); }
    return () => clearTimeout(timer.current);
  }, [text, del, idx, phrases, speed]);

  return text;
}

// ─── PARTICLES ───────────────────────────────────────────────────────────────

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

// ─── LEGAL DASHBOARD ─────────────────────────────────────────────────────────

const FLOAT_BADGES_EN = [
  { text: '⚖ Criminal Law',  pos: 'top-0 -left-10',     grad: 'from-red-500/20 to-orange-500/20',   border: 'border-red-500/30',    color: 'text-red-300',    anim: 'badgeFloat',  delay: '0s'   },
  { text: '◎ Family Law',    pos: 'top-6 -right-8',      grad: 'from-purple-500/20 to-pink-500/20',  border: 'border-purple-500/30', color: 'text-purple-300', anim: 'badgeFloat2', delay: '0.6s' },
  { text: '✦ Property Law',  pos: '-bottom-4 -left-8',   grad: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/30',  color: 'text-amber-300',  anim: 'badgeFloat3', delay: '1s'   },
  { text: '⬡ Civil Law',     pos: 'bottom-10 -right-10', grad: 'from-blue-500/20 to-cyan-500/20',    border: 'border-blue-500/30',   color: 'text-blue-300',   anim: 'badgeFloat',  delay: '1.5s' },
  { text: '★ High Court',    pos: 'top-1/2 -left-12',    grad: 'from-green-500/20 to-teal-500/20',   border: 'border-green-500/30',  color: 'text-green-300',  anim: 'badgeFloat2', delay: '0.3s' },
];
const FLOAT_BADGES_TA = [
  { text: '⚖ குற்றவியல்',    pos: 'top-0 -left-10',     grad: 'from-red-500/20 to-orange-500/20',   border: 'border-red-500/30',    color: 'text-red-300',    anim: 'badgeFloat',  delay: '0s'   },
  { text: '◎ குடும்ப சட்டம்',pos: 'top-6 -right-8',      grad: 'from-purple-500/20 to-pink-500/20',  border: 'border-purple-500/30', color: 'text-purple-300', anim: 'badgeFloat2', delay: '0.6s' },
  { text: '✦ சொத்து சட்டம்', pos: '-bottom-4 -left-8',   grad: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/30',  color: 'text-amber-300',  anim: 'badgeFloat3', delay: '1s'   },
  { text: '⬡ சிவில் சட்டம்', pos: 'bottom-10 -right-10', grad: 'from-blue-500/20 to-cyan-500/20',    border: 'border-blue-500/30',   color: 'text-blue-300',   anim: 'badgeFloat',  delay: '1.5s' },
  { text: '★ உயர் நீதிமன்றம்',pos: 'top-1/2 -left-12',   grad: 'from-green-500/20 to-teal-500/20',   border: 'border-green-500/30',  color: 'text-green-300',  anim: 'badgeFloat2', delay: '0.3s' },
];

function LegalDashboard() {
  const { lang } = useLang();
  const FLOAT_BADGES = lang === 'ta' ? FLOAT_BADGES_TA : FLOAT_BADGES_EN;
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
            <p className="mono-tag text-[10px] text-slate-500 mb-1">{lang === 'ta' ? 'வழக்கு செயல்திறன்' : 'CASE PERFORMANCE'}</p>
            <p className="text-white font-semibold text-sm">{lang === 'ta' ? 'வெற்றி விகிதம் — கடந்த 10 ஆண்டுகள்' : 'Win Rate — Last 10 Years'}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            {lang === 'ta' ? 'செயலில்' : 'Active'}
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
          {(lang === 'ta'
            ? [{label:'வெற்றி விகிதம்',value:'98%'},{label:'வழக்குகள்',value:'5000+'},{label:'ஆண்டுகள்',value:'25+'}]
            : [{label:'Win Rate',value:'98%'},{label:'Cases',value:'5K+'},{label:'Years',value:'25+'}]
          ).map((s, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
              <p className="text-[10px] text-slate-500 mb-1 mono-tag">{s.label}</p>
              <p className="text-base font-bold gold-shimmer">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
          {(lang === 'ta'
            ? [{l:'மெட்ராஸ் உ.நீ.',v:'பதிவு செய்யப்பட்டது'},{l:'வாடிக்கையாளர்',v:'3000+'},{l:'சட்டப் பிரிவுகள்',v:'6'}]
            : [{l:'Madras H.C.',v:'Active Enroll'},{l:'Clients',v:'3000+'},{l:'Domains',v:'6 Areas'}]
          ).map((x, i) => (
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

// ─── LANG TOGGLE ─────────────────────────────────────────────────────────────

function LangToggle() {
  const { lang, toggle } = useLang();
  return (
    <button onClick={toggle}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 transition-all"
      title="Switch Language">
      <span className={`text-xs font-bold transition-colors ${lang === 'en' ? 'text-amber-400' : 'text-slate-400'}`}>EN</span>
      <span className="text-slate-600 text-xs">/</span>
      <span className={`text-xs font-bold transition-colors ${lang === 'ta' ? 'text-amber-400' : 'text-slate-400'}`}>தமிழ்</span>
    </button>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar() {
  const { lang } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = lang === 'ta'
    ? [['முகப்பு','home'],['பற்றி','about'],['சேவைகள்','practice'],['செயல்முறை','process'],['கருத்துகள்','testimonials'],['தொடர்பு','contact']]
    : [['Home','home'],['About','about'],['Practice','practice'],['Process','process'],['Testimonials','testimonials'],['Contact','contact']];

  const scrollTo = useCallback((id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-glass' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('home')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <Scale size={20} className="text-slate-900" />
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm leading-tight">
              {lang === 'ta' ? 'வக்கீல். சாகயராஜ்' : 'Adv. Sahayaraj'}
            </div>
            <div className="mono-tag text-[9px] text-amber-400/70">
              {lang === 'ta' ? '// மெட்ராஸ் உயர் நீதிமன்றம்' : '// MADRAS HIGH COURT'}
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {links.map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)} className="text-slate-400 hover:text-amber-400 text-sm font-medium transition-colors">{label}</button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LangToggle />
          <a href="https://wa.me/919442760535" target="_blank" rel="noreferrer"
            className="btn-gold flex px-5 py-2.5 rounded-full text-sm items-center gap-2">
            <span className="flex items-center gap-2">
              <Phone size={14} />
              {lang === 'ta' ? 'இலவச ஆலோசனை' : 'Free Consultation'}
            </span>
          </a>
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(o => !o)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden navbar-glass border-t border-amber-400/10 px-6 pb-4">
            {links.map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} className="block w-full text-left py-3 text-slate-300 hover:text-amber-400 text-sm border-b border-white/5">{label}</button>
            ))}
            <div className="flex items-center gap-3 mt-4">
              <LangToggle />
              <a href="https://wa.me/919442760535" target="_blank" rel="noreferrer"
                className="flex-1 btn-gold flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm">
                <span className="flex items-center gap-2"><Phone size={14} />{lang === 'ta' ? 'இலவச ஆலோசனை' : 'Free Consultation'}</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  const { lang } = useLang();
  const typed = useTypewriter(
    ['Fight Your Case', 'Protect Your Rights', 'Win in Court', 'Defend Your Family', 'Secure Your Property'],
    ['உங்கள் வழக்கை போரிடுங்கள்', 'உங்கள் உரிமைகளை காக்கவும்', 'நீதிமன்றத்தில் வெல்லுங்கள்', 'குடும்பத்தை பாதுகாக்கவும்', 'சொத்தை பாதுகாக்கவும்']
  );

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden grid-bg pt-20">
      <div className="orb w-[500px] h-[500px] bg-amber-500"  style={{ top: '-8%', right: '-10%', animationDuration: '14s', opacity: 0.18 }} />
      <div className="orb w-[350px] h-[350px] bg-violet-600" style={{ bottom: '5%', left: '-8%', animationDuration: '18s', animationDelay: '-6s', opacity: 0.14 }} />
      <div className="orb w-[250px] h-[250px] bg-cyan-500"   style={{ top: '40%', left: '35%', animationDuration: '11s', animationDelay: '-3s', opacity: 0.07 }} />
      <Particles />
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E")` }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-2 mb-6 section-label">
              <span className="blink-dot" />
              <span className="mono-tag">{lang === 'ta' ? '// மெட்ராஸ் உயர் நீதிமன்ற வக்கீல்' : '// Madras High Court Advocate'}</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">{lang === 'ta' ? 'நாங்கள் உங்களுக்கு' : 'We Help You'}</span><br />
              <span className="gold-shimmer inline-block min-h-[1.1em]">
                {typed}
                <span style={{ display: 'inline-block', width: 3, height: '0.85em', background: '#F59E0B', verticalAlign: 'middle', marginLeft: 2, animation: 'twBlink 0.8s ease-in-out infinite' }} />
              </span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-4">
              {lang === 'ta'
                ? 'குற்றவியல், சிவில், குடும்பம் மற்றும் நிறுவன சட்டத்தில் நிபுணர் சட்ட பிரதிநிதித்துவம். தமிழ்நாடு நீதிமன்றங்களில் நீதிக்கான 25+ ஆண்டு அர்ப்பணிப்பு.'
                : 'Expert legal representation in Criminal, Civil, Family & Corporate Law. 25+ years of unwavering dedication to justice in Tamil Nadu courts.'}
            </p>
            <p className="text-amber-400/80 text-base mb-10 font-display italic">
              "நீதி தாமதமாகலாம், ஆனால் மறுக்கப்படாது"
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a href="https://wa.me/919442760535?text=Hello%20Advocate%20Sahayaraj,%20I%20need%20legal%20consultation"
                target="_blank" rel="noreferrer"
                className="btn-gold flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base">
                <span className="flex items-center gap-2">
                  <MessageCircle size={18} />
                  {lang === 'ta' ? 'இலவச ஆலோசனை' : 'Free Consultation'}
                </span>
              </a>
              <button onClick={() => document.getElementById('practice')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base border border-white/20 text-white hover:border-amber-400/50 hover:text-amber-400 transition-all">
                {lang === 'ta' ? 'எங்கள் சேவைகள்' : 'Our Practice Areas'} <ChevronRight size={16} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-t border-white/5 pt-6">
              <div className="flex items-center gap-1"><span className="text-amber-400 font-bold">★★★★★</span><span className="ml-1">{lang === 'ta' ? '5.0 மதிப்பீடு' : '5.0 Rating'}</span></div>
              <div className="w-px h-4 bg-white/10" />
              <span>{lang === 'ta' ? '3000+ வாடிக்கையாளர்கள்' : '3000+ Clients Served'}</span>
              <div className="w-px h-4 bg-white/10" />
              <span>{lang === 'ta' ? '98% வெற்றி விகிதம்' : '98% Success Rate'}</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.25 }}
            className="hidden lg:flex justify-center items-center">
            <LegalDashboard />
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 text-xs">
        <span className="mono-tag text-[10px]">{lang === 'ta' ? 'கீழே உருட்டு' : 'scroll'}</span>
        <div className="w-px h-10 bg-gradient-to-b from-amber-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

// ─── MARQUEE ─────────────────────────────────────────────────────────────────

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

// ─── STATS ───────────────────────────────────────────────────────────────────

function StatCard({ value, suffix, en: label_en, ta: label_ta, icon: Icon }: typeof STATS[0]) {
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useCounter(value, inView);
  return (
    <div ref={ref} className="glass rounded-2xl p-8 text-center group hover:border-amber-400/30 transition-all duration-300 hover:-translate-y-1">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon size={24} className="text-amber-400" />
      </div>
      <div className="font-display text-5xl font-bold text-white mb-2">{count.toLocaleString()}{suffix}</div>
      <div className="text-white font-semibold text-sm mb-1">{lang === 'ta' ? label_ta : label_en}</div>
    </div>
  );
}

function Stats() {
  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(s => <StatCard key={s.en} {...s} />)}
        </div>
      </div>
    </section>
  );
}

// ─── PRACTICE AREAS ──────────────────────────────────────────────────────────

function PracticeAreas() {
  const { lang } = useLang();
  return (
    <section id="practice" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="mono-tag text-[11px] text-amber-400/70 mb-3">{lang === 'ta' ? '// எங்கள் நிபுணத்துவம்' : '// OUR EXPERTISE'}</div>
          <div className="section-label mx-auto mb-4 inline-flex"><Scale size={12} />{lang === 'ta' ? 'சட்டப் பிரிவுகள்' : 'Practice Areas'}</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            {lang === 'ta' ? <>நாங்கள் <span className="gold-shimmer">நிபுணத்துவம்</span> பெற்ற சட்ட சேவைகள்</> : <>Legal Services We <span className="gold-shimmer">Specialize In</span></>}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {lang === 'ta' ? 'அனைத்து முக்கிய சட்ட பிரிவுகளிலும் விரிவான சட்ட சேவைகள் — அனுபவத்துடன் போராடி, உத்தியுடன் வெல்லப்படுகிறது.' : 'Comprehensive legal services across all major domains — fought with experience and won with strategy.'}
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRACTICE_AREAS.map((area, i) => {
            const Icon = area.icon;
            const d = area[lang];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`svc-card-adv ${area.cls} glass rounded-2xl p-8 cursor-pointer group transition-all duration-300 hover:-translate-y-1`}
                style={{ background: area.bg, borderColor: area.border }}>
                <style>{`.svc-card-adv.${area.cls}::before{background:${area.leftBg}}`}</style>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ background: `${area.color}20` }}>
                  <Icon size={28} style={{ color: area.color }} />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">{d.label}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{d.desc}</p>
                <div className="flex items-center gap-2 mt-6 text-sm font-medium" style={{ color: area.color }}>
                  <span className="svc-arrow">{lang === 'ta' ? 'ஆலோசனை பெறவும்' : 'Consult Now'}</span>
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

// ─── ABOUT ───────────────────────────────────────────────────────────────────

function About() {
  const { lang } = useLang();
  const milestones = [
    { year: '1999', en: 'Enrolled at Bar Council of Tamil Nadu',                        ta: 'தமிழ்நாடு பார் கவுன்சிலில் பதிவு செய்யப்பட்டது'          },
    { year: '2003', en: 'First landmark criminal case victory at Sessions Court',        ta: 'செஷன்ஸ் கோர்ட்டில் முதல் குற்றவியல் வழக்கு வெற்றி'        },
    { year: '2008', en: 'Elevated to Madras High Court practice',                        ta: 'மெட்ராஸ் உயர் நீதிமன்ற வழக்காட்டுக்கு உயர்த்தப்பட்டது'   },
    { year: '2015', en: 'Recognized for outstanding contribution in family law',          ta: 'குடும்ப சட்டத்தில் சிறந்த பங்களிப்புக்காக அங்கீகரிக்கப்பட்டது'},
    { year: '2020', en: 'Appointed as panel advocate for leading corporates',             ta: 'முன்னணி நிறுவனங்களுக்கு குழு வக்கீலாக நியமிக்கப்பட்டது'    },
    { year: '2024', en: '5000+ cases successfully closed',                               ta: '5000+ வழக்குகள் வெற்றிகரமாக முடிக்கப்பட்டன'                },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-amber-600" style={{ top: '20%', right: '5%', opacity: 0.1 }} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="mono-tag text-[11px] text-amber-400/70 mb-3">{lang === 'ta' ? '// வக்கீல் பற்றி' : '// ABOUT THE ADVOCATE'}</div>
            <div className="section-label mb-4 inline-flex"><Award size={12} />{lang === 'ta' ? '25+ ஆண்டு அனுபவம்' : '25+ Years Legacy'}</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              {lang === 'ta' ? <><span className="gold-shimmer">நீதி</span>யின் மரபு</> : <>A Legacy of <span className="gold-shimmer">Justice</span></>}
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              {lang === 'ta'
                ? 'வக்கீல். சாகயராஜ் மெட்ராஸ் உயர் நீதிமன்றம் மற்றும் தமிழ்நாடு முழுவதும் கீழ் நீதிமன்றங்களில் 25 ஆண்டுகளுக்கும் மேலான அனுபவம் வாய்ந்த சிறந்த சட்ட நடைமுறையாளர். கூர்மையான சட்ட அறிவு, மூலோபாய சிந்தனை மற்றும் இடைவிடாத வாதாட்டத்திற்கு பெயர் பெற்றவர்.'
                : 'Advocate Sahayaraj is a distinguished legal practitioner with over 25 years of experience in the Madras High Court and subordinate courts across Tamil Nadu. Known for sharp legal acumen, strategic thinking, and relentless advocacy.'}
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              {lang === 'ta'
                ? 'சிக்கலான குற்றவியல் வழக்குகள் முதல் நுட்பமான குடும்ப விவகாரங்கள், சொத்து தகராறுகள் முதல் நிறுவன ஒப்பந்தங்கள் வரை — அவரது நிபுணத்துவம் ஒவ்வொரு வாடிக்கையாளருக்கும் மிக சிறந்த பிரதிநிதித்துவத்தை உறுதி செய்கிறது.'
                : 'From complex criminal trials to sensitive family matters, property disputes to corporate agreements — his breadth of expertise ensures every client receives the most effective representation possible.'}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { en_l: 'Education',   ta_l: 'கல்வி',         en_v: 'B.L., M.L.',          ta_v: 'B.L., M.L.'              },
                { en_l: 'Court',       ta_l: 'நீதிமன்றம்',    en_v: 'Madras High Court',    ta_v: 'மெட்ராஸ் உயர் நீதிமன்றம்'},
                { en_l: 'Bar Council', ta_l: 'பார் கவுன்சில்', en_v: 'Tamil Nadu',           ta_v: 'தமிழ்நாடு'               },
                { en_l: 'Languages',   ta_l: 'மொழிகள்',       en_v: 'Tamil, English',       ta_v: 'தமிழ், ஆங்கிலம்'         },
              ].map((item, i) => (
                <div key={i} className="glass rounded-xl p-4 hover:border-amber-400/20 transition-all">
                  <div className="mono-tag text-[10px] text-amber-400 mb-1">{lang === 'ta' ? item.ta_l : item.en_l}</div>
                  <div className="text-white text-sm font-medium">{lang === 'ta' ? item.ta_v : item.en_v}</div>
                </div>
              ))}
            </div>
            <a href="https://wa.me/919442760535" target="_blank" rel="noreferrer"
              className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-full">
              <span className="flex items-center gap-2"><Phone size={16} />{lang === 'ta' ? 'வக்கீலிடம் பேசுங்கள்' : 'Talk to the Advocate'}</span>
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="relative pl-8">
              <div className="timeline-line" style={{ left: 0, top: 0, bottom: 0 }} />
              {milestones.map((m, i) => (
                <motion.div key={m.year} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                  className="relative mb-8 last:mb-0">
                  <div className="absolute -left-[42px] w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <CheckCircle size={14} className="text-slate-900" />
                  </div>
                  <div className="glass rounded-xl p-5 hover:border-amber-400/30 transition-all hover:-translate-x-1">
                    <div className="mono-tag text-[11px] text-amber-400 mb-1">{m.year}</div>
                    <div className="text-white text-sm">{lang === 'ta' ? m.ta : m.en}</div>
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

// ─── WHY US ──────────────────────────────────────────────────────────────────

function WhyUs() {
  const { lang } = useLang();
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="mono-tag text-[11px] text-amber-400/70 mb-3">{lang === 'ta' ? '// ஏன் எங்களை தேர்ந்தெடுக்கணும்' : '// WHY CHOOSE US'}</div>
          <div className="section-label mx-auto mb-4 inline-flex"><Shield size={12} />{lang === 'ta' ? 'நன்மைகள்' : 'The Advantage'}</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            {lang === 'ta' ? <><span className="gold-shimmer">சாகயராஜ்</span> நன்மை</> : <>The <span className="gold-shimmer">Sahayaraj</span> Advantage</>}
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_US.map((item, i) => {
            const Icon = item.icon;
            const d = item[lang];
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-8 group hover:border-amber-400/30 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon size={22} className="text-amber-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-3">{d.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{d.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── PROCESS ─────────────────────────────────────────────────────────────────

function Process() {
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <section id="process" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="mono-tag text-[11px] text-amber-400/70 mb-3">{lang === 'ta' ? '// எப்படி செயல்படுகிறோம்' : '// HOW IT WORKS'}</div>
          <div className="section-label mx-auto mb-4 inline-flex"><ChevronRight size={12} />{lang === 'ta' ? 'எங்கள் செயல்முறை' : 'Our Process'}</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            {lang === 'ta' ? <>முதல் அழைப்பிலிருந்து <span className="gold-shimmer">இறுதி தீர்ப்பு</span> வரை</> : <>From First Call to <span className="gold-shimmer">Final Verdict</span></>}
          </h2>
        </motion.div>
        <div ref={ref} className="grid md:grid-cols-4 gap-6 relative">
          {inView && (
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px z-0">
              <div className="process-line w-full h-full" style={{ background: 'linear-gradient(90deg,#f59e0b,#8b5cf6,#10b981)' }} />
            </div>
          )}
          {PROCESS.map((step, i) => {
            const Icon = step.icon;
            const d = step[lang];
            return (
              <motion.div key={step.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative glass rounded-2xl p-8 text-center group hover:-translate-y-2 transition-all duration-300 z-10">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                  style={{ background: `linear-gradient(135deg,${step.color},${step.color}99)` }}>
                  <Icon size={26} className="text-white" />
                </div>
                <div className="font-bold text-[28px] mb-3" style={{ color: `${step.color}25` }}>{step.step}</div>
                <h3 className="text-white font-semibold text-lg mb-3">{d.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{d.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────

function Testimonials() {
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(timer);
  }, []);
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="orb w-80 h-80 bg-purple-600" style={{ bottom: '10%', left: '10%', opacity: 0.08 }} />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="mono-tag text-[11px] text-amber-400/70 mb-3">{lang === 'ta' ? '// வாடிக்கையாளர் கதைகள்' : '// CLIENT STORIES'}</div>
          <div className="section-label mx-auto mb-4 inline-flex"><Star size={12} />{lang === 'ta' ? 'கருத்துகள்' : 'Testimonials'}</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            {lang === 'ta' ? <>வாடிக்கையாளர்கள் என்ன <span className="gold-shimmer">சொல்கிறார்கள்</span></> : <>What Clients <span className="gold-shimmer">Say</span></>}
          </h2>
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto glass rounded-3xl p-10 text-center mb-8">
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: TESTIMONIALS[active].stars }).map((_, i) => <Star key={i} size={20} className="fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-slate-300 text-lg leading-relaxed italic mb-8">"{TESTIMONIALS[active].text[lang]}"</p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-slate-900 font-bold text-lg" style={{ background: TESTIMONIALS[active].color }}>{TESTIMONIALS[active].avatar}</div>
              <div className="text-left">
                <div className="text-white font-semibold">{TESTIMONIALS[active].name}</div>
                <div className="text-slate-400 text-sm">{TESTIMONIALS[active].role[lang]}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center gap-2 mb-12">
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${i === active ? 'w-8 h-2 bg-amber-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              onClick={() => setActive(i)}
              className={`glass rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${i === active ? 'border-amber-400/40' : 'hover:border-white/20'}`}>
              <div className="flex gap-1 mb-3">{Array.from({ length: t.stars }).map((_, j) => <Star key={j} size={12} className="fill-amber-400 text-amber-400" />)}</div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">"{t.text[lang]}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-900" style={{ background: t.color }}>{t.avatar}</div>
                <div>
                  <div className="text-white text-xs font-semibold">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role[lang]}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA BANNER ──────────────────────────────────────────────────────────────

function CtaBanner() {
  const { lang } = useLang();
  const areas = lang === 'ta'
    ? ['குற்றவியல் பாதுகாப்பு','குடும்ப சட்டம்','சொத்து தகராறுகள்','சிவில் வழக்குகள்','நிறுவன சட்டம்','மனித உரிமைகள்']
    : ['Criminal Defense','Family Law','Property Disputes','Civil Cases','Corporate Law','Human Rights'];
  return (
    <section className="py-16 relative">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-12 text-center"
          style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(245,158,11,0.1) 0%, rgba(139,92,246,0.08) 50%, transparent 80%)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div className="orb w-60 h-60 bg-amber-500" style={{ top: '-30%', left: '-10%', opacity: 0.12 }} />
          <div className="orb w-60 h-60 bg-violet-600" style={{ bottom: '-30%', right: '-10%', opacity: 0.1 }} />
          <div className="relative z-10">
            <div className="section-label mx-auto mb-4 inline-flex"><Scale size={12} />{lang === 'ta' ? 'இப்போதே உதவி பெறுங்கள்' : 'Get Help Now'}</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              {lang === 'ta' ? <>உங்கள் சட்ட பிரச்சினைக்கு <span className="gold-shimmer">தீர்வு இருக்கிறது</span></> : <>Your Legal Problem Has <span className="gold-shimmer">A Solution</span></>}
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
              {lang === 'ta' ? 'காத்திருக்காதீர்கள் — சட்ட விவகாரங்களில் ஒவ்வொரு மணி நேரமும் முக்கியம். இன்றே இலவச ஆலோசனை பெறுங்கள்.' : "Don't wait — every hour matters in legal matters. Get a free consultation today."}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {areas.map(ta => <span key={ta} className="bg-amber-400/10 border border-amber-400/20 text-amber-400/80 text-xs px-4 py-2 rounded-full mono-tag">{ta}</span>)}
            </div>
            <a href="https://wa.me/919442760535?text=Hello%20Advocate%20Sahayaraj,%20I%20need%20legal%20consultation"
              target="_blank" rel="noreferrer"
              className="btn-gold inline-flex items-center gap-2 px-10 py-4 rounded-full text-base">
              <span className="flex items-center gap-2">
                <MessageCircle size={18} />
                {lang === 'ta' ? 'இலவச ஆலோசனை தொடங்குங்கள் →' : 'Start Free Consultation →'}
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function Contact() {
  const { lang } = useLang();
  const [form, setForm] = useState({ name: '', phone: '', issue: '', message: '' });
  const handleWA = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Advocate Sahayaraj,\n\nName: ${form.name}\nPhone: ${form.phone}\nLegal Issue: ${form.issue}\n\nMessage: ${form.message}`;
    window.open(`https://wa.me/919442760535?text=${encodeURIComponent(text)}`, '_blank');
  };
  return (
    <section id="contact" className="py-24 relative">
      <div className="orb w-96 h-96 bg-amber-500" style={{ top: '10%', left: '5%', opacity: 0.07 }} />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="mono-tag text-[11px] text-amber-400/70 mb-3">{lang === 'ta' ? '// தொடர்பு கொள்ளுங்கள்' : '// GET IN TOUCH'}</div>
          <div className="section-label mx-auto mb-4 inline-flex"><Phone size={12} />{lang === 'ta' ? 'தொடர்பு' : 'Contact Us'}</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            {lang === 'ta' ? <>இலவச <span className="gold-shimmer">ஆலோசனை</span> பதிவு செய்யுங்கள்</> : <>Book Your Free <span className="gold-shimmer">Consultation</span></>}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {lang === 'ta' ? 'உங்கள் சட்ட கவலையை பகிருங்கள். 2 மணி நேரத்தில் பதில் அளிப்போம்.' : "Share your legal concern. We'll respond within 2 hours."}
          </p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <form onSubmit={handleWA} className="glass rounded-3xl p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mono-tag text-[10px] text-slate-400 mb-2 block">{lang === 'ta' ? 'உங்கள் பெயர்' : 'YOUR NAME'}</label>
                  <input type="text" required placeholder={lang === 'ta' ? 'முழு பெயர்' : 'Full Name'} className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="mono-tag text-[10px] text-slate-400 mb-2 block">{lang === 'ta' ? 'தொலைபேசி எண்' : 'PHONE NUMBER'}</label>
                  <input type="tel" required placeholder="+91 XXXXX XXXXX" className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="mono-tag text-[10px] text-slate-400 mb-2 block">{lang === 'ta' ? 'சட்ட பிரச்சினை வகை' : 'TYPE OF LEGAL ISSUE'}</label>
                <select required className="form-input" value={form.issue} onChange={e => setForm(f => ({ ...f, issue: e.target.value }))} style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <option value="" style={{ background: '#02020F' }}>{lang === 'ta' ? 'சட்ட பிரிவு தேர்ந்தெடுக்கவும்' : 'Select area of law'}</option>
                  {PRACTICE_AREAS.map((a, i) => <option key={i} value={a[lang].label} style={{ background: '#02020F' }}>{a[lang].label}</option>)}
                </select>
              </div>
              <div>
                <label className="mono-tag text-[10px] text-slate-400 mb-2 block">{lang === 'ta' ? 'பிரச்சினையை விவரிக்கவும்' : 'DESCRIBE YOUR ISSUE'}</label>
                <textarea required rows={4} placeholder={lang === 'ta' ? 'உங்கள் சட்ட விவகாரத்தை சுருக்கமாக விவரிக்கவும்...' : 'Briefly describe your legal matter...'} className="form-input resize-none" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <button type="submit" className="btn-gold w-full flex items-center justify-center gap-2 py-4 rounded-full text-base">
                <span className="flex items-center gap-2">
                  <MessageCircle size={18} />
                  {lang === 'ta' ? 'WhatsApp மூலம் அனுப்பவும் →' : 'Send via WhatsApp →'}
                </span>
              </button>
              <p className="text-slate-600 mono-tag text-[10px] text-center">
                {lang === 'ta' ? '// உங்கள் செய்தியுடன் WhatsApp திறக்கும்' : '// opens WhatsApp with your message pre-filled'}
              </p>
            </form>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
            {[
              { icon: Phone,  en_l: 'CALL / WHATSAPP', ta_l: 'அழைப்பு / WHATSAPP', value: '+91 94427 60535',        en_s: 'Available 9 AM – 9 PM',       ta_s: 'காலை 9 – இரவு 9 கிடைக்கும்', color: '#10b981', href: 'tel:+919442760535'              },
              { icon: Mail,   en_l: 'EMAIL',            ta_l: 'மின்னஞ்சல்',          value: 'adv.sahayaraj@gmail.com',en_s: 'Reply within 24 hours',       ta_s: '24 மணி நேரத்தில் பதில்',       color: '#3b82f6', href: 'mailto:adv.sahayaraj@gmail.com' },
              { icon: MapPin, en_l: 'OFFICE',           ta_l: 'அலுவலகம்',            value: lang === 'ta' ? 'உயர் நீதிமன்ற வளாகம்' : 'High Court Complex', en_s: 'Chennai — 600 104, Tamil Nadu', ta_s: 'சென்னை — 600 104, தமிழ்நாடு', color: '#f59e0b', href: '#'                              },
              { icon: Clock,  en_l: 'HOURS',            ta_l: 'நேரம்',               value: lang === 'ta' ? 'திங்கள் – சனி' : 'Monday – Saturday',          en_s: '10:00 AM – 7:00 PM',          ta_s: 'காலை 10:00 – மாலை 7:00',      color: '#8b5cf6', href: '#'                              },
            ].map(({ icon: Icon, en_l, ta_l, value, en_s, ta_s, color, href }) => (
              <a key={en_l} href={href}
                className="flex items-start gap-5 glass rounded-2xl p-6 hover:border-white/20 transition-all group hover:-translate-x-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <div className="mono-tag text-[10px] text-slate-500 mb-1">{lang === 'ta' ? ta_l : en_l}</div>
                  <div className="text-white font-semibold text-sm">{value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{lang === 'ta' ? ta_s : en_s}</div>
                </div>
              </a>
            ))}
            <div className="glass rounded-2xl overflow-hidden h-44 flex items-center justify-center relative">
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="relative text-center">
                <MapPin size={32} className="text-amber-400 mx-auto mb-2" />
                <p className="text-slate-400 text-sm font-semibold">{lang === 'ta' ? 'மெட்ராஸ் உயர் நீதிமன்ற வளாகம்' : 'Madras High Court Complex'}</p>
                <p className="mono-tag text-[10px] text-slate-600 mt-1">// {lang === 'ta' ? 'சென்னை, தமிழ்நாடு' : 'Chennai, Tamil Nadu'}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  const { lang } = useLang();
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
                <div className="font-display font-bold text-white">{lang === 'ta' ? 'வக்கீல். சாகயராஜ்' : 'Adv. Sahayaraj'}</div>
                <div className="mono-tag text-[9px] text-amber-400/60">// B.L., M.L. — {lang === 'ta' ? 'மெட்ராஸ் உயர் நீதிமன்றம்' : 'MADRAS HIGH COURT'}</div>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              {lang === 'ta' ? 'நேர்மை, நிபுணத்துவம் மற்றும் அன்புடன் நீதி வழங்குவதில் அர்ப்பணிப்பு. உங்கள் சட்ட உரிமைகள் எங்கள் முன்னுரிமை.' : 'Dedicated to delivering justice with integrity, expertise, and compassion. Your legal rights are our priority.'}
            </p>
            <p className="text-amber-400/50 font-display italic text-sm mt-4">"நீதியை நோக்கி, உண்மையுடன்"</p>
          </div>
          <div>
            <h4 className="mono-tag text-[11px] text-white mb-4">{lang === 'ta' ? 'சட்டப் பிரிவுகள்' : 'PRACTICE AREAS'}</h4>
            <ul className="space-y-2">
              {PRACTICE_AREAS.map((a, i) => <li key={i}><span className="text-slate-500 text-sm hover:text-amber-400 cursor-pointer transition-colors">{a[lang].label}</span></li>)}
            </ul>
          </div>
          <div>
            <h4 className="mono-tag text-[11px] text-white mb-4">{lang === 'ta' ? 'தொடர்பு' : 'CONTACT'}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-500 text-sm"><Phone size={14} className="text-amber-400" /> +91 94427 60535</li>
              <li className="flex items-center gap-2 text-slate-500 text-sm"><Mail size={14} className="text-amber-400" /> adv.sahayaraj@gmail.com</li>
              <li className="flex items-start gap-2 text-slate-500 text-sm"><MapPin size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />{lang === 'ta' ? 'உயர் நீதிமன்ற வளாகம், சென்னை' : 'High Court Complex, Chennai'}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 mono-tag text-[10px]">© 2024 {lang === 'ta' ? 'வக்கீல். சாகயராஜ். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டுள்ளன.' : 'Advocate Sahayaraj. All rights reserved.'}</p>
          <p className="text-slate-600 mono-tag text-[10px]">{lang === 'ta' ? 'தமிழ்நாடு பார் கவுன்சில் | மெட்ராஸ் உயர் நீதிமன்றம்' : 'Bar Council of Tamil Nadu | Madras High Court'}</p>
        </div>
      </div>
    </footer>
  );
}

// ─── WHATSAPP FLOAT ──────────────────────────────────────────────────────────

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

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [lang, setLang] = useState<Lang>('en');
  const toggle = useCallback(() => setLang(l => l === 'en' ? 'ta' : 'en'), []);

  return (
    <LangCtx.Provider value={{ lang, toggle }}>
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
    </LangCtx.Provider>
  );
}
