import { useState } from "react";
import Navbar from '../components/Navbar'

function AdminPanel(){
    const [users, setUsers] = useState([
        {id: '1', name: 'Mostafa Nassar', email: 'mostafa@example.com', address: 'Beirut', role: 'admin'},
        { id: '2', name: 'Sara Khalil', email: 'sara@example.com', address: 'Tripoli', role: 'user' },
        { id: '3', name: 'Ali Hamdan', email: 'ali@example.com', address: 'Sidon', role: 'user' },
    ])

    const handleDelete = (id) => {
        console.log('Delete user:', id);
        //TODO 
    }

    const handleEdit = (id) => {
        console.log('Edit User:', id);
        //Todo
    }

    const handleAddUser = () => {
        console.log('Add new User');
        //TODO
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-5xl mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
                    <button onClick={handleAddUser} className="bg-blue-600 text-white px-4 py-2 rounded-b-lg hover:bg-blue-700 transition">+ Add User</button>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Name</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Email</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Address</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Role</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="px-6 py-4">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.address}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin'?'bg-purple-100 text-purple-700':'bg-green-100 text-green-700'}`}>{user.role}</span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button onClick={() => handleEdit(user.id)} className="text-blue-600 hover:underline text-sm">Edit</button>
                                        <button onClick={() => handleDelete(user.id)} className="text-blue-600 hover:underline text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminPanel