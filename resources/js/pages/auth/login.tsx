import { Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { useState } from 'react';

export default function Login() {
    const [processing, setProcessing] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setFormErrors({});

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    const errors: Record<string, string> = {};
                    Object.entries(result.errors).forEach(([key, value]: [string, any]) => {
                        errors[key] = Array.isArray(value) ? value[0] : value;
                    });
                    setFormErrors(errors);
                } else if (result.message) {
                    setFormErrors({ submit: result.message });
                }
            } else {
                // Login successful - store token and redirect to dashboard
                if (result.token) {
                    localStorage.setItem('auth_token', result.token);
                    window.location.href = '/dashboard';
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setFormErrors({ submit: 'An error occurred during login' });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            description="Enter your credentials to access your account"
        >
            <Head title="Log in" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="username" className="text-white/80">Username or Email</Label>
                        <Input
                            id="username"
                            type="text"
                            name="username"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="username or email@example.com"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500 focus:ring-emerald-500/20"
                        />
                        <InputError message={formErrors.username} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-white/80">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500 focus:ring-emerald-500/20"
                        />
                        <InputError message={formErrors.password} />
                    </div>

                    {formErrors.submit && (
                        <InputError message={formErrors.submit} className="text-center" />
                    )}

                    <Button
                        type="submit"
                        className="mt-2 w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 border-0 font-semibold disabled:opacity-50"
                        tabIndex={3}
                        disabled={processing}
                    >
                        {processing ? <Spinner /> : 'Sign In'}
                    </Button>
                </div>

                <div className="text-center text-sm text-white/60">
                    Don&apos;t have an account?{' '}
                    <TextLink href={register().url} tabIndex={4} className="text-emerald-400 hover:text-emerald-300 font-medium">
                        Sign up
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
