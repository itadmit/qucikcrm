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
  { label: "לידים", href: "/leads", color: "bg-purple-500", permission: "leads" },
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
      <div className="py-6 px-6 border-b border-gray-200 min-h-[80px] flex items-center justify-between">
        <Link href="/dashboard" className="block">
          <span
            className="text-3xl font-pacifico prodify-gradient-text block leading-relaxed"
            style={{ letterSpacing: '2px', paddingBottom: '4px' }}
          >
            Quick crm
          </span>
        </Link>
        {onMobileClose && (
          <button onClick={onMobileClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-200 text-gray-500">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        <nav className="space-y-1">
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
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.hasBadge && unreadCount > 0 && (
                    <span className="prodify-gradient text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
        </nav>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              הפרויקטים שלי
            </h3>
            <button className="text-gray-400 hover:text-gray-600">
              <span className="text-lg">+</span>
            </button>
          </div>
          <nav className="space-y-1">
            {projectItems
              .filter((item) => hasPermission(item.permission))
              .map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <div className={cn("w-3 h-3 rounded-full", item.color)} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
          </nav>
        </div>

        {/* Settings Section */}
        <nav className="space-y-1">
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
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    finalIsActive
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="rounded-xl p-4 text-white text-sm" style={{
          background: 'linear-gradient(135deg, #6f65e2 0%, #b965e2 100%)'
        }}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-pacifico text-lg" style={{ letterSpacing: '1px' }}>Quick crm</span>
          </div>
          <p className="text-white/80 text-xs mb-3">
            משתמשים חדשים מקבלים גישה ל-Dashboards-1 Spaces, Docs וצ׳וברהיים
          </p>
          <InvitePeopleDialog
            triggerButton={
              <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
                + הזמן אנשים
              </button>
            }
          />
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 h-screen bg-gradient-to-b from-gray-50 to-gray-100 border-l border-gray-200 flex-col shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile overlay + drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={onMobileClose} />
          <div className="relative w-72 max-w-[85vw] h-full bg-gradient-to-b from-gray-50 to-gray-100 border-l border-gray-200 flex flex-col shadow-xl z-10 mr-auto">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
