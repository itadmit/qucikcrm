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
        <div className="flex flex-col h-full">
          {/* Board header */}
          <div className="px-6 py-3 border-b bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-gray-900">המשימות שלי</h1>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{tasks.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <EditTaskTemplatesDialog />
              <NewTaskDialog onTaskCreated={fetchData} />
            </div>
          </div>

          {/* Board content */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-4 bg-[#f1f2f4]">
            {columns.length === 0 && tasks.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <CheckSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">אין משימות עדיין</h3>
                  <p className="text-gray-500 mb-4">התחל על ידי יצירת משימה חדשה</p>
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
                  className="flex-shrink-0 w-[290px] min-h-[80px] flex items-center justify-center gap-2 bg-gray-200/60 hover:bg-gray-200 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-sm font-medium">הוסף עמודה</span>
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
