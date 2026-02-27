import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Coming Soon
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md">
                        The dashboard is under construction. We're working on something great for you!
                    </p>
                    <div className="relative w-48 h-48">
                        <svg
                            className="w-full h-full text-emerald-500/20 dark:text-emerald-400/20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
