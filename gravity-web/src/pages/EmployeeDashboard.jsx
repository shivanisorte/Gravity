import { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

const EmployeeDashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);

      }
    };

    // Fetch data from Firestore
    fetchData();
  }, []);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
        <p className="text-xl text-gray-600 animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Hey {userData.name} 👋</h1>

        {/* Profile Card */}
        <div className="bg-violet-100 shadow-md rounded-xl p-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">🧑‍💼 Your Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <p><strong>Role:</strong> {userData.role}</p>
            <p><strong>Team:</strong> {userData.team}</p>
            <p><strong>Manager:</strong> {userData.managerId}</p>
            <p><strong>Gender:</strong> {userData.gender}</p>
            <p><strong>Ethnicity:</strong> {userData.ethnicity}</p>
            <p><strong>Location:</strong> {userData.location}</p>
          </div>
        </div>

        {/* Impact Score */}
        <div className="bg-indigo-100 shadow-md rounded-xl p-4 mb-6">
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">🌟 Silent Impact Score</h2>
          <p className="text-5xl font-bold text-blue-800">{userData.score}/100</p>
          <p className="text-gray-600 mt-2">
            This score reflects your impact across GitHub, meetings, and chats — even if it goes unnoticed.
          </p>
        </div>

        {/* AI Insights */}
        <div className="bg-pink-100  shadow-md rounded-xl p-4">
          <h2 className="text-2xl font-semibold text-yellow-800 mb-2">🔮 AI Insights</h2>
          <ul className="list-disc list-inside text-gray-800 space-y-1">
            {userData.aiInsights.length > 0 ? (
              userData.aiInsights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))
            ) : (
              <p className="text-gray-500">No AI insights available.</p>
            )}
          </ul>
        </div>

        {/* Recent Work */}
        <div className="bg-teal-100  shadow-md rounded-xl p-4 mt-6">
          <h2 className="text-2xl font-semibold text-green-800 mb-2">🛠️ Your Recent Work</h2>
          <ul className="list-disc list-inside text-gray-800 space-y-1">
            {userData.recentWork.length > 0 ? (
              userData.recentWork.map((work, index) => (
                <li key={index}>{work}</li>
              ))
            ) : (
              <p className="text-gray-500">No recent work recorded.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
