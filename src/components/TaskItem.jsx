import { useRef, useState } from "react";
import { updateTask, deleteTask } from "../api/tasks";
import { formatDateTime } from "../utils/date";
import { EditIcon, TrashIcon } from "./Icons";

const DELETE_WIDTH = 80;
const PRIORITY_STYLES = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-rose-50 text-rose-700",
};

export default function TaskItem({ task, onEdit, onChanged }) {
  const [offset, setOffset] = useState(0); // 0: closed, -80: delete button visible
  const startX = useRef(0);
  const startOffset = useRef(0);
  const done = task.status === "completed";

  const toggleStatus = async () => {
    try {
      await updateTask(task._id, {
        status: done ? "in_progress" : "completed",
      });
      onChanged();
    } catch (error) {
      alert(error.message);
    }
  };

  const remove = async () => {
    try {
      await deleteTask(task._id);
      onChanged();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    startOffset.current = offset;
  };
  const handleTouchMove = (e) => {
    const moved = e.touches[0].clientX - startX.current;
    setOffset(
      Math.min(0, Math.max(-DELETE_WIDTH, startOffset.current + moved)),
    );
  };
  const handleTouchEnd = () =>
    setOffset(offset < -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0);

  return (
    <li className="relative overflow-hidden border-b border-slate-100 last:border-b-0">
      <button
        onClick={remove}
        className="absolute inset-y-0 right-0 w-20 bg-red-500 text-sm font-medium text-white"
      >
        Delete
      </button>

      <div
        className="relative flex items-start gap-3 bg-white px-4 py-3 transition-transform duration-150"
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <input
          type="checkbox"
          checked={done}
          onChange={toggleStatus}
          className="mt-1 h-5 w-5 shrink-0 accent-primary"
        />

        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-sm font-medium ${done ? "text-slate-400 line-through" : "text-slate-900"}`}
          >
            {task.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>{formatDateTime(task.dueAt)}</span>
            <span
              className={`rounded-full px-2 py-0.5 capitalize ${PRIORITY_STYLES[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
              {task.description}
            </p>
          )}
        </div>

        <button
          onClick={() => onEdit(task)}
          aria-label="Edit task"
          className="rounded p-1.5 text-slate-400 hover:text-primary"
        >
          <EditIcon />
        </button>
        <button
          onClick={remove}
          aria-label="Delete task"
          className="hidden rounded p-1.5 text-slate-400 hover:text-red-500 md:block"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}
