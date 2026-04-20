"use client"

import { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { AlertCircle, Clock, FolderKanban, Trash2, User } from "lucide-react"

export interface TaskItem {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  position: number
  dueDate: string | null
  columnId: string | null
  assignee: { id: string; name: string } | null
  project: { name: string } | null
}

interface DragItem {
  type: string
  id: string
  columnId: string | null
  index: number
}

const ITEM_TYPE = "TASK"

const priorityConfig: Record<string, { label: string; color: string; border: string; badge: string }> = {
  URGENT: { label: "דחוף", color: "bg-rose-500", border: "border-r-rose-500", badge: "bg-rose-50 text-rose-700 border-rose-200" },
  HIGH: { label: "גבוהה", color: "bg-amber-500", border: "border-r-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  NORMAL: { label: "רגילה", color: "bg-blue-500", border: "border-r-blue-400", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  LOW: { label: "נמוכה", color: "bg-zinc-400", border: "border-r-zinc-300", badge: "bg-zinc-50 text-zinc-600 border-zinc-200" },
}

function formatDueDate(dueDate: string | null) {
  if (!dueDate) return null
  const date = new Date(dueDate)
  const today = new Date()
  const diffTime = date.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return { text: 'היום', urgent: true }
  if (diffDays === 1) return { text: 'מחר', urgent: false }
  if (diffDays < 0) return { text: 'באיחור', urgent: true }
  return { text: `${diffDays} ימים`, urgent: false }
}

interface TaskBoardCardProps {
  task: TaskItem
  index: number
  columnId: string
  onDelete: (taskId: string) => void
  onMoveCard: (dragId: string, targetColumnId: string, targetIndex: number) => void
  onClickTask: (taskId: string) => void
}

export function TaskBoardCard({ task, index, columnId, onDelete, onMoveCard, onClickTask }: TaskBoardCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const priority = priorityConfig[task.priority] || priorityConfig.NORMAL
  const due = formatDueDate(task.dueDate)

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: (): DragItem => ({ type: ITEM_TYPE, id: task.id, columnId, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ITEM_TYPE,
    hover(item, monitor) {
      if (!ref.current) return
      if (item.id === task.id) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) return
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (item.columnId === columnId) {
        if (item.index < index && hoverClientY < hoverMiddleY) return
        if (item.index > index && hoverClientY > hoverMiddleY) return
      }

      onMoveCard(item.id, columnId, index)
      item.index = index
      item.columnId = columnId
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      onClick={() => onClickTask(task.id)}
      className={`group relative bg-white rounded-xl border transition-all duration-150 cursor-grab active:cursor-grabbing select-none ${
        isDragging ? 'opacity-30 scale-95' : ''
      } ${isOver ? 'border-violet-300 shadow-md' : 'border-zinc-200/80 hover:border-zinc-300 hover:shadow-sm'} border-r-[3px] ${priority.border}`}
    >
      <div className="p-3">
        {(task.priority === 'URGENT' || task.priority === 'HIGH') && (
          <div className="flex gap-1 mb-2">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${priority.badge}`}>
              <AlertCircle className="w-2.5 h-2.5" />
              {priority.label}
            </span>
          </div>
        )}

        <h4 className="text-sm font-semibold text-zinc-900 leading-snug mb-1">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-zinc-500 line-clamp-2 mb-2 leading-relaxed">{task.description}</p>
        )}

        {(due || task.project) && (
          <div className="flex items-center gap-1.5 flex-wrap mt-2">
            {due && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md border ${
                due.urgent
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200'
              }`}>
                <Clock className="w-2.5 h-2.5" />
                {due.text}
              </span>
            )}
            {task.project && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-violet-50 text-violet-700 border border-violet-200">
                <FolderKanban className="w-2.5 h-2.5" />
                {task.project.name}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-zinc-100">
          <div className="flex items-center gap-1">
            {task.assignee ? (
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[9px] font-bold shadow-sm ring-2 ring-white">
                  {task.assignee.name.charAt(0)}
                </div>
                <span className="text-[10px] text-zinc-500 font-medium">{task.assignee.name.split(' ')[0]}</span>
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center">
                <User className="w-2.5 h-2.5 text-zinc-400" />
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(task.id)
            }}
            className="p-1 rounded-md hover:bg-rose-50 text-zinc-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

export { ITEM_TYPE }
