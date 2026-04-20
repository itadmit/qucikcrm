"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Upload, MoreVertical, Eye, Edit, Trash, UserPlus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { NewLeadDialog } from "@/components/dialogs/NewLeadDialog"
import { EditLeadDialog } from "@/components/dialogs/EditLeadDialog"
import { TableSkeleton } from "@/components/skeletons/TableSkeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Lead {
  id: string
  name: string
  email: string | null
  phone: string | null
  source: string | null
  status: string
  notes: string | null
  owner: { name: string } | null
  stage: { name: string; order: number } | null
  createdAt: string
}

export default function LeadsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"table" | "pipeline">("table")
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingLead, setEditingLead] = useState<Lead | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      if (response.ok) {
        const data = await response.json()
        setLeads(data)
      } else {
        toast({
          title: "שגיאה",
          description: "לא ניתן לטעון את הלידים",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בטעינת הלידים",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.includes(searchTerm)
  )

  const handleDeleteLead = async (leadId: string, leadName: string) => {
    if (!confirm(`האם אתה בטוח שברצונך למחוק את הליד "${leadName}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "ליד נמחק",
          description: `הליד ${leadName} נמחק בהצלחה`,
        })
        fetchLeads()
      } else {
        toast({
          title: "שגיאה",
          description: "לא ניתן למחוק את הליד",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting lead:', error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה במחיקת הליד",
        variant: "destructive",
      })
    }
  }

  const statusColors: Record<string, string> = {
    NEW: "bg-blue-50 text-blue-700 border-blue-200",
    CONTACTED: "bg-amber-50 text-amber-700 border-amber-200",
    QUALIFIED: "bg-violet-50 text-violet-700 border-violet-200",
    PROPOSAL: "bg-orange-50 text-orange-700 border-orange-200",
    WON: "bg-emerald-50 text-emerald-700 border-emerald-200",
    LOST: "bg-rose-50 text-rose-700 border-rose-200",
  }

  const statusDots: Record<string, string> = {
    NEW: "bg-blue-500",
    CONTACTED: "bg-amber-500",
    QUALIFIED: "bg-violet-500",
    PROPOSAL: "bg-orange-500",
    WON: "bg-emerald-500",
    LOST: "bg-rose-500",
  }

  const statusLabels: Record<string, string> = {
    NEW: "חדש",
    CONTACTED: "יצירת קשר",
    QUALIFIED: "מתאים",
    PROPOSAL: "הצעה",
    WON: "נסגר",
    LOST: "אבד",
  }

  // Group leads by status for pipeline view
  const leadsPerStatus = Object.keys(statusLabels).reduce((acc, status) => {
    acc[status] = filteredLeads.filter(lead => lead.status === status)
    return acc
  }, {} as Record<string, Lead[]>)

  const newLeads = leads.filter(l => l.status === 'NEW').length
  const qualifiedLeads = leads.filter(l => l.status === 'QUALIFIED').length

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
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-violet-600" strokeWidth={2.2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">לידים</h1>
              <p className="text-sm text-zinc-500 mt-0.5">נהל את כל הלידים שלך במקום אחד</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 ml-1.5" />
              ייבוא CSV
            </Button>
            <NewLeadDialog onLeadCreated={fetchLeads} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "סה״כ לידים", value: leads.length, iconBg: "bg-zinc-100 text-zinc-700" },
            { label: "לידים חדשים", value: newLeads, iconBg: "bg-blue-50 text-blue-600" },
            { label: "לידים מתאימים", value: qualifiedLeads, iconBg: "bg-violet-50 text-violet-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-zinc-200/70 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center`}>
                  <UserPlus className="w-4 h-4" strokeWidth={2.2} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight tabular-nums">{s.value}</div>
              <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters and View Toggle */}
        <div className="bg-white border border-zinc-200/70 rounded-2xl p-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                type="search"
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
            <div className="flex bg-zinc-100 p-0.5 rounded-lg">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  viewMode === "table" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                טבלה
              </button>
              <button
                onClick={() => setViewMode("pipeline")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  viewMode === "pipeline" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                צינור
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        {viewMode === "table" && (
          <div className="bg-white border border-zinc-200/70 rounded-2xl overflow-hidden">
            {filteredLeads.length === 0 && !loading ? (
              <div className="text-center py-16 px-6">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-50 flex items-center justify-center mb-4">
                  <UserPlus className="w-6 h-6 text-zinc-300" strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-1.5 tracking-tight">
                  {searchTerm ? "לא נמצאו לידים" : "אין לידים עדיין"}
                </h3>
                <p className="text-sm text-zinc-500 mb-5 max-w-sm mx-auto">
                  {searchTerm
                    ? "נסה לחפש במונח אחר"
                    : "התחל על ידי יצירת ליד חדש או הוספה דרך ה-Webhook"}
                </p>
                {!searchTerm && <NewLeadDialog onLeadCreated={fetchLeads} />}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200/70 bg-zinc-50/50">
                      <th className="text-right py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-zinc-500">שם</th>
                      <th className="text-right py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-zinc-500">אימייל</th>
                      <th className="text-right py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-zinc-500">טלפון</th>
                      <th className="text-right py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-zinc-500">מקור</th>
                      <th className="text-right py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-zinc-500">סטטוס</th>
                      <th className="text-right py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-zinc-500">אחראי</th>
                      <th className="text-right py-2.5 px-4 font-semibold text-[11px] uppercase tracking-wider text-zinc-500"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="border-b border-zinc-100 hover:bg-zinc-50/60 cursor-pointer transition-colors group"
                        onClick={() => router.push(`/leads/${lead.id}`)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm">
                              {lead.name.charAt(0)}
                            </div>
                            <div className="font-semibold text-sm text-zinc-900">{lead.name}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-zinc-600">{lead.email || "-"}</td>
                        <td className="py-3 px-4 text-sm text-zinc-600 tabular-nums">{lead.phone || "-"}</td>
                        <td className="py-3 px-4 text-sm text-zinc-600">{lead.source || "-"}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold border ${statusColors[lead.status]}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusDots[lead.status]}`}></span>
                            {statusLabels[lead.status]}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-zinc-600">{lead.owner?.name || "-"}</td>
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
                                router.push(`/leads/${lead.id}`)
                              }} className="flex items-center gap-2">
                                <Eye className="w-4 h-4 flex-shrink-0" />
                                <span>צפה בפרטים</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                setEditingLead(lead)
                              }} className="flex items-center gap-2">
                                <Edit className="w-4 h-4 flex-shrink-0" />
                                <span>ערוך</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-rose-600 flex items-center gap-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteLead(lead.id, lead.name)
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
        )}

        {/* Pipeline View */}
        {viewMode === "pipeline" && (
          <div className="overflow-x-auto">
            <div className="flex gap-3 min-w-max pb-4">
              {Object.keys(statusLabels).map((status) => (
                <div key={status} className="w-72 flex-shrink-0 bg-white border border-zinc-200/70 rounded-2xl">
                  <div className="px-3 pt-3 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${statusDots[status]}`}></span>
                        <h3 className="text-sm font-semibold text-zinc-900">{statusLabels[status]}</h3>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded-md tabular-nums">
                        {leadsPerStatus[status]?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="px-2 pb-2 space-y-1.5">
                    {leadsPerStatus[status]?.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white border border-zinc-200/80 hover:border-zinc-300 hover:shadow-sm rounded-xl p-3 cursor-pointer transition-all"
                        onClick={() => router.push(`/leads/${lead.id}`)}
                      >
                        <div className="font-semibold text-sm text-zinc-900 mb-1.5">{lead.name}</div>
                        {lead.email && <div className="text-xs text-zinc-500 mb-0.5 truncate">{lead.email}</div>}
                        {lead.phone && <div className="text-xs text-zinc-500 mb-1.5 tabular-nums">{lead.phone}</div>}
                        {lead.source && (
                          <span className="inline-block text-[10px] text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded">
                            {lead.source}
                          </span>
                        )}
                      </div>
                    ))}
                    {(!leadsPerStatus[status] || leadsPerStatus[status].length === 0) && (
                      <div className="text-center text-zinc-400 text-[11px] py-8 border border-dashed border-zinc-200 rounded-xl mx-1">
                        אין לידים בשלב זה
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Lead Dialog */}
      {editingLead && (
        <EditLeadDialog
          lead={editingLead}
          open={!!editingLead}
          onOpenChange={(open) => !open && setEditingLead(null)}
          onLeadUpdated={fetchLeads}
        />
      )}
    </AppLayout>
  )
}
