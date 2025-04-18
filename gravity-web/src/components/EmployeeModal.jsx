const EmployeeModal = ({ employee, onClose }) => {
  // Destructure the fields from the employee object that was passed in as a prop
  const { score, recentWork, aiInsights } = employee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
        <button className="absolute top-2 right-3 text-gray-600" onClick={onClose}>✖</button>
        <h2 className="text-xl font-bold mb-2">{employee.name}</h2>
        <p className="text-sm text-gray-600 mb-4">{employee.team} — {employee.location}</p>

        <div className="mb-4">
          <p className="font-semibold">Silent Impact Score: 
            <span className="text-blue-600">
              {score !== undefined ? `${score}/100` : 'Not Available'}
            </span>
          </p>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-1">🛠️ Recent Work</h3>
          <ul className="list-disc list-inside text-sm text-gray-800">
            {recentWork && recentWork.length > 0 ? (
              recentWork.map((task, i) => <li key={i}>{task}</li>)
            ) : (
              <li>No recent work available</li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-1">⚠️ AI Insights: Went Unnoticed</h3>
          <ul className="list-disc list-inside text-sm text-red-600">
            {aiInsights && aiInsights.length > 0 ? (
              aiInsights.map((item, i) => <li key={i}>{item}</li>)
            ) : (
              <li>No unnoticed contributions available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
