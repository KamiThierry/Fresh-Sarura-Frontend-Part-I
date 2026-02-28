import { Users, Search, UserPlus, MoreHorizontal } from 'lucide-react';

const MOCK_USERS = [
    { id: 1, name: 'Alice Kamana', email: 'alice@sarura.rw', role: 'QC Officer', status: 'Active', avatar: 'AK' },
    { id: 2, name: 'Peter Nioroge', email: 'peter@sarura.rw', role: 'Logistics Officer', status: 'Active', avatar: 'PN' },
    { id: 3, name: 'Grace Uwase', email: 'grace@sarura.rw', role: 'Farm Manager', status: 'Pending', avatar: 'GU' },
    { id: 4, name: 'James Habimana', email: 'james@sarura.rw', role: 'Production Manager', status: 'Active', avatar: 'JH' },
    { id: 5, name: 'Sarah Mucyo', email: 'sarah@sarura.rw', role: 'Driver', status: 'Inactive', avatar: 'SM' },
];

const STATUS_STYLES: Record<string, string> = {
    Active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Inactive: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
};

const UserManagement = () => (
    <div className="p-6 space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                    <Users size={22} />
                </div>
                <div>
                    <h1 className="text-[22px] font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage platform users and access</p>
                </div>
            </div>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
                <UserPlus size={16} />
                Add User
            </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 text-sm dark:text-gray-200 dark:placeholder-gray-400 transition-all"
            />
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                        <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3" />
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {MOCK_USERS.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                            <td className="px-5 py-4 flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-300 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                    {u.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{u.name}</p>
                                    <p className="text-xs text-gray-400">{u.email}</p>
                                </div>
                            </td>
                            <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{u.role}</td>
                            <td className="px-5 py-4">
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[u.status]}`}>
                                    {u.status}
                                </span>
                            </td>
                            <td className="px-5 py-4 text-right">
                                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
                                    <MoreHorizontal size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default UserManagement;
