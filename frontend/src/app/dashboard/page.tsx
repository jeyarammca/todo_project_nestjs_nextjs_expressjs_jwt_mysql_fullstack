'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Plus, Trash2, CheckCircle, Circle, LogOut, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

export default function DashboardPage() {
    const [todos, setTodos] = useState<any[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const data = await api.todos.getAll();
            setTodos(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        setAdding(true);

        try {
            await api.todos.create({ title: newTodo });
            setNewTodo('');
            fetchTodos();
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Task added',
                showConfirmButton: false,
                timer: 2000,
            });
        } catch (error: any) {
            Swal.fire('Error', error.message, 'error');
        } finally {
            setAdding(false);
        }
    };

    const toggleComplete = async (todo: any) => {
        try {
            await api.todos.update(todo.id, { isCompleted: !todo.isCompleted });
            fetchTodos();
        } catch (error: any) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    const deleteTodo = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await api.todos.delete(id);
                fetchTodos();
                Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
            } catch (error: any) {
                Swal.fire('Error', error.message, 'error');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin w-12 h-12 text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    My TODOs
                </h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                    <LogOut size={20} /> Logout
                </button>
            </div>

            <form onSubmit={handleAddTodo} className="mb-8 flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    placeholder="What needs to be done?"
                    className="input-field flex-1"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={adding}
                    className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap min-w-[120px]"
                >
                    {adding ? <Loader2 className="animate-spin" /> : <><Plus size={20} /> Add Task</>}
                </button>
            </form>

            <div className="space-y-4">
                {todos.length === 0 ? (
                    <div className="glass p-8 text-center text-white/40 italic">
                        No tasks found. Start adding some!
                    </div>
                ) : (
                    todos.map((todo) => (
                        <div
                            key={todo.id}
                            className={`glass p-4 flex items-center gap-4 transition-all duration-300 ${todo.isCompleted ? 'opacity-50' : ''
                                }`}
                        >
                            <button
                                onClick={() => toggleComplete(todo)}
                                className="text-emerald-400 hover:scale-110 transition-transform"
                            >
                                {todo.isCompleted ? <CheckCircle size={24} /> : <Circle size={24} />}
                            </button>

                            <div className="flex-1">
                                <h3 className={`font-medium ${todo.isCompleted ? 'line-through text-white/40' : ''}`}>
                                    {todo.title}
                                </h3>
                            </div>

                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="text-rose-500 hover:scale-110 transition-transform p-2 hover:bg-rose-500/10 rounded-full"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
