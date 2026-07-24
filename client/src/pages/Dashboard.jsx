import { useState } from "react";
import Navbar from "../components/Navbar";

function Dashboard() {
    //Dummy Data for npw
    const [user, setUser] = useState({
        id: '2',
        name: 'Mostafa Nassar',
        email:'mostafa@example.com',
        address: 'Beirut',
        role:'user',
        photo: null
    })

    const handleEditProfile = () => {
        console.log('Edit profile clicked');
        //TODO
    }

    const handlePhotoUpload = () => {
        console.log('Upload photo clicked');
        //TODO
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

                <div className="bg-white rounded-xl shadow p-8">
                    <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
                        {user.photo ? (<img src={user.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover"/>) : (user.name.charAt(0))}
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
                        <span className="inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{user.role}</span>
                        <button onClick={handlePhotoUpload} className="block mt-2 text-sm text-blue-600 hover:underline">Change Photo</button>
                    </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-800 font-medium">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="text-gray-800 font-medium">{user.address}</p>
                        </div>
                    </div>
                    <button onClick={handleEditProfile} className="mt-8 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">Edit Profile</button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard