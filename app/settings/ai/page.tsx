"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles, ExternalLink, CheckCircle2, XCircle, Eye, EyeOff, Trash2 } from "lucide-react"
import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function AiSettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)
  const [maskedKey, setMaskedKey] = useState<string | null>(null)
  const [newKey, setNewKey] = useState("")
  const [showKey, setShowKey] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/company/ai-settings")
      if (res.ok) {
        const data = await res.json()
        setIsConfigured(data.isConfigured)
        setMaskedKey(data.maskedKey)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!newKey.trim()) {
      toast({ title: "מפתח חסר", description: "הזן מפתח API", variant: "destructive" })
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/company/ai-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geminiApiKey: newKey.trim() }),
      })
      if (res.ok) {
        const data = await res.json()
        setIsConfigured(data.isConfigured)
        setMaskedKey(data.maskedKey)
        setNewKey("")
        toast({ title: "נשמר", description: "מפתח Gemini נקלט בהצלחה" })
      } else {
        const err = await res.json()
        toast({ title: "שגיאה", description: err.error || "לא ניתן לשמור", variant: "destructive" })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async () => {
    if (!confirm("להסיר את מפתח ה-AI? זיהוי אוטומטי של קבלות יפסיק לעבוד.")) return
    setRemoving(true)
    try {
      const res = await fetch("/api/company/ai-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geminiApiKey: null }),
      })
      if (res.ok) {
        setIsConfigured(false)
        setMaskedKey(null)
        toast({ title: "המפתח הוסר" })
      }
    } finally {
      setRemoving(false)
    }
  }

  return (
    <AppLayout>
      <div className="flex items-center gap-3 mb-8">
        <Link href="/settings" className="text-zinc-500 hover:text-zinc-900">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">הגדרות AI</h1>
            <p className="text-sm text-zinc-500">זיהוי אוטומטי של קבלות עם Google Gemini</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-600" />
              Google Gemini API Key
            </CardTitle>
            <CardDescription>
              כשהמפתח מוגדר, צילום קבלה באפליקציה יזהה אוטומטית את הסכום, ספק, תאריך, מע"מ וקטגוריה.
              ללא מפתח — הטופס נשאר ריק למילוי ידני.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 text-sm space-y-2">
              <p className="font-medium text-violet-900">איך משיגים מפתח חינמי:</p>
              <ol className="list-decimal list-inside space-y-1 text-violet-800">
                <li>
                  היכנס ל-
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline inline-flex items-center gap-1 mx-1"
                  >
                    Google AI Studio
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  עם חשבון Google
                </li>
                <li>לחץ על "Create API Key" → "Create API key in new project"</li>
                <li>העתק את המפתח (מתחיל ב-AIza...) והדבק כאן</li>
              </ol>
              <p className="text-xs text-violet-700 mt-2">
                המכסה החינמית מספיקה למאות קבלות בחודש. המפתח נשמר רק אצלך ולא נחשף לאחרים.
              </p>
            </div>

            {loading ? (
              <div className="text-zinc-500 text-sm">טוען...</div>
            ) : isConfigured ? (
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-medium text-emerald-900">מפתח מוגדר ופעיל</div>
                    <div className="text-xs text-emerald-700 font-mono">{maskedKey}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={removing}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  {removing ? "מסיר..." : "הסר"}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <XCircle className="w-5 h-5 text-amber-600" />
                <div className="text-sm text-amber-900">
                  לא מוגדר מפתח. זיהוי אוטומטי כבוי. אפשר עדיין למלא קבלות ידנית.
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>{isConfigured ? "החלף מפתח" : "הוסף מפתח"}</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showKey ? "text" : "password"}
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button onClick={handleSave} disabled={saving || !newKey.trim()}>
                  {saving ? "שומר..." : "שמור"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
