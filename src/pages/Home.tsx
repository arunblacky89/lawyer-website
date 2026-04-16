import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import {
  Scale, Gavel, Heart, Building2, Home as HomeIcon, Globe,
  Phone, Mail, MapPin, ChevronRight, Star, Award, Users,
  Shield, Clock, CheckCircle, Menu, X, MessageCircle,
  BookOpen, Handshake, TrendingUp, Lightbulb, FileText, ArrowRight
} from 'lucide-react';

// ─── DATA ───────────────────────────────────────────────────────────────────

const PRACTICE_AREAS = [
  {
    icon: Gavel,
    label: 'Criminal Law',
    tamil: 'குற்றவியல் சட்டம்',
    desc: 'Bail applications, trial defense, anticipatory bail, FIR quashing, and appeals in criminal matters.',
    color: '#ef4444',
    cls: 'card-criminal',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.25)',
  },
  {
    icon: Scale,
    label: 'Civil Law',
    tamil: 'சிவில் சட்டம்',
    desc: 'Contract disputes, injunctions, recovery suits, declaratory suits and civil appeals.',
    color: '#3b82f6',
    cls: 'card-civil',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.25)',
  },
  {
    icon: Heart,
    label: 'Family Law',
    tamil: 'குடும்ப சட்டம்',
    desc: 'Divorce, child custody, maintenance, adoption, matrimonial disputes handled with care.',
    color: '#8b5cf6',
    cls: 'card-family',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.25)',
  },
  {
    icon: Building2,
    label: 'Corporate Law',
    tamil: 'நிறுவன சட்டம்',
    desc: 'Company formation, agreements, compliance, mergers, and commercial litigation.',
    color: '#10b981',
    cls: 'card-corporate',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.25)',
  },
  {
    icon: HomeIcon,
    label: 'Property Law',
    tamil: 'சொத்து சட்டம்',
    desc: 'Title disputes, partition suits, encumbrance checks, registration, and land acquisition matters.',
    color: '#f59e0b',
    cls: 'card-property',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
  },
  {
    icon: Globe,
    label: 'Human Rights',
    tamil: 'மனித உரிமைகள்',
    desc: 'Writ petitions, PIL, consumer rights, and fundamental rights enforcement in High Court.',
    color: '#ec4899',
    cls: 'card-rights',
    bg: 'rgba(236,72,153,0.08)',
    border: 'rgba(236,72,153,0.25)',
  },
];

const STATS = [
  { value: 25, suffix: '+', label: 'Years Experience', tamil: 'ஆண்டு அனுபவம்', icon: Award },
  { value: 5000, suffix: '+', label: 'Cases Handled', tamil: 'வழக்குகள்', icon: FileText },
  { value: 98, suffix: '%', label: 'Success Rate', tamil: 'வெற்றி விகிதம்', icon: TrendingUp },
  { value: 3000, suffix: '+', label: 'Happy Clients', tamil: 'மகிழ்ச்சியான வாடிக்கையாளர்கள்', icon: Users },
];

const TESTIMONIALS = [
  {
    name: 'Rajesh Kumar',
    role: 'Business Owner, Chennai',
    text: 'Sahayaraj sir handled my property dispute with exceptional skill. His in-depth knowledge of Tamil Nadu land laws saved my family home. Highly recommended!',
    stars: 5,
    avatar: 'R',
    color: '#f59e0b',
  },
  {
    name: 'Priya Sundar',
    role: 'IT Professional, Coimbatore',
    text: 'During my divorce proceedings, he was not just my lawyer but a pillar of support. He got me fair maintenance and custody with minimal stress.',
    stars: 5,
    avatar: 'P',
    color: '#ec4899',
  },
  {
    name: 'Murugan S.',
    role: 'Contractor, Madurai',
    text: 'Got anticipatory bail within 24 hours. His contacts and courtroom presence in Madras High Court are unmatched. True professional.',
    stars: 5,
    avatar: 'M',
    color: '#3b82f6',
  },
  {
    name: 'Lakshmi Venkat',
    role: 'Teacher, Salem',
    text: 'My consumer case against a builder was won in just 6 months. Transparent fees, regular updates, and complete dedication to my case.',
    stars: 5,
    avatar: 'L',
    color: '#10b981',
  },
  {
    name: 'Arjun Nair',
    role: 'Startup Founder, Chennai',
    text: 'Drafted all my company contracts and shareholder agreements flawlessly. His corporate law expertise helped us avoid costly mistakes.',
    stars: 5,
    avatar: 'A',
    color: '#8b5cf6',
  },
  {
    name: 'Kavitha Devi',
    role: 'Homemaker, Tirunelveli',
    text: 'He fought my domestic violence case bravely. Got us protection order quickly. Very compassionate and professional at the same time.',
    stars: 5,
    avatar: 'K',
    color: '#ef4444',
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Free Consultation',
    tamil: 'இலவச ஆலோசனை',
    desc: 'Share your legal issue. We listen, assess, and give you an honest evaluation of your case — no strings attached.',
    icon: MessageCircle,
    color: '#f59e0b',
  },
  {
    step: '02',
    title: 'Case Analysis',
    tamil: 'வழக்கு ஆய்வு',
    desc: 'Deep dive into facts, documents, and precedents. We build a bulletproof legal strategy tailored to your situation.',
    icon: BookOpen,
    color: '#3b82f6',
  },
  {
    step: '03',
    title: 'Legal Action',
    tamil: 'சட்ட நடவடிக்கை',
    desc: 'We file, argue, and fight for you in court with full force — keeping you informed at every stage.',
    icon: Gavel,
    color: '#8b5cf6',
  },
  {
    step: '04',
    title: 'Victory & Closure',
    tamil: 'வெற்றி & தீர்வு',
    desc: 'We pursue your case to its best possible conclusion, ensuring justice is served and your rights protected.',
    icon: CheckCircle,
    color: '#10b981',
  },
];

const WHY_US = [
  { icon: Award, title: '25+ Years of Expertise', desc: 'Decades of courtroom experience across Tamil Nadu courts and Madras High Court.' },
  { icon: Shield, title: 'Client Confidentiality', desc: 'Your case details are held in strict confidence. Complete privacy guaranteed.' },
  { icon: Clock, title: '24/7 Availability', desc: 'Legal emergencies don\'t wait. Reach us any time — day or night.' },
  { icon: Handshake, title: 'Transparent Fees', desc: 'No hidden charges. Clear fee structure discussed upfront before we begin.' },
  { icon: Lightbulb, title: 'Strategic Approach', desc: 'Every case gets a custom strategy — not a one-size-fits-all solution.' },
  { icon: TrendingUp, title: 'High Success Rate', desc: '98% success rate earned through relentless preparation and advocacy.' },
];

// ─── HOOKS ──────────────────────────────────────────────────────────────────

function useCounter(target: number, inView: boolean) {
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 40, damping: 15 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, target, motionVal]);

  useEffect(() => spring.on('change', v => setDisplay(Math.round(v))), [spring]);
  return display;
}

// ─── PARTICLES ──────────────────────────────────────────────────────────────

const PARTICLE_COLORS = ['#f59e0b', '#fcd34d', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#ef4444'];

function Particles() {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    delay: Math.random() * 15,
    duration: Math.random() * 10 + 12,
    drift: (Math.random() - 0.5) * 80,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ['--drift' as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

// ─── NAVBAR ─────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = ['Home', 'About', 'Practice', 'Process', 'Testimonials', 'Contact'];

  const scrollTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id.toLowerCase());
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'navbar-glass' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo('home')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <Scale size={20} className="text-slate-900" />
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm leading-tight">Adv. Sahayaraj</div>
            <div className="text-amber-400 text-xs">Madras High Court</div>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <button key={l} onClick={() => scrollTo(l)} className="text-slate-300 hover:text-amber-400 text-sm font-medium transition-colors">
              {l}
            </button>
          ))}
        </div>

        {/* CTA */}
        <a
          href="https://wa.me/919442760535"
          className="hidden md:flex btn-gold px-5 py-2.5 rounded-full text-sm items-center gap-2"
          target="_blank" rel="noreferrer"
        >
          <span className="flex items-center gap-2">
            <Phone size={14} /> Free Consultation
          </span>
        </a>

        {/* Mobile menu */}
        <button className="md:hidden text-white" onClick={() => setOpen(o => !o)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden navbar-glass border-t border-amber-400/10 px-6 pb-4"
          >
            {links.map(l => (
              <button key={l} onClick={() => scrollTo(l)} className="block w-full text-left py-3 text-slate-300 hover:text-amber-400 text-sm border-b border-white/5">
                {l}
              </button>
            ))}
            <a href="https://wa.me/919442760535" target="_blank" rel="noreferrer" className="mt-4 btn-gold flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm w-full">
              <span className="flex items-center gap-2"><Phone size={14} /> Free Consultation</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background orbs */}
      <div className="orb w-[600px] h-[600px] bg-amber-500" style={{ top: '-10%', right: '-15%', animationDuration: '12s' }} />
      <div className="orb w-[400px] h-[400px] bg-purple-600" style={{ bottom: '10%', left: '-10%', animationDuration: '16s', animationDelay: '-5s' }} />
      <div className="orb w-[300px] h-[300px] bg-blue-600" style={{ top: '40%', left: '30%', animationDuration: '10s', animationDelay: '-3s' }} />

      {/* Particles */}
      <Particles />

      {/* Grid background */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.06) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="section-label mb-6">
              <Scale size={12} /> Madras High Court Advocate
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-white">Your Justice,</span><br />
              <span className="gold-shimmer">Our Mission</span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-4">
              Expert legal representation in Criminal, Civil, Family & Corporate Law.
              25+ years of unwavering dedication to justice in Tamil Nadu courts.
            </p>
            <p className="text-amber-400/80 text-base mb-10 font-display italic">
              "நீதி தாமதமாகலாம், ஆனால் மறுக்கப்படாது"
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/919442760535?text=Hello%20Advocate%20Sahayaraj,%20I%20need%20legal%20consultation"
                target="_blank" rel="noreferrer"
                className="btn-gold flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle size={18} /> Free Consultation
                </span>
              </a>
              <button
                onClick={() => document.getElementById('practice')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base border border-white/20 text-white hover:border-amber-400/50 hover:text-amber-400 transition-all"
              >
                Our Practice Areas <ChevronRight size={16} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-12">
              {[
                { icon: Award, text: '25+ Years' },
                { icon: CheckCircle, text: 'High Court' },
                { icon: Shield, text: 'Confidential' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-slate-400 text-sm">
                  <Icon size={16} className="text-amber-400" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — lawyer avatar / scales visual */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            {/* Outer glow ring */}
            <div className="absolute w-80 h-80 rounded-full border border-amber-400/20 animate-spin-slow" />
            <div className="absolute w-96 h-96 rounded-full border border-amber-400/10" style={{ animation: 'spin 40s linear infinite reverse' }} />

            {/* Main avatar card */}
            <div className="relative glass rounded-3xl p-10 text-center" style={{ width: 320 }}>
              {/* Avatar */}
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center mb-6 animate-glow-pulse">
                <Scale size={64} className="text-slate-900" />
              </div>

              <h2 className="font-display text-2xl font-bold text-white mb-1">Adv. Sahayaraj</h2>
              <p className="text-amber-400 text-sm font-medium mb-1">B.L., M.L.</p>
              <p className="text-slate-400 text-xs mb-6">Madras High Court • Bar Council of Tamil Nadu</p>

              {/* Floating scales */}
              <div className="scale-float absolute -top-6 -right-6 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Gavel size={24} className="text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg" style={{ animation: 'scaleFloat 7s ease-in-out infinite reverse' }}>
                <Shield size={20} className="text-white" />
              </div>

              {/* Availability badge */}
              <div className="flex items-center justify-center gap-2 glass rounded-full px-4 py-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-medium">Available for Consultation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs">
        <span>Scroll down</span>
        <div className="w-px h-12 bg-gradient-to-b from-amber-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

// ─── STATS ───────────────────────────────────────────────────────────────────

function StatCard({ value, suffix, label, tamil, icon: Icon }: typeof STATS[0]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useCounter(value, inView);

  return (
    <div ref={ref} className="glass rounded-2xl p-8 text-center group hover:border-amber-400/30 transition-all duration-300">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon size={24} className="text-amber-400" />
      </div>
      <div className="font-display text-5xl font-bold text-white mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-white font-semibold text-sm mb-1">{label}</div>
      <div className="text-amber-400/70 text-xs">{tamil}</div>
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

// ─── PRACTICE AREAS ──────────────────────────────────────────────────────────

function PracticeAreas() {
  return (
    <section id="practice" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="section-label mx-auto mb-4"><Scale size={12} /> Our Expertise</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Practice <span className="gold-shimmer">Areas</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Comprehensive legal services across all major domains — fought with experience and won with strategy.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRACTICE_AREAS.map((area, i) => {
            const Icon = area.icon;
            return (
              <motion.div
                key={area.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`${area.cls} glass rounded-2xl p-8 cursor-pointer group transition-all duration-300`}
                style={{ background: area.bg, borderColor: area.border }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ background: `${area.color}20` }}
                >
                  <Icon size={28} style={{ color: area.color }} />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-1">{area.label}</h3>
                <p className="text-xs mb-4" style={{ color: area.color }}>{area.tamil}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{area.desc}</p>
                <div className="flex items-center gap-2 mt-6 text-sm font-medium group-hover:gap-3 transition-all" style={{ color: area.color }}>
                  Consult Now <ArrowRight size={14} />
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
  const milestones = [
    { year: '1999', event: 'Enrolled at Bar Council of Tamil Nadu' },
    { year: '2003', event: 'First landmark criminal case victory at Sessions Court' },
    { year: '2008', event: 'Elevated to Madras High Court practice' },
    { year: '2015', event: 'Recognized for outstanding contribution in family law' },
    { year: '2020', event: 'Appointed as panel advocate for leading corporates' },
    { year: '2024', event: '5000+ cases successfully closed' },
  ];

  return (
    <section id="about" className="py-24 relative">
      <div className="orb w-96 h-96 bg-amber-600" style={{ top: '20%', right: '5%', opacity: 0.12 }} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="section-label mb-4"><Award size={12} /> About the Advocate</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
              A Legacy of <span className="gold-shimmer">Justice</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Advocate Sahayaraj is a distinguished legal practitioner with over 25 years of experience in the Madras High Court and subordinate courts across Tamil Nadu. Known for his sharp legal acumen, strategic thinking, and relentless advocacy, he has built a reputation as one of the most trusted lawyers in the region.
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              From complex criminal trials to sensitive family matters, property disputes to corporate agreements — his breadth of expertise ensures every client receives the most informed and effective representation possible.
            </p>

            {/* Credentials */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Education', value: 'B.L., M.L.' },
                { label: 'Court', value: 'Madras High Court' },
                { label: 'Bar Council', value: 'Tamil Nadu' },
                { label: 'Languages', value: 'Tamil, English' },
              ].map(({ label, value }) => (
                <div key={label} className="glass rounded-xl p-4">
                  <div className="text-amber-400 text-xs font-semibold mb-1">{label}</div>
                  <div className="text-white text-sm font-medium">{value}</div>
                </div>
              ))}
            </div>

            <a
              href="https://wa.me/919442760535"
              target="_blank" rel="noreferrer"
              className="btn-gold inline-flex items-center gap-2 px-8 py-4 rounded-full"
            >
              <span className="flex items-center gap-2"><Phone size={16} /> Talk to the Advocate</span>
            </a>
          </motion.div>

          {/* Right — timeline */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative pl-8">
              <div className="timeline-line" style={{ left: 0, top: 0, bottom: 0 }} />
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="relative mb-8 last:mb-0"
                >
                  <div className="absolute -left-[42px] w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <CheckCircle size={14} className="text-slate-900" />
                  </div>
                  <div className="glass rounded-xl p-5 hover:border-amber-400/30 transition-all">
                    <div className="text-amber-400 text-xs font-bold mb-1">{m.year}</div>
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

// ─── WHY US ──────────────────────────────────────────────────────────────────

function WhyUs() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="section-label mx-auto mb-4"><Shield size={12} /> Why Choose Us</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            The <span className="gold-shimmer">Sahayaraj</span> Advantage
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            What sets us apart is not just experience — it's our uncompromising commitment to your justice.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_US.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-8 group hover:border-amber-400/30 hover:-translate-y-1 transition-all duration-300"
              >
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

// ─── PROCESS ─────────────────────────────────────────────────────────────────

function Process() {
  return (
    <section id="process" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="section-label mx-auto mb-4"><ChevronRight size={12} /> How It Works</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="gold-shimmer">Process</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A clear, step-by-step approach — from your first call to final verdict.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative glass rounded-2xl p-8 text-center group hover:-translate-y-2 transition-all duration-300"
              >
                {/* Connector line */}
                {i < PROCESS.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-6 h-px bg-gradient-to-r from-amber-400/40 to-transparent z-10" />
                )}

                <div
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                  style={{ background: `${step.color}20`, border: `1px solid ${step.color}30` }}
                >
                  <Icon size={28} style={{ color: step.color }} />
                </div>

                <div className="font-display text-4xl font-bold mb-3" style={{ color: `${step.color}30` }}>
                  {step.step}
                </div>

                <h3 className="text-white font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-xs mb-4" style={{ color: step.color }}>{step.tamil}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
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
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="orb w-80 h-80 bg-purple-600" style={{ bottom: '10%', left: '10%', opacity: 0.1 }} />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="section-label mx-auto mb-4"><Star size={12} /> Client Stories</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            What Clients <span className="gold-shimmer">Say</span>
          </h2>
        </motion.div>

        {/* Featured */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto glass rounded-3xl p-10 text-center mb-8"
          >
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: TESTIMONIALS[active].stars }).map((_, i) => (
                <Star key={i} size={20} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-slate-300 text-lg leading-relaxed italic mb-8">
              "{TESTIMONIALS[active].text}"
            </p>
            <div className="flex items-center justify-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-slate-900 font-bold text-lg"
                style={{ background: TESTIMONIALS[active].color }}
              >
                {TESTIMONIALS[active].avatar}
              </div>
              <div className="text-left">
                <div className="text-white font-semibold">{TESTIMONIALS[active].name}</div>
                <div className="text-slate-400 text-sm">{TESTIMONIALS[active].role}</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-12">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${i === active ? 'w-8 h-2 bg-amber-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActive(i)}
              className={`glass rounded-2xl p-6 cursor-pointer transition-all duration-300 ${i === active ? 'border-amber-400/40' : 'hover:border-white/20'}`}
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={12} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-slate-900" style={{ background: t.color }}>
                  {t.avatar}
                </div>
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

// ─── CONTACT ─────────────────────────────────────────────────────────────────

function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', issue: '', message: '' });

  const handleWA = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello Advocate Sahayaraj,\n\nName: ${form.name}\nPhone: ${form.phone}\nLegal Issue: ${form.issue}\n\nMessage: ${form.message}`;
    window.open(`https://wa.me/919442760535?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="orb w-96 h-96 bg-amber-500" style={{ top: '10%', left: '5%', opacity: 0.08 }} />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="section-label mx-auto mb-4"><Phone size={12} /> Get In Touch</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Book Your Free <span className="gold-shimmer">Consultation</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Share your legal concern. We'll respond within 2 hours.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <form onSubmit={handleWA} className="glass rounded-3xl p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-xs mb-2 block">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    className="form-input"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-slate-400 text-xs mb-2 block">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    className="form-input"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-2 block">Type of Legal Issue</label>
                <select
                  required
                  className="form-input"
                  value={form.issue}
                  onChange={e => setForm(f => ({ ...f, issue: e.target.value }))}
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <option value="" style={{ background: '#020617' }}>Select area of law</option>
                  {PRACTICE_AREAS.map(a => (
                    <option key={a.label} value={a.label} style={{ background: '#020617' }}>{a.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs mb-2 block">Describe Your Issue</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Briefly describe your legal matter..."
                  className="form-input resize-none"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn-gold w-full flex items-center justify-center gap-2 py-4 rounded-full text-base">
                <span className="flex items-center gap-2">
                  <MessageCircle size={18} /> Send via WhatsApp
                </span>
              </button>
              <p className="text-slate-500 text-xs text-center">
                This form opens WhatsApp with your message pre-filled
              </p>
            </form>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {[
              {
                icon: Phone,
                label: 'Call / WhatsApp',
                value: '+91 94427 60535',
                sub: 'Available 9 AM – 9 PM',
                color: '#10b981',
                href: 'tel:+919442760535',
              },
              {
                icon: Mail,
                label: 'Email',
                value: 'adv.sahayaraj@gmail.com',
                sub: 'Reply within 24 hours',
                color: '#3b82f6',
                href: 'mailto:adv.sahayaraj@gmail.com',
              },
              {
                icon: MapPin,
                label: 'Office Address',
                value: 'No. 12, Law Chambers, High Court Complex',
                sub: 'Chennai — 600 104, Tamil Nadu',
                color: '#f59e0b',
                href: '#',
              },
              {
                icon: Clock,
                label: 'Office Hours',
                value: 'Monday – Saturday',
                sub: '10:00 AM – 7:00 PM',
                color: '#8b5cf6',
                href: '#',
              },
            ].map(({ icon: Icon, label, value, sub, color, href }) => (
              <a key={label} href={href} className="flex items-start gap-5 glass rounded-2xl p-6 hover:border-white/20 transition-all group">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <div className="text-slate-400 text-xs mb-1">{label}</div>
                  <div className="text-white font-semibold text-sm">{value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
                </div>
              </a>
            ))}

            {/* Map placeholder */}
            <div className="glass rounded-2xl overflow-hidden h-48 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-950/30 to-slate-900/50" />
              <div className="relative text-center">
                <MapPin size={32} className="text-amber-400 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Madras High Court Complex</p>
                <p className="text-slate-500 text-xs">Chennai, Tamil Nadu</p>
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
  return (
    <footer className="relative border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Scale size={20} className="text-slate-900" />
              </div>
              <div>
                <div className="font-display font-bold text-white">Adv. Sahayaraj</div>
                <div className="text-amber-400 text-xs">B.L., M.L. — Madras High Court</div>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Dedicated to delivering justice with integrity, expertise, and compassion. Your legal rights are our priority.
            </p>
            <p className="text-amber-400/60 font-display italic text-sm mt-4">
              "நீதியை நோக்கி, உண்மையுடன்"
            </p>
          </div>

          {/* Practice */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Practice Areas</h4>
            <ul className="space-y-2">
              {PRACTICE_AREAS.map(a => (
                <li key={a.label}>
                  <span className="text-slate-500 text-sm hover:text-amber-400 cursor-pointer transition-colors">{a.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-500 text-sm"><Phone size={14} className="text-amber-400" /> +91 94427 60535</li>
              <li className="flex items-center gap-2 text-slate-500 text-sm"><Mail size={14} className="text-amber-400" /> adv.sahayaraj@gmail.com</li>
              <li className="flex items-start gap-2 text-slate-500 text-sm"><MapPin size={14} className="text-amber-400 mt-0.5 flex-shrink-0" /> High Court Complex, Chennai</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">© 2024 Advocate Sahayaraj. All rights reserved.</p>
          <p className="text-slate-600 text-xs">Bar Council of Tamil Nadu | Madras High Court</p>
        </div>
      </div>
    </footer>
  );
}

// ─── WHATSAPP FLOAT ──────────────────────────────────────────────────────────

function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/919442760535?text=Hello%20Advocate%20Sahayaraj,%20I%20need%20legal%20consultation"
      target="_blank"
      rel="noreferrer"
      className="wa-float"
      title="WhatsApp Consultation"
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

// ─── HOME ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <Stats />
      <PracticeAreas />
      <About />
      <WhyUs />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
