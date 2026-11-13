import { useEffect, useState } from "react";
import { getTasks } from "../api/tasks";
import { addDays, formatWeekRange } from "../utils/date";
import TaskItem from "./TaskItem";

export default function WeekCard({
  week,
  version,
  isCurrent,
  onEdit,
  onChanged,
}) {
  const [open, setOpen] = useState(isCurrent);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const start = new Date(week.weekStart);
    setLoading(true);
    getTasks({ from: start.toISOString(), to: addDays(start, 7).toISOString() })
      .then(setTasks)
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [open, version, week.weekStart]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div>
          <p className="font-semibold text-slate-900">
            {formatWeekRange(week.weekStart)}
          </p>
          {isCurrent && (
            <span className="text-xs font-medium text-primary">This week</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="rounded-full bg-rose-50 px-2.5 py-1 text-rose-600">
            {week.open} open
          </span>
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-600">
            {week.completed} done
          </span>
        </div>
      </button>

      {open && (
        <ul className="border-t border-slate-100">
          {loading && tasks.length === 0 && (
            <li className="p-4 text-sm text-slate-500">Loading...</li>
          )}
          {!loading && tasks.length === 0 && (
            <li className="p-4 text-sm text-slate-500">No tasks this week.</li>
          )}
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={onEdit}
              onChanged={onChanged}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
