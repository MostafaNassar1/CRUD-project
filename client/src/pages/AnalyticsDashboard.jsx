import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function Analyticsdashboard(){
    const { data: users = [], refetch, isFetching } = useQuery({
        queryKey:['all-users-stats'],
        queryFn: async () => {
            const response = await api.get('/users?limit=1000')
            return response.data.users
        }
    })

    const totalUsers = users.length
    const totalAdmins = users.filter((u) => u.role === 'admin').length
    const totalRegularUsers = users.filter((u) => u.role === 'user').length

    const chartData = [
        { name: 'Admins', value: totalAdmins },
        { name: 'Users', value: totalRegularUsers }
    ]

    const COLORS = ['#9333ea', '#16a34a']

    const handleExportCSV = () => {
        const headers = ['Name', 'Email', 'Address', 'Role']
        const rows = users.map((u) => [u.name, u.email, u.address, u.role])

        const csvContent = [headers, ...rows]
            .map((row) => row.join(','))
            .join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = 'users.csv'
        link.click()

        URL.revokeObjectURL(url)
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
            <Navbar/>

            <div className="max-w-5xl mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">Dashboard Overview</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExportCSV}
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
                        >
                            Export CSV
                        </button>
                        <button
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition"
                        >
                            {isFetching ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Users</p>
                        <p className="text-3xl font-bold text-gray-800 dark:text-gray-50">{totalUsers}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Admin</p>
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalAdmins}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Regular Users</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-gray-400">{totalRegularUsers}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mt-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-50 mb-4">User Roles Breakdown</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default Analyticsdashboard