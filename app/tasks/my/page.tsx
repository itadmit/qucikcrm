"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { AppLayout } from "@/components/AppLayout"
import { useToast } from "@/components/ui/use-toast"
import { NewTaskDialog } from "@/components/dialogs/NewTaskDialog"
import { EditTaskTemplatesDialog } from "@/components/dialogs/EditTaskTemplatesDialog"
import { EditColumnDialog } from "@/components/dialogs/EditColumnDialog"
import { TaskDetailDialog } from "@/components/dialogs/TaskDetailDialog"
import { TaskBoardColumn, ColumnData } from "@/components/tasks/TaskBoardColumn"
import { TaskItem } from "@/components/tasks/TaskBoardCard"
import { CardSkeleton } from "@/components/skeletons/CardSkeleton"
import { CheckSquare, Plus } from "lucide-react"

const AUTO_COLORS = [
  "#a5f3fc", "#c7d2fe", "#fecaca", "#bbf7d0", "#fef08a",
  "#e9d5ff", "#fed7aa", "#fce7f3", "#67e8f9", "#86efac",
]

export default function MyTasksPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [columns, setColumns] = useState<ColumnData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingColumn, setEditingColumn] = useState<ColumnData | null>(null)
  const [editColumnOpen, setEditColumnOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const pendingUpdateRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tasksRef = useRef<TaskItem[]>(tasks)
  tasksRef.current = tasks

  const cachedTasks = useRef(new Map<string, any>())
  useEffect(() => {
    const map = new Map<string, any>()
    tasks.forEach(t => map.set(t.id, t))
    cachedTasks.current = map
  }, [tasks])

  const fetchData = useCallback(async () => {
    try {
      const [tasksRes, colsRes] = await Promise.all([
        fetch('/api/tasks?my=true'),
        fetch('/api/task-columns'),
      ])
      if (tasksRes.ok && colsRes.ok) {
        const [tasksData, colsData] = await Promise.all([
          tasksRes.json(),
          colsRes.json(),
        ])
        setTasks(tasksData)
        setColumns(colsData)
      } else {
        toast({ title: "שגיאה", description: "לא ניתן לטעון את הנתונים", variant: "destructive" })
      }
    } catch {
      toast({ title: "שגיאה", description: "אירעה שגיאה בטעינת הנתונים", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchData() }, [fetchData])

  const getColumnTasks = useCallback((columnId: string) => {
    return tasks
      .filter(t => t.columnId === columnId)
      .sort((a, b) => a.position - b.position)
  }, [tasks])

  const handleMoveCard = useCallback((dragId: string, targetColumnId: string, targetIndex: number) => {
    setTasks(prev => {
      const dragTask = prev.find(t => t.id === dragId)
      if (!dragTask) return prev

      const others = prev.filter(t => t.id !== dragId)
      const columnTasks = others
        .filter(t => t.columnId === targetColumnId)
        .sort((a, b) => a.position - b.position)
      const restTasks = others.filter(t => t.columnId !== targetColumnId)

      columnTasks.splice(targetIndex, 0, {
        ...dragTask,
        columnId: targetColumnId,
      })

      const updated = columnTasks.map((t, i) => ({ ...t, position: i }))
      return [...restTasks, ...updated]
    })
  }, [])

  const handleDropEnd = useCallback(() => {
    if (pendingUpdateRef.current) clearTimeout(pendingUpdateRef.current)

    pendingUpdateRef.current = setTimeout(async () => {
      const currentTasks = tasksRef.current
      const batchPositions = currentTasks.map(t => ({
        id: t.id,
        position: t.position,
        columnId: t.columnId || undefined,
      }))

      try {
        await fetch('/api/tasks', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: '_batch', batchPositions }),
        })
      } catch {
        toast({ title: "שגיאה", description: "אירעה שגיאה בשמירת המיקום", variant: "destructive" })
        fetchData()
      }
    }, 300)
  }, [toast, fetchData])

  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את המשימה?')) return
    const prevTasks = [...tasks]
    setTasks(prev => prev.filter(t => t.id !== taskId))

    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
      if (res.ok) {
        toast({ title: "משימה נמחקה" })
      } else {
        setTasks(prevTasks)
        toast({ title: "שגיאה", description: "לא ניתן למחוק את המשימה", variant: "destructive" })
      }
    } catch {
      setTasks(prevTasks)
    }
  }, [tasks, toast])

  const handleQuickAdd = useCallback(async (columnId: string, title: string) => {
    const column = columns.find(c => c.id === columnId)
    if (!column) return

    const columnTasks = tasks.filter(t => t.columnId === columnId)
    const maxPos = columnTasks.length > 0
      ? Math.max(...columnTasks.map(t => t.position))
      : -1

    const tempId = `temp-${Date.now()}`
    const tempTask: TaskItem = {
      id: tempId,
      title,
      description: null,
      status: column.status,
      priority: "NORMAL",
      position: maxPos + 1,
      dueDate: null,
      columnId,
      assignee: null,
      project: null,
    }
    setTasks(prev => [...prev, tempTask])

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          status: column.status,
          columnId,
          skipEmail: true,
        }),
      })
      if (res.ok) {
        const newTask = await res.json()
        setTasks(prev => prev.map(t => t.id === tempId ? {
          ...newTask,
          columnId: newTask.columnId || newTask.column?.id || columnId,
        } : t))
      } else {
        setTasks(prev => prev.filter(t => t.id !== tempId))
        toast({ title: "שגיאה", description: "לא ניתן ליצור את המשימה", variant: "destructive" })
      }
    } catch {
      setTasks(prev => prev.filter(t => t.id !== tempId))
    }
  }, [columns, tasks, toast])

  const handleAddColumn = useCallback(async () => {
    const colorIndex = columns.length % AUTO_COLORS.length
    const color = AUTO_COLORS[colorIndex]
    const name = `עמודה ${columns.length + 1}`

    try {
      const res = await fetch('/api/task-columns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color, status: 'TODO' }),
      })
      if (res.ok) {
        fetchData()
      }
    } catch {
      toast({ title: "שגיאה", variant: "destructive" })
    }
  }, [columns.length, fetchData, toast])

  const handleMoveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    setColumns(prev => {
      const updated = [...prev]
      const [removed] = updated.splice(dragIndex, 1)
      updated.splice(hoverIndex, 0, removed)
      return updated.map((col, i) => ({ ...col, position: i }))
    })
  }, [])

  const handleColumnDropEnd = useCallback(async () => {
    const reorderData = columns.map((col, i) => ({ id: col.id, position: i }))
    try {
      await fetch('/api/task-columns/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columns: reorderData }),
      })
    } catch {
      toast({ title: "שגיאה", description: "אירעה שגיאה בשמירת סדר העמודות", variant: "destructive" })
      fetchData()
    }
  }, [columns, toast, fetchData])

  const handleDeleteColumn = useCallback(async (columnId: string) => {
    if (columns.length <= 1) {
      toast({ title: "שגיאה", description: "לא ניתן למחוק את העמודה האחרונה", variant: "destructive" })
      return
    }
    const col = columns.find(c => c.id === columnId)
    if (!col) return
    const colTasks = tasks.filter(t => t.columnId === columnId)
    const moveToCol = columns.find(c => c.id !== columnId)

    const msg = colTasks.length > 0
      ? `האם למחוק את העמודה "${col.name}"? ${colTasks.length} כרטיסים יועברו ל"${moveToCol?.name}".`
      : `האם למחוק את העמודה "${col.name}"?`

    if (!confirm(msg)) return

    try {
      const res = await fetch(`/api/task-columns?id=${columnId}&moveTo=${moveToCol?.id || ''}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast({ title: "עמודה נמחקה" })
        fetchData()
      } else {
        toast({ title: "שגיאה", description: "לא ניתן למחוק את העמודה", variant: "destructive" })
      }
    } catch {
      toast({ title: "שגיאה", variant: "destructive" })
    }
  }, [columns, tasks, toast, fetchData])

  const handleEditColumn = useCallback((column: ColumnData) => {
    setEditingColumn(column)
    setEditColumnOpen(true)
  }, [])

  const handleClickTask = useCallback((taskId: string) => {
    setSelectedTaskId(taskId)
    setTaskDialogOpen(true)
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <CardSkeleton />
      </AppLayout>
    )
  }

  return (
    <AppLayout fullWidth>
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-col h-full bg-[#FAFAF7]">
          {/* Board header */}
          <div className="px-6 py-4 border-b border-zinc-200/70 bg-[#FAFAF7] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-violet-600" strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-zinc-900 tracking-tight">המשימות שלי</h1>
                  <span className="text-[10px] font-bold text-zinc-600 bg-white border border-zinc-200 px-1.5 py-0.5 rounded-md tabular-nums">
                    {tasks.length}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">גרור כרטיסים בין עמודות, ערוך וצור משימות חדשות</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <EditTaskTemplatesDialog />
              <NewTaskDialog onTaskCreated={fetchData} />
            </div>
          </div>

          {/* Board content */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-5 bg-[#FAFAF7]">
            {columns.length === 0 && tasks.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-sm">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-zinc-200 flex items-center justify-center mb-4 shadow-sm">
                    <CheckSquare className="w-7 h-7 text-zinc-300" strokeWidth={1.8} />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 mb-1.5 tracking-tight">אין משימות עדיין</h3>
                  <p className="text-sm text-zinc-500 mb-5">התחל ליצור משימות, לארגן אותן בעמודות, ולעקוב אחר ההתקדמות.</p>
                  <NewTaskDialog onTaskCreated={fetchData} />
                </div>
              </div>
            ) : (
              <div className="flex gap-3 h-full items-start pb-4">
                {columns.map((column, index) => (
                  <TaskBoardColumn
                    key={column.id}
                    column={column}
                    columnIndex={index}
                    tasks={getColumnTasks(column.id)}
                    onMoveCard={handleMoveCard}
                    onDropEnd={handleDropEnd}
                    onDeleteTask={handleDeleteTask}
                    onQuickAdd={handleQuickAdd}
                    onEditColumn={handleEditColumn}
                    onClickTask={handleClickTask}
                    onMoveColumn={handleMoveColumn}
                    onColumnDropEnd={handleColumnDropEnd}
                    onDeleteColumn={handleDeleteColumn}
                    canDelete={columns.length > 1}
                  />
                ))}

                <button
                  onClick={handleAddColumn}
                  className="group flex-shrink-0 w-[290px] min-h-[80px] flex items-center justify-center gap-2 bg-white/40 hover:bg-white rounded-2xl border-2 border-dashed border-zinc-300 hover:border-violet-300 text-zinc-500 hover:text-violet-700 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-semibold">הוסף עמודה</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <EditColumnDialog
          column={editingColumn}
          open={editColumnOpen}
          onOpenChange={setEditColumnOpen}
          onUpdated={fetchData}
          columns={columns}
        />

        <TaskDetailDialog
          taskId={selectedTaskId}
          open={taskDialogOpen}
          onOpenChange={setTaskDialogOpen}
          onTaskUpdated={fetchData}
          cachedTasks={cachedTasks.current}
        />
      </DndProvider>
    </AppLayout>
  )
}
