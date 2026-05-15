"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Upload, Sparkles, Loader2, Image as ImageIcon } from "lucide-react"
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

export default function NewExpensePage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileId, setFileId] = useState<string | null>(null)
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [saving, setSaving] = useState(false)

  const [amount, setAmount] = useState("")
  const [vatAmount, setVatAmount] = useState("")
  const [category, setCategory] = useState("OTHER")
  const [vendor, setVendor] = useState("")
  const [description, setDescription] = useState("")
  const [receiptDate, setReceiptDate] = useState("")
  const [receiptNumber, setReceiptNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [aiExtracted, setAiExtracted] = useState(false)
  const [aiConfidence, setAiConfidence] = useState<number | null>(null)
  const [aiFields, setAiFields] = useState<Set<string>>(new Set())

  const handleFile = async (file: File) => {
    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("entityType", "expense")
      fd.append("entityId", "pending") // will be patched after expense create
      const res = await fetch("/api/files/upload", { method: "POST", body: fd })
      if (!res.ok) {
        toast({ title: "העלאה נכשלה", variant: "destructive" })
        return
      }
      const data = await res.json()
      setFileId(data.file.id)
      setImagePath(data.file.path)
      // Trigger Gemini extract
      runExtract(data.file.id)
    } finally {
      setUploading(false)
    }
  }

  const runExtract = async (fid: string) => {
    setExtracting(true)
    try {
      const res = await fetch("/api/expenses/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId: fid }),
      })
      const data = await res.json()
      const ex = data.extracted
      if (!ex) return
      const fields = new Set<string>()
      if (typeof ex.amount === "number") {
        setAmount(String(ex.amount))
        fields.add("amount")
      }
      if (typeof ex.vatAmount === "number") {
        setVatAmount(String(ex.vatAmount))
        fields.add("vatAmount")
      }
      if (ex.vendor) {
        setVendor(ex.vendor)
        fields.add("vendor")
      }
      if (ex.receiptDate) {
        setReceiptDate(ex.receiptDate)
        fields.add("receiptDate")
      }
      if (ex.receiptNumber) {
        setReceiptNumber(ex.receiptNumber)
        fields.add("receiptNumber")
      }
      if (ex.category && CATEGORY_LABELS[ex.category]) {
        setCategory(ex.category)
        fields.add("category")
      }
      setAiExtracted(true)
      setAiConfidence(ex.confidence)
      setAiFields(fields)
      if (ex.confidence < 0.6) {
        toast({
          title: "זוהה ברמת ביטחון נמוכה",
          description: "אנא בדוק את הפרטים שמולאו אוטומטית",
        })
      }
    } catch {
      // silent fail
    } finally {
      setExtracting(false)
    }
  }

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "סכום חובה", variant: "destructive" })
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          vatAmount: vatAmount ? parseFloat(vatAmount) : null,
          category,
          vendor: vendor || null,
          description: description || null,
          receiptDate: receiptDate || null,
          receiptNumber: receiptNumber || null,
          fileId,
          imagePath,
          aiExtracted,
          aiConfidence,
          notes: notes || null,
        }),
      })
      if (res.ok) {
        toast({ title: "נשמר", description: "ההוצאה נוספה בהצלחה" })
        router.push("/expenses")
      } else {
        toast({ title: "שגיאה בשמירה", variant: "destructive" })
      }
    } finally {
      setSaving(false)
    }
  }

  const aiBadge = (field: string) =>
    aiFields.has(field) ? (
      <span className="inline-flex items-center gap-1 text-[10px] text-violet-600 font-medium ml-2">
        <Sparkles className="w-3 h-3" />
        AI
      </span>
    ) : null

  return (
    <AppLayout>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/expenses" className="text-zinc-500 hover:text-zinc-900">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900">הוצאה חדשה</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <Label>תמונת קבלה</Label>
            <div
              className="mt-2 border-2 border-dashed border-zinc-200 rounded-xl p-6 text-center cursor-pointer hover:border-violet-300 hover:bg-violet-50/30 transition-all"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                const f = e.dataTransfer.files[0]
                if (f) handleFile(f)
              }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="קבלה" className="max-h-96 mx-auto rounded" />
              ) : (
                <div className="py-12">
                  <ImageIcon className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
                  <p className="text-sm text-zinc-600 mb-1">גרור תמונה לכאן או לחץ לבחירה</p>
                  <p className="text-xs text-zinc-400">JPG, PNG · מקס׳ 10MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFile(f)
                }}
              />
            </div>
            {(uploading || extracting) && (
              <div className="mt-3 flex items-center gap-2 text-sm text-violet-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploading ? "מעלה..." : "מזהה אוטומטית..."}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label>
                סכום (₪) *{aiBadge("amount")}
              </Label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="mt-1"
              />
            </div>

            <div>
              <Label>
                מע״מ (₪){aiBadge("vatAmount")}
              </Label>
              <Input
                type="number"
                step="0.01"
                value={vatAmount}
                onChange={(e) => setVatAmount(e.target.value)}
                placeholder="0.00"
                className="mt-1"
              />
            </div>

            <div>
              <Label>קטגוריה{aiBadge("category")}</Label>
              <Select value={category} onValueChange={setCategory}>
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
              <Label>ספק / בית עסק{aiBadge("vendor")}</Label>
              <Input
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="לדוגמה: דלק פז"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>תאריך{aiBadge("receiptDate")}</Label>
                <Input
                  type="date"
                  value={receiptDate}
                  onChange={(e) => setReceiptDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>מס׳ קבלה{aiBadge("receiptNumber")}</Label>
                <Input
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder="—"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>תיאור</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="לדוגמה: דלק לרכב העסקי"
                className="mt-1"
              />
            </div>

            <div>
              <Label>הערות</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={saving || !amount} className="flex-1">
                {saving ? "שומר..." : "שמור הוצאה"}
              </Button>
              <Link href="/expenses">
                <Button variant="outline">ביטול</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
