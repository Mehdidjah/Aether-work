import { 
  FileText, 
  CheckSquare, 
  MessageCircle, 
  Palette, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  Home,
  Puzzle,
  HelpCircle,
  User
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useWorkspaceStore, type ModuleId } from '@/stores/workspace-store';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface NavItem {
  id: ModuleId | 'home' | 'plugins' | 'settings' | 'help' | 'profile';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  isModule?: boolean;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'docs', label: 'Docs', icon: FileText, path: '/docs', isModule: true },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, path: '/tasks', isModule: true },
  { id: 'chat', label: 'Chat', icon: MessageCircle, path: '/chat', isModule: true },
  { id: 'whiteboard', label: 'Whiteboard', icon: Palette, path: '/whiteboard', isModule: true },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics', isModule: true },
];

const bottomNavItems: NavItem[] = [
  { id: 'plugins', label: 'Plugins', icon: Puzzle, path: '/plugins' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' },
];

export function AppSidebar() {
  const { sidebarCollapsed, toggleSidebar, enabledModules } = useWorkspaceStore();
  const location = useLocation();

  const isItemEnabled = (item: NavItem) => {
    if (!item.isModule) return true;
    return enabledModules.includes(item.id as ModuleId);
  };

  const NavItemComponent = ({ item, isActive }: { item: NavItem; isActive: boolean }) => {
    const content = (
      <NavLink
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group",
          "hover:bg-sidebar-accent",
          isActive 
            ? "bg-sidebar-accent text-sidebar-primary font-medium" 
            : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
        )}
      >
        {/* Simple active indicator - no animation that causes layout issues */}
        <div 
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full transition-all duration-200",
            isActive ? "bg-sidebar-primary opacity-100" : "bg-transparent opacity-0"
          )}
        />
        
        <item.icon className={cn(
          "h-5 w-5 shrink-0 transition-colors duration-200",
          isActive ? "text-sidebar-primary" : "group-hover:text-sidebar-foreground"
        )} />
        
        <span 
          className={cn(
            "text-sm whitespace-nowrap transition-all duration-200",
            sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
          )}
        >
          {item.label}
        </span>
      </NavLink>
    );

    if (sidebarCollapsed) {
      return (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={12} className="font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 overflow-hidden transition-all duration-250 ease-out",
        sidebarCollapsed ? "w-16" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-3 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          
          <span 
            className={cn(
              "font-semibold text-sidebar-foreground whitespace-nowrap transition-all duration-200",
              sidebarCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            )}
          >
            Aether
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className="text-muted-foreground hover:text-sidebar-foreground shrink-0"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform duration-250",
            sidebarCollapsed && "rotate-180"
          )} />
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isEnabled = isItemEnabled(item);
          const isActive = location.pathname === item.path || 
            (item.path !== '/' && location.pathname.startsWith(item.path));
          
          if (!isEnabled) return null;

          return (
            <NavItemComponent 
              key={item.id} 
              item={item} 
              isActive={isActive} 
            />
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="py-3 px-2 border-t border-sidebar-border space-y-0.5 shrink-0">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <NavItemComponent 
              key={item.id} 
              item={item} 
              isActive={isActive} 
            />
          );
        })}
      </div>
    </aside>
  );
}
