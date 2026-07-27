import { useState, useEffect } from "react";
import Navbar from '../components/Navbar'
import api from "../api/axios";
import { toast } from "react-toastify";

function AdminPanel(){
    const [users, setUsers] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [newUser, setNewUser] = useState({name: '', email: '', address: '', password: '', role: 'user'})
    const [addError, setAddError] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users')
                setUsers(response.data)
            } catch (error) {
                console.error('Failed to fetch users:', error)
            }
        }
        fetchUsers()
    }, [])

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this user?')
        if(!confirmed) return
        
        try {
            await api.delete(`/delete/user/${id}`)
            setUsers(users.filter((user) => user.id !== id))
            toast.success('User deleted successfully')
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user')
        }
    }

    const handleEdit = (id) => {
        console.log('Edit User:', id);
        //Todo
    }

    const handleNewUserChange = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value
        })
    }

    const handleAddUser = async (e) => {
        e.preventDefault()
        setAddError('')

        try {
            const response = await api.post('/user', newUser)
            setUsers([...users, response.data.user])
            setNewUser({name: '', email: '', address: '', password: '', role: 'user'})
            setShowAddModal(false)
            toast.success('User created successfully')
        } catch (error) {
            console.log('Full error: ', error);
            console.log('Error Response:', error.response);
            setAddError(error.response?.data?.message || 'Something went wrong')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-5xl mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
                    <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-b-lg hover:bg-blue-700 transition">+ Add User</button>
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
            {
                showAddModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New User</h2>

                            {addError && (
                                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">{addError}</div>
                            )}

                            <form onSubmit={handleAddUser}>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                                    <input type="text" name="name" value={newUser.name} onChange={handleNewUserChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus: ring-2 focus:ring-blue-500" required />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                                    <input type="email" name="email" value={newUser.email} onChange={handleNewUserChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1 text-gray-700">Address</label>
                                    <input type="text" name="address" value={newUser.address} onChange={handleNewUserChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                                    <input type="password" name="password" value={newUser.password} onChange={handleNewUserChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus: ring-2 focus:ring-blue-500" required />
                                </div>

                                <div className="mb-5">
                                    <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
                                    <select name="role" value={newUser.role} onChange={handleNewUserChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition">Cancel</button>
                                    <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Create User</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default AdminPanel