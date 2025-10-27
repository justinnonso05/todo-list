"use client";

import { useEffect, useState } from "react";
import { addTodo, subscribeToTodos, toggleTodo, deleteTodo, editTodo } from "@/lib/todoService";
import { Todo } from "@/types/todo";
import {
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  onAuthStateChangedListener,
} from "@/lib/authService";

import Layout from "@/components/Layout";
import AuthCard from "@/components/AuthCard";
import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToTodos(setTodos);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (title: string) => {
    await addTodo(title);
  };

  const handleEdit = async (id: string, newTitle: string) => {
    await editTodo(id, newTitle);
  };

  const handleSignUpEmail = async (email: string, password: string) => {
    await signUpWithEmail(email, password);
  };

  const handleSignInEmail = async (email: string, password: string) => {
    await signInWithEmail(email, password);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await toggleTodo(id, completed);
  };

  const handleDelete = async (id: string) => {
    await deleteTodo(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e1629] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0e1629] flex items-center justify-center p-6">
        <AuthCard onSignIn={handleSignInEmail} onSignUp={handleSignUpEmail} />
      </div>
    );
  }

  return (
    <Layout user={user} onSignOut={handleSignOut}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">My Tasks</h2>
          <p className="text-gray-400">Manage your daily tasks</p>
        </div>

        <AddTodo onAdd={handleAdd} />
        <TodoList 
          todos={todos} 
          onToggle={handleToggle} 
          onDelete={handleDelete} 
          onEdit={handleEdit}
        />
      </div>
    </Layout>
  );
}
