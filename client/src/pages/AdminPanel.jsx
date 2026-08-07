import { useEffect, useState } from "react";
import Navbar from '../components/Navbar'
import api from "../api/axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useNotifications } from "../context/NotificationContext";

function AdminPanel(){
    const [showAddModal, setShowAddModal] = useState(false)
    const [newUser, setNewUser] = useState({name: '', email: '', address: '', password: '', role: 'user'})
    const [addError, setAddError] = useState('')
    const [showEditModal, setShowEditModal] = useState(false)
    const [editUser, setEditUser] = useState({ id: '', name: '', email: '', address: '', role: 'user'})
    const [editError, setEditError] = useState('')
    const [selectedIds, setSelectedIds] = useState([])
    const [visibleColumns, setVisibleColumns] = useState({
        name: true, 
        email: true,
        address: true,
        role: true
    })
    const [showColumnMenu, setShowColumnMenu] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const searchQuery = searchParams.get('q') || ''
    const sortBy = searchParams.get('sort') || ''
    

    const currentPage = parseInt(searchParams.get('page')) || 1

    const { data } = useQuery({
    queryKey: ['users', searchQuery, sortBy, currentPage],
    queryFn: async () => {
        let response
        if (searchQuery) {
            response = await api.get(`/search?q=${searchQuery}`)
            return { users: response.data, totalPages: 1, currentPage: 1 }
        } else if (sortBy) {
            response = await api.get(`/users/filter?sort=${sortBy}`)
            return { users: response.data, totalPages: 1, currentPage: 1 }
        } else {
            response = await api.get(`/users?page=${currentPage}&limit=5`)
            return response.data
        }
    },
    placeholderData: keepPreviousData
})


const users = data?.users || []
const totalPages = data?.totalPages || 1

useEffect(() => {
    if(currentPage > totalPages && totalPages > 0){
        setSearchParams({ page: String(totalPages) })
    }
}, [currentPage, totalPages])

    const queryClient = useQueryClient()

    const { addNotification } = useNotifications()

    const addUserMutation = useMutation({
        mutationFn: (userData) => api.post('/user', userData),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success('User created successfully')
            addNotification(`${response.data.user.name} was added`)
        },
        onError: (error) => {
            setAddError(error.response?.data?.message || 'Something went wrong')
        }
    })

    const updateUserMutation = useMutation({
        mutationFn: ({ id, userData }) => api.put(`/update/user/${id}`, userData),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success('User updated successfully')
            addNotification(`${response.data.user.name} was updated`)
        },
        onError: (error) => {
            setEditError(error.response?.data?.message || 'Something went wrong')
        }
    })

    const deleteUserMutation = useMutation({
        mutationFn: (id) => api.delete(`/delete/user/${id}`),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success('User deleted successfully')
            const deletedUser = users.find((u) => u.id === id)
            addNotification(`${deletedUser?.name || 'A user'} was deleted`)
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete user')
        }
    })

    const bulkDeleteMutation = useMutation({
        mutationFn: (ids) => Promise.all(ids.map((id) => api.delete(`/delete/user/${id}`))),
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast.success('Selected users deleted successfully')
            addNotification(`${ids.length} user(s) were deleted`)
            setSelectedIds([])
        },
        onError: () => {
            toast.error('Failed to delete some users')
        }
    })

    const toggleColumn = (column) => {
        setVisibleColumns((prev) => ({
            ...prev, 
            [column] : !prev[column]
        }))
    }

    const toggleSelectUser = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((selectedId) => selectedId != id) : [...prev, id])
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === users.length){
            setSelectedIds([])
        }else {
            setSelectedIds(users.map((u) => u.id))
        }
    }

    const handleDelete = (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this user?')
        if(!confirmed) return
        
        deleteUserMutation.mutate(id)
    }

    const handleEdit = (user) => {
        setEditUser({ id: user.id, name: user.name, email: user.email, address: user.address, role: user.role })
        setEditError('')
        setShowEditModal(true)
    }

    const handleEditUserChange = (e) => {
        setEditUser({
            ...editUser,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdateUser = (e) => {
        e.preventDefault()
        setEditError('')

        updateUserMutation.mutate(
            { id: editUser.id, userData: editUser },
            {
                onSuccess: () => {
                    setShowEditModal(false)
                }
            }
        )
    }

    const handleSearch = (e) => {
        e.preventDefault()
    }

    const handleSortChange = (e) => {
        const value = e.target.value
        setSearchParams({ q: searchQuery, sort: value })
    }

    const handleNewUserChange = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value
        })
    }

    const handleAddUser = (e) => {
        e.preventDefault()
        setAddError('')

        addUserMutation.mutate(newUser, {
            onSuccess: () => {
                setNewUser({ name: '', email: '', address: '', password: '', role: 'user' })
                setShowAddModal(false)
            }
        })
    }

    const handleBulkDelete = () => {
        const confirmed = window.confirm(`Delete ${selectedIds.length} selected user(s)?`)
        if(!confirmed)
            return

        bulkDeleteMutation.mutate(selectedIds)
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
            <Navbar />

            <div className="max-w-5xl mx-auto p-6">
                <div className="flex items-center justify-between mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50">Admin Panel</h1>

                    <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
                        <input type="text" placeholder="Search by name, email, or address..." value={searchQuery} onChange={(e) => setSearchParams({q: e.target.value, sort: sortBy})} className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button type="submit" className="bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 dark:hover:bg-gray-600 transition">Search</button>
                    </form>

                    <select value={sortBy} onChange={handleSortChange} className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Sort by...</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="-name">Name (Z-A)</option>
                        <option value="email">Email (A-Z)</option>
                        <option value="-email">Email (Z-A)</option>
                    </select>

                    <div className="relative">
                        <button onClick={() => setShowColumnMenu(!showColumnMenu)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition whitespace-nowrap">Columns ▾</button>
                        {
                            showColumnMenu && (
                                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg z-10 p-2">
                                    {Object.keys(visibleColumns).map((column) =>(
                                        <label key={column} className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:bg-gray-700 rounded cursor-pointer capitalize">
                                            <input type="checkbox" checked={visibleColumns[column]} onChange={() => toggleColumn(column)} className="rounded" />{column}
                                        </label>
                                    ))}
                                </div>
                            )
                        }
                    </div>

                    <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-b-lg hover:bg-blue-700 transition whitespace-nowrap">+ Add User</button>
                </div>

                {selectedIds.length > 0 && (
                    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3 mb-4">
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">{selectedIds.length} user(s) selected</p>
                        <button onClick={handleBulkDelete} className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition">Delete selected</button>
                    </div>
                )}

                <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3 w-10">
                                    <input type="checkbox" checked={users.length > 0 && selectedIds.length === users.length} onChange={toggleSelectAll} className="rounded" />
                                </th>
                                {visibleColumns.name && <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>}
                                {visibleColumns.email && <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>}
                                {visibleColumns.address && <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Address</th>}
                                {visibleColumns.role && <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>}
                                <th className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-gray-200 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-6 py-4">
                                        <input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => toggleSelectUser(user.id)} className="rounded" />
                                    </td>
                                    {visibleColumns.name && <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{user.name}</td>}
                                    {visibleColumns.email && <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{user.email}</td>}
                                    {visibleColumns.address && <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{user.address}</td>}
                                    {visibleColumns.role && <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin'?'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300':'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'}`}>{user.role}</span>
                                    </td>}
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(user)} className="p-2 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition" title="Edit user">
                                                <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                                            </button>

                                            <button onClick={() => handleDelete(user.id)} className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition" title="Delete user">
                                                <FontAwesomeIcon icon={faTrash} className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <button onClick={()=>setSearchParams({page: String(currentPage - 1)})} disabled={currentPage === 1} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:bg-gray-800 transition">
                            Previous
                        </button>
                        {
                            Array.from({length: totalPages}, (_, i) => i+1).map((page) => (
                                <button key={page} onClick={() => setSearchParams({ page: String(page) })} className={`w-9 h-9 rounded-lg text-sm transition ${page === currentPage ? 'bg-blue-600 text-white' : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                    {page}
                                </button>
                            ))
                        }

                        <button onClick={() => setSearchParams({ page: String(currentPage + 1)})} disabled={currentPage === totalPages} className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                            Next
                        </button>
                    </div>
                )
                }
            </div>
            {
                showAddModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-50 mb-4">Add New User</h2>

                            {addError && (
                                <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm px-4 py-2 rounded-lg mb-4">{addError}</div>
                            )}

                            <form onSubmit={handleAddUser}>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
                                    <input type="text" name="name" value={newUser.name} onChange={handleNewUserChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                                    <input type="email" name="email" value={newUser.email} onChange={handleNewUserChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Address</label>
                                    <input type="text" name="address" value={newUser.address} onChange={handleNewUserChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
                                    <input type="password" name="password" value={newUser.password} onChange={handleNewUserChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>

                                <div className="mb-5">
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Role</label>
                                    <select name="role" value={newUser.role} onChange={handleNewUserChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">Cancel</button>
                                    <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Create User</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            {
                showEditModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-50 mb-4">Edit User</h2>

                            {editError && (
                                <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm px-4 py-2 rounded-lg mb-4">{editError}</div>
                            )}

                            <form onSubmit={handleUpdateUser}>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
                                    <input type="text" name="name" value={editUser.name} onChange={handleEditUserChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                                    <input type="email" name="email" value={editUser.email} onChange={handleEditUserChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Address</label>
                                    <input type="text" name="address" value={editUser.address} onChange={handleEditUserChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                                </div>

                                <div className="mb-5">
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Role</label>
                                    <select name="role" value={editUser.role} onChange={handleEditUserChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">Cancel</button>
                                    <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Save Changes</button>
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