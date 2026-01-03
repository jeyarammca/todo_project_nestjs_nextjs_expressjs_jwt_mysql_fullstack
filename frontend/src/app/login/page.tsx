'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { accessToken } = await api.auth.login({ email, password });
            localStorage.setItem('token', accessToken);

            Swal.fire({
                icon: 'success',
                title: 'Logged in!',
                text: 'Welcome back to your TODO app.',
                timer: 1500,
                showConfirmButton: false,
            });

            router.push('/dashboard');
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.message || 'Invalid email or password',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass w-full max-w-md p-8 shadow-2xl">
                <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Welcome Back
                </h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative flex items-center">
                        <Mail className="absolute left-3 text-white/40 w-5 h-5 pointer-events-none" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="input-field input-with-icon"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative flex items-center">
                        <Lock className="absolute left-3 text-white/40 w-5 h-5 pointer-events-none" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field input-with-icon"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </button>
                </form>

                <p className="mt-6 text-center text-white/60">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-blue-400 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
