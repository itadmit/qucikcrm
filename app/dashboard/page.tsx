"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Users, FolderKanban, Coins, TrendingUp, CheckSquare, Calendar, Bell, Clock, AlertCircle, Circle, CheckCircle2, User, ChevronLeft, ArrowUpRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton"

interface Stats {
  leads: { total: number; new7Days: number }
  clients: { total: number; active: number }
  projects: { total: number; open: number }
  budgets: { total: number; pending: number }
  myTasks: Array<{
    id: string
    title: string
    status: string
    priority: string
    dueDate: string | null
    project: { name: string } | null
    assignee: { name: string; email: string } | null
  }>
  upcomingEvents: Array<{
    id: string
    title: string
    startTime: string
    endTime: string
    location: string | null
  }>
  recentNotifications: Array<{
    id: string
    title: string
    message: string
    type: string
    isRead: boolean
    createdAt: string
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats>({
    leads: { total: 0, new7Days: 0 },
    clients: { total: 0, active: 0 },
    projects: { total: 0, open: 0 },
    budgets: { total: 0, pending: 0 },
    myTasks: [],
    upcomingEvents: [],
    recentNotifications: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  const priorityConfig: Record<string, { label: string; color: string; icon: any; bg: string }> = {
    URGENT: { label: "דחוף", color: "text-red-700", icon: AlertCircle, bg: "bg-red-50 border-red-200" },
    HIGH: { label: "גבוהה", color: "text-orange-700", icon: AlertCircle, bg: "bg-orange-50 border-orange-200" },
    NORMAL: { label: "רגילה", color: "text-blue-700", icon: Circle, bg: "bg-blue-50 border-blue-200" },
    LOW: { label: "נמוכה", color: "text-zinc-700", icon: Circle, bg: "bg-zinc-50 border-zinc-200" },
  }

  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return 'ללא תאריך'
    const date = new Date(dueDate)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'היום'
    if (diffDays === 1) return 'מחר'
    if (diffDays < 0) return 'באיחור'
    return `בעוד ${diffDays} ימים`
  }

  if (loading) {
    return (
      <AppLayout>
        <DashboardSkeleton />
      </AppLayout>
    )
  }

  const inProgressTasks = stats.myTasks.filter(t => t.status === 'IN_PROGRESS')
  const todoTasks = stats.myTasks.filter(t => t.status === 'TODO')

  const statsCards = [
    {
      label: "לידים חדשים",
      sublabel: `סה״כ ${stats.leads.total}`,
      value: stats.leads.new7Days.toString(),
      icon: UserPlus,
      iconBg: "bg-violet-50 text-violet-600",
      onClick: () => router.push('/leads'),
    },
    {
      label: "לקוחות פעילים",
      sublabel: `סה״כ ${stats.clients.total}`,
      value: stats.clients.active.toString(),
      icon: Users,
      iconBg: "bg-blue-50 text-blue-600",
      onClick: () => router.push('/clients'),
    },
    {
      label: "פרויקטים פתוחים",
      sublabel: `סה״כ ${stats.projects.total}`,
      value: stats.projects.open.toString(),
      icon: FolderKanban,
      iconBg: "bg-cyan-50 text-cyan-600",
      onClick: () => router.push('/projects'),
    },
    {
      label: "תקציבים",
      sublabel: `₪${(stats.budgets.pending / 1000).toFixed(0)}K ממתינים`,
      value: `₪${(stats.budgets.total / 1000).toFixed(0)}K`,
      icon: Coins,
      iconBg: "bg-emerald-50 text-emerald-600",
      onClick: undefined,
    },
  ]

  return (
    <AppLayout>
      {/* Welcome Section */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs text-zinc-500">
                {new Date().toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight">
              שלום, {session?.user?.name || 'משתמש'}.
            </h1>
            <p className="text-sm sm:text-base text-zinc-500 mt-1.5">
              איך אני יכול לעזור לך היום?
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm h-9 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300" onClick={() => router.push('/tasks/my')}>
              עדכוני משימות
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm h-9 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300" onClick={() => router.push('/projects')}>
              פרויקט חדש
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm h-9 border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 hidden sm:inline-flex" onClick={() => router.push('/clients')}>
              הוסף לקוח
            </Button>
            <Button size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs sm:text-sm h-9 shadow-sm" onClick={() => router.push('/tasks/my')}>
              + הוסף משימה
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 lg:mb-8">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={i}
              onClick={stat.onClick}
              className={`group relative bg-white border border-zinc-200/70 rounded-2xl p-4 sm:p-5 transition-all hover:border-zinc-300 hover:shadow-sm ${stat.onClick ? 'cursor-pointer' : ''}`}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className={`w-9 h-9 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" strokeWidth={2.2} />
                </div>
                {stat.onClick && (
                  <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                )}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight tabular-nums">{stat.value}</div>
              <div className="mt-1.5 flex items-center gap-2">
                <p className="text-xs sm:text-sm text-zinc-700 font-medium">{stat.label}</p>
                <span className="text-[10px] sm:text-xs text-zinc-400">·</span>
                <p className="text-[10px] sm:text-xs text-zinc-500">{stat.sublabel}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Left Column - My Tasks + Notifications */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {/* My Tasks Card */}
          <Card className="border border-zinc-200/70 shadow-none rounded-2xl">
            <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                    <CheckSquare className="w-4 h-4 text-violet-600" strokeWidth={2.2} />
                  </div>
                  <CardTitle className="text-base sm:text-lg font-semibold text-zinc-900 tracking-tight">המשימות שלי</CardTitle>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => router.push('/tasks/my')}
                  className="text-zinc-600 hover:text-zinc-900 p-0 h-auto font-medium text-xs sm:text-sm gap-1"
                >
                  ראה הכל
                  <ChevronLeft className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {stats.myTasks.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-zinc-500">
                  <CheckSquare className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">אין משימות פעילות כרגע</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => router.push('/tasks/my')}
                  >
                    + צור משימה חדשה
                  </Button>
                </div>
              ) : (
                <>
                  {/* In Progress Section */}
                  {inProgressTasks.length > 0 && (
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2.5 px-1">
                        <div className="flex items-center gap-1.5 bg-cyan-50 text-cyan-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                          בתהליך
                        </div>
                        <span className="text-[11px] text-zinc-500">{inProgressTasks.length} משימות</span>
                      </div>
                      <div className="space-y-1.5">
                        {inProgressTasks.slice(0, 3).map((task) => {
                          const priority = priorityConfig[task.priority] || priorityConfig.NORMAL
                          const PriorityIcon = priority.icon
                          return (
                            <div
                              key={task.id}
                              className="px-3 py-2.5 bg-zinc-50/50 hover:bg-white border border-transparent hover:border-zinc-200 transition-all cursor-pointer group rounded-xl"
                              onClick={() => router.push(`/tasks/${task.id}`)}
                            >
                              <div className="flex items-start gap-2.5 sm:gap-3">
                                <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-cyan-400 flex items-center justify-center flex-shrink-0 hidden sm:flex">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-zinc-900 leading-tight mb-1 text-sm">{task.title}</div>
                                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                    <div className={`flex items-center gap-1 text-[10px] sm:text-xs ${priority.color}`}>
                                      <PriorityIcon className="w-3 h-3" />
                                      {priority.label}
                                    </div>
                                    {task.dueDate && (
                                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-500">
                                        <Clock className="w-3 h-3" />
                                        {formatDueDate(task.dueDate)}
                                      </div>
                                    )}
                                    {task.project && (
                                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-500 hidden sm:flex">
                                        <FolderKanban className="w-3 h-3" />
                                        {task.project.name}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <ChevronLeft className="w-4 h-4 text-zinc-300 group-hover:text-zinc-700 transition-colors flex-shrink-0 mt-1" />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* To Do Section */}
                  {todoTasks.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2.5 px-1">
                        <div className="flex items-center gap-1.5 bg-zinc-100 text-zinc-700 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400"></div>
                          לביצוע
                        </div>
                        <span className="text-[11px] text-zinc-500">{todoTasks.length} משימות</span>
                      </div>
                      <div className="space-y-1.5">
                        {todoTasks.slice(0, 3).map((task) => {
                          const priority = priorityConfig[task.priority] || priorityConfig.NORMAL
                          const PriorityIcon = priority.icon
                          return (
                            <div
                              key={task.id}
                              className="px-3 py-2.5 bg-zinc-50/50 hover:bg-white border border-transparent hover:border-zinc-200 transition-all cursor-pointer group rounded-xl"
                              onClick={() => router.push(`/tasks/${task.id}`)}
                            >
                              <div className="flex items-start gap-2.5 sm:gap-3">
                                <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-zinc-300 hover:border-zinc-400 flex-shrink-0 hidden sm:block" />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-zinc-900 leading-tight mb-1 text-sm">{task.title}</div>
                                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                    <div className={`flex items-center gap-1 text-[10px] sm:text-xs ${priority.color}`}>
                                      <PriorityIcon className="w-3 h-3" />
                                      {priority.label}
                                    </div>
                                    {task.dueDate && (
                                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-500">
                                        <Clock className="w-3 h-3" />
                                        {formatDueDate(task.dueDate)}
                                      </div>
                                    )}
                                    {task.project && (
                                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-500 hidden sm:flex">
                                        <FolderKanban className="w-3 h-3" />
                                        {task.project.name}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <ChevronLeft className="w-4 h-4 text-zinc-300 group-hover:text-zinc-700 transition-colors flex-shrink-0 mt-1" />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 mt-1"
                    onClick={() => router.push('/tasks/my')}
                  >
                    + הוסף משימה
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card className="border border-zinc-200/70 shadow-none rounded-2xl">
            <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-50 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-fuchsia-600" strokeWidth={2.2} />
                  </div>
                  <CardTitle className="text-base sm:text-lg font-semibold text-zinc-900 tracking-tight">התראות אחרונות</CardTitle>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => router.push('/notifications')}
                  className="text-zinc-600 hover:text-zinc-900 p-0 h-auto font-medium text-xs sm:text-sm gap-1"
                >
                  ראה הכל
                  <ChevronLeft className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {stats.recentNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-zinc-50 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-zinc-400" strokeWidth={2} />
                  </div>
                  <p className="text-sm text-zinc-500 mb-4">
                    אין התראות חדשות
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
                    onClick={() => router.push('/notifications')}
                  >
                    ראה התראות
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stats.recentNotifications.slice(0, 4).map(notif => {
                    const getNotifIcon = () => {
                      switch (notif.type) {
                        case 'task': return CheckSquare
                        case 'lead': return UserPlus
                        case 'reminder': return Bell
                        case 'document': return Coins
                        default: return Bell
                      }
                    }
                    const NotifIcon = getNotifIcon()
                    return (
                      <div
                        key={notif.id}
                        className={`p-3 hover:bg-white rounded-xl cursor-pointer transition-all border ${notif.isRead ? 'border-transparent bg-zinc-50/40 opacity-70' : 'border-violet-100 bg-violet-50/40 hover:border-violet-200'}`}
                        onClick={() => router.push('/notifications')}
                      >
                        <div className="flex items-start gap-2.5">
                          <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${notif.isRead ? 'bg-zinc-100' : 'bg-gradient-to-br from-violet-600 to-fuchsia-600'}`}>
                            <NotifIcon className={`w-3.5 h-3.5 ${notif.isRead ? 'text-zinc-500' : 'text-white'}`} strokeWidth={2.2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-zinc-900 text-xs sm:text-sm mb-0.5 truncate">{notif.title}</div>
                            <div className="text-[10px] sm:text-xs text-zinc-500 truncate">{notif.message}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Calendar + Stats */}
        <div className="space-y-4 lg:space-y-6">
          {/* Mini Calendar */}
          <Card className="border border-zinc-200/70 shadow-none rounded-2xl overflow-hidden">
            <CardHeader className="pb-3 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" strokeWidth={2.2} />
                  </div>
                  <CardTitle className="text-base sm:text-lg font-semibold text-zinc-900 tracking-tight">לוח שנה</CardTitle>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => router.push('/calendar')}
                  className="text-zinc-600 hover:text-zinc-900 p-0 h-auto font-medium text-xs sm:text-sm gap-1"
                >
                  פתח
                  <ChevronLeft className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              {/* Mini Calendar Grid */}
              <div className="mb-4">
                <div className="text-center font-semibold text-zinc-900 mb-3 text-sm">
                  {new Date().toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(day => (
                    <div key={day} className="text-zinc-400 font-semibold text-[10px] uppercase h-7 flex items-center justify-center">{day}</div>
                  ))}
                  {(() => {
                    const now = new Date()
                    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
                    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
                    const startDayOfWeek = firstDay.getDay()
                    const daysInMonth = lastDay.getDate()
                    const today = now.getDate()

                    const days = []
                    for (let i = 0; i < startDayOfWeek; i++) {
                      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>)
                    }
                    for (let day = 1; day <= daysInMonth; day++) {
                      const hasEvent = stats.upcomingEvents.some(event => {
                        const eventDate = new Date(event.startTime)
                        return eventDate.getDate() === day &&
                               eventDate.getMonth() === now.getMonth() &&
                               eventDate.getFullYear() === now.getFullYear()
                      })
                      days.push(
                        <div
                          key={day}
                          className={`h-8 w-8 rounded-lg cursor-pointer transition-all flex items-center justify-center text-xs relative ${
                            day === today
                              ? 'bg-zinc-900 text-white font-bold shadow-sm'
                              : hasEvent
                                ? 'bg-violet-50 text-violet-700 font-semibold hover:bg-violet-100'
                                : 'text-zinc-700 hover:bg-zinc-100'
                          }`}
                          onClick={() => router.push('/calendar')}
                        >
                          {day}
                          {hasEvent && day !== today && (
                            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-fuchsia-500"></span>
                          )}
                        </div>
                      )
                    }
                    return days
                  })()}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="border-t border-zinc-100 pt-3">
                <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">פגישות קרובות</div>
                {stats.upcomingEvents.length === 0 ? (
                  <p className="text-xs text-zinc-400 text-center py-3">אין פגישות קרובות</p>
                ) : (
                  <div className="space-y-1.5">
                    {stats.upcomingEvents.slice(0, 3).map(event => {
                      const startDate = new Date(event.startTime)
                      return (
                        <div
                          key={event.id}
                          className="px-2.5 py-2 hover:bg-zinc-50 rounded-lg cursor-pointer transition-colors group"
                          onClick={() => router.push('/calendar')}
                        >
                          <div className="font-medium text-zinc-900 truncate text-xs sm:text-sm">{event.title}</div>
                          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-zinc-500 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {startDate.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })} · {startDate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats - Hero card with violet/fuchsia gradient */}
          <div className="relative overflow-hidden rounded-2xl bg-zinc-900 text-white p-5">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-violet-500/40 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-fuchsia-500/30 rounded-full blur-3xl"></div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-violet-300" strokeWidth={2.2} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300">סקירה</span>
              </div>
              <h3 className="text-base font-semibold mb-4">סטטיסטיקות מהירות</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs text-zinc-400">לידים חדשים (7 ימים)</span>
                  <span className="text-base font-bold tabular-nums bg-gradient-to-br from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                    {stats.leads.new7Days}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs text-zinc-400">לקוחות פעילים</span>
                  <span className="text-base font-bold tabular-nums text-white">
                    {stats.clients.active}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs text-zinc-400">פרויקטים פתוחים</span>
                  <span className="text-base font-bold tabular-nums text-white">
                    {stats.projects.open}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">המשימות שלי</span>
                  <span className="text-base font-bold tabular-nums text-white">
                    {stats.myTasks.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
