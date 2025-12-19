import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getQuizScoreDistributionAPI } from '~/apis'


const fetchScoreDistribution = async (quizId) => {
  const data = await getQuizScoreDistributionAPI(quizId)
  return data
}

export default function ScoreDistributionCard({ quizId }) {
  const { data } = useQuery({
    queryKey: ['scoreDistribution', quizId],
    queryFn: () => fetchScoreDistribution(quizId)
  })

  return (
    <div className="lg:col-span-3 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
      <h2 className="text-lg text-gray-100 mb-6">Score Distribution</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="range" tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#f3f4f6'
            }}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
