import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Session {
  id: string;
  score: number;
  metrics: any;
  created_at: string;
}

interface TrainingMetricsProps {
  agentId: string;
  sessions: Session[];
}

export const TrainingMetrics = ({ sessions }: TrainingMetricsProps) => {
  const chartData = sessions
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map(session => ({
      date: new Date(session.created_at).toLocaleDateString(),
      score: session.score
    }));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h4 className="text-sm font-medium text-gray-500">Average Score</h4>
          <p className="text-3xl font-bold mt-2">
            {Math.round(
              sessions.reduce((acc, session) => acc + session.score, 0) / 
              sessions.length
            )}%
          </p>
        </Card>

        <Card className="p-6">
          <h4 className="text-sm font-medium text-gray-500">Total Sessions</h4>
          <p className="text-3xl font-bold mt-2">{sessions.length}</p>
        </Card>

        <Card className="p-6">
          <h4 className="text-sm font-medium text-gray-500">Latest Score</h4>
          <p className="text-3xl font-bold mt-2">
            {sessions[sessions.length - 1]?.score || 0}%
          </p>
        </Card>
      </div>
    </div>
  );
};