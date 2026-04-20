"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import {
  Sparkles,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  Inbox,
  FileText,
  CreditCard,
  Calendar,
  Users,
  Briefcase,
  PieChart,
  Zap,
  Search,
  Bell,
  Building2,
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "שגיאה בהתחברות",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "התחברת בהצלחה!",
          description: "מעביר אותך לדשבורד...",
        })
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בהתחברות",
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

          <div className="text-sm text-zinc-600">
            עוד אין חשבון?{" "}
            <Link href="/register" className="font-semibold text-zinc-900 hover:text-violet-600 transition-colors">
              הירשם בחינם →
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
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-2">
                ברוך השב.
              </h1>
              <p className="text-zinc-500">
                התחבר לחשבון שלך והמשך לעבוד.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                    סיסמה
                  </label>
                  <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
                    שכחת סיסמה?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={loading}
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
                    מתחבר...
                  </>
                ) : (
                  <>
                    התחבר
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-200"></div>
              <span className="text-xs text-zinc-400">או</span>
              <div className="flex-1 h-px bg-zinc-200"></div>
            </div>

            {/* Register CTA */}
            <Link
              href="/register"
              className="block w-full text-center bg-white hover:bg-zinc-50 text-zinc-900 font-medium py-2.5 rounded-lg border border-zinc-200 hover:border-zinc-300 transition-colors text-sm"
            >
              צור חשבון חדש
            </Link>

            <p className="text-xs text-zinc-400 text-center mt-8">
              בהמשך אתה מסכים ל
              <a href="#" className="underline hover:text-zinc-700 mx-1">תנאי השימוש</a>
              ו
              <a href="#" className="underline hover:text-zinc-700 mr-1">מדיניות הפרטיות</a>
            </p>
          </div>
        </div>

        {/* Right side - Product preview */}
        <div className="hidden lg:flex relative overflow-hidden border-r border-zinc-200/60 bg-[#F5F2EC]">
          {/* Subtle background gradient blob */}
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-300/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-fuchsia-300/20 rounded-full blur-3xl"></div>

          <div className="relative w-full flex flex-col justify-center p-12">
            {/* Floating product preview */}
            <div className="relative max-w-md mx-auto">
              {/* Main card - Dashboard preview */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden">
                {/* Window chrome */}
                <div className="border-b border-zinc-100 bg-zinc-50/50 px-3 py-2 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="inline-block bg-white border border-zinc-200 rounded px-2 py-0.5 text-[10px] text-zinc-500 font-mono">
                      quick-crm.com
                    </div>
                  </div>
                </div>

                {/* App mockup */}
                <div className="grid grid-cols-12 min-h-[320px]">
                  {/* Sidebar */}
                  <div className="col-span-3 border-l border-zinc-100 bg-zinc-50/30 p-2">
                    <div className="flex items-center gap-1.5 px-1.5 py-1 mb-3">
                      <div className="w-5 h-5 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded flex items-center justify-center">
                        <Sparkles className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="font-pacifico text-[10px]">Quick crm</span>
                    </div>
                    <div className="space-y-0.5">
                      {[
                        { icon: PieChart, label: 'דשבורד', active: true },
                        { icon: Inbox, label: 'לידים' },
                        { icon: Users, label: 'לקוחות' },
                        { icon: Briefcase, label: 'פרויקטים' },
                        { icon: FileText, label: 'הצעות' },
                        { icon: Calendar, label: 'יומן' },
                        { icon: Zap, label: 'אוטומציות' },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-1.5 px-1.5 py-1 rounded text-[9px] ${
                            item.active ? 'bg-zinc-900 text-white' : 'text-zinc-600'
                          }`}
                        >
                          <item.icon className="w-2.5 h-2.5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="col-span-9 p-3">
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-[8px] text-zinc-500">בוקר טוב, יוגב</div>
                        <h3 className="text-sm font-bold">דשבורד</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="bg-zinc-50 border border-zinc-200 rounded px-1.5 py-0.5 flex items-center gap-1 text-[8px] text-zinc-500">
                          <Search className="w-2 h-2" />
                          <span>חפש</span>
                        </div>
                        <div className="w-5 h-5 rounded border border-zinc-200 flex items-center justify-center bg-white">
                          <Bell className="w-2 h-2" />
                        </div>
                      </div>
                    </div>

                    {/* KPIs */}
                    <div className="grid grid-cols-3 gap-1.5 mb-3">
                      {[
                        { label: 'לידים', value: '24', color: 'text-violet-600 bg-violet-50' },
                        { label: 'לקוחות', value: '247', color: 'text-blue-600 bg-blue-50' },
                        { label: 'הכנסות', value: '₪47K', color: 'text-emerald-600 bg-emerald-50' },
                      ].map((kpi, i) => (
                        <div key={i} className="border border-zinc-200 rounded p-1.5">
                          <div className={`w-3 h-3 rounded ${kpi.color} mb-1`}></div>
                          <div className="text-xs font-bold">{kpi.value}</div>
                          <div className="text-[8px] text-zinc-500">{kpi.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* List */}
                    <div className="border border-zinc-200 rounded">
                      <div className="px-2 py-1.5 border-b border-zinc-100">
                        <div className="text-[9px] font-bold">לידים אחרונים</div>
                      </div>
                      {[
                        { name: 'דוד כהן', company: 'ויזיון', value: '₪12.5K', color: 'bg-blue-100 text-blue-700', status: 'חדש' },
                        { name: 'שרה לוי', company: 'פיקסל', value: '₪28K', color: 'bg-amber-100 text-amber-700', status: 'בטיפול' },
                        { name: 'מיכאל ר.', company: 'TechFlow', value: '₪8.7K', color: 'bg-rose-100 text-rose-700', status: 'חם' },
                      ].map((lead, i) => (
                        <div key={i} className="px-2 py-1.5 flex items-center gap-1.5 border-b border-zinc-100 last:border-0">
                          <div className="w-4 h-4 rounded-full bg-zinc-100 flex items-center justify-center text-[7px] font-bold">
                            {lead.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[9px] font-medium truncate">{lead.name}</div>
                            <div className="text-[7px] text-zinc-500 flex items-center gap-0.5">
                              <Building2 className="w-2 h-2" />
                              {lead.company}
                            </div>
                          </div>
                          <div className="text-[9px] font-semibold tabular-nums">{lead.value}</div>
                          <span className={`text-[7px] font-medium px-1 py-0.5 rounded ${lead.color}`}>
                            {lead.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification card */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl border border-zinc-200 shadow-xl p-3 max-w-[200px] hidden xl:block">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold mb-0.5">תשלום התקבל!</div>
                    <div className="text-[10px] text-zinc-500">₪12,500 מ-דוד כהן</div>
                  </div>
                </div>
              </div>

              {/* Floating chart card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl border border-zinc-200 shadow-xl p-3 hidden xl:block">
                <div className="text-[10px] text-zinc-500 mb-1">הכנסות החודש</div>
                <div className="text-lg font-bold mb-2">₪47,250</div>
                <div className="flex items-end gap-0.5 h-8">
                  {[40, 65, 45, 80, 55, 90, 70, 100, 85].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-violet-500 to-fuchsia-500 rounded-sm"
                      style={{ height: `${h}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom text */}
            <div className="mt-12 text-center max-w-md mx-auto">
              <p className="text-zinc-600 text-sm leading-relaxed">
                ה-CRM הישראלי שמרגיש <span className="font-semibold text-zinc-900">שעובד בשבילך</span>, לא להפך.
              </p>
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                  עברית מלאה
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                  RTL
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                  אבטחה מלאה
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
