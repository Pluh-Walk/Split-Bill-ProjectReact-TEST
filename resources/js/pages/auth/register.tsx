import { Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { useState } from 'react';

export default function Register() {
    const [processing, setProcessing] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setFormErrors({});

        try {
            const response = await fetch('/api/register', {
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
                }
            } else {
                // Registration successful - redirect to login
                window.location.href = login().url;
            }
        } catch (error) {
            console.error('Registration error:', error);
            setFormErrors({ submit: 'An error occurred during registration' });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            description="Start splitting bills with friends today"
        >
            <Head title="Register" />
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid gap-5">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-white/80">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500 focus:ring-emerald-500/20"
                        />
                        <InputError message={formErrors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-white/80">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500 focus:ring-emerald-500/20"
                        />
                        <InputError message={formErrors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="username" className="text-white/80">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            required
                            tabIndex={3}
                            autoComplete="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="johndoe"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500 focus:ring-emerald-500/20"
                        />
                        <InputError message={formErrors.username} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-white/80">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500 focus:ring-emerald-500/20"
                        />
                        <div className="text-xs text-white/40 mt-1">
                            Must have: uppercase, lowercase, number, special char (8-16 chars)
                        </div>
                        <InputError message={formErrors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-white/80">
                            Confirm Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={5}
                            autoComplete="new-password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500 focus:ring-emerald-500/20"
                        />
                        <InputError message={formErrors.password_confirmation} />
                    </div>

                    {formErrors.submit && (
                        <InputError message={formErrors.submit} className="text-center" />
                    )}

                    <Button
                        type="submit"
                        disabled={processing}
                        className="mt-2 w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 border-0 font-semibold disabled:opacity-50"
                        tabIndex={6}
                    >
                        {processing ? <Spinner /> : 'Create Account'}
                    </Button>
                </div>

                <div className="text-center text-sm text-white/60">
                    Already have an account?{' '}
                    <TextLink href={login().url} tabIndex={7} className="text-emerald-400 hover:text-emerald-300 font-medium">
                        Sign in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
