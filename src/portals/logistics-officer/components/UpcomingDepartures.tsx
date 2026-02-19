import { Plane, Calendar, ArrowUpRight } from 'lucide-react';

const UpcomingDepartures = () => {
    const FLIGHTS = [
        { id: 'WB300', airline: 'RwandAir', dest: 'London (LHR)', cutoff: '14:00 Today', weight: '850 kg', status: 'Closing', statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
        { id: 'KL537', airline: 'KLM', dest: 'Amsterdam (AMS)', cutoff: '09:00 Tomorrow', weight: '1,200 kg', status: 'Open', statusColor: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
        { id: 'WB305', airline: 'RwandAir', dest: 'Dubai (DXB)', cutoff: '06:00 Yesterday', weight: '2,100 kg', status: 'Departed', statusColor: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Plane size={18} className="text-purple-500" />
                    Flight Schedule (Next 24h)
                </h3>
                <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 hover:underline">
                    View Full Schedule <ArrowUpRight size={14} />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            <th className="px-6 py-4">Flight</th>
                            <th className="px-6 py-4">Destination</th>
                            <th className="px-6 py-4">Cut-off Time</th>
                            <th className="px-6 py-4">Booked Weight</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {FLIGHTS.map((flight) => (
                            <tr key={flight.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                            <Plane size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{flight.airline}</p>
                                            <p className="text-xs text-gray-500 font-mono">{flight.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {flight.dest}
                                </td>
                                <td className="px-6 py-4 text-sm flex items-center gap-2">
                                    <Calendar size={14} className="text-gray-400" />
                                    <span className={flight.cutoff.includes('Today') ? 'text-red-500 font-semibold' : 'text-gray-500'}>
                                        {flight.cutoff}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                                    {flight.weight}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${flight.statusColor}`}>
                                        {flight.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UpcomingDepartures;
