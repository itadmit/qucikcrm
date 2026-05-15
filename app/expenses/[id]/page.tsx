"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Trash2, Sparkles } from "lucide-react"
import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { TableSkeleton } from "@/components/skeletons"

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

interface Expense {
  id: string
  amount: number
  vatAmount: number | null
  currency: string
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

export default function ExpenseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [expense, setExpense] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchExpense()
  }, [id])

  const fetchExpense = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/expenses/${id}`)
      if (res.ok) {
        const data = await res.json()
        setExpense(data)
      } else {
        toast({ title: "לא נמצא", variant: "destructive" })
        router.push("/expenses")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!expense) return
    setSaving(true)
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: expense.amount,
          vatAmount: expense.vatAmount,
          category: expense.category,
          vendor: expense.vendor,
          description: expense.description,
          receiptDate: expense.receiptDate,
          receiptNumber: expense.receiptNumber,
          notes: expense.notes,
        }),
      })
      if (res.ok) {
        toast({ title: "נשמר" })
      } else {
        toast({ title: "שגיאה בשמירה", variant: "destructive" })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("למחוק את ההוצאה?")) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast({ title: "נמחק" })
        router.push("/expenses")
      } else {
        toast({ title: "שגיאה במחיקה", variant: "destructive" })
        setDeleting(false)
      }
    } catch {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <TableSkeleton />
      </AppLayout>
    )
  }
  if (!expense) return null

  const update = (field: keyof Expense, value: any) =>
    setExpense({ ...expense, [field]: value })

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Link href="/expenses" className="text-zinc-500 hover:text-zinc-900">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900">פרטי הוצאה</h1>
          {expense.aiExtracted && (
            <span className="inline-flex items-center gap-1 text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded font-medium">
              <Sparkles className="w-3 h-3" />
              זוהה ע״י AI
            </span>
          )}
        </div>
        <Button variant="outline" onClick={handleDelete} disabled={deleting} className="text-red-600">
          <Trash2 className="w-4 h-4 ml-2" />
          {deleting ? "מוחק..." : "מחק"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            {expense.imagePath ? (
              <img
                src={`/api/files/by-path?path=${encodeURIComponent(expense.imagePath)}`}
                alt="קבלה"
                className="w-full rounded border border-zinc-200"
              />
            ) : (
              <div className="aspect-square bg-zinc-50 rounded border border-zinc-200 flex items-center justify-center text-zinc-400">
                אין תמונה
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label>סכום (₪) *</Label>
              <Input
                type="number"
                step="0.01"
                value={expense.amount}
                onChange={(e) => update("amount", parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            <div>
              <Label>מע״מ (₪)</Label>
              <Input
                type="number"
                step="0.01"
                value={expense.vatAmount ?? ""}
                onChange={(e) =>
                  update("vatAmount", e.target.value ? parseFloat(e.target.value) : null)
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label>קטגוריה</Label>
              <Select value={expense.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>ספק / בית עסק</Label>
              <Input
                value={expense.vendor ?? ""}
                onChange={(e) => update("vendor", e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>תאריך</Label>
                <Input
                  type="date"
                  value={expense.receiptDate ? expense.receiptDate.slice(0, 10) : ""}
                  onChange={(e) => update("receiptDate", e.target.value || null)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>מס׳ קבלה</Label>
                <Input
                  value={expense.receiptNumber ?? ""}
                  onChange={(e) => update("receiptNumber", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>תיאור</Label>
              <Input
                value={expense.description ?? ""}
                onChange={(e) => update("description", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label>הערות</Label>
              <Textarea
                value={expense.notes ?? ""}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? "שומר..." : "שמור שינויים"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
