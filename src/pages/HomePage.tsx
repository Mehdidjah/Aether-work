import { useState } from 'react';
import { 
  FileText, 
  CheckSquare, 
  MessageCircle, 
  Palette, 
  BarChart3,
  ArrowRight,
  Plus,
  Clock,
  Users,
  Sparkles,
  Target,
  Command
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const modules = [
  {
    id: 'docs',
    title: 'Docs',
    description: 'Collaborative documents with real-time editing',
    icon: FileText,
    path: '/docs',
    color: 'hsl(var(--primary))',
    stats: '12 documents',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    id: 'tasks',
    title: 'Tasks',
    description: 'Kanban boards and sprint planning',
    icon: CheckSquare,
    path: '/tasks',
    color: 'hsl(var(--accent))',
    stats: '8 active tasks',
    gradient: 'from-accent/20 to-accent/5',
  },
  {
    id: 'chat',
    title: 'Chat',
    description: 'Team messaging and channels',
    icon: MessageCircle,
    path: '/chat',
    color: 'hsl(var(--success))',
    stats: '3 unread',
    gradient: 'from-success/20 to-success/5',
  },
  {
    id: 'whiteboard',
    title: 'Whiteboard',
    description: 'Infinite canvas for brainstorming',
    icon: Palette,
    path: '/whiteboard',
    color: 'hsl(var(--warning))',
    stats: '2 boards',
    gradient: 'from-warning/20 to-warning/5',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Dashboards and KPI tracking',
    icon: BarChart3,
    path: '/analytics',
    color: 'hsl(var(--error))',
    stats: 'Updated today',
    gradient: 'from-error/20 to-error/5',
  },
];

const recentActivity = [
  { id: 1, action: 'Created', item: 'Q4 Planning Document', module: 'Docs', time: '2 min ago', icon: FileText },
  { id: 2, action: 'Completed', item: 'Design Review', module: 'Tasks', time: '15 min ago', icon: CheckSquare },
  { id: 3, action: 'Joined', item: '#product channel', module: 'Chat', time: '1 hour ago', icon: MessageCircle },
  { id: 4, action: 'Shared', item: 'Architecture Diagram', module: 'Whiteboard', time: '3 hours ago', icon: Palette },
];

const quickStats = [
  { label: 'Tasks This Week', value: 24, change: '+12%', icon: CheckSquare },
  { label: 'Documents Created', value: 8, change: '+5%', icon: FileText },
  { label: 'Team Messages', value: 156, change: '+23%', icon: MessageCircle },
];

const upcomingTasks = [
  { id: 1, title: 'Review PR #234', priority: 'high', dueDate: 'Today', progress: 80 },
  { id: 2, title: 'Update documentation', priority: 'medium', dueDate: 'Tomorrow', progress: 45 },
  { id: 3, title: 'Team sync meeting', priority: 'low', dueDate: 'Wed', progress: 0 },
];

const teamMembers = [
  { id: 1, name: 'Alex Chen', status: 'online', avatar: 'AC' },
  { id: 2, name: 'Jordan Lee', status: 'online', avatar: 'JL' },
  { id: 3, name: 'Morgan Kim', status: 'away', avatar: 'MK' },
  { id: 4, name: 'Sam Rivera', status: 'offline', avatar: 'SR' },
];

export default function HomePage() {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {greeting}, Alex
            </h1>
            <p className="text-muted-foreground text-lg">
              Your workspace is ready. What would you like to work on today?
            </p>
          </div>
          
          {/* Command Palette Hint */}
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border border-border">
            <Command className="h-4 w-4" />
            <span>Press</span>
            <kbd className="bg-background px-1.5 py-0.5 rounded text-xs font-mono">⌘K</kbd>
            <span>for commands</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {quickStats.map((stat) => (
          <Card key={stat.label} className="bg-gradient-to-br from-card to-muted/30 hover:shadow-medium hover:scale-[1.02] transition-all cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <span className="text-xs text-success font-medium">{stat.change}</span>
                </div>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button className="gap-2 group">
          <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
          New Document
        </Button>
        <Button variant="outline" className="gap-2 group">
          <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
          Create Task
        </Button>
        <Button variant="outline" className="gap-2">
          <Users className="h-4 w-4" />
          Start Meeting
        </Button>
        <Button variant="ghost" className="gap-2">
          <Sparkles className="h-4 w-4 text-warning" />
          AI Assistant
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Modules Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((module) => (
            <div 
              key={module.id}
              onMouseEnter={() => setHoveredModule(module.id)}
              onMouseLeave={() => setHoveredModule(null)}
            >
              <Link to={module.path}>
                <Card className={cn(
                  "group cursor-pointer transition-all duration-300 hover:shadow-medium hover:-translate-y-1 overflow-hidden relative",
                  hoveredModule === module.id && "border-primary/50"
                )}>
                  {/* Gradient Background */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    module.gradient
                  )} />
                  
                  <CardHeader className="pb-3 relative">
                    <div className="flex items-start justify-between">
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${module.color}15` }}
                      >
                        <module.icon 
                          className="h-5 w-5" 
                          style={{ color: module.color }}
                        />
                      </div>
                      <div className={cn(
                        "transition-all duration-200",
                        hoveredModule === module.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                      )}>
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-3">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 relative">
                    <span className="text-sm text-muted-foreground">{module.stats}</span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Team Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team Online
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {member.avatar}
                    </div>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
                      member.status === 'online' && "bg-success",
                      member.status === 'away' && "bg-warning",
                      member.status === 'offline' && "bg-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{member.status}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="space-y-2 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                      {task.title}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-[10px]",
                        task.priority === 'high' && "bg-error/10 text-error",
                        task.priority === 'medium' && "bg-warning/10 text-warning",
                        task.priority === 'low' && "bg-muted text-muted-foreground"
                      )}
                    >
                      {task.dueDate}
                    </Badge>
                  </div>
                  <Progress value={task.progress} className="h-1.5" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                      <activity.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm">
                      <span className="text-muted-foreground">{activity.action}</span>{' '}
                      <span className="font-medium text-foreground">{activity.item}</span>
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {activity.module}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
