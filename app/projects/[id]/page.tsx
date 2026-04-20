"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  Edit,
  Trash,
  FileText,
  FolderKanban,
  CheckCircle2,
  Clock,
  DollarSign,
  Briefcase,
  Plus,
  Receipt,
  User,
  Loader2,
  X,
  Save,
  StickyNote,
  Check,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { NewQuoteDialog } from "@/components/dialogs/NewQuoteDialog"
import { NewInvoiceDialog } from "@/components/dialogs/NewInvoiceDialog"
import { NewTaskDialog } from "@/components/dialogs/NewTaskDialog"
import { ProjectTaskBoard } from "@/components/tasks/ProjectTaskBoard"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Project {
  id: string
  name: string
  description: string | null
  status: string
  budget: number | null
  progress: number
  startDate: string | null
  endDate: string | null
  client: { id: string; name: string; email: string | null } | null
  tasks: Array<{
    id: string
    title: string
    description: string | null
    status: string
    priority: string
    position: number
    dueDate: string | null
    columnId: string | null
    assignee: { id: string; name: string } | null
  }>
  payments: Array<{ id: string; amount: number; status: string; paidAt: string | null; description: string | null }>
  quotes: Array<{ 
    id: string; 
    quoteNumber: string; 
    title: string; 
    status: string; 
    total: number; 
    paidAmount: number;
    isInvoice: boolean;
    createdAt: string 
  }>
  budgets: Array<{ id: string; name: string; amount: number }>
  files: Array<{ id: string; name: string; path: string; size: number; createdAt: string }>
  notes: string | null
  _count: { tasks: number; budgets: number; payments: number; quotes: number; files: number }
  createdAt: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "budgets" | "files">("overview")
  const [newQuoteOpen, setNewQuoteOpen] = useState(false)
  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false)
  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    status: "",
    budget: "",
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    fetchProject()
  }, [params.id])

  useEffect(() => {
    return () => {
      if (notesTimer.current) clearTimeout(notesTimer.current)
    }
  }, [])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      } else {
        toast({
          title: "שגיאה",
          description: "לא ניתן לטעון את פרטי הפרויקט",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching project:', error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בטעינת פרטי הפרויקט",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = () => {
    if (project) {
      setEditForm({
        name: project.name,
        description: project.description || "",
        status: project.status,
        budget: project.budget?.toString() || "",
        startDate: project.startDate ? project.startDate.split('T')[0] : "",
        endDate: project.endDate ? project.endDate.split('T')[0] : "",
      })
      setEditOpen(true)
    }
  }

  const handleSaveEdit = async () => {
    if (!project) return
    
    setSaving(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description || null,
          status: editForm.status,
          budget: editForm.budget ? parseFloat(editForm.budget) : null,
          startDate: editForm.startDate || null,
          endDate: editForm.endDate || null,
        }),
      })

      if (response.ok) {
        toast({
          title: "נשמר בהצלחה",
          description: "פרטי הפרויקט עודכנו",
        })
        setEditOpen(false)
        fetchProject()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update project")
      }
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לעדכן את הפרויקט",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE'
    
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update local state
        setProject(prev => {
          if (!prev) return prev
          return {
            ...prev,
            tasks: prev.tasks.map(task => 
              task.id === taskId ? { ...task, status: newStatus } : task
            )
          }
        })
        
        toast({
          title: newStatus === 'DONE' ? "משימה הושלמה! ✅" : "משימה הוחזרה לפעילה",
          description: newStatus === 'DONE' ? "כל הכבוד!" : "",
        })
      } else {
        throw new Error("Failed to update task")
      }
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לעדכן את המשימה",
        variant: "destructive",
      })
    }
  }

  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [notesSaveStatus, setNotesSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const handleNotesChange = useCallback((value: string) => {
    setProject(prev => prev ? { ...prev, notes: value } : prev)
    setNotesSaveStatus('saving')
    if (notesTimer.current) clearTimeout(notesTimer.current)
    notesTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/projects/${params.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: value || null }),
        })
        if (res.ok) {
          setNotesSaveStatus('saved')
          setTimeout(() => setNotesSaveStatus('idle'), 2000)
        } else {
          setNotesSaveStatus('idle')
        }
      } catch {
        setNotesSaveStatus('idle')
      }
    }, 600)
  }, [params.id])

  const handleDelete = async () => {
    if (!project) return
    
    setDeleting(true)
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "נמחק בהצלחה",
          description: "הפרויקט וכל הנתונים הקשורים אליו נמחקו",
        })
        router.push("/projects")
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete project")
      }
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "שגיאה",
        description: "לא הצלחנו למחוק את הפרויקט",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-zinc-600">טוען פרטי פרויקט...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <FolderKanban className="w-16 h-16 mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">פרויקט לא נמצא</h3>
          <Link href="/projects">
            <Button variant="outline">חזרה לפרויקטים</Button>
          </Link>
        </div>
      </AppLayout>
    )
  }

  const statusColors: Record<string, string> = {
    PLANNING: "bg-zinc-100 text-zinc-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    ON_HOLD: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  }

  const statusLabels: Record<string, string> = {
    PLANNING: "תכנון",
    IN_PROGRESS: "בביצוע",
    ON_HOLD: "בהמתנה",
    COMPLETED: "הושלם",
    CANCELLED: "בוטל",
  }

  const taskStatusColors: Record<string, string> = {
    TODO: "bg-zinc-100 text-zinc-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    DONE: "bg-green-100 text-green-800",
  }

  const taskStatusLabels: Record<string, string> = {
    TODO: "לביצוע",
    IN_PROGRESS: "בתהליך",
    DONE: "הושלם",
  }

  const quoteStatusColors: Record<string, string> = {
    DRAFT: "bg-zinc-100 text-zinc-800",
    SENT: "bg-blue-100 text-blue-800",
    VIEWED: "bg-violet-100 text-violet-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  }

  const quoteStatusLabels: Record<string, string> = {
    DRAFT: "טיוטה",
    SENT: "נשלח",
    VIEWED: "נצפה",
    ACCEPTED: "אושר",
    REJECTED: "נדחה",
  }

  // חישוב סיכומים פיננסיים
  const totalQuotesValue = project.quotes
    .filter(q => !q.isInvoice)
    .reduce((sum, q) => sum + q.total, 0)
  
  const totalInvoicesValue = project.quotes
    .filter(q => q.isInvoice)
    .reduce((sum, q) => sum + q.total, 0)

  const totalPaid = project.payments
    .filter(p => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0)

  const remainingToPay = (project.budget || totalInvoicesValue || totalQuotesValue) - totalPaid

  const completedTasks = project.tasks.filter(t => t.status === 'DONE').length
  const projectProgress = project.progress

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/projects" className="hover:text-zinc-700">פרויקטים</Link>
          <ArrowLeft className="w-4 h-4" />
          <span className="text-zinc-900">{project.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">{project.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`text-xs px-3 py-1 rounded-full ${statusColors[project.status]}`}>
                {statusLabels[project.status]}
              </span>
              {project.client && (
                <Link 
                  href={`/clients/${project.client.id}`}
                  className="text-sm text-violet-600 hover:text-violet-700 flex items-center gap-1"
                >
                  <User className="w-3 h-3" />
                  {project.client.name}
                </Link>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openEditDialog}>
              <Edit className="w-4 h-4 ml-2" />
              ערוך
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={() => setDeleteOpen(true)}>
              <Trash className="w-4 h-4 ml-2" />
              מחק
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-zinc-200">
          <div className="flex gap-6">
            {[
              { key: "overview", label: "סקירה" },
              { key: "tasks", label: `משימות (${project._count.tasks})` },
              { key: "budgets", label: "תקציבים והצעות" },
              { key: "files", label: `קבצים (${project._count.files})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-3 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-purple-600 text-violet-600 font-medium"
                    : "border-transparent text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`grid grid-cols-1 ${activeTab === 'tasks' ? '' : 'lg:grid-cols-3'} gap-6`}>
          {/* Main Content */}
          <div className={`${activeTab === 'tasks' ? '' : 'lg:col-span-2'} space-y-6`}>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <>
                {/* Project Info */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>פרטי הפרויקט</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {project.description && (
                      <div>
                        <Label className="text-zinc-500 text-sm">תיאור</Label>
                        <p className="text-zinc-900 mt-1">{project.description}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-zinc-500 text-sm">תאריך התחלה</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-zinc-400" />
                          <span className="text-zinc-900">
                            {project.startDate 
                              ? new Date(project.startDate).toLocaleDateString('he-IL')
                              : "-"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-zinc-500 text-sm">תאריך סיום</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-zinc-400" />
                          <span className="text-zinc-900">
                            {project.endDate 
                              ? new Date(project.endDate).toLocaleDateString('he-IL')
                              : "-"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <Label className="text-zinc-500">התקדמות</Label>
                        <span className="font-medium">{projectProgress}%</span>
                      </div>
                      <div className="w-full bg-zinc-200 rounded-full h-2.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${projectProgress === 100 ? 'bg-green-500' : 'bg-violet-600'}`}
                          style={{ width: `${projectProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        {completedTasks} מתוך {project.tasks.length} משימות הושלמו (כולל צ׳קליסט)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Summary */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>סיכום כספי</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-zinc-50 rounded-lg">
                        <DollarSign className="w-6 h-6 mx-auto text-zinc-500 mb-2" />
                        <p className="text-xs text-zinc-500 mb-1">תקציב</p>
                        <p className="font-bold text-lg">
                          ₪{(project.budget || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <FileText className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                        <p className="text-xs text-zinc-500 mb-1">הצעות מחיר</p>
                        <p className="font-bold text-lg text-blue-600">
                          ₪{totalQuotesValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <CheckCircle2 className="w-6 h-6 mx-auto text-green-500 mb-2" />
                        <p className="text-xs text-zinc-500 mb-1">שולם</p>
                        <p className="font-bold text-lg text-green-600">
                          ₪{totalPaid.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <Clock className="w-6 h-6 mx-auto text-orange-500 mb-2" />
                        <p className="text-xs text-zinc-500 mb-1">נותר לתשלום</p>
                        <p className="font-bold text-lg text-orange-600">
                          ₪{remainingToPay.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Tasks */}
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>משימות אחרונות</CardTitle>
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={() => setActiveTab("tasks")}
                      className="text-violet-600"
                    >
                      הצג הכל
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {project.tasks.length === 0 ? (
                      <p className="text-zinc-500 text-center py-4">אין משימות עדיין</p>
                    ) : (
                      <div className="space-y-3">
                        {project.tasks.slice(0, 5).map((task) => (
                          <div 
                            key={task.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-zinc-50"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                task.status === 'DONE' ? 'bg-green-500' :
                                task.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-zinc-400'
                              }`}></div>
                              <span className="font-medium text-zinc-900">{task.title}</span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${taskStatusColors[task.status]}`}>
                              {taskStatusLabels[task.status]}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <StickyNote className="w-5 h-5 text-amber-500" />
                        הערות
                      </CardTitle>
                      <div className="h-6 flex items-center">
                        {notesSaveStatus === 'saving' && (
                          <span className="flex items-center gap-1.5 text-xs text-zinc-400 animate-pulse">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            שומר...
                          </span>
                        )}
                        {notesSaveStatus === 'saved' && (
                          <span className="flex items-center gap-1.5 text-xs text-green-600">
                            <Check className="w-3.5 h-3.5" />
                            נשמר
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={project.notes || ""}
                      onChange={(e) => handleNotesChange(e.target.value)}
                      placeholder="הוסף הערות כלליות לפרויקט... לחץ כאן כדי לכתוב"
                      className="w-full min-h-[150px] p-4 text-sm text-zinc-700 bg-zinc-50 rounded-lg border border-transparent hover:border-zinc-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:bg-white outline-none resize-y transition-all leading-relaxed"
                    />
                  </CardContent>
                </Card>
              </>
            )}

            {/* Tasks Tab */}
            {activeTab === "tasks" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-zinc-900">משימות</h2>
                    {project.tasks.length > 0 && (
                      <p className="text-sm text-zinc-500 mt-0.5">
                        {completedTasks} מתוך {project.tasks.length} הושלמו
                      </p>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                    onClick={() => setNewTaskOpen(true)}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    הוסף משימה
                  </Button>
                </div>

                {project.tasks.length > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-600">התקדמות</span>
                      <span className="font-semibold text-violet-600">{projectProgress}%</span>
                    </div>
                    <div className="h-2.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${projectProgress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'}`}
                        style={{ width: `${projectProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <ProjectTaskBoard
                  tasks={project.tasks}
                  projectId={project.id}
                  onTasksChanged={fetchProject}
                />
              </div>
            )}

            {/* Budgets Tab */}
            {activeTab === "budgets" && (
              <div className="space-y-6">
                {/* Quotes Section */}
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      הצעות מחיר
                    </CardTitle>
                    <Button
                      onClick={() => setNewQuoteOpen(true)}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      <FileText className="w-4 h-4 ml-2" />
                      הצעת מחיר חדשה
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {project.quotes.filter(q => !q.isInvoice).length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 mx-auto text-zinc-400 mb-4" />
                        <p className="text-zinc-500 mb-4">אין הצעות מחיר עדיין</p>
                        <Button onClick={() => setNewQuoteOpen(true)} variant="outline">
                          <FileText className="w-4 h-4 ml-2" />
                          צור הצעת מחיר
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {project.quotes.filter(q => !q.isInvoice).map((quote) => (
                          <div
                            key={quote.id}
                            className="p-4 border rounded-lg hover:bg-zinc-50 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-zinc-900">
                                    {quote.quoteNumber}
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${quoteStatusColors[quote.status]}`}
                                  >
                                    {quoteStatusLabels[quote.status]}
                                  </span>
                                </div>
                                <p className="text-sm text-zinc-600 mb-2">{quote.title}</p>
                                <div className="flex items-center gap-4 text-xs text-zinc-500">
                                  <span>
                                    {new Date(quote.createdAt).toLocaleDateString("he-IL")}
                                  </span>
                                  <span className="font-semibold text-zinc-900">
                                    ₪{quote.total.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <Link href={`/quotes`}>
                                <Button variant="ghost" size="sm">
                                  <ArrowLeft className="w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Invoices Section */}
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-orange-600" />
                      חשבונות עסקה / דרישות תשלום
                    </CardTitle>
                    <Button
                      onClick={() => setNewInvoiceOpen(true)}
                      size="sm"
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    >
                      <Receipt className="w-4 h-4 ml-2" />
                      חשבון עסקה חדש
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {project.quotes.filter(q => q.isInvoice).length === 0 ? (
                      <div className="text-center py-8">
                        <Receipt className="w-12 h-12 mx-auto text-zinc-400 mb-4" />
                        <p className="text-zinc-500 mb-4">אין חשבונות עסקה עדיין</p>
                        <Button onClick={() => setNewInvoiceOpen(true)} variant="outline">
                          <Receipt className="w-4 h-4 ml-2" />
                          צור חשבון עסקה
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {project.quotes.filter(q => q.isInvoice).map((invoice) => (
                          <div
                            key={invoice.id}
                            className="p-4 border rounded-lg hover:bg-zinc-50 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-zinc-900">
                                    {invoice.quoteNumber}
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${quoteStatusColors[invoice.status]}`}
                                  >
                                    {quoteStatusLabels[invoice.status]}
                                  </span>
                                </div>
                                <p className="text-sm text-zinc-600 mb-2">{invoice.title}</p>
                                <div className="flex items-center gap-4 text-xs text-zinc-500">
                                  <span>
                                    {new Date(invoice.createdAt).toLocaleDateString("he-IL")}
                                  </span>
                                  <span className="font-semibold text-zinc-900">
                                    סה״כ: ₪{invoice.total.toLocaleString()}
                                  </span>
                                  <span className="text-green-600">
                                    שולם: ₪{invoice.paidAmount.toLocaleString()}
                                  </span>
                                  <span className="text-orange-600 font-medium">
                                    נותר: ₪{(invoice.total - invoice.paidAmount).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              <Link href={`/quotes`}>
                                <Button variant="ghost" size="sm">
                                  <ArrowLeft className="w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payments History */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      היסטוריית תשלומים
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {project.payments.length === 0 ? (
                      <p className="text-zinc-500 text-center py-8">אין תשלומים עדיין</p>
                    ) : (
                      <div className="space-y-3">
                        {project.payments.map((payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-zinc-900">
                                ₪{payment.amount.toLocaleString()}
                              </p>
                              {payment.description && (
                                <p className="text-xs text-zinc-500">{payment.description}</p>
                              )}
                            </div>
                            <div className="text-left">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                payment.status === "COMPLETED" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {payment.status === "COMPLETED" ? "שולם" : "ממתין"}
                              </span>
                              {payment.paidAt && (
                                <p className="text-xs text-zinc-500 mt-1">
                                  {new Date(payment.paidAt).toLocaleDateString('he-IL')}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Files Tab */}
            {activeTab === "files" && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>קבצים ומסמכים</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.files.length === 0 ? (
                    <p className="text-zinc-500 text-center py-8">
                      אין קבצים. העלה קבצים הקשורים לפרויקט זה.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {project.files.map((file) => (
                        <div 
                          key={file.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-zinc-50"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-zinc-400" />
                            <div>
                              <p className="font-medium text-zinc-900">{file.name}</p>
                              <p className="text-xs text-zinc-500">
                                {(file.size / 1024).toFixed(1)} KB • 
                                {new Date(file.createdAt).toLocaleDateString('he-IL')}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            הורד
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className={`space-y-6 ${activeTab === 'tasks' ? 'hidden' : ''}`}>
            {/* Client Info */}
            {project.client && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>לקוח</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/clients/${project.client.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                        <span className="text-violet-600 font-medium">
                          {project.client.name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-zinc-900">
                          {project.client.name}
                        </div>
                        {project.client.email && (
                          <div className="text-sm text-zinc-500">
                            {project.client.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>פעולות מהירות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => {
                    if (!project.client) {
                      toast({ title: "שגיאה", description: "יש לשייך לקוח לפרויקט לפני יצירת הצעת מחיר", variant: "destructive" })
                      return
                    }
                    setNewQuoteOpen(true)
                  }}
                >
                  <FileText className="w-4 h-4 ml-2" />
                  צור הצעת מחיר
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  size="sm"
                  onClick={() => {
                    if (!project.client) {
                      toast({ title: "שגיאה", description: "יש לשייך לקוח לפרויקט לפני יצירת חשבון", variant: "destructive" })
                      return
                    }
                    setNewInvoiceOpen(true)
                  }}
                >
                  <Receipt className="w-4 h-4 ml-2" />
                  צור חשבון עסקה
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => setNewTaskOpen(true)}>
                  <Plus className="w-4 h-4 ml-2" />
                  הוסף משימה
                </Button>
                {project.client?.email && (
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Mail className="w-4 h-4 ml-2" />
                    שלח אימייל ללקוח
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Project Stats */}
            <Card className="shadow-sm bg-violet-50 border-purple-200">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-600">משימות</span>
                    <span className="font-bold">{completedTasks}/{project.tasks.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-600">הצעות מחיר</span>
                    <span className="font-bold">{project.quotes.filter(q => !q.isInvoice).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-600">חשבונות</span>
                    <span className="font-bold">{project.quotes.filter(q => q.isInvoice).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-600">תשלומים</span>
                    <span className="font-bold">{project.payments.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {project && project.client && (
        <>
          <NewQuoteDialog
            open={newQuoteOpen}
            onOpenChange={setNewQuoteOpen}
            onSuccess={fetchProject}
            projectId={project.id}
            clientId={project.client.id}
          />
          <NewInvoiceDialog
            open={newInvoiceOpen}
            onOpenChange={setNewInvoiceOpen}
            onSuccess={fetchProject}
            projectId={project.id}
            clientId={project.client.id}
            clientName={project.client.name}
            projectBudget={project.budget || 0}
            paidAmount={totalPaid}
          />
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-violet-600" />
              עריכת פרויקט
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">שם הפרויקט</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="שם הפרויקט"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">תיאור</Label>
              <Textarea
                id="description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="תיאור הפרויקט"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">סטטוס</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סטטוס" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANNING">בתכנון</SelectItem>
                    <SelectItem value="IN_PROGRESS">בביצוע</SelectItem>
                    <SelectItem value="ON_HOLD">מושהה</SelectItem>
                    <SelectItem value="COMPLETED">הושלם</SelectItem>
                    <SelectItem value="CANCELLED">בוטל</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">תקציב</Label>
                <Input
                  id="budget"
                  type="number"
                  value={editForm.budget}
                  onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                  placeholder="תקציב בש״ח"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">תאריך התחלה</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">תאריך סיום</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={editForm.endDate}
                  onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>
              ביטול
            </Button>
            <Button onClick={handleSaveEdit} disabled={saving || !editForm.name.trim()}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  שומר...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 ml-2" />
                  שמור
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Task Dialog */}
      <NewTaskDialog
        open={newTaskOpen}
        onOpenChange={setNewTaskOpen}
        projectId={project?.id}
        onTaskCreated={fetchProject}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash className="w-5 h-5" />
              מחיקת פרויקט
            </AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              האם אתה בטוח שברצונך למחוק את הפרויקט "{project?.name}"?
              <br /><br />
              <span className="text-red-600 font-medium">
                פעולה זו תמחק גם את כל המשימות, התקציבים, התשלומים והקבצים המקושרים לפרויקט.
              </span>
              <br /><br />
              לא ניתן לבטל פעולה זו.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 sm:gap-0">
            <AlertDialogCancel disabled={deleting}>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  מוחק...
                </>
              ) : (
                <>
                  <Trash className="w-4 h-4 ml-2" />
                  מחק
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}
