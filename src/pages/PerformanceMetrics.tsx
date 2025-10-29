import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const PerformanceMetrics = () => {
  const responseTimeData = [
    { day: "Day 1", time: 2.8 },
    { day: "Day 7", time: 2.6 },
    { day: "Day 14", time: 2.4 },
    { day: "Day 21", time: 2.3 },
    { day: "Day 30", time: 2.3 },
  ];

  const hallucinationData = [
    { month: "Jan", rate: 8.5 },
    { month: "Feb", rate: 7.2 },
    { month: "Mar", rate: 5.8 },
    { month: "Apr", rate: 4.9 },
    { month: "May", rate: 4.2 },
  ];

  const lowConfidenceQueries = [
    { query: "What is the enterprise pricing tier?", confidence: 0.54 },
    { query: "How to implement custom SSO?", confidence: 0.58 },
    { query: "Database migration procedures", confidence: 0.61 },
    { query: "Advanced API authentication", confidence: 0.63 },
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Performance Metrics</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Response Time Trends (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Hallucination Rate Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hallucinationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="rate" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel">
        <CardHeader>
          <CardTitle>Recent Low Confidence Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lowConfidenceQueries.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                <span className="font-medium">{item.query}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    item.confidence > 0.6
                      ? "bg-warning/20 text-warning"
                      : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {(item.confidence * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
