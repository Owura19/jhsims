import { Link } from 'react-router-dom';

export default function DashboardLayout({ children }) {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-blue-600">JHSIMS</h2>
                    <div className="mt-8 space-y-2">
                        <a href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded">
                            🏠 Dashboard
                        </a>
                        <Link to="/students" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded">
                            👥 Students
                        </Link>
                        <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded">
                            👤 Profile
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64 p-6">
                {/* Header */}
                <header className="bg-white shadow rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Signed in as</p>
                            <p className="font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.role}</p>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
}
