"use client"

import { useEffect, useState, useRef } from "react"
import { AppLayout } from "@/components/AppLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowRight, 
  CheckSquare,
  Square,
  Calendar,
  Clock,
  Edit,
  Trash,
  User,
  FolderKanban,
  Building,
  UserPlus,
  AlertCircle,
  Circle,
  CheckCircle2,
  Paperclip,
  MessageSquare,
  Tag,
  Plus,
  X,
  Save,
  ListChecks,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { AssignTaskDialog } from "@/components/dialogs/AssignTaskDialog"

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  tags: string[]
  checklist: any
  createdAt: string
  updatedAt: string
  assignee: { 
    id: string
    name: string
    email: string
    avatar: string | null
  } | null
  project: { 
    id: string
    name: string
    status: string
    client: {
      id: string
      name: string
    } | null
  } | null
  client: { 
    id: string
    name: string
    email: string | null
    phone: string | null
  } | null
  lead: { 
    id: string
    name: string
    email: string | null
    phone: string | null
  } | null
  files: Array<{
    id: string
    name: string
    path: string
    size: number
    mimeType: string | null
    createdAt: string
  }>
}

interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

function ChecklistAddInput({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 mt-2 px-2 py-1.5 text-sm text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 rounded-lg transition-colors w-full"
      >
        <Plus className="w-4 h-4" />
        הוסף פריט
      </button>
    )
  }

  const handleAdd = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText("")
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAdd()
          if (e.key === 'Escape') { setIsOpen(false); setText("") }
        }}
        placeholder="הוסף פריט..."
        className="flex-1 text-sm px-3 py-2 border border-zinc-200 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none"
        autoFocus
      />
      <Button size="sm" onClick={handleAdd} className="h-9 px-3 text-xs shrink-0">
        הוסף
      </Button>
      <button
        onClick={() => { setIsOpen(false); setText("") }}
        className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: "",
    status: "",
  })
  const [saving, setSaving] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetchTask()
  }, [params.id])

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  const fetchTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setTask(data)
        setEditData({
          title: data.title || "",
          description: data.description || "",
          priority: data.priority || "NORMAL",
          dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : "",
          status: data.status || "TODO",
        })
      } else {
        toast({
          title: "שגיאה",
          description: "לא ניתן לטעון את פרטי המשימה",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error fetching task:', error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בטעינת פרטי המשימה",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/tasks/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editData.title,
          description: editData.description || null,
          priority: editData.priority,
          dueDate: editData.dueDate || null,
          status: editData.status,
        }),
      })

      if (response.ok) {
        toast({
          title: "המשימה עודכנה",
          description: "פרטי המשימה נשמרו בהצלחה",
        })
        setIsEditing(false)
        fetchTask()
      } else {
        toast({
          title: "שגיאה",
          description: "לא ניתן לעדכן את המשימה",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating task:', error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעדכון המשימה",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "הסטטוס עודכן",
          description: `המשימה עודכנה ל${statusLabels[newStatus]}`,
        })
        fetchTask()
      } else {
        toast({
          title: "שגיאה",
          description: "לא ניתן לעדכן את הסטטוס",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error updating task status:', error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעדכון הסטטוס",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את המשימה?')) {
      return
    }

    try {
      const response = await fetch(`/api/tasks/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "המשימה נמחקה",
          description: "המשימה נמחקה בהצלחה",
        })
        router.push('/tasks/my')
      } else {
        toast({
          title: "שגיאה",
          description: "לא ניתן למחוק את המשימה",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה במחיקת המשימה",
        variant: "destructive",
      })
    }
  }

  const checklist: ChecklistItem[] = (task?.checklist as ChecklistItem[]) || []
  const completedCount = checklist.filter(i => i.checked).length
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0

  const patchChecklist = async (newList: ChecklistItem[]) => {
    setTask(prev => prev ? { ...prev, checklist: newList } : prev)
    try {
      await fetch(`/api/tasks/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checklist: newList }),
      })
    } catch {}
  }

  const addChecklistItem = (text: string) => {
    const item: ChecklistItem = { id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text, checked: false }
    patchChecklist([...checklist, item])
  }

  const toggleChecklistItem = (itemId: string) => {
    patchChecklist(checklist.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i))
  }

  const removeChecklistItem = (itemId: string) => {
    patchChecklist(checklist.filter(i => i.id !== itemId))
  }

  const updateChecklistItemText = (itemId: string, text: string) => {
    const newList = checklist.map(i => i.id === itemId ? { ...i, text } : i)
    setTask(prev => prev ? { ...prev, checklist: newList } : prev)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      fetch(`/api/tasks/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checklist: newList }),
      }).catch(() => {})
    }, 600)
  }

  const moveChecklistItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= checklist.length) return
    const newList = [...checklist]
    const [moved] = newList.splice(index, 1)
    newList.splice(targetIndex, 0, moved)
    patchChecklist(newList)
  }

  const priorityConfig: Record<string, { label: string; color: string; icon: any; bg: string }> = {
    URGENT: { label: "דחוף מאוד", color: "text-red-700", icon: AlertCircle, bg: "bg-red-100 border-red-200" },
    HIGH: { label: "גבוהה", color: "text-orange-700", icon: AlertCircle, bg: "bg-orange-100 border-orange-200" },
    NORMAL: { label: "רגילה", color: "text-blue-700", icon: Circle, bg: "bg-blue-100 border-blue-200" },
    LOW: { label: "נמוכה", color: "text-zinc-700", icon: Circle, bg: "bg-zinc-100 border-zinc-200" },
  }

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    TODO: { label: "לביצוע", color: "text-zinc-700", bg: "bg-zinc-100" },
    IN_PROGRESS: { label: "בתהליך", color: "text-cyan-700", bg: "bg-cyan-100" },
    DONE: { label: "הושלם", color: "text-green-700", bg: "bg-green-100" },
  }

  const statusLabels: Record<string, string> = {
    TODO: "לביצוע",
    IN_PROGRESS: "בתהליך",
    DONE: "הושלם",
  }

  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return null
    const date = new Date(dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDateClean = new Date(date)
    dueDateClean.setHours(0, 0, 0, 0)
    
    const diffTime = dueDateClean.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    let label = ''
    let colorClass = 'text-zinc-600'
    
    if (diffDays < 0) {
      label = `באיחור של ${Math.abs(diffDays)} ימים`
      colorClass = 'text-red-600'
    } else if (diffDays === 0) {
      label = 'היום'
      colorClass = 'text-orange-600'
    } else if (diffDays === 1) {
      label = 'מחר'
      colorClass = 'text-yellow-600'
    } else if (diffDays <= 7) {
      label = `בעוד ${diffDays} ימים`
      colorClass = 'text-blue-600'
    } else {
      label = `בעוד ${diffDays} ימים`
    }
    
    return { label, colorClass, formatted: date.toLocaleDateString('he-IL') }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-zinc-600">טוען פרטי משימה...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!task) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <CheckSquare className="w-16 h-16 mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">משימה לא נמצאה</h3>
          <Link href="/tasks/my">
            <Button variant="outline">חזרה למשימות</Button>
          </Link>
        </div>
      </AppLayout>
    )
  }

  const priority = priorityConfig[task.priority] || priorityConfig.NORMAL
  const status = statusConfig[task.status] || statusConfig.TODO
  const PriorityIcon = priority.icon
  const dueInfo = formatDueDate(task.dueDate)

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/tasks/my" className="hover:text-zinc-700">המשימות שלי</Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-zinc-900 truncate max-w-xs">{task.title}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                className="text-2xl font-bold mb-2"
                placeholder="כותרת המשימה"
              />
            ) : (
              <h1 className={`text-3xl font-bold text-zinc-900 ${task.status === 'DONE' ? 'line-through opacity-60' : ''}`}>
                {task.title}
              </h1>
            )}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className={`text-sm px-3 py-1.5 rounded-full border ${priority.bg} ${priority.color} flex items-center gap-1.5`}>
                <PriorityIcon className="w-4 h-4" />
                {priority.label}
              </span>
              <span className={`text-sm px-3 py-1.5 rounded-full ${status.bg} ${status.color}`}>
                {status.label}
              </span>
              {dueInfo && (
                <span className={`text-sm flex items-center gap-1.5 ${dueInfo.colorClass}`}>
                  <Calendar className="w-4 h-4" />
                  {dueInfo.formatted} ({dueInfo.label})
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="prodify-gradient text-white"
                >
                  <Save className="w-4 h-4 ml-2" />
                  {saving ? 'שומר...' : 'שמור'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false)
                    setEditData({
                      title: task.title || "",
                      description: task.description || "",
                      priority: task.priority || "NORMAL",
                      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
                      status: task.status || "TODO",
                    })
                  }}
                >
                  <X className="w-4 h-4 ml-2" />
                  ביטול
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 ml-2" />
                  ערוך
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  <Trash className="w-4 h-4 ml-2" />
                  מחק
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>תיאור</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <textarea
                    className="w-full min-h-[150px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="הוסף תיאור למשימה..."
                  />
                ) : (
                  <p className="text-zinc-700 whitespace-pre-wrap">
                    {task.description || "אין תיאור למשימה זו"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Checklist */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-zinc-400" />
                    <CardTitle>צ'קליסט</CardTitle>
                    {checklist.length > 0 && (
                      <span className="text-sm text-zinc-400 font-normal">{completedCount}/{checklist.length}</span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {checklist.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2.5 bg-zinc-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${progressPercent === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className={`text-sm font-semibold min-w-[40px] text-left ${progressPercent === 100 ? 'text-green-600' : 'text-zinc-500'}`}>
                        {progressPercent}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  {checklist.map((item, idx) => (
                    <div key={item.id} className="group flex items-start gap-2 py-2 px-2 -mx-2 rounded-lg hover:bg-zinc-50 transition-colors">
                      <div className="flex flex-col shrink-0 opacity-0 group-hover:opacity-100 transition-all -space-y-1 mt-0.5">
                        <button
                          onClick={() => moveChecklistItem(idx, 'up')}
                          disabled={idx === 0}
                          className="text-zinc-300 hover:text-zinc-600 disabled:opacity-20 p-0"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveChecklistItem(idx, 'down')}
                          disabled={idx === checklist.length - 1}
                          className="text-zinc-300 hover:text-zinc-600 disabled:opacity-20 p-0"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => toggleChecklistItem(item.id)}
                        className="mt-0.5 shrink-0 text-zinc-400 hover:text-blue-600 transition-colors"
                      >
                        {item.checked ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                      <input
                        value={item.text}
                        onChange={(e) => updateChecklistItemText(item.id, e.target.value)}
                        className={`flex-1 text-sm bg-transparent border-0 outline-none py-0.5 ${item.checked ? 'line-through text-zinc-400' : 'text-zinc-700'}`}
                      />
                      <button
                        onClick={() => removeChecklistItem(item.id)}
                        className="shrink-0 p-1 rounded text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <ChecklistAddInput onAdd={addChecklistItem} />
              </CardContent>
            </Card>

            {/* Status Actions */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>שינוי סטטוס</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <Button
                      key={key}
                      variant={task.status === key ? "default" : "outline"}
                      className={task.status === key ? "prodify-gradient text-white" : ""}
                      onClick={() => handleStatusChange(key)}
                      disabled={task.status === key}
                    >
                      {key === 'DONE' && <CheckCircle2 className="w-4 h-4 ml-2" />}
                      {key === 'IN_PROGRESS' && <Clock className="w-4 h-4 ml-2" />}
                      {key === 'TODO' && <Circle className="w-4 h-4 ml-2" />}
                      {config.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Related Info */}
            {(task.project || task.client || task.lead) && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>קישורים</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {task.project && (
                    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FolderKanban className="w-5 h-5 text-cyan-600" />
                        <div>
                          <div className="font-medium text-zinc-900">{task.project.name}</div>
                          <div className="text-sm text-zinc-500">פרויקט</div>
                        </div>
                      </div>
                      {task.project.client && (
                        <Link href={`/clients/${task.project.client.id}`}>
                          <Button variant="ghost" size="sm">
                            לעמוד הלקוח
                            <ArrowRight className="w-4 h-4 mr-2" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                  {task.client && (
                    <Link href={`/clients/${task.client.id}`} className="block">
                      <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors">
                        <Building className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-zinc-900">{task.client.name}</div>
                          <div className="text-sm text-zinc-500">לקוח</div>
                        </div>
                      </div>
                    </Link>
                  )}
                  {task.lead && (
                    <Link href={`/leads/${task.lead.id}`} className="block">
                      <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg hover:bg-zinc-100 transition-colors">
                        <UserPlus className="w-5 h-5 text-violet-600" />
                        <div>
                          <div className="font-medium text-zinc-900">{task.lead.name}</div>
                          <div className="text-sm text-zinc-500">ליד</div>
                        </div>
                      </div>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Files */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>קבצים מצורפים</CardTitle>
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4 ml-2" />
                    העלה קובץ
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {task.files && task.files.length > 0 ? (
                  <div className="space-y-2">
                    {task.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-zinc-50">
                        <div className="flex items-center gap-3">
                          <Paperclip className="w-4 h-4 text-zinc-400" />
                          <div>
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-zinc-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">הורד</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-zinc-400 py-8">
                    <Paperclip className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>אין קבצים מצורפים</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assignee */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>אחראי</CardTitle>
              </CardHeader>
              <CardContent>
                {task.assignee ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                      {task.assignee.avatar ? (
                        <img src={task.assignee.avatar} alt={task.assignee.name} className="w-10 h-10 rounded-full" />
                      ) : (
                        <span className="text-violet-600 font-medium">
                          {task.assignee.name?.charAt(0) || "?"}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-zinc-900">{task.assignee.name}</div>
                      <div className="text-sm text-zinc-500">{task.assignee.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-zinc-400 py-4">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">לא משויך לאף אחד</p>
                  </div>
                )}
                <div className="mt-4">
                  <AssignTaskDialog
                    taskId={task.id}
                    taskTitle={task.title}
                    currentAssigneeId={task.assignee?.id || null}
                    currentAssigneeName={task.assignee?.name || null}
                    onTaskAssigned={fetchTask}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Details */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>פרטים</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label className="text-zinc-500 text-sm">עדיפות</Label>
                      <select
                        className="w-full mt-1 p-2 border rounded-lg"
                        value={editData.priority}
                        onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                      >
                        {Object.entries(priorityConfig).map(([key, config]) => (
                          <option key={key} value={key}>{config.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-zinc-500 text-sm">תאריך יעד</Label>
                      <Input
                        type="date"
                        className="mt-1"
                        value={editData.dueDate}
                        onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label className="text-zinc-500 text-sm">עדיפות</Label>
                      <div className={`mt-1 flex items-center gap-2 ${priority.color}`}>
                        <PriorityIcon className="w-4 h-4" />
                        <span>{priority.label}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-zinc-500 text-sm">תאריך יעד</Label>
                      <div className="mt-1">
                        {dueInfo ? (
                          <span className={dueInfo.colorClass}>{dueInfo.formatted}</span>
                        ) : (
                          <span className="text-zinc-400">לא הוגדר</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
                <div>
                  <Label className="text-zinc-500 text-sm">נוצר בתאריך</Label>
                  <div className="mt-1 text-zinc-700">
                    {new Date(task.createdAt).toLocaleDateString('he-IL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
                <div>
                  <Label className="text-zinc-500 text-sm">עודכן לאחרונה</Label>
                  <div className="mt-1 text-zinc-700">
                    {new Date(task.updatedAt).toLocaleDateString('he-IL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>תגיות</CardTitle>
              </CardHeader>
              <CardContent>
                {task.tags && task.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-zinc-400 py-4">
                    <Tag className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">אין תגיות</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
