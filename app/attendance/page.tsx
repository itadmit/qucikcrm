"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Calendar, TrendingUp, DollarSign, Plus, Edit, Trash, History, Settings } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { he } from "date-fns/locale"
import dynamic from "next/dynamic"
import { EmployeeSettingsDialog } from "@/components/dialogs/EmployeeSettingsDialog"

const SalarySummaryDialog = dynamic(
  () => import("@/components/dialogs/SalarySummaryDialog").then(mod => ({ default: mod.SalarySummaryDialog })),
  { ssr: false }
)

// תרגום חודשים לעברית
const hebrewMonths: { [key: string]: string } = {
  "01": "ינואר",
  "02": "פברואר",
  "03": "מרץ",
  "04": "אפריל",
  "05": "מאי",
  "06": "יוני",
  "07": "יולי",
  "08": "אוגוסט",
  "09": "ספטמבר",
  "10": "אוקטובר",
  "11": "נובמבר",
  "12": "דצמבר"
}

interface Attendance {
  id: string
  date: string
  clockIn: string
  clockOut: string
  totalHours: number
  notes: string | null
  user: {
    name: string
    email: string
  }
}

interface Stats {
  totalHours: number
  workDays: number
  regularHours: number
  overtimeHours: number
  hourlyRate: number
  totalSalary: number
}

export default function AttendancePage() {
  const { toast } = useToast()
  const [attendances, setAttendances] = useState<Attendance[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  )
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFormData, setEditFormData] = useState<any>(null)

  // פונקציה להצגת חודש בעברית
  const getHebrewMonth = (dateString: string) => {
    const [year, month] = dateString.split('-')
    return `${hebrewMonths[month]} ${year}`
  }

  // טופס רישום חדש
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    clockIn: format(new Date(), "HH:mm"),
    clockOut: "18:00",
    notes: ""
  })

  useEffect(() => {
    fetchAttendances()
    fetchStats()
  }, [selectedMonth])

  const fetchAttendances = async () => {
    try {
      const response = await fetch(`/api/attendance?month=${selectedMonth}`)
      if (response.ok) {
        const data = await response.json()
        setAttendances(data)
      }
    } catch (error) {
      console.error("Error fetching attendances:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/attendance/stats?month=${selectedMonth}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const clockInDateTime = new Date(`${formData.date}T${formData.clockIn}`)
      const clockOutDateTime = new Date(`${formData.date}T${formData.clockOut}`)

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formData.date,
          clockIn: clockInDateTime.toISOString(),
          clockOut: clockOutDateTime.toISOString(),
          notes: formData.notes
        })
      })

      if (response.ok) {
        toast({
          title: "הצלחה!",
          description: "רישום הנוכחות נוצר בהצלחה"
        })
        fetchAttendances()
        fetchStats()
        // איפוס הטופס
        setFormData({
          date: format(new Date(), "yyyy-MM-dd"),
          clockIn: format(new Date(), "HH:mm"),
          clockOut: "18:00",
          notes: ""
        })
      } else {
        const error = await response.json()
        toast({
          title: "שגיאה",
          description: error.error || "לא הצליח ליצור רישום",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשמירת הנוכחות",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (attendance: Attendance) => {
    setEditingId(attendance.id)
    setEditFormData({
      date: format(new Date(attendance.date), "yyyy-MM-dd"),
      clockIn: format(new Date(attendance.clockIn), "HH:mm"),
      clockOut: format(new Date(attendance.clockOut), "HH:mm"),
      notes: attendance.notes || "",
      isCorrection: false
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditFormData(null)
  }

  const handleSaveEdit = async (id: string) => {
    try {
      const clockInDateTime = new Date(`${editFormData.date}T${editFormData.clockIn}`)
      const clockOutDateTime = new Date(`${editFormData.date}T${editFormData.clockOut}`)

      const response = await fetch(`/api/attendance/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: editFormData.date,
          clockIn: clockInDateTime.toISOString(),
          clockOut: clockOutDateTime.toISOString(),
          notes: editFormData.notes || "",
          isCorrection: editFormData.isCorrection || false
        })
      })

      if (response.ok) {
        toast({
          title: "הצלחה!",
          description: "הרישום עודכן בהצלחה"
        })
        setEditingId(null)
        setEditFormData(null)
        fetchAttendances()
        fetchStats()
      } else {
        const error = await response.json()
        toast({
          title: "שגיאה",
          description: error.error || "לא הצליח לעדכן את הרישום",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error updating attendance:", error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעדכון הרישום",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("האם אתה בטוח שברצונך למחוק רישום זה?")) return

    try {
      const response = await fetch(`/api/attendance/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast({
          title: "הצלחה!",
          description: "הרישום נמחק בהצלחה"
        })
        fetchAttendances()
        fetchStats()
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא הצליח למחוק את הרישום",
        variant: "destructive"
      })
    }
  }

  const calculateDailyHours = () => {
    if (formData.clockIn && formData.clockOut) {
      const [inHours, inMinutes] = formData.clockIn.split(":").map(Number)
      const [outHours, outMinutes] = formData.clockOut.split(":").map(Number)
      const hours = outHours - inHours + (outMinutes - inMinutes) / 60
      return hours.toFixed(2)
    }
    return "0"
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* כותרת */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">שעון נוכחות</h1>
            <p className="text-muted-foreground mt-1 text-sm lg:text-base">
              רישום שעות עבודה וחישוב משכורת
            </p>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <SalarySummaryDialog />
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-40 lg:w-48"
            />
          </div>
        </div>

        {/* כרטיסי סטטיסטיקה */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">שעות החודש</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalHours.toFixed(1) || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.workDays || 0} ימי עבודה
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">שעות רגילות</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.regularHours.toFixed(1) || 0}</div>
              <p className="text-xs text-muted-foreground">
                עד {stats?.overtimeHours || 0} שעות נוספות
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">שכר שעתי</CardTitle>
              <EmployeeSettingsDialog 
                triggerButton={
                  <button className="text-muted-foreground hover:text-purple-600 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                }
                onSettingsUpdated={() => {
                  fetchStats()
                  toast({
                    title: "הגדרות עודכנו",
                    description: "הסטטיסטיקות חושבו מחדש"
                  })
                }}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₪{stats?.hourlyRate || 0}</div>
              <p className="text-xs text-muted-foreground">
                לשעה
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">משכורת החודש</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₪{stats?.totalSalary.toFixed(0) || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                סה"כ
              </p>
            </CardContent>
          </Card>
        </div>

        {/* טופס רישום חדש */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              רישום נוכחות יומי
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="date">תאריך</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clockIn">שעת כניסה</Label>
                  <Input
                    id="clockIn"
                    type="time"
                    value={formData.clockIn}
                    onChange={(e) => setFormData({ ...formData, clockIn: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clockOut">שעת יציאה</Label>
                  <Input
                    id="clockOut"
                    type="time"
                    value={formData.clockOut}
                    onChange={(e) => setFormData({ ...formData, clockOut: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>סה"כ שעות</Label>
                  <div className="flex items-center h-10 px-3 bg-muted rounded-md text-2xl font-bold">
                    {calculateDailyHours()}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">הערות (אופציונלי)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="הוסף הערות על יום העבודה..."
                  rows={2}
                />
              </div>

              <Button type="submit" className="w-full prodify-gradient text-white hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                שמור רישום נוכחות
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* טבלת נוכחות */}
        <Card>
          <CardHeader>
            <CardTitle>היסטוריית נוכחות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-2 sm:p-3 font-medium text-sm">תאריך</th>
                    <th className="text-right p-2 sm:p-3 font-medium text-sm">כניסה</th>
                    <th className="text-right p-2 sm:p-3 font-medium text-sm">יציאה</th>
                    <th className="text-right p-2 sm:p-3 font-medium text-sm">סה"כ שעות</th>
                    <th className="text-right p-2 sm:p-3 font-medium text-sm hidden sm:table-cell">הערות</th>
                    <th className="text-right p-2 sm:p-3 font-medium text-sm">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.map((attendance) => {
                    const isEditing = editingId === attendance.id
                    return (
                      <tr key={attendance.id} className="border-b hover:bg-muted/50">
                        {isEditing ? (
                          // מצב עריכה
                          <>
                            <td className="p-2">
                              <Input
                                type="date"
                                value={editFormData.date}
                                onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                                className="w-full"
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                type="time"
                                value={editFormData.clockIn}
                                onChange={(e) => setEditFormData({ ...editFormData, clockIn: e.target.value })}
                                className="w-full"
                              />
                            </td>
                            <td className="p-2">
                              <Input
                                type="time"
                                value={editFormData.clockOut}
                                onChange={(e) => setEditFormData({ ...editFormData, clockOut: e.target.value })}
                                className="w-full"
                              />
                            </td>
                            <td className="p-2 font-semibold">
                              {(() => {
                                const [inH, inM] = editFormData.clockIn.split(":").map(Number)
                                const [outH, outM] = editFormData.clockOut.split(":").map(Number)
                                const hours = outH - inH + (outM - inM) / 60
                                return hours.toFixed(2)
                              })()}
                            </td>
                            <td className="p-2">
                              <div className="space-y-2">
                                <Input
                                  value={editFormData.notes || ""}
                                  onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                                  className="w-full"
                                  placeholder="הערות"
                                />
                                <label className="flex items-center gap-2 text-xs cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={editFormData.isCorrection || false}
                                    onChange={(e) => setEditFormData({ ...editFormData, isCorrection: e.target.checked })}
                                    className="rounded"
                                  />
                                  <span className="text-orange-600">תיקון</span>
                                </label>
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSaveEdit(attendance.id)}
                                  className="text-green-600"
                                >
                                  ✓
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCancelEdit}
                                  className="text-red-600"
                                >
                                  ✕
                                </Button>
                              </div>
                            </td>
                          </>
                        ) : (
                          // מצב תצוגה רגיל
                          <>
                            <td className="p-2 sm:p-3 text-sm">
                              {format(new Date(attendance.date), "dd/MM/yyyy", { locale: he })}
                            </td>
                            <td className="p-2 sm:p-3 text-sm">
                              {format(new Date(attendance.clockIn), "HH:mm")}
                            </td>
                            <td className="p-2 sm:p-3 text-sm">
                              {format(new Date(attendance.clockOut), "HH:mm")}
                            </td>
                            <td className="p-2 sm:p-3 font-semibold text-sm">
                              {attendance.totalHours.toFixed(2)}
                            </td>
                            <td className="p-2 sm:p-3 text-muted-foreground text-sm hidden sm:table-cell">
                              {attendance.notes || "-"}
                            </td>
                            <td className="p-2 sm:p-3">
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(attendance)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(attendance.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    )
                  })}
                  {attendances.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="text-center p-8 text-muted-foreground text-sm">
                        אין רישומי נוכחות לחודש זה
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}





