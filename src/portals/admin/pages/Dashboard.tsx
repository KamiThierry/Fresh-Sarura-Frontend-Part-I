import { LayoutDashboard, Users, ShieldCheck, BarChart3, Building2, TrendingUp, AlertCircle } from 'lucide-react';

const StatCard = ({ label, value, sub, icon: Icon, color }: {
    label: string; value: string; sub: string;
    icon: React.ElementType; color: string;
}) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={22} />
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const stats = [
        { label: 'Total Users', value: '47', sub: '+3 this week', icon: Users, color: 'bg-green-50 text-green-600 dark:bg-green-900/20' },
        { label: 'Active Roles', value: '6', sub: '2 pending review', icon: ShieldCheck, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' },
        { label: 'Organisations', value: '4', sub: 'All verified', icon: Building2, color: 'bg-green-50 text-green-600 dark:bg-green-900/20' },
        { label: 'System Alerts', value: '3', sub: '1 critical', icon: AlertCircle, color: 'bg-red-50 text-red-600 dark:bg-red-900/20' },
    ];

    const recentActivity = [
        { text: 'Alice Kamana registered — awaiting role assignment', time: '2 min ago', dot: 'bg-green-500' },
        { text: 'Role "QC Officer" updated by logistics@sarura.rw', time: '18 min ago', dot: 'bg-amber-500' },
        { text: 'Kigali Packhouse added as new Organisation', time: '1 hr ago', dot: 'bg-green-500' },
        { text: 'System backup completed successfully', time: '3 hrs ago', dot: 'bg-blue-500' },
    ];

    return (
        <div className="p-6 space-y-6 animate-fade-in">

            {/* Page header */}
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                    <LayoutDashboard size={22} />
                </div>
                <div>
                    <h1 className="text-[22px] font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">System overview &amp; key metrics</p>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-green-500" />
                        Recent Activity
                    </h2>
                    <div className="space-y-3">
                        {recentActivity.map((a, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${a.dot}`} />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{a.text}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
                    <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <BarChart3 size={18} className="text-green-500" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Add User', icon: Users, href: '/admin/users' },
                            { label: 'Edit Roles', icon: ShieldCheck, href: '/admin/roles' },
                            { label: 'Add Org', icon: Building2, href: '/admin/organisations' },
                            { label: 'View Reports', icon: BarChart3, href: '/admin/reports' },
                        ].map(q => (
                            <a
                                key={q.label}
                                href={q.href}
                                className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all"
                            >
                                <q.icon size={16} className="text-green-600 dark:text-green-400" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{q.label}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
