"use client"

import { useEffect, useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Receipt,
  Search,
  Trash2,
  MoreVertical,
  Download,
  Plus,
  Calendar,
  Sparkles,
} from "lucide-react"
import { AppLayout } from "@/components/AppLayout"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { TableSkeleton } from "@/components/skeletons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface Expense {
  id: string
  amount: number
  currency: string
  vatAmount: number | null
  category: string
  vendor: string | null
  description: string | null
  receiptDate: string | null
  receiptNumber: string | null
  imagePath: string | null
  aiExtracted: boolean
  aiConfidence: number | null
  notes: string | null
  createdAt: string
}

const CATEGORY_LABELS: Record<string, string> = {
  FUEL: "דלק",
  OFFICE: "משרד",
  MEALS: "אוכל ואירוח",
  CLOTHING: "ביגוד",
  EQUIPMENT: "ציוד",
  TRAVEL: "נסיעות",
  COMMUNICATION: "תקשורת",
  OTHER: "אחר",
}

const CATEGORY_COLORS: Record<string, string> = {
  FUEL: "bg-orange-500",
  OFFICE: "bg-blue-500",
  MEALS: "bg-amber-500",
  CLOTHING: "bg-pink-500",
  EQUIPMENT: "bg-zinc-500",
  TRAVEL: "bg-cyan-500",
  COMMUNICATION: "bg-violet-500",
  OTHER: "bg-zinc-400",
}

function formatDateShort(d: string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("he-IL")
}

function formatCurrency(n: number) {
  return `₪${n.toLocaleString("he-IL", { minimumFractionDigits: 2 })}`
}

export default function ExpensesPage() {
  const { status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [period, setPeriod] = useState<string>("two_months")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const dateRange = useMemo(() => {
    const now = new Date()
    if (period === "current_month") {
      return {
        from: new Date(now.getFullYear(), now.getMonth(), 1),
        to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
      }
    }
    if (period === "two_months") {
      return {
        from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
      }
    }
    if (period === "year") {
      return {
        from: new Date(now.getFullYear(), 0, 1),
        to: new Date(now.getFullYear(), 11, 31, 23, 59, 59),
      }
    }
    return null
  }, [period])

  useEffect(() => {
    if (status === "authenticated") {
      fetchExpenses()
    } else if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router, filterCategory, period])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterCategory !== "all") params.set("category", filterCategory)
      if (dateRange) {
        params.set("from", dateRange.from.toISOString())
        params.set("to", dateRange.to.toISOString())
      }
      const res = await fetch(`/api/expenses?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setExpenses(data)
      }
    } catch (error) {
      console.error("Error fetching expenses:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("למחוק את ההוצאה הזו?")) return
    try {
      setDeletingId(id)
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "נמחק", description: "ההוצאה נמחקה בהצלחה" })
        fetchExpenses()
      } else {
        toast({ title: "שגיאה", description: "המחיקה נכשלה", variant: "destructive" })
      }
    } finally {
      setDeletingId(null)
    }
  }

  const handleExportPdf = async () => {
    if (!dateRange) return
    try {
      setExporting(true)
      const params = new URLSearchParams({
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
      })
      if (filterCategory !== "all") params.set("category", filterCategory)
      const res = await fetch(`/api/expenses/export-pdf?${params.toString()}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast({
          title: "ייצוא נכשל",
          description: err.error || "אין הוצאות בתקופה זו",
          variant: "destructive",
        })
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `expenses_${dateRange.from.toISOString().slice(0, 10)}_${dateRange.to
        .toISOString()
        .slice(0, 10)}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

  const filtered = expenses.filter((e) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      e.vendor?.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.receiptNumber?.toLowerCase().includes(q)
    )
  })

  const totals = useMemo(() => {
    const total = expenses.reduce((s, e) => s + e.amount, 0)
    const vat = expenses.reduce((s, e) => s + (e.vatAmount || 0), 0)
    const beforeVat = total - vat
    return { count: expenses.length, total, vat, beforeVat }
  }, [expenses])

  if (status === "loading" || loading) {
    return (
      <AppLayout>
        <TableSkeleton />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-violet-600" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              הוצאות וקבלות
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">
              נהל את ההוצאות הקטנות שלך ויצא דו"ח לדיווח מע"מ
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPdf} disabled={exporting || expenses.length === 0}>
            <Download className="w-4 h-4 ml-2" />
            {exporting ? "מייצא..." : "ייצא PDF"}
          </Button>
          <Link href="/expenses/new">
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              הוצאה חדשה
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600">סה"כ קבלות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totals.count}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600">סה"כ סכום</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-600">{formatCurrency(totals.total)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600">סה"כ מע"מ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{formatCurrency(totals.vat)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600">לפני מע"מ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">{formatCurrency(totals.beforeVat)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="חיפוש לפי ספק, תיאור או מספר קבלה..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[200px]">
                <Calendar className="w-4 h-4 ml-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current_month">חודש נוכחי</SelectItem>
                <SelectItem value="two_months">חודשיים אחרונים</SelectItem>
                <SelectItem value="year">השנה</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הקטגוריות</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 mx-auto text-zinc-300 mb-4" />
              <h3 className="text-lg font-medium text-zinc-900 mb-2">
                {searchQuery ? "לא נמצאו הוצאות" : "אין הוצאות בתקופה זו"}
              </h3>
              <p className="text-zinc-500 mb-4">
                {searchQuery ? "נסה חיפוש אחר" : "התחל בהוספת קבלה חדשה"}
              </p>
              {!searchQuery && (
                <Link href="/expenses/new">
                  <Button>
                    <Plus className="w-4 h-4 ml-2" />
                    הוצאה חדשה
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-medium text-zinc-700 w-20">תמונה</th>
                    <th className="text-right py-3 px-4 font-medium text-zinc-700">תאריך</th>
                    <th className="text-right py-3 px-4 font-medium text-zinc-700">ספק</th>
                    <th className="text-right py-3 px-4 font-medium text-zinc-700">קטגוריה</th>
                    <th className="text-right py-3 px-4 font-medium text-zinc-700">סכום</th>
                    <th className="text-right py-3 px-4 font-medium text-zinc-700">מע"מ</th>
                    <th className="text-right py-3 px-4 font-medium text-zinc-700">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((expense) => (
                    <tr key={expense.id} className="border-b hover:bg-zinc-50">
                      <td className="py-3 px-4">
                        {expense.imagePath ? (
                          <Link href={`/expenses/${expense.id}`}>
                            <img
                              src={`/api/files/by-path?path=${encodeURIComponent(expense.imagePath)}`}
                              alt="קבלה"
                              className="w-12 h-12 object-cover rounded border border-zinc-200"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).style.display = "none"
                              }}
                            />
                          </Link>
                        ) : (
                          <div className="w-12 h-12 rounded bg-zinc-100 flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-zinc-400" />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/expenses/${expense.id}`} className="text-zinc-900 hover:underline">
                          {formatDateShort(expense.receiptDate || expense.createdAt)}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-normal text-zinc-900">{expense.vendor || "—"}</span>
                          {expense.aiExtracted && (
                            <Sparkles className="w-3 h-3 text-violet-500" aria-label="זוהה ע״י AI" />
                          )}
                        </div>
                        {expense.description && (
                          <div className="text-sm text-zinc-500 font-light">{expense.description}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${CATEGORY_COLORS[expense.category] || "bg-zinc-400"} text-white`}>
                          {CATEGORY_LABELS[expense.category] || expense.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-zinc-900">{formatCurrency(expense.amount)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-zinc-700">
                          {expense.vatAmount ? formatCurrency(expense.vatAmount) : "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={deletingId === expense.id}>
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/expenses/${expense.id}`}>פתח</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(expense.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 ml-2" />
                              {deletingId === expense.id ? "מוחק..." : "מחק"}
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
        </CardContent>
      </Card>
    </AppLayout>
  )
}
