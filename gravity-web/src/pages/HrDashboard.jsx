import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Card as MuiCard, CardContent, Typography } from "@mui/material";

const HrDashboard = () => {
  const [teamMetrics, setTeamMetrics] = useState({
    totalImpactScore: 0,
    totalPossibleScore: 0,
    unnoticedContributions: 0,
    genderData: { male: 0, female: 0, nonbinary: 0 },
    ethnicityData: { white: 0, south_asian: 0, african: 0 },
    disabilityData: { none: 0, disabled: 0 },
    genderHighPerformers: { male: 0, female: 0, nonbinary: 0 },
    ethnicityHighPerformers: { white: 0, south_asian: 0, african: 0 },
    disabilityHighPerformers: { none: 0, disabled: 0 },
  });

  const [groupedData, setGroupedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "users"), where("role", "==", "employee")); //Only employees, dont check for hr or managers
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());

      const categories = ["gender", "ethnicity", "disabilityStatus"];
      const insights = [];
      const graphData = [];

      let totalImpactScore = 0;
      let totalPossibleScore = 0;
      let unnoticedContributions = 0;
      const genderData = { male: 0, female: 0, nonbinary: 0 };
      const ethnicityData = { white: 0, south_asian: 0, african: 0 };
      const disabilityData = { none: 0, disabled: 0 };
      const genderHighPerformers = { male: 0, female: 0, nonbinary: 0 };
      const ethnicityHighPerformers = { white: 0, south_asian: 0, african: 0 };
      const disabilityHighPerformers = { none: 0, disabled: 0 };

      data.forEach((user) => {
        //Calculate total impact score and group data
        totalImpactScore += user.score || 0;
        totalPossibleScore += 100; //max score is 100
        unnoticedContributions += user.aiInsights ? user.aiInsights.length : 0;

        //gender and ethnicity grouping
        if (user.gender) genderData[user.gender] = (genderData[user.gender] || 0) + 1;
        if (user.ethnicity) ethnicityData[user.ethnicity] = (ethnicityData[user.ethnicity] || 0) + 1;
        if (user.disabilityStatus) disabilityData[user.disabilityStatus] = (disabilityData[user.disabilityStatus] || 0) + 1;

        // high performer tracking (score>70= high performer)
        if (user.score >= 70) {
          if (user.gender) genderHighPerformers[user.gender] = (genderHighPerformers[user.gender] || 0) + 1;
          if (user.ethnicity) ethnicityHighPerformers[user.ethnicity] = (ethnicityHighPerformers[user.ethnicity] || 0) + 1;
          if (user.disabilityStatus) disabilityHighPerformers[user.disabilityStatus] = (disabilityHighPerformers[user.disabilityStatus] || 0) + 1;
        }
      });

      //create insights and graph data
      categories.forEach((cat) => {
        const groupMap = {};
        data.forEach((user) => {
          const key = user[cat] || "unknown";
          if (!groupMap[key]) groupMap[key] = [];
          groupMap[key].push(user);
        });

        Object.entries(groupMap).forEach(([group, users]) => {
          const highScorers = users.filter((u) => u.score > 70);
          const percentage = ((highScorers.length / users.length) * 100).toFixed(1);

          insights.push(
            `${group} group in ${cat} has ${highScorers.length} high performers out of ${users.length} (${percentage}%)`
          );

          graphData.push({
            category: `${cat} - ${group}`,
            total: users.length,
            highScorers: highScorers.length,
          });
        });
      });

      setTeamMetrics({
        totalImpactScore,
        totalPossibleScore,
        unnoticedContributions,
        genderData,
        ethnicityData,
        disabilityData,
        genderHighPerformers,
        ethnicityHighPerformers,
        disabilityHighPerformers,
      });

      setGroupedData(graphData);
    };

    fetchData();
  }, []);

  const scorePercentage = teamMetrics.totalPossibleScore
    ? ((teamMetrics.totalImpactScore / teamMetrics.totalPossibleScore) * 100).toFixed(2)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-gray-800">HR Dashboard</h1>

        {/* Silent Impact Score and Insights */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Overall Silent Impact Score</h2>
          <p className="text-lg text-gray-700">
            <span className="font-semibold">Total Silent Impact Score: </span> {teamMetrics.totalImpactScore} / {teamMetrics.totalPossibleScore} ({scorePercentage}%)
          </p>
          <p className="text-sm text-gray-500 mt-2">
            The higher the score, the more work being done behind the scenes without proper recognition. Consider focusing on groups with lower recognition.
          </p>
        </div>

        {/* Gender insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MuiCard className="bg-yellow-50 border-l-4 border-yellow-400 p-4 shadow-lg rounded-xl">
            <CardContent>
              <Typography variant="h6" color="textSecondary">Gender Insights</Typography>
              <Typography className="text-gray-700">{`Male silent performers% : ${((teamMetrics.genderHighPerformers.male / teamMetrics.genderData.male) * 100).toFixed(2)}%`}</Typography>
              <Typography className="text-gray-700">{`Female silent performers% : ${((teamMetrics.genderHighPerformers.female / teamMetrics.genderData.female) * 100).toFixed(2)}%`}</Typography>
              <Typography className="text-gray-700">{`Nonbinary silent performers% : ${((teamMetrics.genderHighPerformers.nonbinary / teamMetrics.genderData.nonbinary) * 100).toFixed(2)}%`}</Typography>
            </CardContent>
          </MuiCard>

          {/* Ethnicity insights */}
          <MuiCard className="bg-pink-50 border-l-4 border-pink-400 p-4 shadow-lg rounded-xl">
            <CardContent>
              <Typography variant="h6" color="textSecondary">Ethnicity Insights</Typography>
              <Typography className="text-gray-700">{`White silent performers% : ${((teamMetrics.ethnicityHighPerformers.white / teamMetrics.ethnicityData.white) * 100).toFixed(2)}%`}</Typography>
              <Typography className="text-gray-700">{`South Asian silent performers% : ${((teamMetrics.ethnicityHighPerformers.south_asian / teamMetrics.ethnicityData.south_asian) * 100).toFixed(2)}%`}</Typography>
              <Typography className="text-gray-700">{`African silent performers% : ${((teamMetrics.ethnicityHighPerformers.african / teamMetrics.ethnicityData.african) * 100).toFixed(2)}%`}</Typography>
            </CardContent>
          </MuiCard>
        </div>

        {/*Bar Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">👥 Representation & Impact</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={groupedData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" angle={-15} textAnchor="end" interval={0} height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name="Total Members" />
              <Bar dataKey="highScorers" fill="#82ca9d" name="SilentTop Performers" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Silent workers at risk */}
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-xl">
          <h3 className="font-semibold text-red-700 mb-2">🚨 Silent Workers at Risk of Being Overlooked</h3>
          <p className="text-gray-700">
            Employees from the **African** ethnicity, as well as **Nonbinary** gender identities, are currently not being recognized despite their silent contributions. This is an urgent opportunity for HR to explore inclusion and recognition gaps.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
