"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Upload, MoreVertical, Eye, Edit, Trash, Building } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { NewClientDialog } from "@/components/dialogs/NewClientDialog"
import { EditClientDialog } from "@/components/dialogs/EditClientDialog"
import { TableSkeleton } from "@/components/skeletons/TableSkeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  status: string
  owner: { name: string } | null
  projects: Array<{ id: string; name: string; status: string }>
  _count: { projects: number; budgets: number }
  createdAt: string
}

export default function ClientsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const data = await response.json()
        setClients(data)
      } else {
        toast({
          title: "שגיאה",
          description: "לא ניתן לטעון את הלקוחות",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בטעינת הלקוחות",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  )

  const handleDeleteClient = async (clientId: string, clientName: string) => {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את הלקוח "${clientName}"? פעולה זו תמחק גם את כל הפרויקטים והמשימות הקשורים.`)) {
      return
    }

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "לקוח נמחק",
          description: `הלקוח ${clientName} נמחק בהצלחה`,
        })
        fetchClients()
      } else {
        toast({
          title: "שגיאה",
          description: "לא ניתן למחוק את הלקוח",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting client:', error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה במחיקת הלקוח",
        variant: "destructive",
      })
    }
  }

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INACTIVE: "bg-zinc-50 text-zinc-700 border-zinc-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  }

  const statusDots: Record<string, string> = {
    ACTIVE: "bg-emerald-500",
    INACTIVE: "bg-zinc-400",
    PENDING: "bg-amber-500",
  }

  const statusLabels: Record<string, string> = {
    ACTIVE: "פעיל",
    INACTIVE: "לא פעיל",
    PENDING: "בהמתנה",
  }

  const activeClients = clients.filter(c => c.status === 'ACTIVE').length
  const totalProjects = clients.reduce((sum, c) => sum + c._count.projects, 0)

  if (loading) {
    return (
      <AppLayout>
        <TableSkeleton rows={5} columns={7} />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-600" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">לקוחות</h1>
              <p className="text-sm text-zinc-500 mt-0.5">נהל את כל הלקוחות שלך במקום אחד</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 ml-1.5" />
              ייבוא CSV
            </Button>
            <NewClientDialog onClientCreated={fetchClients} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "סה״כ לקוחות", value: clients.length, iconBg: "bg-zinc-100 text-zinc-700" },
            { label: "לקוחות פעילים", value: activeClients, iconBg: "bg-emerald-50 text-emerald-600" },
            { label: "סה״כ פרויקטים", value: totalProjects, iconBg: "bg-blue-50 text-blue-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-zinc-200/70 rounded-2xl p-5">
              <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center mb-3`}>
                <Building className="w-4 h-4" strokeWidth={2.2} />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight tabular-nums">{s.value}</div>
              <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-zinc-200/70 rounded-2xl p-3">
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="חיפוש לפי שם, אימייל או טלפון..."
                className="pr-10 h-9 border-zinc-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 ml-1.5" />
              סינון
            </Button>
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white border border-zinc-200/70 rounded-2xl overflow-hidden">
          {filteredClients.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-50 flex items-center justify-center mb-4">
                <Building className="w-6 h-6 text-zinc-300" strokeWidth={1.8} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 mb-1.5 tracking-tight">
                {searchTerm ? "לא נמצאו לקוחות" : "אין לקוחות עדיין"}
              </h3>
              <p className="text-sm text-zinc-500 mb-5 max-w-sm mx-auto">
                {searchTerm
                  ? "נסה לחפש במונח אחר"
                  : "התחל על ידי יצירת לקוח חדש או המרת ליד ללקוח"}
              </p>
              {!searchTerm && <NewClientDialog onClientCreated={fetchClients} />}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200/70 bg-zinc-50/50">
                    <th className="text-right py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-zinc-500">שם הלקוח</th>
                    <th className="text-right py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-zinc-500">אימייל</th>
                    <th className="text-right py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-zinc-500">טלפון</th>
                    <th className="text-right py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-zinc-500">סטטוס</th>
                    <th className="text-right py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-zinc-500">פרויקטים</th>
                    <th className="text-right py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-zinc-500">אחראי</th>
                    <th className="text-right py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-zinc-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b border-zinc-100 hover:bg-zinc-50/60 cursor-pointer transition-colors"
                      onClick={() => router.push(`/clients/${client.id}`)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm">
                            {client.name.charAt(0)}
                          </div>
                          <div className="font-semibold text-sm text-zinc-900">{client.name}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-zinc-600">{client.email || "-"}</td>
                      <td className="py-3 px-4 text-sm text-zinc-600 tabular-nums">{client.phone || "-"}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border ${statusColors[client.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDots[client.status]}`}></span>
                          {statusLabels[client.status]}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-zinc-700 font-medium tabular-nums">{client._count.projects}</td>
                      <td className="py-3 px-4 text-sm text-zinc-600">{client.owner?.name || "-"}</td>
                      <td className="py-3 px-4 text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/clients/${client.id}`)
                            }} className="flex items-center gap-2">
                              <Eye className="w-4 h-4 flex-shrink-0" />
                              <span>צפה בפרטים</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation()
                              setEditingClient(client)
                            }} className="flex items-center gap-2">
                              <Edit className="w-4 h-4 flex-shrink-0" />
                              <span>ערוך</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-rose-600 flex items-center gap-2"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteClient(client.id, client.name)
                              }}
                            >
                              <Trash className="w-4 h-4 flex-shrink-0" />
                              <span>מחק</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Client Dialog */}
      {editingClient && (
        <EditClientDialog
          client={editingClient}
          open={!!editingClient}
          onOpenChange={(open) => !open && setEditingClient(null)}
          onClientUpdated={fetchClients}
        />
      )}
    </AppLayout>
  )
}
