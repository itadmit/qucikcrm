"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Trash2 } from "lucide-react"

const PRESET_COLORS = [
  "#e2e8f0", "#fecaca", "#fed7aa", "#fef08a",
  "#bbf7d0", "#a5f3fc", "#c7d2fe", "#e9d5ff",
  "#fce7f3", "#67e8f9", "#86efac", "#fbbf24",
]

interface ColumnData {
  id: string
  name: string
  color: string
  status: string
  position: number
}

interface EditColumnDialogProps {
  column: ColumnData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
  columns: ColumnData[]
}

export function EditColumnDialog({ column, open, onOpenChange, onUpdated, columns }: EditColumnDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [color, setColor] = useState("#e2e8f0")
  const [status, setStatus] = useState("TODO")

  useEffect(() => {
    if (column) {
      setName(column.name)
      setColor(column.color)
      setStatus(column.status)
    }
  }, [column])

  const handleSave = async () => {
    if (!column || !name.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/task-columns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: column.id, name: name.trim(), color, status }),
      })
      if (res.ok) {
        toast({ title: "עמודה עודכנה", description: "השינויים נשמרו בהצלחה" })
        onOpenChange(false)
        onUpdated()
      } else {
        toast({ title: "שגיאה", description: "לא ניתן לעדכן את העמודה", variant: "destructive" })
      }
    } catch {
      toast({ title: "שגיאה", description: "אירעה שגיאה", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!column) return
    if (columns.length <= 1) {
      toast({ title: "שגיאה", description: "לא ניתן למחוק את העמודה האחרונה", variant: "destructive" })
      return
    }
    if (!confirm(`האם למחוק את העמודה "${column.name}"? הכרטיסים יועברו לעמודה הראשונה.`)) return

    setLoading(true)
    const moveToCol = columns.find(c => c.id !== column.id)
    try {
      const res = await fetch(`/api/task-columns?id=${column.id}&moveTo=${moveToCol?.id || ''}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast({ title: "עמודה נמחקה", description: "העמודה נמחקה בהצלחה" })
        onOpenChange(false)
        onUpdated()
      } else {
        toast({ title: "שגיאה", description: "לא ניתן למחוק את העמודה", variant: "destructive" })
      }
    } catch {
      toast({ title: "שגיאה", description: "אירעה שגיאה", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (!column) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>עריכת עמודה</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>שם העמודה</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>

          <div>
            <Label>צבע</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === c ? 'border-gray-800 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <Label>סטטוס ממופה</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">לביצוע</SelectItem>
                <SelectItem value="IN_PROGRESS">בתהליך</SelectItem>
                <SelectItem value="DONE">הושלם</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={loading} className="flex-1">
              {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
              שמור שינויים
            </Button>
            <Button onClick={handleDelete} disabled={loading} variant="destructive" size="icon" className="shrink-0">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
