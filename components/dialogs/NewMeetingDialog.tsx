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
import { useToast } from "@/components/ui/use-toast"
import { Plus } from "lucide-react"

interface NewMeetingDialogProps {
  onMeetingCreated?: () => void
}

export function NewMeetingDialog({ onMeetingCreated }: NewMeetingDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    attendees: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // בונים Date באזור זמן מקומי (לא UTC) כדי שהתאריך לא יזוז ביום
      const startTime = new Date(`${formData.date}T${formData.startTime}:00`)
      const endTime = new Date(`${formData.date}T${formData.endTime}:00`)

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        throw new Error("תאריך או שעה לא תקינים")
      }

      if (endTime <= startTime) {
        throw new Error("שעת הסיום חייבת להיות אחרי שעת ההתחלה")
      }

      const attendeesArray = formData.attendees
        .split(',')
        .map(a => a.trim())
        .filter(Boolean)

      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          location: formData.location,
          attendees: attendeesArray,
          isAllDay: false,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || "שגיאה בשמירת הפגישה")
      }

      toast({
        title: "פגישה נוצרה!",
        description: `הפגישה "${formData.title}" נקבעה ל-${startTime.toLocaleDateString('he-IL')}`,
      })

      setOpen(false)
      setFormData({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
        attendees: "",
      })
      onMeetingCreated?.()
    } catch (error: any) {
      console.error('Error creating meeting:', error)
      toast({
        title: "שגיאה",
        description: error?.message || "אירעה שגיאה ביצירת הפגישה",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="prodify-gradient text-white">
          <Plus className="w-4 h-4 ml-2" />
          פגישה חדשה
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>יצירת פגישה חדשה</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">כותרת *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="למשל: פגישת One-on-One"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">תיאור</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="תיאור הפגישה, נושאים לדיון וכו'"
                className="w-full min-h-[80px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">תאריך *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="startTime">שעת התחלה *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="endTime">שעת סיום *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                  min={formData.startTime}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">מיקום / קישור</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="כתובת פיזית או קישור ל-Zoom/Google Meet"
              />
            </div>

            <div>
              <Label htmlFor="attendees">משתתפים</Label>
              <Input
                id="attendees"
                value={formData.attendees}
                onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                placeholder="שמות או אימיילים מופרדים בפסיקים"
              />
              <p className="text-xs text-zinc-500 mt-1">
                למשל: יוסי כהן, dana@example.com, משה לוי
              </p>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              className="prodify-gradient text-white"
              disabled={loading}
            >
              {loading ? "יוצר פגישה..." : "צור פגישה"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

