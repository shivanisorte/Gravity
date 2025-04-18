import { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import EmployeeModal from "../components/EmployeeModal";

const ManagerDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [teamMetrics, setTeamMetrics] = useState({ totalImpactScore: 0, totalPossibleScore: 0, unnoticedContributions: 0 });
  const [silentImpactLeaderboard, setSilentImpactLeaderboard] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      const user = auth.currentUser;
      if (!user) return;

      // Set the logged-in user's name
      setUserName(user.name || user.email.split('@')[0]); // If displayName is not available, use the part before "@" in the email

      const q = query(collection(db, "users"), where("managerId", "==", user.email));
      const snapshot = await getDocs(q);
      const team = [];
      let totalImpactScore = 0;
      let totalPossibleScore = 0;
      let unnoticedContributions = 0;

      snapshot.forEach((doc) => {
        const employeeData = { id: doc.id, ...doc.data() };
        team.push(employeeData);

        // Calculate total impact score and unnoticed contributions
        totalImpactScore += employeeData.score || 0;
        totalPossibleScore += 100; // Assuming max score per employee is 100
        unnoticedContributions += employeeData.aiInsights ? employeeData.aiInsights.length : 0;
      });

      // Sort employees by Silent Impact Score (Descending)
      const leaderboard = [...team].sort((a, b) => (b.score || 0) - (a.score || 0));

      setEmployees(team);
      setSilentImpactLeaderboard(leaderboard);
      setTeamMetrics({ totalImpactScore, totalPossibleScore, unnoticedContributions });
    };

    fetchEmployees();
  }, []);

  const scorePercentage = teamMetrics.totalPossibleScore
    ? ((teamMetrics.totalImpactScore / teamMetrics.totalPossibleScore) * 100).toFixed(2)
    : 0;

  // Determine the Silent Impact Category (Good, Moderate, Bad)
  let scoreCategory = "Good"; // Default category
  let scoreColor = "green"; // Default color

  if (scorePercentage > 60) {
    scoreCategory = "Bad";
    scoreColor = "red";
  } else if (scorePercentage > 30) {
    scoreCategory = "Moderate";
    scoreColor = "orange";
  } else {
    scoreCategory = "Good";
    scoreColor = "green";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Welcome, {userName} 👋</h1>

        {/* Manager Overview Section */}
        <div className="mb-8 space-y-4">
          <h3 className="text-2xl font-semibold text-gray-700">Manager Insights</h3>
          <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
            <p className="text-lg text-gray-600">
              <span className="font-semibold">Total Team Silent Impact Score : </span> {teamMetrics.totalImpactScore}/{teamMetrics.totalPossibleScore}  - 
              ({scorePercentage}% - <span className={`text-${scoreColor}-500`}>{scoreCategory}</span>)
            </p>
            <p className="text-sm text-gray-500">Total Unnoticed Contributions: {teamMetrics.unnoticedContributions}</p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
            <h4 className="text-xl font-semibold text-gray-700 mb-4">Silent Impact Leaderboard</h4>
            <ul className="list-disc list-inside text-sm text-gray-800 space-y-2">
              {silentImpactLeaderboard.map((emp) => (
                <li key={emp.id} className="flex justify-between text-gray-700">
                  <span>{emp.name}</span>
                  <span>{emp.score || "Not Available"}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Team Member List */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Team Members</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white shadow-lg hover:shadow-xl rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all"
              onClick={() => setSelectedEmployee(emp)}
            >
              <p className="text-lg font-medium text-gray-800">{emp.name}</p>
              <p className="text-sm text-gray-500">{emp.team}</p>
              <p className="text-sm text-blue-600 mt-2">
                Silent Impact Score: {emp.score || "Not Available"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {selectedEmployee && (
        <EmployeeModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
      )}
    </div>
  );
};

export default ManagerDashboard;
