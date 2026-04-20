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

const priorityConfig: Record<string, { label: string; color: string; border: string }> = {
  URGENT: { label: "דחוף", color: "bg-red-500", border: "border-r-red-500" },
  HIGH: { label: "גבוהה", color: "bg-orange-400", border: "border-r-orange-400" },
  NORMAL: { label: "רגילה", color: "bg-blue-400", border: "border-r-blue-400" },
  LOW: { label: "נמוכה", color: "bg-gray-300", border: "border-r-gray-300" },
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
      className={`group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing select-none ${
        isDragging ? 'opacity-30 scale-95' : ''
      } ${isOver ? 'border-blue-300' : ''} border-r-4 ${priority.border}`}
    >
      <div className="p-3">
        {(task.priority === 'URGENT' || task.priority === 'HIGH') && (
          <div className="flex gap-1 mb-2">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${priority.color}`}>
              <AlertCircle className="w-3 h-3" />
              {priority.label}
            </span>
          </div>
        )}

        <h4 className="text-sm font-medium text-gray-900 leading-snug mb-1">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{task.description}</p>
        )}

        <div className="flex items-center gap-2 flex-wrap mt-2">
          {due && (
            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${
              due.urgent ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
            }`}>
              <Clock className="w-3 h-3" />
              {due.text}
            </span>
          )}
          {task.project && (
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
              <FolderKanban className="w-3 h-3" />
              {task.project.name}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            {task.assignee ? (
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {task.assignee.name.charAt(0)}
                </div>
                <span className="text-[11px] text-gray-500">{task.assignee.name.split(' ')[0]}</span>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-3 h-3 text-gray-400" />
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(task.id)
            }}
            className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export { ITEM_TYPE }
