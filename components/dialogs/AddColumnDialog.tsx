"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, Loader2 } from "lucide-react"

const PRESET_COLORS = [
  "#e2e8f0", "#fecaca", "#fed7aa", "#fef08a",
  "#bbf7d0", "#a5f3fc", "#c7d2fe", "#e9d5ff",
  "#fce7f3", "#67e8f9", "#86efac", "#fbbf24",
]

interface AddColumnDialogProps {
  onColumnCreated: () => void
}

export function AddColumnDialog({ onColumnCreated }: AddColumnDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [color, setColor] = useState("#e2e8f0")
  const [status, setStatus] = useState("TODO")

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast({ title: "שגיאה", description: "יש להזין שם לעמודה", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/task-columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), color, status }),
      })
      if (res.ok) {
        toast({ title: "עמודה נוספה", description: `העמודה "${name}" נוצרה בהצלחה` })
        setOpen(false)
        setName("")
        setColor("#e2e8f0")
        setStatus("TODO")
        onColumnCreated()
      } else {
        toast({ title: "שגיאה", description: "לא ניתן ליצור את העמודה", variant: "destructive" })
      }
    } catch {
      toast({ title: "שגיאה", description: "אירעה שגיאה", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex-shrink-0 w-[290px] min-h-[100px] flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border-2 border-dashed border-white/40 text-white/80 hover:text-white transition-all cursor-pointer">
          <Plus className="w-5 h-5" />
          <span className="text-sm font-medium">הוסף עמודה</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>הוסף עמודה חדשה</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>שם העמודה</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="לדוגמה: בבדיקה, ממתין לאישור..."
              className="mt-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
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
                    color === c ? 'border-zinc-800 scale-110' : 'border-transparent'
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
            <p className="text-xs text-zinc-500 mt-1">
              כרטיסים בעמודה זו יקבלו את הסטטוס הנבחר
            </p>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : null}
            הוסף עמודה
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
