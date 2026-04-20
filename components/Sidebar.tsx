"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  UserPlus,
  Users,
  FolderKanban,
  CheckSquare,
  Coins,
  BarChart3,
  Settings,
  Sparkles,
  Inbox,
  Calendar,
  Clock,
  TrendingUp,
  Plug,
  Workflow,
  FileText,
  CreditCard,
  X,
  ArrowRight,
} from "lucide-react"
import { InvitePeopleDialog } from "@/components/dialogs/InvitePeopleDialog"

const menuItems = [
  { icon: Home, label: "בית", href: "/dashboard", permission: "dashboard" },
  { icon: CheckSquare, label: "המשימות שלי", href: "/tasks/my", permission: "tasks" },
  { icon: Calendar, label: "לוח שנה", href: "/calendar", permission: "calendar" },
  { icon: Clock, label: "שעון נוכחות", href: "/attendance", permission: "attendance" },
  { icon: Inbox, label: "התראות", href: "/notifications", hasBadge: true, permission: "notifications" },
  { icon: TrendingUp, label: "דוחות ואנליטיקה", href: "/reports", permission: "reports" },
]

const projectItems = [
  { label: "לידים", href: "/leads", color: "bg-violet-500", permission: "leads" },
  { label: "לקוחות", href: "/clients", color: "bg-blue-500", permission: "clients" },
  { label: "פרויקטים", href: "/projects", color: "bg-cyan-500", permission: "projects" },
  { label: "מסמכים", href: "/quotes", color: "bg-green-500", permission: "quotes" },
  { label: "תשלומים", href: "/payments", color: "bg-orange-500", permission: "payments" },
]

const settingsItems = [
  { icon: Settings, label: "הגדרות", href: "/settings", permission: "settings" },
  { icon: Plug, label: "אינטגרציות", href: "/settings/integrations", permission: "integrations" },
  { icon: Workflow, label: "אוטומציות", href: "/automations", permission: "automations" },
]

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
  externalUnreadCount?: number
}

export function Sidebar({ mobileOpen, onMobileClose, externalUnreadCount }: SidebarProps) {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})
  const [loadingPermissions, setLoadingPermissions] = useState(true)

  useEffect(() => {
    if (externalUnreadCount !== undefined) {
      setUnreadCount(externalUnreadCount)
    }
  }, [externalUnreadCount])

  useEffect(() => {
    fetchPermissions()
  }, [])

  // Close on route change (mobile)
  useEffect(() => {
    if (onMobileClose) onMobileClose()
  }, [pathname])

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/users/permissions')
      if (response.ok) {
        const data = await response.json()
        setPermissions(data.permissions || {})
      }
    } catch (error) {
      console.error('Error fetching permissions:', error)
      setPermissions({
        dashboard: true, tasks: true, calendar: true, attendance: true,
        notifications: true, reports: true, leads: true, clients: true,
        projects: true, quotes: true, payments: true, settings: true,
        integrations: true, automations: true,
      })
    } finally {
      setLoadingPermissions(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications?countOnly=true')
      if (response.ok) {
        const data = await response.json()
        if (typeof data === 'number') {
          setUnreadCount(data)
        } else if (Array.isArray(data)) {
          setUnreadCount(data.filter((n: any) => !n.isRead).length)
        } else if (data.unreadCount !== undefined) {
          setUnreadCount(data.unreadCount)
        }
      }
    } catch (error) {
      console.error('Error fetching notifications count:', error)
    }
  }

  const hasPermission = (permission?: string) => {
    if (!permission) return true
    return permissions[permission] === true
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="py-5 px-5 border-b border-zinc-200/70 min-h-[72px] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-sm shadow-violet-200">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-xl font-pacifico text-zinc-900 leading-none"
              style={{ letterSpacing: '0.5px' }}
            >
              Quick crm
            </span>
            <span className="text-[9px] font-bold text-violet-700 bg-violet-100 px-1.5 py-0.5 rounded">
              v2
            </span>
          </div>
        </Link>
        {onMobileClose && (
          <button onClick={onMobileClose} className="lg:hidden p-1 rounded-lg hover:bg-zinc-100 text-zinc-500">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        <nav className="space-y-0.5">
          {menuItems
            .filter((item) => hasPermission(item.permission))
            .map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all relative",
                    isActive
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  )}
                >
                  <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-900")} strokeWidth={2} />
                  <span className="flex-1">{item.label}</span>
                  {item.hasBadge && unreadCount > 0 && (
                    <span className={cn(
                      "text-[10px] font-bold rounded-full inline-flex items-center justify-center shrink-0",
                      unreadCount > 9 ? "h-5 px-1.5 min-w-[20px]" : "h-5 w-5",
                      isActive
                        ? "bg-white text-zinc-900"
                        : "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white"
                    )}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
        </nav>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              עבודה
            </h3>
            <button className="text-zinc-400 hover:text-zinc-700 transition-colors">
              <span className="text-base leading-none">+</span>
            </button>
          </div>
          <nav className="space-y-0.5">
            {projectItems
              .filter((item) => hasPermission(item.permission))
              .map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-violet-50 text-violet-900"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    )}
                  >
                    <div className={cn(
                      "w-2 h-2 rounded-full shrink-0 transition-transform",
                      item.color,
                      isActive && "ring-2 ring-offset-1 ring-violet-300 scale-110"
                    )} />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                )
              })}
          </nav>
        </div>

        {/* Settings Section */}
        <div>
          <div className="px-3 mb-2">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              הגדרות
            </h3>
          </div>
          <nav className="space-y-0.5">
            {settingsItems
              .filter((item) => hasPermission(item.permission))
              .map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href ||
                  (pathname.startsWith(item.href + '/') &&
                    !settingsItems.some(otherItem =>
                      otherItem.href !== item.href &&
                      pathname.startsWith(otherItem.href + '/') &&
                      otherItem.href.length > item.href.length
                    ))
                const isIntegrationsPage = pathname.startsWith('/settings/integrations')
                const finalIsActive = isIntegrationsPage && item.href === '/settings'
                  ? false
                  : isActive

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      finalIsActive
                        ? "bg-zinc-900 text-white shadow-sm"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 shrink-0", finalIsActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-900")} strokeWidth={2} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
          </nav>
        </div>
      </div>

      {/* Bottom Section - clean upgrade card */}
      <div className="p-3 border-t border-zinc-200/70">
        <div className="relative bg-white rounded-xl border border-zinc-200 p-3.5 overflow-hidden">
          <div className="absolute -top-8 -left-8 w-24 h-24 bg-violet-200/40 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-fuchsia-200/40 rounded-full blur-2xl"></div>

          <div className="relative">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-bold text-zinc-900">הזמן את הצוות</span>
            </div>
            <p className="text-zinc-500 text-[11px] mb-2.5 leading-relaxed">
              הוסף משתמשים והתחל לעבוד יחד בזמן אמת.
            </p>
            <InvitePeopleDialog
              triggerButton={
                <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-colors flex items-center justify-center gap-1.5">
                  <UserPlus className="w-3 h-3" />
                  הזמן אנשים
                </button>
              }
            />
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 h-screen bg-[#FAFAF7] border-l border-zinc-200/70 flex-col shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={onMobileClose} />
          <div className="relative w-72 max-w-[85vw] h-full bg-[#FAFAF7] border-l border-zinc-200 flex flex-col shadow-xl z-10 mr-auto">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
