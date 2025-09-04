// src/pages/Dashboard.jsx

export default function Dashboard() {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to JHSIMS</h2>
            <p className="text-gray-600 mb-4">
                You are logged in as an <strong>admin</strong>. Use the sidebar to manage students, classes, grades, and fees.
            </p>
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-800">Next Steps</h3>
                <ul className="mt-2 list-disc list-inside text-gray-600">
                    <li>View or add students</li>
                    <li>Manage class assignments</li>
                    <li>Record grades and payments</li>
                </ul>
            </div>
        </div>
    );
}