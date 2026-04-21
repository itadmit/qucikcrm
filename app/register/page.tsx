"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BrandLogoMark } from "@/components/BrandLogoMark"
import { useToast } from "@/components/ui/use-toast"
import {
  Sparkles,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  Check,
  Users,
  FileText,
  TrendingUp,
  Zap,
  Shield,
  Globe,
} from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast({
          title: "שגיאה בהרשמה",
          description: data.error || "אירעה שגיאה",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "נרשמת בהצלחה!",
        description: "כעת תוכל להתחבר עם הפרטים שהזנת",
      })

      router.push("/login")
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בהרשמה",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col" dir="rtl">
      {/* Top nav */}
      <nav className="border-b border-zinc-200/60 bg-[#FAFAF7]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <BrandLogoMark className="w-8 h-8 rounded-lg shadow-sm" size={32} priority />
            <span className="text-xl font-pacifico" style={{ letterSpacing: '0.5px' }}>
              Quick crm
            </span>
            <span className="text-[10px] font-bold text-violet-700 bg-violet-100 px-1.5 py-0.5 rounded">
              v2
            </span>
          </Link>

          <div className="text-sm text-zinc-600">
            כבר יש לך חשבון?{" "}
            <Link href="/login" className="font-semibold text-zinc-900 hover:text-violet-600 transition-colors">
              התחבר →
            </Link>
          </div>
        </div>
      </nav>

      {/* Split layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left side - Form */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 rounded-full px-3 py-1 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-medium text-emerald-700">14 יום ניסיון חינם</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-2">
                בוא נתחיל.
              </h1>
              <p className="text-zinc-500">
                3 דקות והעסק שלך מנוהל אחרת.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase tracking-wider">
                    שם מלא
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      id="name"
                      type="text"
                      placeholder="ישראל ישראלי"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={loading}
                      className="w-full bg-white border border-zinc-200 rounded-lg py-2.5 pr-10 pl-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase tracking-wider">
                    שם חברה
                  </label>
                  <div className="relative">
                    <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      id="companyName"
                      type="text"
                      placeholder="החברה שלי בע״מ"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      required
                      disabled={loading}
                      className="w-full bg-white border border-zinc-200 rounded-lg py-2.5 pr-10 pl-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase tracking-wider">
                  אימייל
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                    className="w-full bg-white border border-zinc-200 rounded-lg py-2.5 pr-10 pl-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-zinc-700 mb-1.5 uppercase tracking-wider">
                  סיסמה
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="לפחות 8 תווים"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={loading}
                    minLength={8}
                    className="w-full bg-white border border-zinc-200 rounded-lg py-2.5 pr-10 pl-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-6"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    יוצר חשבון...
                  </>
                ) : (
                  <>
                    צור חשבון בחינם
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Trust */}
            <div className="mt-6 grid grid-cols-3 gap-2 text-[11px] text-zinc-500">
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                ללא כרטיס
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                14 יום חינם
              </div>
              <div className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                ביטול בלחיצה
              </div>
            </div>

            <p className="text-xs text-zinc-400 text-center mt-8">
              בהמשך אתה מסכים ל
              <a href="#" className="underline hover:text-zinc-700 mx-1">תנאי השימוש</a>
              ו
              <a href="#" className="underline hover:text-zinc-700 mr-1">מדיניות הפרטיות</a>
            </p>
          </div>
        </div>

        {/* Right side - Benefits */}
        <div className="hidden lg:flex relative overflow-hidden border-r border-zinc-200/60 bg-[#F5F2EC]">
          {/* Subtle background gradient blob */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-300/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-fuchsia-300/20 rounded-full blur-3xl"></div>

          <div className="relative w-full flex flex-col justify-center p-12">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="mb-10">
                <div className="text-xs font-semibold text-violet-600 tracking-wider uppercase mb-3">
                  הצטרף ל-500+ עסקים בישראל
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 leading-tight">
                  כל מה שתקבל ביום הראשון.
                </h2>
              </div>

              {/* Feature cards */}
              <div className="space-y-3 mb-10">
                {[
                  {
                    icon: Users,
                    title: 'ניהול לידים ולקוחות',
                    desc: 'איסוף, מעקב, המרה ללקוחות בלחיצה',
                    color: 'bg-violet-100 text-violet-700',
                  },
                  {
                    icon: FileText,
                    title: 'הצעות מחיר ב-PDF',
                    desc: 'תבניות מקצועיות + חתימה דיגיטלית',
                    color: 'bg-fuchsia-100 text-fuchsia-700',
                  },
                  {
                    icon: Zap,
                    title: 'אוטומציות חכמות',
                    desc: 'הגדר זרימות עבודה ללא קוד',
                    color: 'bg-amber-100 text-amber-700',
                  },
                  {
                    icon: TrendingUp,
                    title: 'דוחות בזמן אמת',
                    desc: 'תדע בדיוק איפה העסק עומד',
                    color: 'bg-emerald-100 text-emerald-700',
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-xl p-4 hover:bg-white transition-colors"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${f.color}`}>
                      <f.icon className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-zinc-900 mb-0.5">{f.title}</div>
                      <div className="text-xs text-zinc-500">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-zinc-200/60">
                {[
                  { value: '500+', label: 'עסקים פעילים' },
                  { value: '12 שעות', label: 'נחסכות בשבוע' },
                  { value: '4.9 / 5', label: 'דירוג ממוצע' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-2xl font-bold tracking-tight bg-gradient-to-br from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                      {s.value}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Bottom mini-quote */}
              <div className="mt-8 bg-white/70 backdrop-blur-sm border border-zinc-200/60 rounded-xl p-4">
                <p className="text-sm text-zinc-700 italic leading-relaxed mb-2">
                  "ניסינו 4 מערכות. רק Quick CRM הצוות באמת אימץ. תוך שבוע — כולם השתמשו."
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-[10px] font-bold">
                    ר.ל
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900">רועי לוי</div>
                    <div className="text-[10px] text-zinc-500">מנכ״ל · סטודיו אמברלה</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
