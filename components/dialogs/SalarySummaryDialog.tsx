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
import { Calendar, DollarSign, Clock, TrendingUp, Loader2, Users } from "lucide-react"
import { useSession } from "next-auth/react"

interface EmployeeStats {
  userId: string
  userName: string
  userEmail: string
  totalHours: number
  workDays: number
  regularHours: number
  overtimeHours: number
  hourlyRate: number
  monthlyHours: number
  overtimeRate: number
  regularPay: number
  overtimePay: number
  totalSalary: number
}

interface SalaryStats {
  month: string
  isAdmin: boolean
  employees?: EmployeeStats[]
  totals?: {
    totalHours: number
    totalSalary: number
    totalEmployees: number
  }
  // נתונים למשתמש רגיל
  totalHours?: number
  workDays?: number
  regularHours?: number
  overtimeHours?: number
  hourlyRate?: number
  monthlyHours?: number
  overtimeRate?: number
  regularPay?: number
  overtimePay?: number
  totalSalary?: number
}

interface SalarySummaryDialogProps {
  triggerButton?: React.ReactNode
}

export function SalarySummaryDialog({ triggerButton }: SalarySummaryDialogProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<SalaryStats | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>("")

  const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN'

  // חודש נוכחי כברירת מחדל
  useEffect(() => {
    const now = new Date()
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    setSelectedMonth(month)
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      // אם המשתמש הוא מנהל, נבקש את הנתונים של כל העובדים
      const url = isAdmin 
        ? `/api/attendance/stats?month=${selectedMonth}&allEmployees=true`
        : `/api/attendance/stats?month=${selectedMonth}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching salary stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && selectedMonth) {
      fetchStats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedMonth, isAdmin])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long' })
  }

  // יצירת רשימת חודשים (6 חודשים אחורה)
  const getMonthOptions = () => {
    const months = []
    const now = new Date()
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      months.push({
        value: monthStr,
        label: date.toLocaleDateString('he-IL', { year: 'numeric', month: 'long' })
      })
    }
    return months
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" className="gap-2">
            <DollarSign className="w-4 h-4" />
            סיכום משכורת
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={isAdmin ? "sm:max-w-[1000px]" : "sm:max-w-[600px]"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {isAdmin ? "סיכום משכורות הצוות" : "סיכום משכורת"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* בחירת חודש */}
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {getMonthOptions().map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : stats ? (
            <>
              {/* תצוגה למנהל - כל העובדים */}
              {stats.isAdmin && stats.employees ? (
                <div className="space-y-4">
                  {/* סיכומים כלליים */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-700 mb-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">עובדים</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-900">
                        {stats.totals?.totalEmployees || 0}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">סך שעות</span>
                      </div>
                      <div className="text-2xl font-bold text-green-900">
                        {stats.totals?.totalHours.toFixed(1) || 0}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-2 text-purple-700 mb-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm font-medium">סך משכורות</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-900">
                        {formatCurrency(stats.totals?.totalSalary || 0)}
                      </div>
                    </div>
                  </div>

                  {/* טבלת עובדים */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b sticky top-0">
                          <tr>
                            <th className="text-right p-3 font-medium">עובד</th>
                            <th className="text-right p-3 font-medium">ימי עבודה</th>
                            <th className="text-right p-3 font-medium">סך שעות</th>
                            <th className="text-right p-3 font-medium">שעות רגילות</th>
                            <th className="text-right p-3 font-medium">שעות נוספות</th>
                            <th className="text-right p-3 font-medium">שכר/שעה</th>
                            <th className="text-right p-3 font-medium">סך משכורת</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {stats.employees.map((employee) => (
                            <tr key={employee.userId} className="hover:bg-gray-50">
                              <td className="p-3">
                                <div className="font-medium">{employee.userName}</div>
                                <div className="text-xs text-gray-500">{employee.userEmail}</div>
                              </td>
                              <td className="p-3 text-center">{employee.workDays}</td>
                              <td className="p-3 font-semibold">{employee.totalHours.toFixed(1)}</td>
                              <td className="p-3 text-green-700">{employee.regularHours.toFixed(1)}</td>
                              <td className="p-3 text-orange-600">{employee.overtimeHours.toFixed(1)}</td>
                              <td className="p-3">₪{employee.hourlyRate}</td>
                              <td className="p-3 font-bold text-purple-700">
                                {formatCurrency(employee.totalSalary)}
                              </td>
                            </tr>
                          ))}
                          {stats.employees.length === 0 && (
                            <tr>
                              <td colSpan={7} className="text-center p-8 text-gray-500">
                                אין נתונים לחודש זה
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                /* תצוגה למשתמש רגיל - הנתונים שלו בלבד */
                <>
                  {/* כרטיסי סיכום */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* סך שעות */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-700 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">סך שעות</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-900">
                        {stats.totalHours?.toFixed(1) || 0}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {stats.workDays || 0} ימי עבודה
                      </div>
                    </div>

                    {/* שעות רגילות */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">שעות רגילות</span>
                      </div>
                      <div className="text-2xl font-bold text-green-900">
                        {stats.regularHours?.toFixed(1) || 0}
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        {formatCurrency(stats.regularPay || 0)}
                      </div>
                    </div>

                    {/* שעות נוספות */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                      <div className="flex items-center gap-2 text-orange-700 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">שעות נוספות</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-900">
                        {stats.overtimeHours?.toFixed(1) || 0}
                      </div>
                      <div className="text-xs text-orange-600 mt-1">
                        {formatCurrency(stats.overtimePay || 0)} (×{stats.overtimeRate || 1.25})
                      </div>
                    </div>

                    {/* סך משכורת */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-2 text-purple-700 mb-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm font-medium">סך משכורת</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-900">
                        {formatCurrency(stats.totalSalary || 0)}
                      </div>
                      <div className="text-xs text-purple-600 mt-1">
                        {(stats.hourlyRate || 0) > 0 ? `${stats.hourlyRate}₪/שעה` : 'לא הוגדר שכר'}
                      </div>
                    </div>
                  </div>

                  {/* פירוט נוסף */}
                  <div className="border-t pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>שכר לשעה:</span>
                      <span className="font-medium">{stats.hourlyRate || 0}₪</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>נורמת שעות חודשית:</span>
                      <span className="font-medium">{stats.monthlyHours || 186} שעות</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>מקדם שעות נוספות:</span>
                      <span className="font-medium">×{stats.overtimeRate || 1.25}</span>
                    </div>
                  </div>

                  {/* הערה */}
                  {(stats.hourlyRate || 0) === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                      💡 לא הוגדרו הגדרות משכורת. ניתן להגדיר בעמוד שעון הנוכחות.
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              לא נמצאו נתונים לחודש זה
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            סגור
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}





