import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  Users,
  Edit3,
  Trash2,
  Copy,
  Tag,
  CalendarDays,
  LayoutGrid,
  List,
  SortAsc
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

type Priority = 'high' | 'medium' | 'low';
type Status = 'todo' | 'in-progress' | 'review' | 'done';
type ViewMode = 'board' | 'list';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  assignee?: { name: string; initials: string };
  dueDate?: string;
  tags: string[];
  subtasks?: { id: string; title: string; completed: boolean }[];
  createdAt: string;
}

const teamMembers = [
  { name: 'Alex Chen', initials: 'AC' },
  { name: 'Jordan Lee', initials: 'JL' },
  { name: 'Sam Rivera', initials: 'SR' },
  { name: 'Morgan Kim', initials: 'MK' },
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create mockups for the marketing site redesign',
    priority: 'high',
    status: 'in-progress',
    assignee: { name: 'Alex Chen', initials: 'AC' },
    dueDate: 'Dec 8',
    tags: ['design', 'marketing'],
    subtasks: [
      { id: 's1', title: 'Create wireframes', completed: true },
      { id: 's2', title: 'Design hero section', completed: false },
      { id: 's3', title: 'Mobile responsive', completed: false },
    ],
    createdAt: '2024-12-01',
  },
  {
    id: '2',
    title: 'Implement auth flow',
    description: 'Add OAuth2 support with refresh tokens',
    priority: 'high',
    status: 'todo',
    assignee: { name: 'Jordan Lee', initials: 'JL' },
    dueDate: 'Dec 10',
    tags: ['backend', 'security'],
    subtasks: [
      { id: 's4', title: 'Setup OAuth providers', completed: false },
      { id: 's5', title: 'Implement token refresh', completed: false },
    ],
    createdAt: '2024-12-02',
  },
  {
    id: '3',
    title: 'Write API documentation',
    priority: 'medium',
    status: 'review',
    assignee: { name: 'Sam Rivera', initials: 'SR' },
    tags: ['docs'],
    createdAt: '2024-12-03',
  },
  {
    id: '4',
    title: 'Fix mobile navigation',
    priority: 'medium',
    status: 'done',
    assignee: { name: 'Alex Chen', initials: 'AC' },
    tags: ['bug', 'mobile'],
    createdAt: '2024-11-28',
  },
  {
    id: '5',
    title: 'Update dependencies',
    priority: 'low',
    status: 'todo',
    tags: ['maintenance'],
    createdAt: '2024-12-05',
  },
  {
    id: '6',
    title: 'Performance optimization',
    description: 'Reduce bundle size and improve load times',
    priority: 'medium',
    status: 'in-progress',
    assignee: { name: 'Jordan Lee', initials: 'JL' },
    dueDate: 'Dec 12',
    tags: ['performance'],
    createdAt: '2024-12-04',
  },
];

const columns: { id: Status; title: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'todo', title: 'To Do', icon: Circle },
  { id: 'in-progress', title: 'In Progress', icon: Clock },
  { id: 'review', title: 'Review', icon: AlertCircle },
  { id: 'done', title: 'Done', icon: CheckCircle2 },
];

const priorityConfig = {
  high: { icon: ArrowUp, color: 'text-error', bg: 'bg-error/10', label: 'High' },
  medium: { icon: ArrowRight, color: 'text-warning', bg: 'bg-warning/10', label: 'Medium' },
  low: { icon: ArrowDown, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Low' },
};

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [filterAssignee, setFilterAssignee] = useState<string | 'all'>('all');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    status: 'todo' as Status,
    assignee: '',
    dueDate: '',
    tags: '',
  });

  const getColumnTasks = (status: Status) => 
    tasks.filter(task => {
      const matchesStatus = task.status === status;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchesAssignee = filterAssignee === 'all' || task.assignee?.name === filterAssignee;
      return matchesStatus && matchesSearch && matchesPriority && matchesAssignee;
    });

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDrop = (status: Status) => {
    if (draggedTask) {
      setTasks(prev => 
        prev.map(task => 
          task.id === draggedTask ? { ...task, status } : task
        )
      );
      toast.success(`Task moved to ${columns.find(c => c.id === status)?.title}`);
    }
  };

  const createTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Title is required');
      return;
    }
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || undefined,
      priority: newTask.priority,
      status: newTask.status,
      assignee: newTask.assignee ? teamMembers.find(m => m.name === newTask.assignee) : undefined,
      dueDate: newTask.dueDate || undefined,
      tags: newTask.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [task, ...prev]);
    setNewTask({ title: '', description: '', priority: 'medium', status: 'todo', assignee: '', dueDate: '', tags: '' });
    setIsNewTaskOpen(false);
    toast.success('Task created');
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success('Task deleted');
  };

  const duplicateTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newT: Task = {
        ...task,
        id: Date.now().toString(),
        title: `${task.title} (Copy)`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTasks(prev => [newT, ...prev]);
      toast.success('Task duplicated');
    }
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditOpen(true);
  };

  const saveEdit = () => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? editingTask : t));
      setIsEditOpen(false);
      setEditingTask(null);
      toast.success('Task updated');
    }
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && task.subtasks) {
        return {
          ...task,
          subtasks: task.subtasks.map(st => 
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          )
        };
      }
      return task;
    }));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;

  return (
    <div className="p-6 lg:p-8 h-full flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col gap-4 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
            <p className="text-muted-foreground">Manage your team's work</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48 sm:w-64"
              />
            </div>
            <Button className="gap-2" onClick={() => setIsNewTaskOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">{totalTasks} Total</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span className="text-muted-foreground">{inProgressTasks} In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-muted-foreground">{completedTasks} Completed</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as Priority | 'all')}>
              <SelectTrigger className="w-32">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger className="w-36">
                <Users className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                {teamMembers.map(m => (
                  <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
              <TabsList className="h-9">
                <TabsTrigger value="board" className="px-3">
                  <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list" className="px-3">
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </motion.div>

      {viewMode === 'board' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 overflow-x-auto pb-4"
        >
          <div className="flex gap-4 h-full min-w-max">
            {columns.map((column, colIndex) => (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + colIndex * 0.05 }}
                className="w-80 flex-shrink-0"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(column.id)}
              >
                <Card className="h-full bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <column.icon className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold text-foreground">{column.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {getColumnTasks(column.id).length}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon-sm" onClick={() => {
                        setNewTask(prev => ({ ...prev, status: column.id }));
                        setIsNewTaskOpen(true);
                      }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 min-h-[200px]">
                    <AnimatePresence>
                      {getColumnTasks(column.id).map((task) => (
                        <TaskCard 
                          key={task.id} 
                          task={task}
                          onDragStart={() => handleDragStart(task.id)}
                          onDragEnd={handleDragEnd}
                          isDragging={draggedTask === task.id}
                          onDelete={() => deleteTask(task.id)}
                          onDuplicate={() => duplicateTask(task.id)}
                          onEdit={() => openEditTask(task)}
                          onToggleSubtask={(subtaskId) => toggleSubtask(task.id, subtaskId)}
                        />
                      ))}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 overflow-auto"
        >
          <div className="space-y-2">
            {tasks
              .filter(task => {
                const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
                const matchesAssignee = filterAssignee === 'all' || task.assignee?.name === filterAssignee;
                return matchesSearch && matchesPriority && matchesAssignee;
              })
              .map(task => (
                <TaskListItem
                  key={task.id}
                  task={task}
                  onDelete={() => deleteTask(task.id)}
                  onDuplicate={() => duplicateTask(task.id)}
                  onEdit={() => openEditTask(task)}
                  onStatusChange={(status) => setTasks(prev => 
                    prev.map(t => t.id === task.id ? { ...t, status } : t)
                  )}
                />
              ))}
          </div>
        </motion.div>
      )}

      <Dialog open={isNewTaskOpen} onOpenChange={setIsNewTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Task title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Task description..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newTask.priority} onValueChange={(v) => setNewTask(prev => ({ ...prev, priority: v as Priority }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={newTask.status} onValueChange={(v) => setNewTask(prev => ({ ...prev, status: v as Status }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Assignee</Label>
                <Select value={newTask.assignee} onValueChange={(v) => setNewTask(prev => ({ ...prev, assignee: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map(m => (
                      <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input
                value={newTask.tags}
                onChange={(e) => setNewTask(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="design, frontend, bug"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTaskOpen(false)}>Cancel</Button>
            <Button onClick={createTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select 
                    value={editingTask.priority} 
                    onValueChange={(v) => setEditingTask({ ...editingTask, priority: v as Priority })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={editingTask.status} 
                    onValueChange={(v) => setEditingTask({ ...editingTask, status: v as Status })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {columns.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TaskCard({ 
  task, 
  onDragStart, 
  onDragEnd,
  isDragging,
  onDelete,
  onDuplicate,
  onEdit,
  onToggleSubtask
}: { 
  task: Task;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onToggleSubtask: (subtaskId: string) => void;
}) {
  const PriorityIcon = priorityConfig[task.priority].icon;
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.16 }}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`bg-background border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging ? 'shadow-large opacity-75' : 'shadow-soft hover:shadow-medium'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`p-1 rounded ${priorityConfig[task.priority].bg}`}>
          <PriorityIcon className={`h-3 w-3 ${priorityConfig[task.priority].color}`} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="h-6 w-6">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-error" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h4 className="font-medium text-sm text-foreground mb-1">{task.title}</h4>
      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
      )}

      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <CheckCircle2 className="h-3 w-3" />
            {completedSubtasks}/{totalSubtasks} subtasks
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map(tag => (
            <span 
              key={tag} 
              className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        {task.assignee ? (
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
              {task.assignee.initials}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-6 w-6 rounded-full border-2 border-dashed border-border flex items-center justify-center">
            <Users className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {task.dueDate}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TaskListItem({
  task,
  onDelete,
  onDuplicate,
  onEdit,
  onStatusChange
}: {
  task: Task;
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onStatusChange: (status: Status) => void;
}) {
  const PriorityIcon = priorityConfig[task.priority].icon;
  const StatusIcon = columns.find(c => c.id === task.status)?.icon || Circle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex items-center gap-4 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-all"
    >
      <Select value={task.status} onValueChange={(v) => onStatusChange(v as Status)}>
        <SelectTrigger className="w-auto border-0 p-0 h-auto shadow-none">
          <StatusIcon className={`h-5 w-5 ${task.status === 'done' ? 'text-success' : 'text-muted-foreground'}`} />
        </SelectTrigger>
        <SelectContent>
          {columns.map(c => (
            <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex-1 min-w-0">
        <h4 className={`font-medium text-sm ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-muted-foreground truncate">{task.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {task.tags.slice(0, 2).map(tag => (
          <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
        ))}
      </div>

      <div className={`p-1 rounded ${priorityConfig[task.priority].bg}`}>
        <PriorityIcon className={`h-3 w-3 ${priorityConfig[task.priority].color}`} />
      </div>

      {task.assignee && (
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
            {task.assignee.initials}
          </AvatarFallback>
        </Avatar>
      )}

      {task.dueDate && (
        <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
          <CalendarDays className="h-3 w-3" />
          {task.dueDate}
        </div>
      )}

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon-sm" onClick={onEdit}>
          <Edit3 className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-error" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
