import { useState } from "react";
import { createTask, updateTask } from "../api/tasks";
import { toInputValue } from "../utils/date";
import { CloseIcon } from "./Icons";

const PRIORITIES = ["low", "medium", "high"];
const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function TaskModal({ task, onClose, onSaved }) {
  const isEdit = Boolean(task);
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    dueAt: task ? toInputValue(task.dueAt) : "",
    priority: task?.priority || "medium",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.dueAt) {
      setError("Title and date & time are required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, dueAt: new Date(form.dueAt).toISOString() };
      if (isEdit) await updateTask(task._id, payload);
      else await createTask(payload);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90dvh] w-full max-w-md space-y-4 overflow-y-auto rounded-t-2xl bg-white p-5 sm:rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">
            {isEdit ? "Edit Task" : "Add New Task"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <label className="block text-xs text-slate-500">
          Task title *
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={120}
            placeholder="Doing Homework"
            className={`mt-1 ${inputClass}`}
          />
        </label>

        <label className="block text-xs text-slate-500">
          Date & time *
          <input
            type="datetime-local"
            name="dueAt"
            value={form.dueAt}
            onChange={handleChange}
            className={`mt-1 ${inputClass}`}
          />
        </label>

        <div>
          <p className="mb-1 text-xs text-slate-500">Priority</p>
          <div className="grid grid-cols-3 gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setForm({ ...form, priority: p })}
                className={`rounded-lg border py-2 text-sm capitalize ${form.priority === p ? "border-primary bg-primary text-white" : "border-slate-200 text-slate-600"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <label className="block text-xs text-slate-500">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            maxLength={1000}
            placeholder="Add Description"
            className={`mt-1 ${inputClass}`}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          disabled={saving}
          className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? "Saving..." : isEdit ? "Save changes" : "Create task"}
        </button>
      </form>
    </div>
  );
}
