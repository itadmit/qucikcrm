"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Plus, X, AlertCircle, Clock, User, CheckCircle2, Circle, FolderKanban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { TaskDetailDialog } from "@/components/dialogs/TaskDetailDialog"

const TASK_TYPE = "PROJECT_TASK"

interface ProjectTask {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  position: number
  dueDate: string | null
  columnId: string | null
  assignee: { id: string; name: string } | null
}

interface StatusColumn {
  key: string
  label: string
  color: string
  icon: any
}

const STATUS_COLUMNS: StatusColumn[] = [
  { key: "TODO", label: "לביצוע", color: "#94a3b8", icon: Circle },
  { key: "IN_PROGRESS", label: "בתהליך", color: "#22d3ee", icon: Clock },
  { key: "DONE", label: "הושלם", color: "#22c55e", icon: CheckCircle2 },
]

const priorityConfig: Record<string, { label: string; color: string; border: string }> = {
  URGENT: { label: "דחוף", color: "bg-red-500", border: "border-r-red-500" },
  HIGH: { label: "גבוהה", color: "bg-orange-400", border: "border-r-orange-400" },
  NORMAL: { label: "רגילה", color: "bg-blue-400", border: "border-r-blue-400" },
  LOW: { label: "נמוכה", color: "bg-zinc-300", border: "border-r-gray-300" },
}

interface DragItem {
  type: string
  id: string
  status: string
  index: number
}

function formatDueDate(dueDate: string | null) {
  if (!dueDate) return null
  const date = new Date(dueDate)
  const today = new Date()
  const diffTime = date.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return { text: "היום", urgent: true }
  if (diffDays === 1) return { text: "מחר", urgent: false }
  if (diffDays < 0) return { text: "באיחור", urgent: true }
  return { text: `${diffDays} ימים`, urgent: false }
}

function ProjectTaskCard({
  task,
  index,
  statusKey,
  onMoveCard,
  onClickTask,
}: {
  task: ProjectTask
  index: number
  statusKey: string
  onMoveCard: (dragId: string, targetStatus: string, targetIndex: number) => void
  onClickTask: (taskId: string) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const priority = priorityConfig[task.priority] || priorityConfig.NORMAL
  const due = formatDueDate(task.dueDate)

  const [{ isDragging }, drag] = useDrag({
    type: TASK_TYPE,
    item: (): DragItem => ({ type: TASK_TYPE, id: task.id, status: statusKey, index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  })

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: TASK_TYPE,
    hover(item, monitor) {
      if (!ref.current) return
      if (item.id === task.id) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) return
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (item.status === statusKey) {
        if (item.index < index && hoverClientY < hoverMiddleY) return
        if (item.index > index && hoverClientY > hoverMiddleY) return
      }

      onMoveCard(item.id, statusKey, index)
      item.index = index
      item.status = statusKey
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      onClick={() => onClickTask(task.id)}
      className={`group relative bg-white rounded-lg border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing select-none ${
        isDragging ? "opacity-30 scale-95" : ""
      } ${isOver ? "border-blue-300" : ""} border-r-4 ${priority.border}`}
    >
      <div className="p-3">
        {(task.priority === "URGENT" || task.priority === "HIGH") && (
          <div className="flex gap-1 mb-2">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${priority.color}`}>
              <AlertCircle className="w-3 h-3" />
              {priority.label}
            </span>
          </div>
        )}

        <h4 className={`text-sm font-medium text-zinc-900 leading-snug mb-1 ${task.status === "DONE" ? "line-through opacity-60" : ""}`}>
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-zinc-500 line-clamp-2 mb-2">{task.description}</p>
        )}

        <div className="flex items-center gap-2 flex-wrap mt-2">
          {due && (
            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${
              due.urgent ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-600"
            }`}>
              <Clock className="w-3 h-3" />
              {due.text}
            </span>
          )}
        </div>

        {task.assignee && (
          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-zinc-100">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
              {task.assignee.name.charAt(0)}
            </div>
            <span className="text-[11px] text-zinc-500">{task.assignee.name.split(" ")[0]}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectStatusColumn({
  column,
  tasks,
  onMoveCard,
  onDropEnd,
  onQuickAdd,
  onClickTask,
}: {
  column: StatusColumn
  tasks: ProjectTask[]
  onMoveCard: (dragId: string, targetStatus: string, targetIndex: number) => void
  onDropEnd: () => void
  onQuickAdd: (status: string, title: string) => void
  onClickTask: (taskId: string) => void
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const Icon = column.icon

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: TASK_TYPE,
    drop: () => onDropEnd(),
    hover(item) {
      if (tasks.length === 0 && item.status !== column.key) {
        onMoveCard(item.id, column.key, 0)
        item.status = column.key
        item.index = 0
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  })

  const handleAdd = () => {
    const t = newTitle.trim()
    if (!t) return
    onQuickAdd(column.key, t)
    setNewTitle("")
    setIsAdding(false)
  }

  return (
    <div
      ref={drop}
      className={`flex flex-col max-h-[600px] rounded-xl shadow-sm transition-colors duration-200 min-w-0 ${
        isOver ? "bg-blue-50 ring-2 ring-blue-300" : "bg-white"
      }`}
    >
      <div className="rounded-t-xl px-3 pt-3 pb-2" style={{ borderTop: `3px solid ${column.color}` }}>
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color: column.color }} />
          <h3 className="text-sm font-bold text-zinc-800">{column.label}</h3>
          <span className="text-[11px] text-zinc-500 font-semibold bg-zinc-100 min-w-[22px] text-center px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2 min-h-[60px] scrollbar-thin bg-zinc-50/50">
        {tasks.map((task, index) => (
          <ProjectTaskCard
            key={task.id}
            task={task}
            index={index}
            statusKey={column.key}
            onMoveCard={onMoveCard}
            onClickTask={onClickTask}
          />
        ))}
        {tasks.length === 0 && !isOver && (
          <div className="text-center py-8 text-xs text-zinc-400">גרור כרטיסים לכאן</div>
        )}
      </div>

      <div className="px-2 pb-2">
        {isAdding ? (
          <div className="space-y-2">
            <textarea
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAdd() }
                if (e.key === "Escape") { setIsAdding(false); setNewTitle("") }
              }}
              placeholder="הזן כותרת למשימה..."
              className="w-full p-2 text-sm rounded-lg border border-zinc-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none resize-none bg-white shadow-sm"
              rows={2}
              autoFocus
            />
            <div className="flex items-center gap-1">
              <Button size="sm" onClick={handleAdd} className="text-xs h-8 px-3">הוסף</Button>
              <button onClick={() => { setIsAdding(false); setNewTitle("") }} className="p-1.5 rounded hover:bg-zinc-200 text-zinc-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 w-full px-3 py-2 text-sm text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            הוסף כרטיס
          </button>
        )}
      </div>
    </div>
  )
}

interface ProjectTaskBoardProps {
  tasks: ProjectTask[]
  projectId: string
  onTasksChanged: () => void
}

export function ProjectTaskBoard({ tasks: initialTasks, projectId, onTasksChanged }: ProjectTaskBoardProps) {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks)
  const tasksRef = useRef<ProjectTask[]>(tasks)
  tasksRef.current = tasks
  const pendingRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)

  const cachedTasks = useRef(new Map<string, any>())

  useEffect(() => {
    setTasks(initialTasks)
    const map = new Map<string, any>()
    initialTasks.forEach((t) => map.set(t.id, t))
    cachedTasks.current = map
  }, [initialTasks])

  const getStatusTasks = useCallback(
    (status: string) => tasks.filter((t) => t.status === status).sort((a, b) => a.position - b.position),
    [tasks]
  )

  const handleMoveCard = useCallback((dragId: string, targetStatus: string, targetIndex: number) => {
    setTasks((prev) => {
      const dragTask = prev.find((t) => t.id === dragId)
      if (!dragTask) return prev

      const others = prev.filter((t) => t.id !== dragId)
      const statusTasks = others.filter((t) => t.status === targetStatus).sort((a, b) => a.position - b.position)
      const restTasks = others.filter((t) => t.status !== targetStatus)

      statusTasks.splice(targetIndex, 0, { ...dragTask, status: targetStatus })
      const updated = statusTasks.map((t, i) => ({ ...t, position: i }))
      return [...restTasks, ...updated]
    })
  }, [])

  const handleDropEnd = useCallback(() => {
    if (pendingRef.current) clearTimeout(pendingRef.current)
    pendingRef.current = setTimeout(async () => {
      const currentTasks = tasksRef.current
      const batchPositions = currentTasks.map((t) => ({
        id: t.id,
        position: t.position,
        status: t.status,
      }))

      try {
        await fetch("/api/tasks", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: "_batch", batchPositions }),
        })
        onTasksChanged()
      } catch {
        toast({ title: "שגיאה", description: "אירעה שגיאה בשמירת המיקום", variant: "destructive" })
      }
    }, 300)
  }, [toast, onTasksChanged])

  const handleQuickAdd = useCallback(
    async (status: string, title: string) => {
      const statusTasks = tasks.filter((t) => t.status === status)
      const maxPos = statusTasks.length > 0 ? Math.max(...statusTasks.map((t) => t.position)) : -1

      const tempId = `temp-${Date.now()}`
      const tempTask: ProjectTask = {
        id: tempId,
        title,
        description: null,
        status,
        priority: "NORMAL",
        position: maxPos + 1,
        dueDate: null,
        columnId: null,
        assignee: null,
      }
      setTasks((prev) => [...prev, tempTask])

      try {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, status, projectId, skipEmail: true }),
        })
        if (res.ok) {
          const newTask = await res.json()
          setTasks((prev) =>
            prev.map((t) =>
              t.id === tempId
                ? { ...newTask, assignee: newTask.assignee || null }
                : t
            )
          )
          onTasksChanged()
        } else {
          setTasks((prev) => prev.filter((t) => t.id !== tempId))
          toast({ title: "שגיאה", description: "לא ניתן ליצור את המשימה", variant: "destructive" })
        }
      } catch {
        setTasks((prev) => prev.filter((t) => t.id !== tempId))
      }
    },
    [tasks, projectId, toast, onTasksChanged]
  )

  const handleClickTask = useCallback((taskId: string) => {
    setSelectedTaskId(taskId)
    setTaskDialogOpen(true)
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="pb-4">
        <div className="grid grid-cols-3 gap-3 items-start">
          {STATUS_COLUMNS.map((col) => (
            <ProjectStatusColumn
              key={col.key}
              column={col}
              tasks={getStatusTasks(col.key)}
              onMoveCard={handleMoveCard}
              onDropEnd={handleDropEnd}
              onQuickAdd={handleQuickAdd}
              onClickTask={handleClickTask}
            />
          ))}
        </div>
      </div>

      <TaskDetailDialog
        taskId={selectedTaskId}
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onTaskUpdated={() => {
          onTasksChanged()
        }}
        cachedTasks={cachedTasks.current}
      />
    </DndProvider>
  )
}
