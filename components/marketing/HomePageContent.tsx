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
} from "lucide-react"

export default function HomePageContent() {
  const [seatCount, setSeatCount] = useState(5)
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
              <span className="text-xs text-zinc-600">חדש: גרסה 2 — מהיר פי 3, מעוצב מחדש</span>
              <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                גלה →
              </span>
            </Link>

            <p className="text-sm md:text-base font-semibold text-violet-800/90 mb-4 tracking-tight">
              מערכת CRM בעברית · ניהול לקוחות · ניהול פרויקטים · יצירת הצעות מחיר
            </p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-zinc-900 mb-6">
              ה-CRM שמרגיש
              <br />
              <span className="relative">
                <span className="bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
                  שעובד בשבילך.
                </span>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              נהל לידים, לקוחות, הצעות מחיר, פרויקטים ותשלומים — במערכת אחת ישראלית, עברית, ומהירה.
              <br className="hidden md:block" />
              ממשק נקי, מחיר שקוף, ותמיכה מקומית — בלי סיבוכים מיותרים.
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
                <div className="relative bg-white border border-zinc-200/70 rounded-2xl shadow-sm p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                    <h5 className="text-sm font-semibold text-zinc-900 tracking-tight">פרויקט: עיצוב אתר ויזיון</h5>
                    <div className="flex -space-x-1.5">
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-violet-500" />
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-fuchsia-500" />
                      <div className="w-6 h-6 rounded-full border-2 border-white bg-pink-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      {
                        title: 'לביצוע',
                        count: 4,
                        wrap: 'rounded-xl border border-zinc-200/70 bg-zinc-50/50',
                        header: 'bg-zinc-100 text-zinc-700 border border-zinc-200/80',
                        tasks: [
                          { t: 'שיחת בריף עם הלקוח', tag: 'דחוף', tagColor: 'bg-red-50 text-red-700 border border-red-100' },
                          { t: 'איסוף תוכן ראשוני', tag: 'תוכן', tagColor: 'bg-violet-50 text-violet-700 border border-violet-100' },
                          { t: 'מחקר מתחרים' },
                        ]
                      },
                      {
                        title: 'בתהליך',
                        count: 2,
                        wrap: 'rounded-xl border border-cyan-100/80 bg-cyan-50/30',
                        header: 'bg-cyan-50 text-cyan-800 border border-cyan-100',
                        tasks: [
                          { t: 'עיצוב דף הבית', tag: 'עיצוב', tagColor: 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-100', avatar: true },
                          { t: 'wireframes פנימיים', avatar: true },
                        ]
                      },
                      {
                        title: 'בוצע',
                        count: 5,
                        wrap: 'rounded-xl border border-emerald-100/80 bg-emerald-50/30',
                        header: 'bg-emerald-50 text-emerald-800 border border-emerald-100',
                        tasks: [
                          { t: 'פגישת היכרות', done: true },
                          { t: 'הצעת מחיר', done: true },
                          { t: 'חתימה על חוזה', done: true },
                        ]
                      },
                    ].map((col, i) => (
                      <div key={i} className={`${col.wrap} p-2`}>
                        <div className={`flex items-center justify-between gap-1 mb-2 px-1.5 py-1 rounded-md text-[11px] font-semibold ${col.header}`}>
                          <span>{col.title}</span>
                          <span className="tabular-nums text-zinc-500 font-medium">{col.count}</span>
                        </div>
                        <div className="space-y-1.5">
                          {col.tasks.map((t, j) => (
                            <div
                              key={j}
                              className="rounded-xl border border-zinc-200/80 bg-white px-2.5 py-2 shadow-none hover:border-zinc-300/80 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-1">
                                <div className={`text-[11px] leading-snug font-medium ${t.done ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                                  {t.t}
                                </div>
                                {t.done && (
                                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-1.5">
                                {t.tag ? (
                                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${t.tagColor}`}>{t.tag}</span>
                                ) : (
                                  <span />
                                )}
                                {t.avatar && (
                                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 ring-2 ring-white shrink-0" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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
                <div className="relative bg-white border border-zinc-200/70 rounded-2xl shadow-sm p-4 sm:p-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      ש.ל
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-zinc-900 tracking-tight">שרה לוי</div>
                      <div className="text-xs text-zinc-500 mt-0.5">מנכ״לית · סטודיו פיקסל</div>
                    </div>
                    <div className="text-left shrink-0">
                      <div className="text-[10px] font-medium text-zinc-500">שווי כולל</div>
                      <div className="text-base font-bold tabular-nums text-zinc-900">₪127,400</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-5">
                    <div className="flex items-center gap-2 text-zinc-600 rounded-lg bg-zinc-50/80 border border-zinc-100 px-2.5 py-2">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" strokeWidth={2} />
                      <span className="truncate">sara@pixel.co.il</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-600 rounded-lg bg-zinc-50/80 border border-zinc-100 px-2.5 py-2">
                      <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" strokeWidth={2} />
                      <span dir="ltr" className="truncate">050-1234567</span>
                    </div>
                  </div>

                  <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">פעילות אחרונה</div>
                  <div className="space-y-2">
                    {[
                      { icon: FileText, box: 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white', text: 'הצעת מחיר #2418 נשלחה', time: 'לפני 2 שעות' },
                      { icon: CreditCard, box: 'bg-emerald-50 text-emerald-600 border border-emerald-100', text: 'תשלום התקבל · ₪12,500', time: 'אתמול' },
                      { icon: Calendar, box: 'bg-blue-50 text-blue-600 border border-blue-100', text: 'פגישה תואמה ליום שני', time: 'לפני 3 ימים' },
                      { icon: Mail, box: 'bg-zinc-100 text-zinc-600 border border-zinc-200', text: 'מייל נשלח: סיכום פגישה', time: 'לפני 5 ימים' },
                    ].map((act, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 text-xs p-2.5 rounded-xl border border-transparent bg-zinc-50/50 hover:bg-white hover:border-zinc-200/80 transition-all"
                      >
                        <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.box}`}>
                          <act.icon className="w-3.5 h-3.5" strokeWidth={2.2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-zinc-900 leading-tight">{act.text}</div>
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
                הצעות מחיר ש<span className="italic font-pacifico font-normal text-fuchsia-600" style={{ letterSpacing: '2px' }}>סוגרות</span> עסקאות.
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
                <div className="relative bg-white border border-zinc-200/70 rounded-2xl shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-br from-violet-600 via-violet-600 to-fuchsia-600 px-5 py-5 sm:p-6 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-xs text-white/80 font-medium mb-1">הצעת מחיר</div>
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

      {/* Mobile apps — בקרוב */}
      <section id="apps" className="bg-white border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 mb-5">
              <Smartphone className="w-6 h-6" strokeWidth={2} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-3">
              אפליקציה לנייד — בקרוב
            </h2>
            <p className="text-lg text-zinc-600 leading-relaxed mb-8">
              אפליקציה ייעודית <span className="font-semibold text-zinc-800">לאייפון (iOS)</span> ול־
              <span className="font-semibold text-zinc-800">אנדרואיד</span> — אותה חוויית ניהול לקוחות, משימות והתראות,
              בדרך אליכם. ההרשמה היום שומרת את המקום ברשימת ההמתנה.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-800">
                <span className="text-xs font-bold text-zinc-700 bg-white border border-zinc-200 px-1.5 py-0.5 rounded">iOS</span>
                אפליקציה לאייפון — בקרוב
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-800">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Android</span>
                אפליקציה לאנדרואיד — בקרוב
              </span>
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
              דמי בסיס + משתמשים לפי הצורך
            </h2>
            <p className="text-lg text-zinc-600">
              כל תוכנית כוללת חבילת משתמשים בסיסית. מעבר לכך — תשלום פר־מושב שקוף. 14 יום ניסיון חינם, ביטול בלחיצה.
            </p>
          </div>

          <div className="max-w-xl mx-auto mb-14 px-2">
            <label htmlFor="seat-slider" className="flex items-center justify-between text-sm font-medium text-zinc-800 mb-3">
              <span>כמה משתמשים במשרד?</span>
              <span className="tabular-nums text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">{seatCount}</span>
            </label>
            <input
              id="seat-slider"
              type="range"
              min={1}
              max={30}
              value={seatCount}
              onChange={(e) => setSeatCount(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-zinc-200 accent-violet-600"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1.5">
              <span>1</span>
              <span>30</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {(
              [
                {
                  name: 'התחלה',
                  base: 89,
                  includedSeats: 1,
                  extraPerSeat: 42,
                  desc: 'מושלם לעצמאים ולצוותים קטנים',
                  features: ['עד 100 לקוחות', 'עד 50 הצעות מחיר בחודש', 'דשבורד וקנבן', 'תמיכה במייל'],
                  popular: false,
                },
                {
                  name: 'צמיחה',
                  base: 179,
                  includedSeats: 3,
                  extraPerSeat: 36,
                  desc: 'הבחירה של רוב העסקים',
                  features: ['עד 1,000 לקוחות', 'הצעות וחשבוניות ללא הגבלה', 'אוטומציות', 'סליקה ואינטגרציות', 'תמיכה טלפונית'],
                  popular: true,
                },
                {
                  name: 'מקצועי',
                  base: 349,
                  includedSeats: 8,
                  extraPerSeat: 28,
                  desc: 'לארגונים שצריכים שליטה מלאה',
                  features: ['נפחים גבוהים ו־API', 'הרשאות מתקדמות', 'מנהל לקוח', 'SLA ותמיכה מורחבת'],
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
            המחירים להמחשה בלבד — לפני רכישה תקבלו הצעה מדויקת לפי גודל הארגון והיקף השימוש. אפשר גם חבילה קבועה ללא פר־מושב.
          </p>
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
