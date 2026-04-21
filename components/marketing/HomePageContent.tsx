"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  MARKETING_HERO_IMAGE,
  MARKETING_HERO_IMAGE_ALT,
  MARKETING_HERO_IMAGE_HEIGHT,
  MARKETING_HERO_IMAGE_WIDTH,
} from "@/lib/marketing-hero-image"
import { BrandLogoMark } from "@/components/BrandLogoMark"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  ArrowLeft,
  Check,
  CircleDot,
  Mail,
  Phone,
  Calendar,
  Users,
  FileText,
  CreditCard,
  Inbox,
  Briefcase,
  ChevronLeft,
  Star,
  Zap,
  Layers,
  Smartphone,
  Bell,
  Fingerprint,
  WifiOff,
  AlertCircle,
  Clock,
  FolderKanban,
  CheckCircle2,
  TrendingUp,
  Building,
  ArrowUpLeft,
  MessageCircle,
  UserPlus,
  Menu,
  X,
} from "lucide-react"

const TESTIMONIALS = [
  {
    quote: '״חיפשנו משהו פשוט שיצמח איתנו. Quick CRM זה הראשון שהצוות באמת אימץ — תוך שבוע כולם עבדו במערכת, בלי הדרכות ארוכות ובלי בלגן.״',
    name: 'רועי לוי',
    initials: 'ר.ל',
    role: 'מנכ״ל · סטודיו אמברלה, תל אביב',
    gradient: 'from-emerald-500 to-teal-500',
    stars: 5,
  },
  {
    quote: '״עברתי מ-Monday ל-Quick CRM והחסכתי כמעט 70% בחודש. הממשק בעברית מרגיש טבעי, ולקח לי 20 דקות להעביר את כל הלידים.״',
    name: 'מיכל אברהם',
    initials: 'מ.א',
    role: 'בעלת עסק · פרילנסרית שיווק דיגיטלי',
    gradient: 'from-violet-500 to-fuchsia-500',
    stars: 5,
  },
  {
    quote: '״הפיצ׳ר של הצעות מחיר שנשלחות ללקוח ומאושרות בלחיצה — שינה לנו את המשחק. הלקוחות מתרשמים ואנחנו סוגרים מהר יותר.״',
    name: 'יונתן כהן',
    initials: 'י.כ',
    role: 'שותף מייסד · דיגיטל פלוס, רמת גן',
    gradient: 'from-amber-500 to-orange-500',
    stars: 5,
  },
  {
    quote: '״התמיכה בעברית ובטלפון הייתה שיקול מרכזי. תוך יום קיבלתי מענה אנושי שעזר לי להגדיר אוטומציות — אצל המתחרים חיכיתי שבועות.״',
    name: 'שרון דוד',
    initials: 'ש.ד',
    role: 'מנהלת תפעול · קבוצת נדל״ן SD',
    gradient: 'from-cyan-500 to-blue-500',
    stars: 5,
  },
  {
    quote: '״מנהל 8 עובדים ו-Quick CRM הפך את הבלגן לסדר. הקנבן, ניהול הפרויקטים, והתזכורות האוטומטיות — כאילו הוספתי עוד עובד לצוות.״',
    name: 'אלון ברק',
    initials: 'א.ב',
    role: 'CEO · סוכנות ברק קריאייטיב, חיפה',
    gradient: 'from-rose-500 to-pink-500',
    stars: 5,
  },
] as const

const NAV_LINKS = [
  { href: "#product", label: "המוצר" },
  { href: "#workflow", label: "איך זה עובד" },
  { href: "#apps", label: "אפליקציה" },
  { href: "#pricing", label: "מחירים" },
  { href: "#faq", label: "שאלות נפוצות" },
  { href: "#customers", label: "לקוחות" },
] as const

export default function HomePageContent() {
  const [seatCount, setSeatCount] = useState(3)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [testimonialFade, setTestimonialFade] = useState(true)
  const testimonialTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goToTestimonial = useCallback((idx: number) => {
    setTestimonialFade(false)
    setTimeout(() => {
      setActiveTestimonial(idx)
      setTestimonialFade(true)
    }, 300)
  }, [])

  useEffect(() => {
    testimonialTimer.current = setTimeout(() => {
      goToTestimonial((activeTestimonial + 1) % TESTIMONIALS.length)
    }, 6000)
    return () => {
      if (testimonialTimer.current) clearTimeout(testimonialTimer.current)
    }
  }, [activeTestimonial, goToTestimonial])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (!mobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mobileMenuOpen])

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-zinc-900" dir="rtl">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#FAFAF7]/80 border-b border-zinc-200/60">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-3">
          {/* ב־RTL: שני בני flex בלבד (לוגו+המבורגר | CTA) — התפריט המרכזי בדסקטופ ב-absolute שלא יתפוס מקום במובייל */}
          <div className="relative z-10 flex items-center gap-1 shrink-0 min-w-0">
            <button
              type="button"
              className="md:hidden relative inline-flex items-center justify-center w-10 h-10 -ms-0.5 text-zinc-800 bg-transparent hover:bg-transparent active:bg-transparent rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50 touch-manipulation shrink-0"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-site-nav"
              aria-label={mobileMenuOpen ? "סגור תפריט" : "פתח תפריט"}
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              <span className="inline-flex transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none motion-reduce:duration-150">
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 animate-in fade-in zoom-in-95 duration-200" strokeWidth={2} />
                ) : (
                  <Menu className="w-6 h-6 animate-in fade-in zoom-in-95 duration-200" strokeWidth={2} />
                )}
              </span>
            </button>
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <BrandLogoMark className="w-8 h-8 rounded-lg shadow-sm" size={32} priority />
              <span className="text-xl font-pacifico" style={{ letterSpacing: '0.5px' }}>
                Quick crm
              </span>
            </Link>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] hidden h-16 items-center justify-center md:flex">
            <div className="pointer-events-auto flex items-center gap-1 text-sm text-zinc-600">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-md hover:bg-zinc-100 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href="/login"
              className="hidden sm:inline-block text-sm text-zinc-700 hover:text-zinc-900 px-3 py-1.5 rounded-md hover:bg-zinc-100"
            >
              כניסה ללקוחות
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 bg-zinc-900 text-white text-sm font-medium px-3.5 py-1.5 rounded-md hover:bg-zinc-800 transition-colors shadow-sm"
            >
              התחל חינם
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* מחוץ ל־nav — תמיד ב־DOM במובייל לאנימציית פתיחה/סגירה */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-[100] bg-zinc-900/40 backdrop-blur-[2px] md:hidden transition-opacity duration-300 ease-out motion-reduce:transition-none",
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!mobileMenuOpen}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        id="mobile-site-nav"
        role="navigation"
        aria-label="ניווט באתר"
        aria-hidden={!mobileMenuOpen}
        inert={mobileMenuOpen ? undefined : true}
        className={cn(
          "md:hidden fixed top-16 left-0 right-0 z-[110] border-b border-zinc-200 bg-[#FAFAF7] shadow-xl shadow-zinc-900/10 max-h-[min(70vh,calc(100dvh-4rem))] overflow-y-auto overscroll-contain isolate",
          "transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none motion-reduce:duration-150",
          mobileMenuOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible pointer-events-none -translate-y-3 opacity-0"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "block px-3 py-3 rounded-xl text-base font-medium leading-normal text-zinc-800 hover:bg-zinc-100 text-right",
                "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
                mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              )}
              style={{
                transitionDelay: mobileMenuOpen ? `${Math.min(i, 8) * 40}ms` : "0ms",
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/login"
            className={cn(
              "block px-3 py-3 rounded-xl text-base font-medium leading-normal text-zinc-700 hover:bg-zinc-100 text-right border-t border-zinc-200/80 mt-1 pt-3",
              "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
              mobileMenuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            )}
            style={{
              transitionDelay: mobileMenuOpen ? `${Math.min(NAV_LINKS.length, 8) * 40 + 40}ms` : "0ms",
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            כניסה ללקוחות
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Ambient background */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[36rem] h-[36rem] rounded-full bg-violet-200/30 blur-3xl" />
          <div className="absolute top-20 left-1/4 w-[32rem] h-[32rem] rounded-full bg-fuchsia-200/25 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 lg:pt-20 lg:pb-14">
          <div className="text-center max-w-3xl mx-auto">
            {/* Announcement pill */}
            <Link
              href="#pricing"
              className="group inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-zinc-200/80 rounded-full p-1 pr-3 mb-8 hover:border-violet-300 hover:bg-white transition-all shadow-sm"
            >
              <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">חדש</span>
              <span className="text-xs text-zinc-700 font-medium">
                מבצע השקה — מסלול סולו ב־<span className="text-zinc-900 font-bold">₪99</span> לחודש
              </span>
              <ArrowLeft className="w-3.5 h-3.5 text-zinc-400 group-hover:text-violet-600 group-hover:-translate-x-0.5 transition-all" />
            </Link>

            {/* Eyebrow */}
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] font-medium text-violet-700/80 mb-5">
              <span>CRM בעברית</span>
              <span className="text-violet-300">·</span>
              <span>ניהול לקוחות</span>
              <span className="text-violet-300">·</span>
              <span>הצעות מחיר</span>
              <span className="text-violet-300">·</span>
              <span>פרויקטים</span>
            </div>

            {/* Headline */}
            <h1 className="text-[3rem] sm:text-5xl md:text-[4.25rem] lg:text-[4.75rem] font-black tracking-tight text-zinc-900 mb-6 text-balance max-sm:word-spacing-[0.12em] max-sm:tracking-wide max-sm:leading-[1.15] sm:leading-[1.05] md:leading-[1.02]">
              <span className="block">ה־CRM היחידי</span>
              <span className="block mt-1 sm:mt-0.5">
                <span className="bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                  שעובד בשבילך
                </span>
                <span className="text-zinc-900">.</span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base md:text-lg text-zinc-600 max-w-xl mx-auto mb-9 leading-relaxed">
              נהל לידים, לקוחות, הצעות מחיר, פרויקטים ותשלומים במערכת אחת ישראלית, בעברית, ומהירה.
              <span className="block mt-1 text-zinc-500">ממשק נקי, מחיר שקוף, ותמיכה מקומית — בלי סיבוכים מיותרים.</span>
            </p>

            {/* CTA */}
            <div className="flex justify-center items-center mb-5">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/15 hover:shadow-xl hover:-translate-y-0.5"
              >
                התחל ניסיון חינם
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust row */}
            <div className="inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-zinc-600">
              {['14 יום חינם', 'ללא כרטיס אשראי', 'ביטול בכל עת'].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* App screenshot — real product UI */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-200/30 via-fuchsia-200/20 to-pink-200/30 blur-3xl rounded-3xl" aria-hidden />
            <div className="relative mx-auto max-w-6xl rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden ring-1 ring-zinc-900/5">
              <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2.5 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white border border-zinc-200 rounded-md px-3 py-0.5 text-xs text-zinc-500 font-mono">
                    quick-crm.com/dashboard
                  </div>
                </div>
              </div>
              <div className="bg-zinc-100">
                <Image
                  src={MARKETING_HERO_IMAGE}
                  alt={MARKETING_HERO_IMAGE_ALT}
                  width={MARKETING_HERO_IMAGE_WIDTH}
                  height={MARKETING_HERO_IMAGE_HEIGHT}
                  className="w-full h-auto object-top max-h-[min(85vh,900px)] object-cover sm:object-contain"
                  priority
                  sizes="(max-width: 1280px) 100vw, 1152px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW — pipeline visualization */}
      <section id="workflow" className="scroll-mt-20 border-y border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold text-violet-600 tracking-wider uppercase mb-3">
              איך זה עובד
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              מליד <span className="text-zinc-400">←</span> ללקוח <span className="text-zinc-400">←</span> לכסף בבנק
            </h2>
            <p className="text-lg text-zinc-600">
              ה-Pipeline הקלאסי. רק שעכשיו הוא מתנהל לבד.
            </p>
          </div>

          {/* Pipeline visual */}
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {[
                {
                  step: '01',
                  icon: Inbox,
                  title: 'ליד נכנס',
                  desc: 'מטופס באתר, פרסום בפייסבוק, וואטסאפ — הכל מגיע למקום אחד',
                  color: 'from-violet-500 to-violet-600',
                  bg: 'bg-violet-50',
                  border: 'border-violet-200',
                  preview: (
                    <div className="space-y-1.5">
                      {['דוד כהן · ויזיון', 'שרה לוי · פיקסל', 'מיכאל ר. · TechFlow'].map((n, i) => (
                        <div key={i} className="bg-white border border-zinc-200 rounded px-2 py-1.5 text-[11px] flex items-center gap-1.5">
                          <CircleDot className="w-2.5 h-2.5 text-violet-500" />
                          {n}
                        </div>
                      ))}
                    </div>
                  )
                },
                {
                  step: '02',
                  icon: FileText,
                  title: 'הצעת מחיר',
                  desc: 'יצירה אוטומטית, עיצוב יפה ב-PDF, חתימה דיגיטלית של הלקוח',
                  color: 'from-fuchsia-500 to-fuchsia-600',
                  bg: 'bg-fuchsia-50',
                  border: 'border-fuchsia-200',
                  preview: (
                    <div className="bg-white border border-zinc-200 rounded p-2">
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-2">
                        <span>הצעת מחיר #2426</span>
                        <span className="bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded text-[9px]">אושר</span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-1.5 bg-zinc-100 rounded w-full"></div>
                        <div className="h-1.5 bg-zinc-100 rounded w-4/5"></div>
                        <div className="h-1.5 bg-zinc-100 rounded w-3/5"></div>
                      </div>
                      <div className="mt-2 text-left text-xs font-bold tabular-nums">₪28,500</div>
                    </div>
                  )
                },
                {
                  step: '03',
                  icon: Briefcase,
                  title: 'פרויקט פעיל',
                  desc: 'משימות, Kanban, מעקב אחרי כל שלב, שיתוף עם הצוות',
                  color: 'from-pink-500 to-pink-600',
                  bg: 'bg-pink-50',
                  border: 'border-pink-200',
                  preview: (
                    <div className="grid grid-cols-3 gap-1">
                      {['לעשות', 'בעבודה', 'בוצע'].map((s, i) => (
                        <div key={i} className="bg-white border border-zinc-200 rounded p-1">
                          <div className="text-[9px] text-zinc-500 mb-1">{s}</div>
                          <div className="space-y-0.5">
                            <div className="h-1 bg-zinc-200 rounded"></div>
                            {i === 1 && <div className="h-1 bg-zinc-200 rounded w-3/4"></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                },
                {
                  step: '04',
                  icon: CreditCard,
                  title: 'תשלום',
                  desc: 'סליקה ישירה דרך המערכת, חשבונית מס אוטומטית, התראה מיידית',
                  color: 'from-emerald-500 to-emerald-600',
                  bg: 'bg-emerald-50',
                  border: 'border-emerald-200',
                  preview: (
                    <div className="bg-white border border-zinc-200 rounded p-2 text-center">
                      <div className="text-[10px] text-zinc-500 mb-1">תשלום התקבל</div>
                      <div className="text-lg font-bold text-emerald-600 tabular-nums">₪28,500</div>
                      <div className="text-[9px] text-zinc-400 font-mono">PP-2426 · אישר</div>
                    </div>
                  )
                },
              ].map((item, i) => (
                <div key={i} className="relative">
                  {/* Arrow between steps - hidden on mobile */}
                  {i < 3 && (
                    <div className="hidden lg:flex absolute -left-3 top-12 z-10 items-center justify-center w-6 h-6 bg-white border border-zinc-200 rounded-full">
                      <ChevronLeft className="w-3 h-3 text-zinc-400" />
                    </div>
                  )}
                  <div className={`border ${item.border} ${item.bg} rounded-xl p-5 h-full hover:shadow-md transition-shadow`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center shadow-sm`}>
                        <item.icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-mono font-bold text-zinc-400">/{item.step}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-zinc-600 leading-relaxed mb-4">{item.desc}</p>
                    <div className="pt-3 border-t border-zinc-200/60">
                      {item.preview}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT — features with mockups */}
      <section id="product" className="bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold text-violet-600 tracking-wider uppercase mb-3">
              המוצר
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              כל מה שעסק צריך.
              <br />
              <span className="text-zinc-500">בלי פיצ'רים שלא משתמשים בהם.</span>
            </h2>
          </div>

          {/* Feature 1 - Kanban (מראה כמו דשבורד / לוח פרויקט) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-32">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-violet-600" strokeWidth={2.2} />
                </div>
                <span className="text-xs font-semibold text-zinc-700">ניהול פרויקטים</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-zinc-900">
                הכי פשוט לנהל משימות. בעברית.
              </h3>
              <p className="text-lg text-zinc-600 mb-6 leading-relaxed">
                גרור משימות בין סטטוסים, הקצה לעובדים, הוסף תאריכי יעד. הכל מתעדכן בזמן אמת לכל הצוות.
              </p>
              <ul className="space-y-2.5">
                {['גרירה ושחרור חלקה', 'הקצאה לעובדים בלחיצה', 'תאריכי יעד והתראות', 'תגיות וקטגוריות'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-zinc-700">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 via-fuchsia-50/40 to-zinc-100/60 blur-2xl rounded-3xl" aria-hidden />
                <div className="relative bg-white border border-zinc-200/70 rounded-2xl shadow-none p-4 sm:p-5">
                  {/* Card header בסגנון של AppLayout + Card */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                        <Layers className="w-4 h-4 text-violet-600" strokeWidth={2.2} />
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-zinc-900 tracking-tight leading-tight">עיצוב אתר ויזיון</h5>
                        <span className="text-[10px] text-zinc-500">פרויקט · סטודיו פיקסל</span>
                      </div>
                    </div>
                    <div className="flex -space-x-2 space-x-reverse">
                      <div className="w-7 h-7 rounded-full ring-2 ring-white bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-bold leading-none">ד</div>
                      <div className="w-7 h-7 rounded-full ring-2 ring-white bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-[10px] font-bold leading-none">ש</div>
                      <div className="w-7 h-7 rounded-full ring-2 ring-white bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold leading-none">מ</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {([
                      {
                        title: 'לביצוע',
                        count: 3,
                        dot: 'bg-zinc-400',
                        header: 'bg-zinc-100 text-zinc-700',
                        tasks: [
                          { t: 'שיחת בריף עם הלקוח', priority: 'URGENT', assignee: 'דני' },
                          { t: 'איסוף תוכן ראשוני', priority: 'NORMAL', project: 'ויזיון' },
                          { t: 'מחקר מתחרים', priority: 'LOW' },
                        ],
                      },
                      {
                        title: 'בתהליך',
                        count: 2,
                        dot: 'bg-cyan-500',
                        header: 'bg-cyan-50 text-cyan-700',
                        tasks: [
                          { t: 'עיצוב דף הבית', priority: 'HIGH', assignee: 'שרה', due: 'מחר' },
                          { t: 'Wireframes פנימיים', priority: 'NORMAL', assignee: 'מיכאל' },
                        ],
                      },
                      {
                        title: 'הושלם',
                        count: 3,
                        dot: 'bg-emerald-500',
                        header: 'bg-emerald-50 text-emerald-700',
                        tasks: [
                          { t: 'פגישת היכרות', priority: 'NORMAL', done: true },
                          { t: 'הצעת מחיר', priority: 'NORMAL', done: true },
                          { t: 'חתימה על חוזה', priority: 'HIGH', done: true },
                        ],
                      },
                    ] as Array<{
                      title: string
                      count: number
                      dot: string
                      header: string
                      tasks: Array<{ t: string; priority: string; assignee?: string; project?: string; due?: string; done?: boolean }>
                    }>).map((col, i) => {
                      const priBorder: Record<string, string> = {
                        URGENT: 'border-r-rose-500',
                        HIGH: 'border-r-amber-400',
                        NORMAL: 'border-r-blue-400',
                        LOW: 'border-r-zinc-300',
                      }
                      const priBadge: Record<string, { label: string; cls: string }> = {
                        URGENT: { label: 'דחוף', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
                        HIGH: { label: 'גבוהה', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
                        NORMAL: { label: '', cls: '' },
                        LOW: { label: '', cls: '' },
                      }
                      return (
                        <div key={i} className="rounded-xl bg-zinc-50/40 border border-zinc-200/50 p-1.5">
                          <div className={`flex items-center justify-between gap-1 mb-2 px-2 py-1 rounded-md text-[11px] font-semibold ${col.header}`}>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                              <span>{col.title}</span>
                            </div>
                            <span className="tabular-nums text-zinc-500 font-medium">{col.count}</span>
                          </div>
                          <div className="space-y-1.5">
                            {col.tasks.map((t, j) => (
                              <div
                                key={j}
                                className={`group relative rounded-xl border border-zinc-200/80 bg-white px-2.5 py-2 hover:border-zinc-300 hover:shadow-sm transition-all border-r-[3px] ${priBorder[t.priority]}`}
                              >
                                {(t.priority === 'URGENT' || t.priority === 'HIGH') && !t.done && (
                                  <span className={`inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-md border mb-1 ${priBadge[t.priority].cls}`}>
                                    <AlertCircle className="w-2.5 h-2.5" />
                                    {priBadge[t.priority].label}
                                  </span>
                                )}
                                <div className={`text-[11px] leading-snug font-semibold ${t.done ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                                  {t.t}
                                </div>
                                {(t.due || t.project) && (
                                  <div className="flex items-center gap-1 flex-wrap mt-1.5">
                                    {t.due && (
                                      <span className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1 py-0.5 rounded-md bg-zinc-50 text-zinc-600 border border-zinc-200">
                                        <Clock className="w-2 h-2" />
                                        {t.due}
                                      </span>
                                    )}
                                    {t.project && (
                                      <span className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200">
                                        <Layers className="w-2 h-2" />
                                        {t.project}
                                      </span>
                                    )}
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-zinc-100">
                                  {t.assignee ? (
                                    <div className="flex items-center gap-1">
                                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[8px] font-bold shadow-sm ring-2 ring-white">
                                        {t.assignee.charAt(0)}
                                      </div>
                                      <span className="text-[9px] text-zinc-500 font-medium">{t.assignee}</span>
                                    </div>
                                  ) : (
                                    <div className="w-4 h-4 rounded-full bg-zinc-100" />
                                  )}
                                  {t.done && (
                                    <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - כרטיס לקוח בסגנון דשבורד */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-32">
            <div className="lg:col-span-7 lg:order-1 order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-violet-50/50 to-fuchsia-50/40 blur-2xl rounded-3xl" aria-hidden />
                <div className="relative bg-white border border-zinc-200/70 rounded-2xl shadow-none p-4 sm:p-6">
                  {/* Header identical pattern to dashboard client card */}
                  <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white">
                      ש.ל
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-sm text-zinc-900 tracking-tight">שרה לוי</div>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <div className="w-1 h-1 rounded-full bg-emerald-500" />
                          פעיל
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1.5">
                        <Building className="w-3 h-3" />
                        סטודיו פיקסל · מנכ״לית
                      </div>
                    </div>
                  </div>

                  {/* Stat cards — same pattern as dashboard */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: 'שווי כולל', value: '₪127,400', icon: TrendingUp, bg: 'bg-emerald-50', fg: 'text-emerald-600' },
                      { label: 'פרויקטים', value: '3', icon: FolderKanban, bg: 'bg-violet-50', fg: 'text-violet-600' },
                      { label: 'הצעות פתוחות', value: '2', icon: FileText, bg: 'bg-blue-50', fg: 'text-blue-600' },
                    ].map((s, i) => (
                      <div key={i} className="rounded-xl border border-zinc-200/70 bg-white p-2.5 hover:border-zinc-300 transition-all">
                        <div className="flex items-center justify-between mb-1">
                          <div className={`w-6 h-6 rounded-lg ${s.bg} flex items-center justify-center`}>
                            <s.icon className={`w-3 h-3 ${s.fg}`} strokeWidth={2.5} />
                          </div>
                        </div>
                        <div className="text-sm font-bold tabular-nums text-zinc-900 leading-tight">{s.value}</div>
                        <div className="text-[9px] text-zinc-500 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Contact row */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-5">
                    <div className="flex items-center gap-1.5 text-zinc-600 rounded-lg bg-zinc-50/80 border border-zinc-100 px-2.5 py-1.5">
                      <Mail className="w-3 h-3 text-zinc-400 shrink-0" strokeWidth={2} />
                      <span className="truncate text-[11px]">sara@pixel.co.il</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-600 rounded-lg bg-zinc-50/80 border border-zinc-100 px-2.5 py-1.5">
                      <Phone className="w-3 h-3 text-zinc-400 shrink-0" strokeWidth={2} />
                      <span dir="ltr" className="truncate text-[11px]">050-1234567</span>
                    </div>
                  </div>

                  {/* Activity timeline — matches dashboard notifications list */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-fuchsia-50 flex items-center justify-center">
                        <Clock className="w-3 h-3 text-fuchsia-600" strokeWidth={2.5} />
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-900">פעילות אחרונה</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">ראה הכל ‹</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { icon: FileText, box: 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white', text: 'הצעת מחיר #2418 נשלחה', time: 'לפני 2 שעות', unread: true },
                      { icon: CreditCard, box: 'bg-emerald-50 text-emerald-600 border border-emerald-100', text: 'תשלום התקבל · ₪12,500', time: 'אתמול', unread: true },
                      { icon: Calendar, box: 'bg-blue-50 text-blue-600 border border-blue-100', text: 'פגישה תואמה ליום שני', time: 'לפני 3 ימים', unread: false },
                      { icon: Mail, box: 'bg-zinc-100 text-zinc-600 border border-zinc-200', text: 'מייל נשלח: סיכום פגישה', time: 'לפני 5 ימים', unread: false },
                    ].map((act, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all ${
                          act.unread
                            ? 'border-violet-100 bg-violet-50/40 hover:border-violet-200'
                            : 'border-transparent bg-zinc-50/40 opacity-70'
                        }`}
                      >
                        <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${act.box}`}>
                          <act.icon className="w-3.5 h-3.5" strokeWidth={2.2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-semibold text-zinc-900 leading-tight">{act.text}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">{act.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 lg:order-2 order-1">
              <div className="inline-flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" strokeWidth={2.2} />
                </div>
                <span className="text-xs font-semibold text-zinc-700">360° לקוח</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-zinc-900">
                כל מה שצריך לדעת על לקוח. במסך אחד.
              </h3>
              <p className="text-lg text-zinc-600 mb-6 leading-relaxed">
                היסטוריית פגישות, מיילים, הצעות מחיר, תשלומים, פרויקטים פעילים ופתוחים. כשהלקוח מתקשר — אתה כבר יודע הכל.
              </p>
              <ul className="space-y-2.5">
                {['ציר זמן מלא של אינטראקציות', 'קבצים, חוזים והערות', 'סך הכנסות ושווי כולל', 'התראות חכמות'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-zinc-700">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature 3 - הצעת מחיר כמו במערכת */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-fuchsia-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-fuchsia-600" strokeWidth={2.2} />
                </div>
                <span className="text-xs font-semibold text-zinc-700">הצעות מחיר</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-zinc-900">
                הצעות מחיר ש<span className="font-black text-fuchsia-600">סוגרות</span> עסקאות.
              </h3>
              <p className="text-lg text-zinc-600 mb-6 leading-relaxed">
                תבניות מקצועיות עם הלוגו והמיתוג שלך. הלקוח חותם דיגיטלית בסריקת QR ומשלם מקדמה באותו רגע — בלי טלפונים ובלי דחיות.
              </p>
              <ul className="space-y-2.5">
                {[
                  'תבניות מעוצבות (פשוטה / מקצועית)',
                  'חתימה דיגיטלית בסריקת QR מהנייד',
                  'תשלום מקדמה מיידי עם אישור ההצעה',
                  'הגדרת אחוז מקדמה או סכום קבוע מראש',
                  'המרה אוטומטית לחשבונית מס כשהתשלום מתקבל',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-zinc-700">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 to-fuchsia-100/50 blur-2xl rounded-3xl" aria-hidden />
                <div className="relative bg-white border border-zinc-200/70 rounded-2xl shadow-none overflow-hidden">
                  <div className="bg-gradient-to-br from-violet-600 via-violet-600 to-fuchsia-600 px-5 py-5 sm:p-6 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-white/80 font-medium">הצעת מחיר</span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-white/15 text-white border border-white/25 backdrop-blur-sm">
                            <div className="w-1 h-1 rounded-full bg-amber-300 animate-pulse" />
                            ממתין לחתימה
                          </span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold tracking-tight">#QM-2426</div>
                      </div>
                      <div className="text-left shrink-0">
                        <div className="text-xs text-white/80 font-medium">תאריך</div>
                        <div className="font-mono text-sm font-medium tabular-nums">20.04.2026</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-2 gap-4 mb-5 pb-4 border-b border-zinc-100">
                      <div>
                        <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">מאת</div>
                        <div className="text-sm font-semibold text-zinc-900">החברה שלי בע״מ</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">ע.מ 123456789</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">לכבוד</div>
                        <div className="text-sm font-semibold text-zinc-900">סטודיו פיקסל בע״מ</div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">שרה לוי, מנכ״לית</div>
                      </div>
                    </div>
                    <div className="space-y-0 mb-4">
                      {[
                        { item: 'עיצוב לוגו ומיתוג', qty: 1, price: 4500 },
                        { item: 'בניית אתר תדמית', qty: 1, price: 18000 },
                        { item: 'ניהול תוכן (3 חודשים)', qty: 3, price: 2000 },
                      ].map((row, i) => (
                        <div key={i} className="grid grid-cols-12 gap-2 text-xs py-2.5 border-b border-zinc-100 last:border-0">
                          <div className="col-span-7 text-zinc-800 font-medium">{row.item}</div>
                          <div className="col-span-2 text-zinc-500 tabular-nums">{row.qty}</div>
                          <div className="col-span-3 text-left tabular-nums font-semibold text-zinc-900">₪{row.price.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-4 border-t border-zinc-200 space-y-1.5">
                      <div className="flex justify-between items-center text-xs text-zinc-500">
                        <span>סכום להצעה</span>
                        <span className="tabular-nums">₪28,500</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="inline-flex items-center gap-1.5 text-violet-700 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                          מקדמה לתשלום מיידי <span className="text-zinc-400 font-normal">· 30%</span>
                        </span>
                        <span className="tabular-nums font-semibold text-violet-700">₪8,550</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 mt-1 border-t border-dashed border-zinc-200">
                        <span className="text-sm font-semibold text-zinc-700">סה״כ לתשלום</span>
                        <span className="text-xl sm:text-2xl font-bold tabular-nums text-zinc-900">₪28,500</span>
                      </div>
                    </div>
                    <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg bg-white border border-zinc-200 p-1.5 flex-shrink-0 grid grid-cols-5 grid-rows-5 gap-[1px]" aria-hidden>
                        {[
                          1,1,1,0,1, 1,0,1,0,1, 1,1,0,1,1, 0,1,1,1,0, 1,0,1,0,1,
                        ].map((v, i) => (
                          <span key={i} className={`rounded-[1px] ${v ? 'bg-zinc-900' : 'bg-transparent'}`} />
                        ))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-semibold text-zinc-900 flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          סרוק לחתימה ותשלום מקדמה
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5 leading-snug">חתימה דיגיטלית וסליקה מאובטחת מהטלפון · ללא הורדת אפליקציה</div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button type="button" className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors">
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                        אישור וחתימה
                      </button>
                      <button type="button" className="bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50 text-xs font-medium py-2.5 rounded-lg transition-colors">
                        הורד PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section id="customers" className="bg-white border-y border-zinc-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { v: '12 שעות', l: 'נחסכות בשבוע בממוצע' },
              { v: '+34%', l: 'גידול בהמרת לידים ללקוחות' },
              { v: '4.9 / 5', l: 'דירוג מעל 200 לקוחות' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                  {s.v}
                </div>
                <div className="text-sm text-zinc-600">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="min-h-[220px] sm:min-h-[200px] flex flex-col items-center justify-center">
            <blockquote
              className={cn(
                "text-xl sm:text-2xl md:text-3xl font-medium text-zinc-900 leading-relaxed text-center max-w-3xl mx-auto mb-8 transition-opacity duration-300 ease-in-out motion-reduce:transition-none",
                testimonialFade ? "opacity-100" : "opacity-0"
              )}
            >
              {TESTIMONIALS[activeTestimonial].quote}
            </blockquote>

            <div
              className={cn(
                "flex items-center justify-center gap-3 transition-opacity duration-300 ease-in-out motion-reduce:transition-none",
                testimonialFade ? "opacity-100" : "opacity-0"
              )}
            >
              <div className={cn("w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm", TESTIMONIALS[activeTestimonial].gradient)}>
                {TESTIMONIALS[activeTestimonial].initials}
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">{TESTIMONIALS[activeTestimonial].name}</div>
                <div className="text-xs text-zinc-500">{TESTIMONIALS[activeTestimonial].role}</div>
              </div>
              <div className="border-r border-zinc-200 h-10 mx-2" />
              <div className="flex gap-0.5">
                {Array.from({ length: TESTIMONIALS[activeTestimonial].stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          </div>

          {/* נקודות ניווט */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`ביקורת ${i + 1} מתוך ${TESTIMONIALS.length}`}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === activeTestimonial
                    ? "w-7 h-2.5 bg-violet-600"
                    : "w-2.5 h-2.5 bg-zinc-300 hover:bg-zinc-400"
                )}
                onClick={() => {
                  if (testimonialTimer.current) clearTimeout(testimonialTimer.current)
                  goToTestimonial(i)
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mobile apps — coming soon */}
      <section id="apps" className="scroll-mt-20 relative overflow-hidden bg-zinc-950 text-white">
        {/* Decorative gradients */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-violet-600/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 w-[28rem] h-[28rem] rounded-full bg-fuchsia-600/25 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Copy + waitlist */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 backdrop-blur px-3 py-1 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[11px] font-semibold tracking-wider uppercase text-white/90">בפיתוח · השקה Q2 2026</span>
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5 leading-[1.08]">
                ה־CRM שלך.
                <br />
                <span className="bg-gradient-to-br from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
                  בכיס שלך.
                </span>
              </h2>
              <p className="text-lg text-zinc-300 leading-relaxed mb-8 max-w-lg">
                אפליקציה יעודית לאייפון ולאנדרואיד — אותה חוויית ניהול לקוחות, משימות, הצעות מחיר והתראות,
                רק מהירה יותר ומותאמת למסך הקטן.
              </p>

              {/* Feature grid */}
              <div className="grid grid-cols-2 gap-3 mb-8 max-w-lg">
                {[
                  { icon: Bell, label: 'התראות Push', sub: 'ליד חדש מייד' },
                  { icon: WifiOff, label: 'מצב Offline', sub: 'גם בלי אינטרנט' },
                  { icon: Fingerprint, label: 'כניסה ביומטרית', sub: 'Face ID / טביעה' },
                  { icon: Zap, label: 'פתיחה מיידית', sub: 'מהירה פי 3' },
                ].map((f, i) => (
                  <div key={i} className="rounded-xl bg-white/[0.04] border border-white/10 p-3 backdrop-blur hover:bg-white/[0.06] hover:border-white/20 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-2 shadow-lg shadow-violet-500/20">
                      <f.icon className="w-4 h-4 text-white" strokeWidth={2.2} />
                    </div>
                    <div className="text-sm font-semibold text-white">{f.label}</div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">{f.sub}</div>
                  </div>
                ))}
              </div>

              {/* Waitlist form */}
              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative flex flex-col sm:flex-row gap-2 p-1.5 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur max-w-lg"
              >
                <input
                  type="email"
                  required
                  placeholder="האימייל שלך"
                  className="flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-white text-zinc-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-100 transition-colors shadow-lg"
                >
                  שמור לי מקום
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </form>
              <div className="flex items-center gap-3 mt-4 text-xs text-zinc-400">
                <div className="flex -space-x-2 space-x-reverse">
                  {[47, 32, 12, 5].map((id, i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/80?img=${id}`}
                      alt=""
                      width={28}
                      height={28}
                      loading="lazy"
                      className="w-7 h-7 rounded-full ring-2 ring-zinc-950 object-cover bg-zinc-800"
                    />
                  ))}
                </div>
                <span>
                  <span className="font-bold text-white tabular-nums">1,284</span> בעלי עסקים כבר ברשימת ההמתנה
                </span>
              </div>

              {/* Store badges (local SVG assets) */}
              <div className="flex flex-wrap gap-3 mt-6 items-center">
                <Image
                  src="/images/store-badges/appstore.svg"
                  alt="זמין בקרוב ב-App Store"
                  width={168}
                  height={57}
                  className="h-10 sm:h-11 w-auto opacity-70"
                />
                <Image
                  src="/images/store-badges/googleplay.svg"
                  alt="זמין בקרוב ב-Google Play"
                  width={168}
                  height={58}
                  className="h-10 sm:h-11 w-auto opacity-70"
                />
              </div>
            </div>

            {/* Phone mockup */}
            <div className="lg:col-span-6 order-1 lg:order-2 relative">
              <div className="relative mx-auto" style={{ maxWidth: 340 }}>
                {/* Ambient glow */}
                <div aria-hidden className="absolute -inset-10 bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-transparent rounded-[3rem] blur-3xl" />

                {/* Phone frame */}
                <div className="relative rounded-[2.8rem] bg-zinc-900 p-2.5 shadow-[0_30px_90px_-20px_rgba(139,92,246,0.45)] ring-1 ring-white/10">
                  <div className="relative rounded-[2.2rem] bg-white overflow-hidden aspect-[9/19.5]">
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-zinc-900 rounded-full z-20" />

                    {/* Status bar (iOS-like, battery+wifi+signal on LEFT as shown in Hebrew iOS) */}
                    <div className="flex items-center justify-between px-6 pt-3 pb-1 relative z-10" dir="ltr">
                      <div className="flex items-center gap-1.5">
                        {/* Battery */}
                        <div className="flex items-center gap-[1px]">
                          <div className="relative w-[22px] h-[11px] rounded-[3px] border border-zinc-900/90 p-[1.5px]">
                            <div className="h-full w-[80%] rounded-[1.5px] bg-zinc-900" />
                          </div>
                          <div className="w-[1px] h-[4px] rounded-sm bg-zinc-900/90" />
                        </div>
                        {/* Wi-Fi (3 arcs + dot) */}
                        <svg viewBox="0 0 16 12" className="w-[14px] h-[11px] fill-zinc-900" aria-hidden>
                          <path d="M8 2.3c2.4 0 4.7.9 6.4 2.4.2.2.2.5 0 .7l-.9.9a.5.5 0 01-.7 0A7 7 0 008 4a7 7 0 00-4.8 2.3.5.5 0 01-.7 0l-.9-.9a.5.5 0 010-.7A9.4 9.4 0 018 2.3z" />
                          <path d="M8 5.6c1.5 0 3 .6 4.1 1.6.2.2.2.5 0 .7l-.9.9a.5.5 0 01-.7 0A4.6 4.6 0 008 7.3a4.6 4.6 0 00-2.5.5.5.5 0 01-.7 0l-.9-.9a.5.5 0 010-.7A6 6 0 018 5.6z" />
                          <circle cx="8" cy="10" r="1.3" />
                        </svg>
                        {/* Signal bars */}
                        <div className="flex items-end gap-[1.5px] h-[11px]">
                          <div className="w-[3px] h-[4px] bg-zinc-900 rounded-[1px]" />
                          <div className="w-[3px] h-[6px] bg-zinc-900 rounded-[1px]" />
                          <div className="w-[3px] h-[8px] bg-zinc-900 rounded-[1px]" />
                          <div className="w-[3px] h-[10px] bg-zinc-900/30 rounded-[1px]" />
                        </div>
                      </div>
                      <span className="tabular-nums font-semibold text-[11px] text-zinc-900">11:50</span>
                    </div>

                    {/* App content — scrollable area */}
                    <div className="px-4 pt-3 pb-20">
                      {/* Header: bell (left visual) + greeting (right visual) */}
                      <div className="flex items-start justify-between mb-4">
                        <button type="button" className="w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-zinc-700">
                          <Bell className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <div className="text-right">
                          <div className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium mb-0.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                            יום שלישי, 21 באפריל
                          </div>
                          <div className="text-xl font-bold text-zinc-900 leading-tight tracking-tight">שלום, דני.</div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">איך אני יכול לעזור לך היום?</div>
                        </div>
                      </div>

                      {/* Stat cards 2x2 */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {[
                          { v: '12', l: 'לקוחות', Icon: Building, bg: 'bg-violet-50', fg: 'text-violet-600' },
                          { v: '4', l: 'לידים פעילים', Icon: Users, bg: 'bg-fuchsia-50', fg: 'text-fuchsia-600' },
                          { v: '₪28K', l: 'תקציב', Icon: TrendingUp, bg: 'bg-emerald-50', fg: 'text-emerald-600' },
                          { v: '3', l: 'פרויקטים פעילים', Icon: FolderKanban, bg: 'bg-cyan-50', fg: 'text-cyan-600' },
                        ].map((s, i) => (
                          <div key={i} className="rounded-2xl bg-white border border-zinc-200/70 p-3 relative">
                            <ArrowUpLeft className="absolute top-2.5 left-2.5 w-3 h-3 text-zinc-300" strokeWidth={2.2} />
                            <div className="flex justify-end mb-1">
                              <div className={`w-6 h-6 rounded-lg ${s.bg} flex items-center justify-center`}>
                                <s.Icon className={`w-3 h-3 ${s.fg}`} strokeWidth={2.2} />
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-zinc-900 tabular-nums leading-tight">{s.v}</div>
                              <div className="text-[10px] text-zinc-500 mt-0.5">{s.l}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* "המשימות שלי" card */}
                      <div className="rounded-2xl bg-white border border-zinc-200/70 overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2.5 border-b border-zinc-100">
                          <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                            ראה הכל
                            <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" aria-hidden>
                              <path d="M6 2L3 5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            </svg>
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-zinc-900">המשימות שלי</span>
                            <div className="w-5 h-5 rounded-md bg-violet-50 flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-violet-600" strokeWidth={2.5} />
                            </div>
                          </div>
                        </div>
                        <div>
                          {[
                            'לייבא לקוחות קיימים משופיפיי',
                            'התכתבות עם לקוח אקספרס',
                            'לחזור להצעת מחיר סטודיו פיקסל',
                            'לעדכן תקציב פרויקט ויזיון',
                            'תיקונים לאורגניה — מה שאורי שלח',
                          ].map((t, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-2 border-b border-zinc-50 last:border-0">
                              <div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-blue-500 shrink-0" />
                              <div className="flex-1 min-w-0 text-right">
                                <div className="text-[11px] text-zinc-900 leading-tight truncate">{t}</div>
                                <div className="text-[9px] text-blue-600 font-medium mt-0.5">רגילה</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom tab bar (RTL: בית on the right) */}
                    <div className="absolute bottom-0 inset-x-0 bg-white border-t border-zinc-200/60 px-2 pt-1.5 pb-4 flex items-center justify-around" dir="rtl">
                      {[
                        { label: 'בית', active: true, icon: (cls: string) => (
                          <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10l9-7 9 7v10a2 2 0 01-2 2h-4a1 1 0 01-1-1v-5h-4v5a1 1 0 01-1 1H5a2 2 0 01-2-2V10z"/></svg>
                        ) },
                        { label: 'משימות', icon: (cls: string) => (
                          <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/></svg>
                        ) },
                        { label: 'לוח שנה', icon: (cls: string) => (
                          <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        ) },
                        { label: 'עוד', icon: (cls: string) => (
                          <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                        ), badge: '4' },
                      ].map((t, i) => (
                        <div key={i} className="relative flex flex-col items-center gap-0.5">
                          {t.badge && <span className="absolute -top-0.5 right-2 min-w-[14px] h-[14px] px-1 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">{t.badge}</span>}
                          {t.icon(`w-5 h-5 ${t.active ? 'text-violet-600' : 'text-zinc-400'}`)}
                          <span className={`text-[8px] ${t.active ? 'text-violet-600 font-semibold' : 'text-zinc-500'}`}>{t.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Home indicator */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-zinc-900/80" />
                  </div>
                </div>

                {/* Floating: new lead */}
                <div className="absolute -right-6 top-20 hidden sm:flex items-center gap-2.5 rounded-2xl bg-white shadow-2xl shadow-black/40 border border-zinc-200 px-3 py-2.5 w-56 ring-1 ring-black/5 animate-float-slow will-change-transform" style={{ '--tilt': '-4deg' } as React.CSSProperties}>
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-zinc-900 leading-tight">ליד חדש · שרה לוי</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 truncate">עכשיו · לחצי לצפייה</div>
                  </div>
                </div>

                {/* Floating: payment received */}
                <div className="absolute -left-4 bottom-28 hidden sm:flex items-center gap-2.5 rounded-2xl bg-white shadow-2xl shadow-black/40 border border-zinc-200 px-3 py-2.5 w-52 ring-1 ring-black/5 animate-float-medium will-change-transform" style={{ '--tilt': '3deg' } as React.CSSProperties}>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-zinc-900 leading-tight">תשלום התקבל</div>
                    <div className="text-[10px] text-emerald-600 font-semibold tabular-nums mt-0.5">+ ₪12,500</div>
                  </div>
                </div>

                {/* Floating: WhatsApp message */}
                <div className="absolute -left-8 top-32 hidden md:flex items-center gap-2.5 rounded-2xl bg-white shadow-2xl shadow-black/40 border border-zinc-200 px-3 py-2.5 w-52 ring-1 ring-black/5 animate-float-delayed will-change-transform" style={{ '--tilt': '5deg' } as React.CSSProperties}>
                  <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-white" strokeWidth={2.5} fill="white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-zinc-900 leading-tight">וואטסאפ · דוד כהן</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 truncate">״כן, אני מאשר את ההצעה״</div>
                  </div>
                </div>

                {/* Floating: new signup */}
                <div className="absolute -right-10 bottom-44 hidden md:flex items-center gap-2.5 rounded-2xl bg-white shadow-2xl shadow-black/40 border border-zinc-200 px-3 py-2.5 w-52 ring-1 ring-black/5 animate-float-delayed-2 will-change-transform" style={{ '--tilt': '-6deg' } as React.CSSProperties}>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                    <UserPlus className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-zinc-900 leading-tight">לקוח חדש הצטרף</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 truncate">סטודיו פיקסל · פרויקט חדש</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING — בסיס + למשתמש */}
      <section id="pricing" className="scroll-mt-20 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold text-violet-600 tracking-wider uppercase mb-3">
              מחירים
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              מ־<span className="bg-gradient-to-br from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">₪99</span> לחודש. בלי מינימום.
            </h2>
            <p className="text-lg text-zinc-600">
              מחיר פשוט שגדל איתך: ₪99 לעצמאי, ₪75 בלבד! לכל משתמש נוסף.
            </p>
            <p className="text-xs text-zinc-500 mt-2">המחירים אינם כוללים מע״מ · 14 יום ניסיון חינם · ביטול בלחיצה</p>
          </div>

          <div className="max-w-xl mx-auto mb-14 px-2">
            <label htmlFor="seat-slider" className="flex items-center justify-between text-sm font-medium text-zinc-800 mb-3">
              <span>כמה משתמשים בעסק שלך?</span>
              <span className="tabular-nums text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">{seatCount}</span>
            </label>
            <input
              id="seat-slider"
              type="range"
              min={1}
              max={10}
              value={seatCount}
              onChange={(e) => setSeatCount(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-zinc-200 accent-violet-600"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1.5">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {(
              [
                {
                  name: 'סולו',
                  desc: 'לעצמאי או פרילנסר אחד',
                  minSeats: 1,
                  maxSeats: 1,
                  priceAt: (_s: number) => 99,
                  promoBadge: 'מבצע השקה',
                  features: [
                    'משתמש אחד',
                    'לידים ולקוחות ללא הגבלה',
                    'הצעות מחיר וחשבוניות',
                    'משימות, פרויקטים וקנבן',
                    'תמיכה במייל ובצ׳אט',
                  ],
                  popular: false,
                },
                {
                  name: 'עסק',
                  desc: 'המתאים לעסקים של 2–5 עובדים',
                  minSeats: 2,
                  maxSeats: 5,
                  priceAt: (s: number) => s * 75,
                  features: [
                    'עד 5 משתמשים · ₪75 לכל מושב',
                    'כל מה שבסולו',
                    'אוטומציות ותהליכי עבודה',
                    'סליקת אשראי ותשלומים',
                    'אינטגרציה לחשבשבת ו־API',
                    'תמיכה טלפונית בעברית',
                  ],
                  popular: true,
                },
                {
                  name: 'צוות',
                  desc: 'לעסקים של 6–10 עובדים',
                  minSeats: 6,
                  maxSeats: 10,
                  priceAt: (s: number) => s * 75,
                  features: [
                    'עד 10 משתמשים · ₪75 לכל מושב',
                    'כל מה שבעסק',
                    'הרשאות מתקדמות',
                    'תצוגות מותאמות אישית',
                    'ייצוא נתונים ו־BI',
                    'מנהל לקוח ו־SLA תגובה',
                  ],
                  popular: false,
                },
              ] as const
            ).map((plan, i) => {
              const inRange = seatCount >= plan.minSeats && seatCount <= plan.maxSeats
              const effectiveSeats = Math.max(plan.minSeats, Math.min(seatCount, plan.maxSeats))
              const total = plan.priceAt(effectiveSeats)
              const popular = inRange
              const hasPromo = 'promoBadge' in plan && !!plan.promoBadge
              const seatLabel =
                plan.maxSeats === plan.minSeats
                  ? `${plan.minSeats} משתמש`
                  : `${plan.minSeats}–${plan.maxSeats} משתמשים`

              return (
                <div
                  key={i}
                  className={`relative rounded-2xl p-7 transition-all duration-300 ${
                    popular
                      ? 'bg-zinc-900 text-white shadow-xl ring-2 ring-violet-500 scale-[1.015]'
                      : 'bg-white border border-zinc-200 hover:border-zinc-300'
                  } ${!inRange ? 'opacity-60' : ''}`}
                >
                  {popular && (
                    <div className="absolute -top-3 right-7 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      המסלול שלך
                    </div>
                  )}
                  {hasPromo && 'promoBadge' in plan && plan.promoBadge && (
                    <div className={`absolute -top-3 left-7 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${popular ? 'shadow-md' : ''}`}>
                      {plan.promoBadge}
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md tabular-nums ${popular ? 'bg-white/10 text-white' : 'bg-zinc-100 text-zinc-700'}`}>
                      {seatLabel}
                    </span>
                  </div>
                  <p className={`text-sm mb-5 ${popular ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.desc}</p>

                  <div className={`mb-6 pb-6 border-b ${popular ? 'border-zinc-700' : 'border-zinc-200/80'}`}>
                    <div className={`text-xs mb-1 ${popular ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {inRange ? `לפי ${seatCount} ${seatCount === 1 ? 'משתמש' : 'משתמשים'}` : `החל מ־${plan.minSeats} משתמשים`}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl sm:text-6xl font-bold tracking-tight tabular-nums">₪{total}</span>
                      <span className={`text-sm ${popular ? 'text-zinc-400' : 'text-zinc-500'}`}>/ חודש</span>
                    </div>
                    {plan.name !== 'סולו' && (
                      <div className={`text-[11px] mt-2 ${popular ? 'text-zinc-500' : 'text-zinc-500'}`}>
                        ₪75 למשתמש · ללא מע״מ
                      </div>
                    )}
                    {plan.name === 'סולו' && (
                      <div className={`text-[11px] mt-2 font-semibold ${popular ? 'text-emerald-300' : 'text-emerald-700'}`}>
                        מחיר שובר שוק — הזול בישראל
                      </div>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-8">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm">
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${popular ? 'text-emerald-400' : 'text-emerald-600'}`} strokeWidth={3} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`block text-center font-medium py-2.5 rounded-lg transition-colors ${
                      popular ? 'bg-white text-zinc-900 hover:bg-zinc-100' : 'bg-zinc-900 text-white hover:bg-zinc-800'
                    }`}
                  >
                    התחל ניסיון חינם
                  </Link>
                </div>
              )
            })}
          </div>
          <p className="text-center text-xs text-zinc-500 mt-10 max-w-2xl mx-auto leading-relaxed">
            ללא התחייבות, אפשר לבטל בכל חודש. מעל 10 משתמשים? <a href="#contact" className="underline hover:text-violet-600">דבר איתנו</a> לתוכנית מותאמת.
          </p>

          {/* השוואת מחיר - תצוגת מידע, לא ניתנת ללחיצה */}
          {(() => {
            const quickTotal = seatCount === 1 ? 99 : seatCount * 75
            const quickPlanName = seatCount === 1 ? 'סולו' : seatCount <= 5 ? 'עסק' : 'צוות'
            const marketMinSeats = Math.max(seatCount, 3)
            const marketTotal = marketMinSeats * 120
            const savings = Math.max(0, marketTotal - quickTotal)
            const savingsPct = marketTotal ? Math.round((savings / marketTotal) * 100) : 0
            const quickBarPct = marketTotal ? Math.round((quickTotal / marketTotal) * 100) : 0
            return (
              <div className="max-w-3xl mx-auto mt-16">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-violet-600 mb-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    השוואת מחיר
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-zinc-900">
                    לעסק של {seatCount} {seatCount === 1 ? 'עובד' : 'עובדים'} — כמה תחסוך בחודש
                  </h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-sm text-zinc-600">ממוצע שוק ה־CRM בישראל <span className="text-zinc-400 text-xs">· מינימום 3 משתמשים</span></span>
                      <span className="text-base font-semibold tabular-nums text-rose-600 line-through decoration-rose-300">₪{marketTotal.toLocaleString('he-IL')}</span>
                    </div>
                    <div className="h-2 rounded-full bg-rose-50 overflow-hidden" aria-hidden>
                      <div className="h-full bg-gradient-to-l from-rose-500 to-rose-400 rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="text-sm font-semibold text-violet-700">Quick CRM · {quickPlanName} <span className="text-violet-500/80 text-xs font-normal">· בלי מינימום מושבים</span></span>
                      <span className="text-lg font-bold tabular-nums text-violet-700">₪{quickTotal.toLocaleString('he-IL')}</span>
                    </div>
                    <div className="h-2 rounded-full bg-violet-50 overflow-hidden" aria-hidden>
                      <div
                        className="h-full bg-gradient-to-l from-violet-600 to-fuchsia-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.max(8, quickBarPct)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                  <span className="text-zinc-600">חיסכון חודשי:</span>
                  <span className="inline-flex items-baseline gap-1.5 font-bold tabular-nums text-emerald-700">
                    <span className="text-lg">₪{savings.toLocaleString('he-IL')}</span>
                    <span className="text-xs text-emerald-600 font-semibold">עד {savingsPct}% פחות</span>
                  </span>
                </div>
                <p className="text-center text-[11px] text-zinc-400 mt-4 max-w-xl mx-auto leading-relaxed">
                  השוואה מבוססת על ממוצע מחירונים פומביים של מערכות CRM פופולריות בישראל נכון לתאריך הפרסום. ללא מע״מ.
                </p>
              </div>
            )
          })()}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-white border-t border-zinc-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-violet-600 tracking-wider uppercase mb-3">שאלות נפוצות</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">שאלות שכל בעל עסק קטן שואל</h2>
            <p className="text-zinc-600">כל מה שצריך לדעת לפני שמתחילים ב־Quick CRM.</p>
          </div>
          <div className="space-y-3">
            {[
              {
                q: 'האם Quick CRM מתאים לעסק של עובד אחד או שניים?',
                a: 'בהחלט. חבילת סולו מתחילה ב־₪99 לחודש ומיועדת בדיוק לעצמאים, פרילנסרים ועסקים זעירים — בלי מינימום 3 משתמשים כמו במערכות אחרות.',
              },
              {
                q: 'כמה עולה CRM בעברית בישראל?',
                a: 'המחיר הממוצע בישראל הוא ₪120–₪250 למשתמש, עם מינימום 3–10 משתמשים. ב־Quick CRM מתחילים מ־₪99 לחודש בלי מינימום מושבים — חיסכון של עד 60%.',
              },
              {
                q: 'האם אפשר ליצור הצעות מחיר וחשבוניות ממערכת אחת?',
                a: 'כן. Quick CRM מייצרת הצעות מחיר בעיצוב מקצועי, ממירה אותן להזמנה ומפיקה חשבוניות וקבלות מוכרות מס — הכול בממשק אחד בעברית.',
              },
              {
                q: 'כמה זמן לוקח להטמיע את המערכת?',
                a: 'רוב הלקוחות מתחילים לעבוד תוך פחות משעה. הממשק בעברית, יש תבניות מוכנות, ותמיכה טלפונית מקומית שמלווה אותך בכל שלב.',
              },
              {
                q: 'האם הנתונים שלי מאובטחים?',
                a: 'כן. כל המידע מוצפן (TLS בתעבורה, AES-256 באחסון), הגיבויים יומיים, והמערכת מאוחסנת בשרתים בישראל ובאירופה בתאימות GDPR.',
              },
              {
                q: 'אפשר לבטל בכל רגע?',
                a: 'בטח. אין חוזה ארוך טווח, אין דמי ביטול, ואפשר לייצא את כל הנתונים בקובץ Excel בלחיצה אחת.',
              },
              {
                q: 'יש אפליקציה לנייד?',
                a: 'אפליקציה ל־iPhone ול־Android בדרך. בינתיים המערכת מותאמת לחלוטין למובייל דרך הדפדפן ואפשר להוסיף אותה למסך הבית.',
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-zinc-200 bg-[#FAFAF7] open:bg-white open:shadow-sm transition-all"
              >
                <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4 font-semibold text-zinc-900">
                  <span>{item.q}</span>
                  <span className="text-violet-600 text-2xl leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-5 pb-5 text-zinc-600 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-zinc-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            תפסיקו לנהל את <span className="bg-gradient-to-br from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">העסק שלכם באקסל.</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-3">
            14 יום ניסיון חינם. ללא התחייבות וללא כרטיס אשראי.
          </p>
          <p className="text-lg text-zinc-500 mb-10">
            מה יש לכם להפסיד? ההגדרה לוקחת 3 דקות.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-zinc-900 px-7 py-3.5 rounded-lg font-medium hover:bg-zinc-100 transition-colors shadow-lg"
            >
              התחל בחינם
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 border border-zinc-700 text-white px-7 py-3.5 rounded-lg font-medium hover:bg-zinc-800 transition-colors"
            >
              דבר איתנו
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <BrandLogoMark className="w-8 h-8 rounded-lg opacity-95" size={32} />
                <span className="text-xl font-pacifico text-white">Quick crm</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                מערכת CRM בעברית לניהול לקוחות, פרויקטים ויצירת הצעות מחיר — נבנה בתל אביב לעסקים בישראל.
              </p>
            </div>
            {[
              { title: 'מוצר', links: ['תכונות', 'מחירים', 'אינטגרציות', 'API'] },
              { title: 'חברה', links: ['אודות', 'בלוג', 'קריירה', 'צור קשר'] },
              { title: 'משפטי', links: ['תנאי שימוש', 'פרטיות', 'אבטחה', 'GDPR'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-white font-bold text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2 text-sm">
                  {col.links.map((l, j) => (
                    <li key={j}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <span>© 2026 Quick CRM · נבנה בתל אביב</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>כל המערכות פעילות</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
