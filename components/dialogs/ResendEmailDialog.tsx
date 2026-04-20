"use client"

import { useState, useEffect } from "react"
import { Send, Mail, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface ResendEmailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quoteId: string
  quoteNumber: string
  defaultEmail: string | null
  onSuccess?: () => void
}

export function ResendEmailDialog({
  open,
  onOpenChange,
  quoteId,
  quoteNumber,
  defaultEmail,
  onSuccess,
}: ResendEmailDialogProps) {
  const { toast } = useToast()
  const [email, setEmail] = useState(defaultEmail || "")
  const [loading, setLoading] = useState(false)

  // עדכון המייל כאשר ה-dialog נפתח
  useEffect(() => {
    if (open) {
      setEmail(defaultEmail || "")
    }
  }, [open, defaultEmail])

  const handleSend = async () => {
    if (!email.trim()) {
      toast({
        title: "שגיאה",
        description: "יש להזין כתובת אימייל",
        variant: "destructive",
      })
      return
    }

    // בדיקת תקינות אימייל בסיסית
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "שגיאה",
        description: "כתובת האימייל אינה תקינה",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/quotes/${quoteId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        const data = await res.json()
        toast({
          title: "נשלח בהצלחה! ✉️",
          description: data.message || `המסמך נשלח למייל ${email}`,
        })
        onOpenChange(false)
        onSuccess?.()
      } else {
        const error = await res.json()
        throw new Error(error.details || error.error || "Failed to send")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "שגיאה בשליחה",
        description: error instanceof Error ? error.message : "לא הצלחנו לשלוח את המסמך",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Mail className="w-5 h-5 text-violet-600" />
            שליחת מסמך במייל
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-zinc-50 p-3 rounded-lg">
            <p className="text-sm text-zinc-600">מסמך מספר:</p>
            <p className="font-semibold text-zinc-900">{quoteNumber}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">כתובת אימייל</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              dir="ltr"
              className="text-left"
            />
            <p className="text-xs text-zinc-500">
              ניתן לערוך את כתובת האימייל לפני השליחה
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            ביטול
          </Button>
          <Button
            onClick={handleSend}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                שולח...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 ml-2" />
                שלח
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
