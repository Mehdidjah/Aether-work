import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  CheckSquare,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MoreHorizontal,
  Plus,
  Download,
  RefreshCw,
  Filter,
  Maximize2,
  X,
  Sparkles,
  Target,
  Zap,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { staggerContainer, staggerItem } from '@/lib/motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const kpiCards = [
  {
    title: 'Active Users',
    value: '2,847',
    change: '+12.5%',
    trend: 'up' as const,
    icon: Users,
    sparkline: [20, 25, 30, 28, 35, 40, 38, 45],
  },
  {
    title: 'Documents Created',
    value: '1,429',
    change: '+8.2%',
    trend: 'up' as const,
    icon: FileText,
    sparkline: [15, 20, 18, 25, 22, 30, 28, 35],
  },
  {
    title: 'Tasks Completed',
    value: '892',
    change: '+23.1%',
    trend: 'up' as const,
    icon: CheckSquare,
    sparkline: [10, 15, 20, 18, 25, 30, 35, 42],
  },
  {
    title: 'Avg. Session Time',
    value: '24m 32s',
    change: '-3.2%',
    trend: 'down' as const,
    icon: Clock,
    sparkline: [30, 28, 25, 27, 24, 22, 25, 23],
  },
];

const activityData = [
  { name: 'Mon', docs: 45, tasks: 28, chat: 120, whiteboard: 15 },
  { name: 'Tue', docs: 52, tasks: 35, chat: 98, whiteboard: 22 },
  { name: 'Wed', docs: 38, tasks: 42, chat: 145, whiteboard: 18 },
  { name: 'Thu', docs: 65, tasks: 31, chat: 132, whiteboard: 28 },
  { name: 'Fri', docs: 48, tasks: 38, chat: 89, whiteboard: 35 },
  { name: 'Sat', docs: 22, tasks: 12, chat: 45, whiteboard: 12 },
  { name: 'Sun', docs: 18, tasks: 8, chat: 32, whiteboard: 8 },
];

const moduleUsage = [
  { name: 'Docs', value: 35, color: 'hsl(43, 45%, 59%)' },
  { name: 'Tasks', value: 28, color: 'hsl(78, 26%, 48%)' },
  { name: 'Chat', value: 22, color: 'hsl(130, 22%, 46%)' },
  { name: 'Whiteboard', value: 10, color: 'hsl(43, 55%, 57%)' },
  { name: 'Analytics', value: 5, color: 'hsl(0, 38%, 56%)' },
];

const productivityData = [
  { week: 'Week 1', productivity: 72, target: 75 },
  { week: 'Week 2', productivity: 78, target: 75 },
  { week: 'Week 3', productivity: 85, target: 80 },
  { week: 'Week 4', productivity: 82, target: 80 },
];

const teamPerformance = [
  { subject: 'Speed', A: 120, B: 110, fullMark: 150 },
  { subject: 'Quality', A: 98, B: 130, fullMark: 150 },
  { subject: 'Collaboration', A: 86, B: 130, fullMark: 150 },
  { subject: 'Innovation', A: 99, B: 100, fullMark: 150 },
  { subject: 'Communication', A: 85, B: 90, fullMark: 150 },
];

const realtimeMetrics = [
  { label: 'Active Sessions', value: 127, icon: Activity },
  { label: 'Tasks in Progress', value: 34, icon: Target },
  { label: 'Messages/min', value: 8.5, icon: Zap },
];

const goals = [
  { name: 'Weekly Tasks', current: 45, target: 50, unit: 'tasks' },
  { name: 'Team Velocity', current: 82, target: 100, unit: 'points' },
  { name: 'Doc Reviews', current: 12, target: 15, unit: 'reviews' },
];

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  delay?: number;
}

function ChartCard({ title, children, className, actions, delay = 0 }: ChartCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className={cn(
          "h-full transition-all duration-300",
          isHovered && "shadow-medium border-primary/20"
        )}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <div className="flex items-center gap-1">
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-1"
                  >
                    <Button variant="ghost" size="icon-sm" onClick={() => setIsExpanded(true)}>
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              {actions}
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </motion.div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl shadow-lg border border-border w-full max-w-4xl max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-xl font-semibold">{title}</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-6 h-96">
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  return (
    <svg className="w-16 h-8" viewBox="0 0 64 32">
      <path
        d={data.map((v, i) => {
          const x = (i / (data.length - 1)) * 64;
          const y = 32 - ((v - min) / range) * 28;
          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track your workspace performance in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-36">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Real-time Metrics Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-gradient-to-r from-primary/5 via-accent/5 to-success/5 rounded-xl p-4 mb-6 border border-border"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-foreground">Live Dashboard</span>
          </div>
          <div className="flex items-center gap-8">
            {realtimeMetrics.map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                <metric.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{metric.label}:</span>
                <span className="text-sm font-bold text-foreground">{metric.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {kpiCards.map((kpi, index) => (
          <motion.div 
            key={kpi.title} 
            variants={staggerItem}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="hover:shadow-medium transition-all duration-300 cursor-pointer group overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <kpi.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <MiniSparkline 
                      data={kpi.sparkline} 
                      color={kpi.trend === 'up' ? 'hsl(130, 22%, 46%)' : 'hsl(0, 38%, 56%)'} 
                    />
                    <div className={cn(
                      "flex items-center gap-1 text-sm font-medium",
                      kpi.trend === 'up' ? 'text-success' : 'text-error'
                    )}>
                      {kpi.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {kpi.change}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <motion.p 
                    className="text-2xl font-bold text-foreground"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                  >
                    {kpi.value}
                  </motion.p>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Goals Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-6"
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Weekly Goals
              </CardTitle>
              <Badge variant="secondary">3 Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {goals.map((goal, i) => (
                <motion.div
                  key={goal.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-muted-foreground">
                      {goal.current}/{goal.target} {goal.unit}
                    </span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Activity Chart */}
        <ChartCard title="Weekly Activity" className="lg:col-span-2" delay={0.2}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(43, 45%, 59%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(43, 45%, 59%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(78, 26%, 48%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(78, 26%, 48%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="docs" 
                  stroke="hsl(43, 45%, 59%)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorDocs)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke="hsl(78, 26%, 48%)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTasks)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Documents</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-sm text-muted-foreground">Tasks</span>
            </div>
          </div>
        </ChartCard>

        {/* Module Usage */}
        <ChartCard title="Module Usage" delay={0.3}>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moduleUsage}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {moduleUsage.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {moduleUsage.map((module) => (
              <motion.div 
                key={module.name} 
                className="flex items-center justify-between hover:bg-muted/50 p-1 rounded transition-colors cursor-pointer"
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: module.color }}
                  />
                  <span className="text-sm text-muted-foreground">{module.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{module.value}%</span>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Chart */}
        <ChartCard title="Team Productivity vs Target" delay={0.4}>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="week" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="productivity" 
                  fill="hsl(43, 45%, 59%)" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
                <Bar 
                  dataKey="target" 
                  fill="hsl(var(--muted))" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted" />
              <span className="text-sm text-muted-foreground">Target</span>
            </div>
          </div>
        </ChartCard>

        {/* Team Performance Radar */}
        <ChartCard title="Team Performance" delay={0.5}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={teamPerformance}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 150]}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                />
                <Radar
                  name="This Week"
                  dataKey="A"
                  stroke="hsl(43, 45%, 59%)"
                  fill="hsl(43, 45%, 59%)"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Last Week"
                  dataKey="B"
                  stroke="hsl(78, 26%, 48%)"
                  fill="hsl(78, 26%, 48%)"
                  fillOpacity={0.3}
                />
                <Legend />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
