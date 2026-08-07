import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useAuth } from "../context/authContext";
import { toast } from "react-toastify";

function Dashboard() {

    const { user: loggedInUser, updateUser } = useAuth()
    const [user, setUser] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editForm, setEditForm] = useState({name: '', email: '', address: ''})
    const [editError, setEditError] = useState('')
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/user/${loggedInUser.id}`)
                setUser(response.data)
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        }
        if(loggedInUser){
            fetchUser()
        }
    }, [loggedInUser])

    if(!user) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
                <Navbar />
                <div className="max-w-2xl mx-auto p-6 text-center text-gray-500 dark:text-gray-400">
                    Loading profile...
                </div>
            </div>
        )
    }

    const handleEditFormChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setEditError('')

        try {
            const response = await api.put(`/update/user/${user.id}`, {...editForm, role: user.role })
            setUser(response.data.user)
            setShowEditModal(false)
            toast.success('Profile updated successfully')
        } catch (error) {
            setEditError(error.response?.data?.message || 'Something went wrong')
        }
    }

    const handleEditProfile = () => {
        setEditForm({name: user.name, email: user.email, address: user.address})
        setEditError('')
        setShowEditModal(true)
    }

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0]
        if(!file)
            return
        setUploading(true)

        try {
            const formData = new FormData()
            formData.append('photos', file)
            const response = await api.post(`/user/${user.id}/photo`, formData)
            const photoUrl = response.data.user.photo[0]
            setUser({...response.data.user, photo: photoUrl})
            updateUser({photo: photoUrl})
            toast.success('Photo uploaded successfully')
        } catch (error) {
            toast.error('Failed to upload photo')
        }finally{
            setUploading(false)
        }
    }

    const handlePhotoDelete = async () => {
        try {
            await api.delete(`/user/${user.id}/photo`)
            setUser({...user, photo: null})
            updateUser({ photo: null })
            toast.success('Photo removed')
        } catch (error) {
            toast.error('Failed to remove photo')
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
            <Navbar />
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-50 mb-6">My Profile</h1>

                <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-8">
                    <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-3xl font-bold overflow-hidden">
                        {user.photo ? (<img src={user.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover"/>) : (user.name.charAt(0))}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-50">{user.name}</h2>
                        <span className="inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">{user.role}</span>
                        <div className="flex gap-3 mt-2">
                            <label className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                                {uploading ? 'Uploading...' : 'Change Photo'}
                                <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} className="hidden" />
                            </label>
                            {user.photo && (
                                <button onClick={handlePhotoDelete} className="text-sm text-red-600 dark:text-red-400 hover:underline">Remove Photo</button>
                            )}
                        </div>
                    </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                            <p className="text-gray-800 dark:text-gray-100 font-medium">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                            <p className="text-gray-800 dark:text-gray-100 font-medium">{user.address}</p>
                        </div>
                    </div>
                    <button onClick={handleEditProfile} className="mt-8 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">Edit Profile</button>
                </div>
            </div>
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-50 mb-4">Edit Profile</h2>

                        {editError && (
                            <div className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm px-4 py-2 rounded-lg mb-4">
                                {editError}
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfile}>
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Name</label>
                                <input type="text" name="name" value={editForm.name} onChange={handleEditFormChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                            </div>

                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                                <input type="email" name="email" value={editForm.email} onChange={handleEditFormChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            </div>

                            <div className="mb-5">
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Address</label>
                                <input type="text" name="address" value={editForm.address} onChange={handleEditFormChange} className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">Cancel</button>
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard