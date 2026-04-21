"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
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
} from "lucide-react"

export default function HomePageContent() {
  const [seatCount, setSeatCount] = useState(3)
  return (
    <div className="min-h-screen bg-[#FAFAF7] text-zinc-900" dir="rtl">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#FAFAF7]/80 border-b border-zinc-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-pacifico" style={{ letterSpacing: '0.5px' }}>
              Quick crm
            </span>
            <span className="text-[10px] font-bold text-violet-700 bg-violet-100 px-1.5 py-0.5 rounded">
              v2
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 text-sm text-zinc-600">
            <a href="#product" className="px-3 py-1.5 rounded-md hover:bg-zinc-100 transition-colors">המוצר</a>
            <a href="#workflow" className="px-3 py-1.5 rounded-md hover:bg-zinc-100 transition-colors">איך זה עובד</a>
            <a href="#apps" className="px-3 py-1.5 rounded-md hover:bg-zinc-100 transition-colors">אפליקציה</a>
            <a href="#pricing" className="px-3 py-1.5 rounded-md hover:bg-zinc-100 transition-colors">מחירים</a>
            <a href="#faq" className="px-3 py-1.5 rounded-md hover:bg-zinc-100 transition-colors">שאלות נפוצות</a>
            <a href="#customers" className="px-3 py-1.5 rounded-md hover:bg-zinc-100 transition-colors">לקוחות</a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-block text-sm text-zinc-700 hover:text-zinc-900 px-3 py-1.5 rounded-md hover:bg-zinc-100"
            >
              כניסה
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

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8 lg:pt-24 lg:pb-12">
          <div className="text-center max-w-3xl mx-auto">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white border border-zinc-200 rounded-full pl-4 pr-1 py-1 mb-8 hover:border-zinc-300 transition-colors shadow-sm"
            >
              <span className="text-xs text-zinc-600">בנוי לעסקים של עד 10 עובדים · בלי מינימום מושבים</span>
              <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                גלה →
              </span>
            </Link>

            <p className="text-sm md:text-base font-semibold text-violet-800/90 mb-4 tracking-tight">
              מערכת CRM בעברית לעסקים קטנים · עצמאים, פרילנסרים וצוותים עד 10 עובדים
            </p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-zinc-900 mb-6">
              ניהול לקוחות שמתאים
              <br />
              <span className="relative">
                <span className="bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                  לעסק הקטן שלך.
                </span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              לידים, לקוחות, הצעות מחיר, פרויקטים ותשלומים — במערכת אחת בעברית, מהירה ופשוטה להטמעה.
              <br className="hidden md:block" />
              מתחילים מ־<span className="font-semibold text-zinc-900">₪79 לחודש</span> · בלי מינימום משתמשים · ניסיון 14 יום חינם.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-800 transition-colors shadow-sm"
              >
                התחל ניסיון חינם
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-white border border-zinc-200 text-zinc-900 px-6 py-3 rounded-lg font-medium hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
              >
                צפה בדמו
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                14 יום חינם
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                ללא כרטיס אשראי
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={3} />
                ביטול בכל עת
              </span>
            </div>
          </div>
        </div>

        {/* App screenshot — real product UI */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16 lg:pb-20">
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
                  src="/images/quickcrm-dashboard.webp"
                  alt="ממשק Quick CRM — דשבורד וניהול לידים"
                  width={2938}
                  height={2208}
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
      <section id="workflow" className="border-y border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
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
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
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
                Kanban בעברית. בסוף.
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
                    <div className="flex -space-x-1.5">
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[9px] font-bold">ד</div>
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-[9px] font-bold">ש</div>
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-[9px] font-bold">מ</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                    {[
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
                    ].map((col, i) => {
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
                תבניות מקצועיות עם הלוגו והמיתוג שלך. ייצוא ל-PDF בלחיצה. חתימה דיגיטלית של הלקוח ישר מהמייל.
              </p>
              <ul className="space-y-2.5">
                {['תבניות מעוצבות (פשוטה / מקצועית)', 'PDF אוטומטי עם QR לאישור', 'חתימה דיגיטלית בטלפון', 'המרה אוטומטית לחשבונית מס'].map((f, i) => (
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
                    <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
                      <span className="text-sm font-semibold text-zinc-700">סה״כ לתשלום</span>
                      <span className="text-xl sm:text-2xl font-bold tabular-nums text-zinc-900">₪28,500</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
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
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-24">
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

          <blockquote className="text-2xl md:text-3xl font-medium text-zinc-900 leading-relaxed text-center max-w-3xl mx-auto mb-8">
            ״חיפשנו משהו פשוט שיצמח איתנו. Quick CRM זה הראשון שהצוות באמת אימץ — תוך שבוע כולם עבדו במערכת, בלי הדרכות ארוכות ובלי בלגן.״
          </blockquote>

          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
              ר.ל
            </div>
            <div className="text-right">
              <div className="font-bold text-sm">רועי לוי</div>
              <div className="text-xs text-zinc-500">מנכ״ל · סטודיו אמברלה, תל אביב</div>
            </div>
            <div className="border-r border-zinc-200 h-10 mx-2"></div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile apps — coming soon */}
      <section id="apps" className="relative overflow-hidden bg-zinc-950 text-white">
        {/* Decorative gradients */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] rounded-full bg-violet-600/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 w-[28rem] h-[28rem] rounded-full bg-fuchsia-600/25 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-28">
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
                אפליקציה ילידית לאייפון ולאנדרואיד — אותה חוויית ניהול לקוחות, משימות, הצעות מחיר והתראות,
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
                <div className="flex -space-x-1.5">
                  {['from-violet-500 to-fuchsia-500', 'from-amber-500 to-orange-500', 'from-blue-500 to-cyan-500', 'from-emerald-500 to-teal-500'].map((g, i) => (
                    <div key={i} className={`w-6 h-6 rounded-full bg-gradient-to-br ${g} ring-2 ring-zinc-950`} />
                  ))}
                </div>
                <span>
                  <span className="font-bold text-white tabular-nums">1,284</span> בעלי עסקים כבר ברשימת ההמתנה
                </span>
              </div>

              {/* Store badges */}
              <div className="flex flex-wrap gap-3 mt-6">
                <div className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.03] backdrop-blur px-4 py-2.5 opacity-70">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.38-1.09-.5-2.08-.53-3.24 0-1.44.62-2.2.44-3.06-.38C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  <div className="text-right">
                    <div className="text-[9px] text-zinc-400 leading-none">זמין בקרוב ב־</div>
                    <div className="text-sm font-semibold text-white leading-tight mt-0.5">App Store</div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.03] backdrop-blur px-4 py-2.5 opacity-70">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden>
                    <path fill="#34A853" d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92z" />
                    <path fill="#FBBC04" d="M16.81 15.017l-2.413-2.413-2.413 2.413 5.447 3.145a1.001 1.001 0 00.997-.002l.002-.001 3.31-1.912a1 1 0 000-1.732l-3.31-1.913a1 1 0 00-.999 0l-5.447 3.145 2.413 2.413 2.413-2.413z" opacity=".65" />
                    <path fill="#EA4335" d="M20.16 10.485l-3.31-1.913a1 1 0 00-.999 0l-5.447 3.145L12.813 14l4.87-2.812a1 1 0 00.001-1.732z" />
                    <path fill="#4285F4" d="M3.61 1.814l10.183 10.186 2.414-2.414L6.02 1.257a1 1 0 00-2.41.557z" />
                  </svg>
                  <div className="text-right">
                    <div className="text-[9px] text-zinc-400 leading-none">זמין בקרוב ב־</div>
                    <div className="text-sm font-semibold text-white leading-tight mt-0.5">Google Play</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="lg:col-span-6 order-1 lg:order-2 relative">
              <div className="relative mx-auto" style={{ maxWidth: 340 }}>
                {/* Ambient glow */}
                <div aria-hidden className="absolute -inset-10 bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-transparent rounded-[3rem] blur-3xl" />

                {/* Phone frame */}
                <div className="relative rounded-[2.8rem] bg-zinc-900 p-2.5 shadow-[0_30px_90px_-20px_rgba(139,92,246,0.45)] ring-1 ring-white/10">
                  <div className="relative rounded-[2.2rem] bg-[#FAFAF7] overflow-hidden aspect-[9/19.5]">
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 bg-zinc-900 rounded-full z-20" />
                    {/* Status bar */}
                    <div className="flex items-center justify-between px-7 pt-3 pb-1 text-[10px] font-semibold text-zinc-900 relative z-10">
                      <span className="tabular-nums">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5 items-end">
                          <div className="w-0.5 h-1.5 bg-zinc-900 rounded-sm" />
                          <div className="w-0.5 h-2 bg-zinc-900 rounded-sm" />
                          <div className="w-0.5 h-2.5 bg-zinc-900 rounded-sm" />
                          <div className="w-0.5 h-3 bg-zinc-900 rounded-sm" />
                        </div>
                        <div className="w-5 h-2.5 border border-zinc-900 rounded-sm relative">
                          <div className="absolute inset-0.5 bg-zinc-900 rounded-[1px] w-[70%]" />
                        </div>
                      </div>
                    </div>

                    {/* App content */}
                    <div className="px-4 pt-6 pb-20">
                      {/* Greeting */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-[10px] text-zinc-500 font-medium">יום שלישי, 21 באפריל</div>
                          <div className="text-lg font-bold text-zinc-900 leading-tight">שלום, דני</div>
                        </div>
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">ד.כ</div>
                          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-rose-500 border-2 border-[#FAFAF7]" />
                        </div>
                      </div>

                      {/* Stat cards */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="rounded-xl bg-white border border-zinc-200/70 p-2.5">
                          <div className="flex items-center justify-between mb-1">
                            <TrendingUp className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />
                            <span className="text-[8px] font-semibold text-emerald-600 tabular-nums">+12%</span>
                          </div>
                          <div className="text-sm font-bold text-zinc-900 tabular-nums">₪300K</div>
                          <div className="text-[9px] text-zinc-500">תקציבים</div>
                        </div>
                        <div className="rounded-xl bg-white border border-zinc-200/70 p-2.5">
                          <div className="flex items-center justify-between mb-1">
                            <Users className="w-3 h-3 text-violet-600" strokeWidth={2.5} />
                            <span className="text-[8px] font-semibold text-violet-600 tabular-nums">+4</span>
                          </div>
                          <div className="text-sm font-bold text-zinc-900 tabular-nums">46</div>
                          <div className="text-[9px] text-zinc-500">לקוחות פעילים</div>
                        </div>
                      </div>

                      {/* Tasks card */}
                      <div className="rounded-xl bg-white border border-zinc-200/70 p-3 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" strokeWidth={2.5} />
                            <span className="text-[11px] font-bold text-zinc-900">המשימות שלי</span>
                          </div>
                          <span className="text-[9px] bg-cyan-50 text-cyan-700 font-semibold px-1.5 py-0.5 rounded-md">3 פעילות</span>
                        </div>
                        <div className="space-y-1.5">
                          {[
                            { t: 'ליצור הצעה ללקוחות משופצים', border: 'border-r-rose-500' },
                            { t: 'גביית תשלום מגמר חשבון', border: 'border-r-amber-400' },
                            { t: 'יצירת משתמש חדש בקווין', border: 'border-r-blue-400' },
                          ].map((t, i) => (
                            <div key={i} className={`rounded-lg bg-zinc-50 border border-zinc-200/60 border-r-[3px] ${t.border} px-2 py-1.5`}>
                              <div className="text-[10px] font-semibold text-zinc-900 leading-tight">{t.t}</div>
                              <div className="flex items-center gap-1 mt-1">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 ring-1 ring-white" />
                                <span className="text-[8px] text-zinc-500">דני כהן</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom tab bar */}
                    <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-zinc-200/60 px-4 py-2.5 flex items-center justify-around">
                      {[
                        { icon: Sparkles, active: true },
                        { icon: Users, active: false },
                        { icon: FileText, active: false },
                        { icon: Bell, active: false, badge: true },
                      ].map((t, i) => (
                        <div key={i} className="relative flex flex-col items-center gap-0.5">
                          <t.icon className={`w-5 h-5 ${t.active ? 'text-violet-600' : 'text-zinc-400'}`} strokeWidth={t.active ? 2.5 : 2} />
                          {t.active && <div className="w-1 h-1 rounded-full bg-violet-600" />}
                          {t.badge && <div className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-rose-500" />}
                        </div>
                      ))}
                    </div>

                    {/* Home indicator */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-zinc-900/80" />
                  </div>
                </div>

                {/* Floating notification card */}
                <div className="absolute -right-6 top-20 hidden sm:flex items-center gap-2.5 rounded-2xl bg-white shadow-2xl shadow-black/40 border border-zinc-200 px-3 py-2.5 w-56 rotate-[-4deg] ring-1 ring-black/5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-zinc-900 leading-tight">ליד חדש · שרה לוי</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 truncate">עכשיו · לחצי לצפייה</div>
                  </div>
                </div>

                {/* Floating payment card */}
                <div className="absolute -left-4 bottom-28 hidden sm:flex items-center gap-2.5 rounded-2xl bg-white shadow-2xl shadow-black/40 border border-zinc-200 px-3 py-2.5 w-52 rotate-[3deg] ring-1 ring-black/5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-zinc-900 leading-tight">תשלום התקבל</div>
                    <div className="text-[10px] text-emerald-600 font-semibold tabular-nums mt-0.5">+ ₪12,500</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING — בסיס + למשתמש */}
      <section id="pricing" className="bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold text-violet-600 tracking-wider uppercase mb-3">
              מחירים
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              תמחור הוגן לעסקים קטנים
            </h2>
            <p className="text-lg text-zinc-600">
              בלי מינימום 3 או 5 משתמשים. בלי הפתעות. כל חבילה כוללת מושבים בסיסיים — רק משלמים על מה שצריך.
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
                  base: 79,
                  includedSeats: 1,
                  extraPerSeat: 39,
                  desc: 'לעצמאים ופרילנסרים',
                  features: [
                    'לידים ולקוחות ללא הגבלה',
                    'הצעות מחיר וחשבוניות',
                    'משימות ופרויקטים',
                    'דשבורד וקנבן',
                    'תמיכה במייל ובצ׳אט',
                  ],
                  popular: false,
                },
                {
                  name: 'עסק',
                  base: 189,
                  includedSeats: 3,
                  extraPerSeat: 35,
                  desc: 'המתאים לרוב העסקים עד 10 עובדים',
                  features: [
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
                  base: 449,
                  includedSeats: 10,
                  extraPerSeat: 29,
                  desc: 'לעסקים קטנים בצמיחה מהירה',
                  features: [
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
              const extraSeats = Math.max(0, seatCount - plan.includedSeats)
              const total = plan.base + extraSeats * plan.extraPerSeat
              const popular = plan.popular
              return (
                <div
                  key={i}
                  className={`relative rounded-2xl p-7 transition-all ${
                    popular
                      ? 'bg-zinc-900 text-white shadow-xl ring-2 ring-violet-500'
                      : 'bg-white border border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {popular && (
                    <div className="absolute -top-3 right-7 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      הכי פופולרי
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className={`text-sm mb-4 ${popular ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.desc}</p>
                  <div className={`text-xs mb-4 space-y-1 rounded-lg p-3 ${popular ? 'bg-zinc-800/80' : 'bg-zinc-50 border border-zinc-100'}`}>
                    <div className="flex justify-between gap-2">
                      <span className={popular ? 'text-zinc-400' : 'text-zinc-600'}>דמי בסיס</span>
                      <span className="font-mono tabular-nums font-semibold">₪{plan.base}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className={popular ? 'text-zinc-400' : 'text-zinc-600'}>משתמשים כלולים</span>
                      <span className="font-mono tabular-nums font-semibold">{plan.includedSeats}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className={popular ? 'text-zinc-400' : 'text-zinc-600'}>תוספת למושב</span>
                      <span className="font-mono tabular-nums font-semibold">₪{plan.extraPerSeat}</span>
                    </div>
                    {extraSeats > 0 ? (
                      <div className={`flex justify-between gap-2 pt-1 border-t ${popular ? 'border-zinc-700' : 'border-zinc-200'}`}>
                        <span className={popular ? 'text-zinc-400' : 'text-zinc-600'}>
                          {extraSeats} מושבים נוספים
                        </span>
                        <span className="font-mono tabular-nums font-semibold">+₪{extraSeats * plan.extraPerSeat}</span>
                      </div>
                    ) : (
                      <div className={`text-center pt-1 text-[11px] ${popular ? 'text-zinc-500' : 'text-zinc-500'}`}>
                        כל המושבים בתוך החבילה
                      </div>
                    )}
                  </div>
                  <div className={`mb-6 pb-6 border-b ${popular ? 'border-zinc-700' : 'border-zinc-200/80'}`}>
                    <div className={`text-xs mb-1 ${popular ? 'text-zinc-400' : 'text-zinc-500'}`}>סה״כ משוער לחודש</div>
                    <span className="text-4xl sm:text-5xl font-bold tracking-tight tabular-nums">₪{total}</span>
                    <span className={`text-sm ${popular ? 'text-zinc-400' : 'text-zinc-500'}`}> / חודש</span>
                    <div className={`text-[11px] mt-1 ${popular ? 'text-zinc-500' : 'text-zinc-500'}`}>
                      לפי {seatCount} משתמשים פעילים
                    </div>
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
            המחירים להמחשה בלבד — לפני רכישה תקבלו הצעה מדויקת לפי גודל הארגון והיקף השימוש. בתשלום שנתי מראש — 20% הנחה.
          </p>

          {/* השוואת מחיר למתחרים */}
          <div className="max-w-3xl mx-auto mt-16 bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl md:text-2xl font-bold text-center mb-1">
              לעסק של {seatCount} {seatCount === 1 ? 'עובד' : 'עובדים'} — כמה תחסוך?
            </h3>
            <p className="text-center text-sm text-zinc-500 mb-6">
              השוואה לחבילת CRM ישראלית מובילה (Fireberry), על בסיס המחירים הפומביים שלה לחודש.
            </p>
            {(() => {
              const quickBase = 189
              const quickIncluded = 3
              const quickExtra = 35
              const quickTotal = quickBase + Math.max(0, seatCount - quickIncluded) * quickExtra
              const fireberryMinSeats = Math.max(seatCount, 3)
              const fireberryTotal = fireberryMinSeats * 120
              const savings = Math.max(0, fireberryTotal - quickTotal)
              const savingsPct = fireberryTotal ? Math.round((savings / fireberryTotal) * 100) : 0
              return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-center">
                    <div className="text-xs text-zinc-500 mb-1">Fireberry Standard</div>
                    <div className="text-2xl font-bold tabular-nums text-zinc-900">₪{fireberryTotal.toLocaleString('he-IL')}</div>
                    <div className="text-[11px] text-zinc-500 mt-1">מינימום 3 משתמשים</div>
                  </div>
                  <div className="rounded-xl border-2 border-violet-500 bg-violet-50/50 p-4 text-center">
                    <div className="text-xs font-bold text-violet-700 mb-1">Quick CRM · עסק</div>
                    <div className="text-2xl font-bold tabular-nums text-violet-900">₪{quickTotal.toLocaleString('he-IL')}</div>
                    <div className="text-[11px] text-violet-700 mt-1">בלי מינימום מושבים</div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 text-center">
                    <div className="text-xs opacity-90 mb-1">חיסכון לחודש</div>
                    <div className="text-2xl font-bold tabular-nums">₪{savings.toLocaleString('he-IL')}</div>
                    <div className="text-[11px] opacity-90 mt-1">{savingsPct}% פחות</div>
                  </div>
                </div>
              )
            })()}
            <p className="text-center text-[11px] text-zinc-400 mt-4">
              * השוואה מבוססת על מחירון פומבי נכון לתאריך הפרסום. ללא מע״מ. לא כולל הטבות שנתיות.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white border-t border-zinc-100">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-24">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-bold text-violet-600 tracking-wider uppercase mb-3">שאלות נפוצות</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">שאלות שכל בעל עסק קטן שואל</h2>
            <p className="text-zinc-600">כל מה שצריך לדעת לפני שמתחילים ב־Quick CRM.</p>
          </div>
          <div className="space-y-3">
            {[
              {
                q: 'האם Quick CRM מתאים לעסק של עובד אחד או שניים?',
                a: 'בהחלט. חבילת סולו מתחילה ב־₪79 לחודש ומיועדת בדיוק לעצמאים, פרילנסרים ועסקים זעירים — בלי מינימום 3 משתמשים כמו במערכות אחרות.',
              },
              {
                q: 'כמה עולה CRM בעברית בישראל?',
                a: 'המחיר הממוצע בישראל הוא ₪120–₪250 למשתמש, עם מינימום 3–10 משתמשים. ב־Quick CRM מתחילים מ־₪79 לחודש בלי מינימום מושבים — חיסכון של עד 70% לעסקים קטנים.',
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
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            תפסיק להזמין את <span className="bg-gradient-to-br from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">העסק שלך לאקסל.</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-10">
            14 יום ניסיון חינם. ההגדרה לוקחת 3 דקות.
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
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
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
