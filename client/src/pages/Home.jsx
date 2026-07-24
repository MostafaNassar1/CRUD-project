import { Link } from "react-router-dom";

function Home() {
    return(
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
            <nav className="px-6 py-4 flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">CRUD App</span>
                <div className="flex gap-4">
                    <Link to="/login" className="text-gray-700 font-medium hover:text-blue-600 transition">Login</Link>
                    <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Get Started</Link>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-24 text-center">
                <h1 className="text-5xl font-bold text-gray-800 mb-6">Manage Users, Simply</h1>
                <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">A full-stack user management system with secure aithentication, role-based access control, and real-time admin tools - built to handle registration, profiles, and permissions in one place.</p>
                <Link to="/login" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition">Login to Continue</Link>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 text-left">
                    <div className="bg-white p-6 rounded-xl shadow">
                        <h3 className="font-semibold text-gray-800 mb-2">Secure Authentication</h3>
                        <p className="text-sm text-gray-600">JWT-based login with HTTP-only cookies keeps sessions safe.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow">
                        <h3 className="font-semibold text-gray-800 mb-2">Role-Based Access</h3>
                        <p className="text-sm text-gray-600">Admins and users get different views and permissions automically.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow">
                        <h3 className="font-semibold text-gray-800 mb-2">Full CRUD Control</h3>
                        <p className="text-sm text-gray-600">Create, Search, Filter, Update, and delete users with ease.</p>
                    </div>
                </div>
            </div>
        </div>
    ) 
}

export default Home