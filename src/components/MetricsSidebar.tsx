import { CheckCircle, TrendingUp, Star, Database } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const MetricsSidebar = () => {
  const metrics = [
    {
      title: "Avg Response Time",
      value: "2.3s",
      icon: CheckCircle,
      color: "text-success",
      trend: "+12%",
    },
    {
      title: "Hallucination Rate",
      value: "4.2%",
      icon: TrendingUp,
      color: "text-warning",
      trend: "-8%",
    },
    {
      title: "Precision@5",
      value: "0.89",
      icon: Database,
      color: "text-primary",
      progress: 89,
    },
    {
      title: "User Satisfaction",
      value: "4.7/5",
      icon: Star,
      color: "text-accent",
    },
  ];

  const recentActivity = [
    { query: "What is the refund policy?", time: "2 min ago" },
    { query: "How to reset password?", time: "5 min ago" },
    { query: "API rate limits explained", time: "12 min ago" },
    { query: "Database backup procedures", time: "18 min ago" },
    { query: "Security best practices", time: "23 min ago" },
  ];

  return (
    <aside className="w-full lg:w-96 space-y-4 p-4">
      <div className="glass-panel rounded-xl p-4 space-y-4">
        <h2 className="text-lg font-semibold">Performance Metrics</h2>
        
        <div className="space-y-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="border-border/50">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold mt-1">{metric.value}</p>
                    </div>
                    <Icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  {metric.progress !== undefined && (
                    <Progress value={metric.progress} className="h-2 mt-2" />
                  )}
                  {metric.trend && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {metric.trend} from last week
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
        <div className="space-y-2">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <p className="text-sm font-medium truncate">{activity.query}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-3">Knowledge Base Status</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Documents Indexed</span>
            <span className="font-semibold">847</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Chunks</span>
            <span className="font-semibold">12,450</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="font-semibold">5 min ago</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default MetricsSidebar;
