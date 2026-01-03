'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { Mail, Lock, Loader2, UserPlus } from 'lucide-react';
import { api } from '@/services/api';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.auth.register({ email, password });

            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'Please log in to continue.',
            });

            router.push('/login');
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: error.message || 'Something went wrong',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="glass w-full max-w-md p-8 shadow-2xl">
                <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    Create Account
                </h1>

                <form onSubmit={handleRegister} className="space-y-6">
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
                        {loading ? <Loader2 className="animate-spin" /> : 'Register'}
                    </button>
                </form>

                <p className="mt-6 text-center text-white/60">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-400 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
