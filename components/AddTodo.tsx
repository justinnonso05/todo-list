import { useState } from 'react';

interface AddTodoProps {
  onAdd: (title: string) => void;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title);
      setTitle('');
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-[#182343] text-white px-4 py-3 rounded border border-gray-600 focus:border-[#4c73fe] focus:outline-none"
        />
        <button
          type="submit"
          className="bg-[#4c73fe] text-white px-6 py-3 rounded hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </form>
    </div>
  );
}