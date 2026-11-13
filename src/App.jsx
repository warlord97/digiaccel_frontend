import { useEffect, useState } from "react";
import { getWeeklySummary } from "./api/tasks";
import { startOfWeek } from "./utils/date";
import WeekCard from "./components/WeekCard";
import TaskModal from "./components/TaskModal";
import SearchPanel from "./components/SearchPanel";
import { SearchIcon, PlusIcon } from "./components/Icons";

// Always show the current week, even when it has no tasks yet
const withCurrentWeek = (weeks) => {
  const thisWeek = startOfWeek().getTime();
  const exists = weeks.some(
    (w) => new Date(w.weekStart).getTime() === thisWeek,
  );
  const all = exists
    ? weeks
    : [
        ...weeks,
        { weekStart: new Date(thisWeek).toISOString(), open: 0, completed: 0 },
      ];
  return all.sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart));
};

function StatCard({ label, value, className }) {
  return (
    <div className={`rounded-xl p-4 ${className}`}>
      <p className="text-xs text-slate-600">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">
        {String(value).padStart(2, "0")}
      </p>
      <p className="text-[11px] text-slate-400">This week</p>
    </div>
  );
}

export default function App() {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0); // bump to refetch everything
  const [modalTask, setModalTask] = useState(undefined); // undefined: closed, null: new task, object: edit
  const [searching, setSearching] = useState(false);

  const refresh = () => setVersion((v) => v + 1);

  useEffect(() => {
    getWeeklySummary()
      .then((data) => {
        setWeeks(withCurrentWeek(data));
        setError("");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [version]);

  const thisWeek = startOfWeek().getTime();
  const current = weeks.find(
    (w) => new Date(w.weekStart).getTime() === thisWeek,
  ) || { open: 0, completed: 0 };
  const total = current.open + current.completed;
  const percent = total ? Math.round((current.completed / total) * 100) : 0;

  return (
    <div className="min-h-dvh bg-slate-100">
      {/* The centered column: phone width on mobile, wider on tablet and desktop */}
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white md:max-w-2xl md:shadow-sm">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-5 py-4">
          <h1 className="text-xl font-bold text-slate-900">My Tasks</h1>
          <button
            onClick={() => setSearching(true)}
            aria-label="Search tasks"
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
          >
            <SearchIcon />
          </button>
        </header>

        <main className="flex-1 space-y-6 px-5 pb-24">
          <section className="grid grid-cols-2 gap-3">
            <StatCard
              label="Task Complete"
              value={current.completed}
              className="bg-indigo-50"
            />
            <StatCard
              label="Task Pending"
              value={current.open}
              className="bg-rose-50"
            />
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-slate-900">
              Weekly Progress
            </h2>
            <div className="h-3 overflow-hidden rounded-full bg-indigo-100">
              <div
                className="h-full rounded-full bg-primary-dark transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-semibold text-slate-900">Your Weeks</h2>
            {loading && <p className="text-sm text-slate-500">Loading...</p>}
            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="space-y-3">
              {weeks.map((week) => (
                <WeekCard
                  key={week.weekStart}
                  week={week}
                  version={version}
                  isCurrent={new Date(week.weekStart).getTime() === thisWeek}
                  onEdit={setModalTask}
                  onChanged={refresh}
                />
              ))}
            </div>
          </section>
        </main>

        {/* Sticky inside the column, so the button never floats off to the screen edge on desktop */}
        <div className="pointer-events-none sticky bottom-6 flex justify-end px-5">
          <button
            onClick={() => setModalTask(null)}
            aria-label="Add task"
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark"
          >
            <PlusIcon className="h-7 w-7" />
          </button>
        </div>
      </div>

      {modalTask !== undefined && (
        <TaskModal
          task={modalTask}
          onClose={() => setModalTask(undefined)}
          onSaved={() => {
            setModalTask(undefined);
            refresh();
          }}
        />
      )}

      {searching && (
        <SearchPanel
          version={version}
          onClose={() => setSearching(false)}
          onEdit={setModalTask}
          onChanged={refresh}
        />
      )}
    </div>
  );
}
