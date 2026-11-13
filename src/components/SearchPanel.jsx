import { useEffect, useState } from "react";
import { getTasks } from "../api/tasks";
import TaskItem from "./TaskItem";
import { SearchIcon, CloseIcon } from "./Icons";

export default function SearchPanel({ version, onClose, onEdit, onChanged }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    const timer = setTimeout(() => {
      getTasks({ q: query.trim() })
        .then((data) => {
          setResults(data);
          setSearched(true);
        })
        .catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [query, version]);

  return (
    <div className="fixed inset-0 z-40 bg-slate-100">
      <div className="mx-auto flex h-full w-full max-w-md flex-col bg-white md:max-w-2xl">
        <div className="flex items-center gap-3 border-b border-slate-100 p-4">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3">
            <SearchIcon className="h-4 w-4 text-slate-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a task"
              className="w-full py-2.5 text-sm outline-none"
            />
          </div>
          <button onClick={onClose} aria-label="Close search">
            <CloseIcon />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto">
          {searched && results.length === 0 && (
            <li className="p-6 text-center text-sm text-slate-500">
              No tasks found.
            </li>
          )}
          {results.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onEdit={onEdit}
              onChanged={onChanged}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
