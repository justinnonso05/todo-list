import { useState } from 'react';
import { Todo } from '@/types/todo';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
}

export default function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id!);
    setEditTitle(todo.title);
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      onEdit(editingId, editTitle);
      setEditingId(null);
      setEditTitle('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  if (todos.length === 0) {
    return (
      <div className="bg-[#182343] rounded-lg p-8 border border-gray-700 text-center">
        <p className="text-gray-400">No tasks yet. Add one above to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="bg-[#182343] rounded-lg p-4 border border-gray-700 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3 flex-1">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id!, todo.completed)}
              title="Toggle task completed"
              aria-label="Toggle task completed"
              className="w-4 h-4 text-[#4c73fe] bg-[#0e1629] border-gray-600 rounded focus:ring-[#4c73fe] focus:ring-2"
            />
            
            {editingId === todo.id ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') cancelEdit();
                }}
                placeholder="Edit task title"
                aria-label="Edit task title"
                title="Edit task title"
                className="flex-1 bg-[#0e1629] text-white px-2 py-1 rounded border border-gray-600 focus:border-[#4c73fe] focus:outline-none"
                autoFocus
              />
            ) : (
              <span
                className={`flex-1 ${
                  todo.completed ? 'text-gray-400 line-through' : 'text-white'
                }`}
              >
                {todo.title}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {editingId === todo.id ? (
              <>
                <button
                  onClick={saveEdit}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => startEdit(todo)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(todo.id!)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}