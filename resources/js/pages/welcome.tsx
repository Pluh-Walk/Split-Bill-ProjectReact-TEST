import { Head, Link, usePage } from '@inertiajs/react';
import { login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="BillSplit - Split Bills Fairly with Friends" />
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
                {/* Animated background pattern */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                {/* Navigation */}
                <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">BillSplit</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Link
                            href={login()}
                            className="px-5 py-2.5 text-white/80 hover:text-white font-medium transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            href={register()}
                            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50"
                        >
                            Get Started
                        </Link>
                    </div>
                </nav>

                {/* Hero Section */}
                <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
                    <div className="max-w-4xl text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            <span className="text-sm text-white/80">Split bills with friends effortlessly</span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Never worry about
                            <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                                splitting bills again
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl lg:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Track expenses, split costs equally or custom, and settle up with friends. 
                            The fair way to handle shared expenses.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href={register()}
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
                            >
                                Start Splitting Free
                            </Link>
                            <Link
                                href={login()}
                                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-lg rounded-2xl transition-all duration-300 backdrop-blur-sm hover:scale-105"
                            >
                                Sign In
                            </Link>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/50 text-sm">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Free to start</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Guest access available</span>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-5">
                                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Invite Anyone</h3>
                            <p className="text-white/60 leading-relaxed">
                                Add friends via invitation code or invite guests without accounts. Everyone can participate.
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-5">
                                <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Flexible Splitting</h3>
                            <p className="text-white/60 leading-relaxed">
                                Split equally or customize amounts per person. Perfect for any expense scenario.
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mb-5">
                                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Secure & Private</h3>
                            <p className="text-white/60 leading-relaxed">
                                Guest access limited to 6 hours daily. Your financial data stays private and secure.
                            </p>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-white/50">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="font-medium">BillSplit</span>
                        </div>
                        <p className="text-white/40 text-sm">
                            © 2024 BillSplit. Split bills fairly with friends.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
