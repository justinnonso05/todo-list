// lib/todoService.ts
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { Todo } from "@/types/todo";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const TODOS_LOCAL_KEY = "todo_list_local_v1";
const todosCollection = collection(db, "todos");

// Local helpers
function readLocalTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(TODOS_LOCAL_KEY);
  return raw ? JSON.parse(raw) : [];
}

function writeLocalTodos(todos: Todo[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TODOS_LOCAL_KEY, JSON.stringify(todos));
}

function addLocalTodo(title: string) {
  const todos = readLocalTodos();
  const t: Todo = { id: String(Date.now()), title, completed: false, createdAt: new Date() };
  todos.unshift(t);
  writeLocalTodos(todos);
}

async function migrateLocalToRemote() {
  const local = readLocalTodos();
  for (const t of local) {
    await addDoc(todosCollection, {
      title: t.title,
      completed: t.completed,
      createdAt: Timestamp.fromDate(t.createdAt),
      uid: auth.currentUser?.uid ?? null,
    });
  }
  writeLocalTodos([]);
}

// Add todo
export const addTodo = async (title: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    addLocalTodo(title);
    return;
  }
  await addDoc(todosCollection, {
    title,
    completed: false,
    createdAt: Timestamp.now(),
    uid: user.uid,
  });
};

// Edit todo
export const editTodo = async (id: string, newTitle: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    const todos = readLocalTodos().map((t) => 
      t.id === id ? { ...t, title: newTitle } : t
    );
    writeLocalTodos(todos);
    return;
  }
  const todoRef = doc(db, "todos", id);
  await updateDoc(todoRef, { title: newTitle });
};

// Toggle completion - Fixed logic
export const toggleTodo = async (id: string, currentCompleted: boolean): Promise<void> => {
  const user = auth.currentUser;
  const newCompleted = !currentCompleted;
  
  if (!user) {
    const todos = readLocalTodos().map((t) => 
      t.id === id ? { ...t, completed: newCompleted } : t
    );
    writeLocalTodos(todos);
    return;
  }
  
  const todoRef = doc(db, "todos", id);
  await updateDoc(todoRef, { completed: newCompleted });
};

// Delete todo
export const deleteTodo = async (id: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) {
    const todos = readLocalTodos().filter((t) => t.id !== id);
    writeLocalTodos(todos);
    return;
  }
  const todoRef = doc(db, "todos", id);
  await deleteDoc(todoRef);
};

// Subscribe to todos
export const subscribeToTodos = (callback: (todos: Todo[]) => void) => {
  let unsubscribeFirestore: () => void = () => {};
  const emitLocal = () => callback(readLocalTodos());

  const detachAuth = onAuthStateChanged(auth, (user) => {
    if (unsubscribeFirestore) {
      try { unsubscribeFirestore(); } catch {}
      unsubscribeFirestore = () => {};
    }

    if (!user) {
      emitLocal();
      return;
    }

    migrateLocalToRemote().catch(console.error);

    const q = query(todosCollection, where("uid", "==", user.uid), orderBy("createdAt", "desc"));
    unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const todos = snapshot.docs.map((d) => ({
        id: d.id,
        title: d.data().title,
        completed: d.data().completed,
        createdAt: d.data().createdAt?.toDate() ?? new Date(),
      })) as Todo[];
      callback(todos);
    });
  });

  return () => {
    try { detachAuth(); } catch {}
    try { unsubscribeFirestore(); } catch {}
  };
};
