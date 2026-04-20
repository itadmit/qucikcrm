"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Bell, Search, ChevronDown, Settings, LogOut, User, UserPlus, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NotificationsDrawer } from "@/components/NotificationsDrawer"
import { InvitePeopleDialog } from "@/components/dialogs/InvitePeopleDialog"

interface HeaderProps {
  title?: string
  onMenuToggle?: () => void
  externalUnreadCount?: number
}

export function Header({ title, onMenuToggle, externalUnreadCount }: HeaderProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)

  const unreadCount = externalUnreadCount ?? 0

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="h-14 lg:h-16 border-b border-zinc-200/70 bg-[#FAFAF7]/80 backdrop-blur-md flex items-center justify-between px-3 lg:px-6 shrink-0">
      <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -mr-1 rounded-lg hover:bg-zinc-100 text-zinc-600"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title && (
          <h1 className="text-lg lg:text-2xl font-bold text-zinc-900 truncate tracking-tight">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-1.5 lg:gap-3">
        {/* Search - hidden on small mobile */}
        <div className="relative hidden sm:block w-40 lg:w-64">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            type="search"
            placeholder="חיפוש..."
            className="pr-10 h-9 lg:h-9 text-sm bg-white border-zinc-200 focus-visible:ring-violet-500/20 focus-visible:border-zinc-900"
          />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg hover:bg-zinc-100"
          onClick={() => setNotificationsOpen(true)}
        >
          <Bell className="w-4 h-4 text-zinc-600" strokeWidth={2} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>

        <NotificationsDrawer open={notificationsOpen} onOpenChange={setNotificationsOpen} />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 lg:gap-2 hover:bg-zinc-100 rounded-lg p-1 lg:p-1.5 transition-colors">
              <Avatar className="w-8 h-8 ring-2 ring-white shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-xs font-semibold">
                  {session?.user?.name ? getUserInitials(session.user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-zinc-900 leading-tight">
                  {session?.user?.name || "משתמש"}
                </div>
                <div className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                  {session?.user?.role === "SUPER_ADMIN" && "סופר אדמין"}
                  {session?.user?.role === "ADMIN" && "מנהל"}
                  {session?.user?.role === "MANAGER" && "מנהל צוות"}
                  {session?.user?.role === "USER" && "משתמש"}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{session?.user?.name}</p>
                <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <User className="ml-2 h-4 w-4" />
              <span>הפרופיל שלי</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="ml-2 h-4 w-4" />
              <span>הגדרות</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="ml-2 h-4 w-4" />
              <span>הזמן צוות</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="ml-2 h-4 w-4" />
              <span>התנתק</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <InvitePeopleDialog
          open={inviteDialogOpen}
          onOpenChange={setInviteDialogOpen}
        />
      </div>
    </header>
  )
}
