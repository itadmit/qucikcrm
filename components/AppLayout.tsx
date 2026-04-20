"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Footer } from "./Footer"
import { useToast } from "@/components/ui/use-toast"

interface AppLayoutProps {
  children: React.ReactNode
  title?: string
  hideSidebar?: boolean
  hideHeader?: boolean
  fullWidth?: boolean
}

export function AppLayout({ children, title, hideSidebar = false, hideHeader = false, fullWidth = false }: AppLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/notifications')
        if (response.ok) {
          const notifications = await response.json()
          const unread = notifications.filter((n: any) => !n.isRead).length
          setUnreadNotifications(unread)
        }
      } catch (error) {
        console.error('Error fetching notifications count:', error)
      }
    }

    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (pathname?.startsWith("/invite") || pathname?.startsWith("/register")) {
      return
    }

    if (status === "unauthenticated" && session === null) {
      const userDeleted = sessionStorage.getItem("user_deleted")
      if (userDeleted === "true") {
        toast({
          title: "החשבון נמחק",
          description: "החשבון שלך נמחק מהמערכת. יש להתחבר מחדש.",
          variant: "destructive",
        })
        sessionStorage.removeItem("user_deleted")
      }
      router.push("/login")
    }
  }, [status, session, router, toast, pathname])

  const handleMobileClose = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  const handleMenuToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  if (hideSidebar && hideHeader) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f7f9fe' }} dir="rtl">
        <main className="flex items-center justify-center py-12">
          <div className="w-full max-w-md px-4">
            {children}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#f7f9fe' }} dir="rtl">
      {!hideSidebar && (
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onMobileClose={handleMobileClose}
          externalUnreadCount={unreadNotifications}
        />
      )}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {!hideHeader && <Header title={title} onMenuToggle={handleMenuToggle} externalUnreadCount={unreadNotifications} />}
        <main className={`flex-1 ${fullWidth ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          {fullWidth ? (
            <div className="h-full">
              {children}
            </div>
          ) : (
            <div className="min-h-full flex flex-col">
              <div className="flex-1 p-3 sm:p-4 lg:p-6">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </div>
              <Footer />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
