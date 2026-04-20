"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { AssignTaskDialog } from "@/components/dialogs/AssignTaskDialog"
import {
  Calendar,
  Clock,
  Trash,
  User,
  FolderKanban,
  Building,
  UserPlus,
  AlertCircle,
  Circle,
  CheckCircle2,
  Tag,
  ExternalLink,
  FileText,
  CalendarDays,
  ListChecks,
  Plus,
  X,
  Square,
  CheckSquare,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"

interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

interface TaskDetail {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  tags: string[]
  checklist: ChecklistItem[] | null
  createdAt: string
  updatedAt: string
  assignee: { id: string; name: string; email: string; avatar: string | null } | null
  project: { id: string; name: string; status: string; client: { id: string; name: string } | null } | null
  client: { id: string; name: string } | null
  lead: { id: string; name: string } | null
}

const priorityConfig: Record<string, { label: string; color: string; icon: any; bg: string; headerBg: string }> = {
  URGENT: { label: "דחוף מאוד", color: "text-red-700", icon: AlertCircle, bg: "bg-red-100 border-red-200", headerBg: "from-red-500 to-red-600" },
  HIGH: { label: "גבוהה", color: "text-orange-700", icon: AlertCircle, bg: "bg-orange-100 border-orange-200", headerBg: "from-orange-400 to-orange-500" },
  NORMAL: { label: "רגילה", color: "text-blue-700", icon: Circle, bg: "bg-blue-100 border-blue-200", headerBg: "from-blue-500 to-indigo-600" },
  LOW: { label: "נמוכה", color: "text-zinc-700", icon: Circle, bg: "bg-zinc-100 border-zinc-200", headerBg: "from-gray-400 to-gray-500" },
}

const statusConfig: Record<string, { label: string; activeBg: string; bg: string; color: string }> = {
  TODO: { label: "לביצוע", activeBg: "bg-zinc-700 text-white", bg: "bg-zinc-100 border-zinc-200", color: "text-zinc-700" },
  IN_PROGRESS: { label: "בתהליך", activeBg: "bg-cyan-600 text-white", bg: "bg-cyan-50 border-cyan-200", color: "text-cyan-700" },
  DONE: { label: "הושלם", activeBg: "bg-green-600 text-white", bg: "bg-green-50 border-green-200", color: "text-green-700" },
}

function ChecklistAddInput({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const handleAdd = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText("")
  }

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

interface TaskDetailDialogProps {
  taskId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onTaskUpdated: () => void
  cachedTasks: Map<string, any>
}

export function TaskDetailDialog({ taskId, open, onOpenChange, onTaskUpdated, cachedTasks }: TaskDetailDialogProps) {
  const { toast } = useToast()
  const [task, setTask] = useState<TaskDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const prevTaskId = useRef<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (taskId && open) {
      if (taskId !== prevTaskId.current) {
        prevTaskId.current = taskId
        const cached = cachedTasks.get(taskId)
        if (cached) {
          setTask({
            id: cached.id, title: cached.title, description: cached.description,
            status: cached.status, priority: cached.priority, dueDate: cached.dueDate,
            tags: cached.tags || [], checklist: cached.checklist || null,
            createdAt: cached.createdAt || new Date().toISOString(),
            updatedAt: cached.updatedAt || new Date().toISOString(),
            assignee: cached.assignee || null, project: cached.project || null,
            client: cached.client || null, lead: cached.lead || null,
          })
        } else {
          setLoading(true)
        }
      }
      fetch(`/api/tasks/${taskId}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setTask(data) })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [taskId, open, cachedTasks])

  const patchField = useCallback(async (field: string, value: any) => {
    if (!task) return
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      onTaskUpdated()
    } catch {}
  }, [task, onTaskUpdated])

  const debouncedPatch = useCallback((field: string, value: any) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => patchField(field, value), 600)
  }, [patchField])

  const updateField = useCallback((field: keyof TaskDetail, value: any, debounce = true) => {
    setTask(prev => prev ? { ...prev, [field]: value } : prev)
    if (debounce) {
      debouncedPatch(field, value)
    } else {
      patchField(field, value)
    }
  }, [debouncedPatch, patchField])

  const handleStatusChange = useCallback((newStatus: string) => {
    updateField('status', newStatus, false)
  }, [updateField])

  const handlePriorityChange = useCallback((newPriority: string) => {
    updateField('priority', newPriority, false)
  }, [updateField])

  const checklist: ChecklistItem[] = task?.checklist || []
  const completedCount = checklist.filter(i => i.checked).length
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0

  const updateChecklist = useCallback((newList: ChecklistItem[]) => {
    setTask(prev => prev ? { ...prev, checklist: newList } : prev)
    patchField('checklist', newList)
  }, [patchField])

  const addChecklistItem = useCallback((text: string) => {
    const item: ChecklistItem = { id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text, checked: false }
    updateChecklist([...checklist, item])
  }, [checklist, updateChecklist])

  const toggleChecklistItem = useCallback((itemId: string) => {
    updateChecklist(checklist.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i))
  }, [checklist, updateChecklist])

  const removeChecklistItem = useCallback((itemId: string) => {
    updateChecklist(checklist.filter(i => i.id !== itemId))
  }, [checklist, updateChecklist])

  const updateChecklistItemText = useCallback((itemId: string, text: string) => {
    const newList = checklist.map(i => i.id === itemId ? { ...i, text } : i)
    setTask(prev => prev ? { ...prev, checklist: newList } : prev)
    debouncedPatch('checklist', newList)
  }, [checklist, debouncedPatch])

  const moveChecklistItem = useCallback((index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= checklist.length) return
    const newList = [...checklist]
    const [moved] = newList.splice(index, 1)
    newList.splice(targetIndex, 0, moved)
    updateChecklist(newList)
  }, [checklist, updateChecklist])

  const handleDelete = async () => {
    if (!task || !confirm('האם אתה בטוח שברצונך למחוק את המשימה?')) return
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: "המשימה נמחקה" })
        onOpenChange(false)
        onTaskUpdated()
      }
    } catch {
      toast({ title: "שגיאה", variant: "destructive" })
    }
  }

  if (!taskId) return null

  const priority = task ? priorityConfig[task.priority] || priorityConfig.NORMAL : priorityConfig.NORMAL
  const status = task ? statusConfig[task.status] || statusConfig.TODO : statusConfig.TODO
  const PriorityIcon = priority.icon

  const dueInfo = task?.dueDate ? (() => {
    const date = new Date(task.dueDate!)
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const d = new Date(date); d.setHours(0, 0, 0, 0)
    const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    const formatted = date.toLocaleDateString('he-IL')
    if (diff < 0) return { label: `באיחור ${Math.abs(diff)} ימים`, colorClass: 'text-red-600 bg-red-50', formatted, overdue: true }
    if (diff === 0) return { label: 'היום', colorClass: 'text-orange-600 bg-orange-50', formatted, overdue: false }
    if (diff === 1) return { label: 'מחר', colorClass: 'text-yellow-700 bg-yellow-50', formatted, overdue: false }
    return { label: `${diff} ימים`, colorClass: 'text-blue-600 bg-blue-50', formatted, overdue: false }
  })() : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[860px] p-0 gap-0 overflow-hidden max-h-[90vh]">
        {task ? (
          <>
            {/* Header - title bar only */}
            <div className={`bg-gradient-to-l ${priority.headerBg} px-6 py-3.5`}>
              <div className="flex items-center justify-between gap-3">
                <input
                  value={task.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className={`flex-1 min-w-0 text-xl font-bold text-white bg-transparent border-0 outline-none placeholder-white/50 ${task.status === 'DONE' ? 'line-through opacity-75' : ''}`}
                  placeholder="כותרת המשימה..."
                />
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="ghost" onClick={handleDelete} className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/20">
                    <Trash className="w-4 h-4" />
                  </Button>
                  <Link href={`/tasks/${task.id}`}>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/20">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap px-6 py-3 border-b border-zinc-100 bg-zinc-50/50">
              <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1 font-medium ${priority.bg} ${priority.color}`}>
                <PriorityIcon className="w-3 h-3" />
                {priority.label}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1 font-medium ${status.bg} ${status.color}`}>
                {status.label}
              </span>
              {dueInfo && (
                <span className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1 font-medium ${dueInfo.overdue ? 'bg-red-50 border-red-200 text-red-700' : 'bg-zinc-100 border-zinc-200 text-zinc-600'}`}>
                  <CalendarDays className="w-3 h-3" />
                  {dueInfo.formatted}
                </span>
              )}
            </div>

            {/* Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-130px)]">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-x-reverse divide-gray-100">
                {/* Main */}
                <div className="md:col-span-2 p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-zinc-400" />
                      <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">תיאור</Label>
                    </div>
                    <textarea
                      value={task.description || ""}
                      onChange={(e) => updateField('description', e.target.value || null)}
                      placeholder="הוסף תיאור למשימה... לחץ כאן כדי לכתוב"
                      className="w-full min-h-[120px] p-4 text-sm text-zinc-700 bg-zinc-50 rounded-lg border border-transparent hover:border-zinc-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:bg-white outline-none resize-y transition-all leading-relaxed"
                    />
                  </div>

                  {/* Checklist */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ListChecks className="w-4 h-4 text-zinc-400" />
                        <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">צ'קליסט</Label>
                        {checklist.length > 0 && (
                          <span className="text-xs text-zinc-400">{completedCount}/{checklist.length}</span>
                        )}
                      </div>
                    </div>

                    {checklist.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-2 bg-zinc-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${progressPercent === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <span className={`text-xs font-semibold ${progressPercent === 100 ? 'text-green-600' : 'text-zinc-500'}`}>
                            {progressPercent}%
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      {checklist.map((item, idx) => (
                        <div key={item.id} className="group flex items-start gap-1.5 py-1 rounded-lg hover:bg-zinc-50 px-1 -mx-1">
                          <div className="flex flex-col shrink-0 opacity-0 group-hover:opacity-100 transition-all -space-y-1">
                            <button
                              onClick={() => moveChecklistItem(idx, 'up')}
                              disabled={idx === 0}
                              className="text-zinc-300 hover:text-zinc-600 disabled:opacity-20 p-0"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveChecklistItem(idx, 'down')}
                              disabled={idx === checklist.length - 1}
                              className="text-zinc-300 hover:text-zinc-600 disabled:opacity-20 p-0"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
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
                            className="shrink-0 p-0.5 rounded text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <ChecklistAddInput onAdd={addChecklistItem} />
                  </div>

                  {/* Status */}
                  <div>
                    <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3 block">סטטוס</Label>
                    <div className="flex gap-2">
                      {Object.entries(statusConfig).map(([key, cfg]) => (
                        <button
                          key={key}
                          onClick={() => handleStatusChange(key)}
                          disabled={task.status === key}
                          className={`flex items-center gap-1.5 text-sm font-medium px-5 py-2.5 rounded-lg transition-all ${
                            task.status === key
                              ? cfg.activeBg + ' shadow-sm'
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                          }`}
                        >
                          {key === 'DONE' && <CheckCircle2 className="w-4 h-4" />}
                          {key === 'IN_PROGRESS' && <Clock className="w-4 h-4" />}
                          {key === 'TODO' && <Circle className="w-4 h-4" />}
                          {cfg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Related */}
                  {(task.project || task.client || task.lead) && (
                    <div>
                      <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3 block">קישורים</Label>
                      <div className="space-y-2">
                        {task.project && (
                          <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg border border-cyan-100">
                            <FolderKanban className="w-4 h-4 text-cyan-600 shrink-0" />
                            <span className="text-sm font-medium text-cyan-800">{task.project.name}</span>
                          </div>
                        )}
                        {task.client && (
                          <Link href={`/clients/${task.client.id}`} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
                            <Building className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="text-sm font-medium text-blue-800">{task.client.name}</span>
                          </Link>
                        )}
                        {task.lead && (
                          <Link href={`/leads/${task.lead.id}`} className="flex items-center gap-3 p-3 bg-violet-50 rounded-lg border border-purple-100 hover:bg-violet-100 transition-colors">
                            <UserPlus className="w-4 h-4 text-violet-600 shrink-0" />
                            <span className="text-sm font-medium text-violet-800">{task.lead.name}</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="p-5 space-y-5 bg-zinc-50/50">
                  {/* Assignee */}
                  <div>
                    <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2 block">אחראי</Label>
                    {task.assignee ? (
                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-zinc-100">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {task.assignee.name?.charAt(0) || "?"}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-zinc-900 truncate">{task.assignee.name}</div>
                          <div className="text-xs text-zinc-500 truncate">{task.assignee.email}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-dashed border-zinc-200 text-zinc-400">
                        <User className="w-4 h-4" />
                        <span className="text-sm">לא משויך</span>
                      </div>
                    )}
                    <div className="mt-2">
                      <AssignTaskDialog
                        taskId={task.id}
                        taskTitle={task.title}
                        currentAssigneeId={task.assignee?.id || null}
                        currentAssigneeName={task.assignee?.name || null}
                        onTaskAssigned={() => {
                          fetch(`/api/tasks/${task.id}`).then(r => r.json()).then(setTask)
                          onTaskUpdated()
                        }}
                      />
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2 block">עדיפות</Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.entries(priorityConfig).map(([key, cfg]) => {
                        const Icon = cfg.icon
                        return (
                          <button
                            key={key}
                            onClick={() => handlePriorityChange(key)}
                            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all ${
                              task.priority === key
                                ? `${cfg.bg} border ${cfg.color} shadow-sm`
                                : 'bg-white border border-zinc-100 text-zinc-500 hover:bg-zinc-50'
                            }`}
                          >
                            <Icon className="w-3 h-3" />
                            {cfg.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Due date */}
                  <div>
                    <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2 block">תאריך יעד</Label>
                    <Input
                      type="date"
                      value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateField('dueDate', e.target.value || null, false)}
                      className="bg-white text-sm"
                    />
                    {dueInfo && (
                      <div className={`flex items-center gap-1.5 mt-1.5 text-xs px-2.5 py-1 rounded-md ${dueInfo.colorClass}`}>
                        <Calendar className="w-3 h-3" />
                        {dueInfo.label}
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div>
                    <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2 block">תאריכים</Label>
                    <div className="space-y-1.5 text-xs text-zinc-500">
                      <div className="flex justify-between">
                        <span>נוצר</span>
                        <span className="text-zinc-700">{new Date(task.createdAt).toLocaleDateString('he-IL', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>עודכן</span>
                        <span className="text-zinc-700">{new Date(task.updatedAt).toLocaleDateString('he-IL', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div>
                      <Label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2 block">תגיות</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {task.tags.map((tag, i) => (
                          <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 flex items-center gap-1 font-medium">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-10 h-10 border-3 border-zinc-200 border-t-blue-500 rounded-full animate-spin mx-auto" />
              <p className="text-sm text-zinc-400 mt-3">טוען...</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-400">משימה לא נמצאה</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
