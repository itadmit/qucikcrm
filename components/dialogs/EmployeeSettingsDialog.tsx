"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface EmployeeSettingsDialogProps {
  triggerButton?: React.ReactNode
  onSettingsUpdated?: () => void
}

interface Settings {
  hourlyRate: number
  monthlyHours: number
  overtimeRate: number
}

export function EmployeeSettingsDialog({ 
  triggerButton, 
  onSettingsUpdated 
}: EmployeeSettingsDialogProps) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    hourlyRate: 0,
    monthlyHours: 186,
    overtimeRate: 1.25
  })

  useEffect(() => {
    if (open) {
      fetchSettings()
    }
  }, [open])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/attendance/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({
          hourlyRate: data.hourlyRate || 0,
          monthlyHours: data.monthlyHours || 186,
          overtimeRate: data.overtimeRate || 1.25
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/attendance/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast({
          title: "הצלחה!",
          description: "ההגדרות נשמרו בהצלחה"
        })
        setOpen(false)
        if (onSettingsUpdated) {
          onSettingsUpdated()
        }
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא הצליח לשמור את ההגדרות",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="w-4 h-4" />
            הגדרות שכר
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            הגדרות שכר ונוכחות
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* שכר שעתי */}
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">
                שכר שעתי (₪)
                <span className="text-xs text-muted-foreground mr-2">
                  הסכום ששולמים לך לשעת עבודה
                </span>
              </Label>
              <Input
                id="hourlyRate"
                type="number"
                step="0.01"
                value={settings.hourlyRate}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  hourlyRate: parseFloat(e.target.value) || 0 
                })}
                placeholder="0"
                className="text-lg font-semibold"
              />
            </div>

            {/* נורמת שעות חודשית */}
            <div className="space-y-2">
              <Label htmlFor="monthlyHours">
                נורמת שעות חודשית
                <span className="text-xs text-muted-foreground mr-2">
                  כמות השעות הרגילות בחודש (ברירת מחדל: 186)
                </span>
              </Label>
              <Input
                id="monthlyHours"
                type="number"
                value={settings.monthlyHours}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  monthlyHours: parseInt(e.target.value) || 186 
                })}
                placeholder="186"
              />
            </div>

            {/* מקדם שעות נוספות */}
            <div className="space-y-2">
              <Label htmlFor="overtimeRate">
                מקדם שעות נוספות
                <span className="text-xs text-muted-foreground mr-2">
                  המכפיל לשעות נוספות (1.25 = 125%, 1.5 = 150%)
                </span>
              </Label>
              <Input
                id="overtimeRate"
                type="number"
                step="0.01"
                value={settings.overtimeRate}
                onChange={(e) => setSettings({ 
                  ...settings, 
                  overtimeRate: parseFloat(e.target.value) || 1.25 
                })}
                placeholder="1.25"
              />
            </div>

            {/* דוגמה לחישוב */}
            {settings.hourlyRate > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-blue-900">דוגמה לחישוב:</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>• שעה רגילה: {settings.hourlyRate}₪</p>
                  <p>• שעה נוספת: {(settings.hourlyRate * settings.overtimeRate).toFixed(2)}₪</p>
                  <p>• משכורת בסיס ({settings.monthlyHours} שעות): {(settings.hourlyRate * settings.monthlyHours).toLocaleString()}₪</p>
                </div>
              </div>
            )}

            {settings.hourlyRate === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                💡 הגדר את השכר השעתי שלך כדי לחשב את המשכורת החודשית אוטומטית
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
            ביטול
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving || loading}
            className="prodify-gradient text-white hover:opacity-90"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                שומר...
              </>
            ) : (
              'שמור הגדרות'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}





