import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type ModuleId = 'docs' | 'tasks' | 'chat' | 'whiteboard' | 'analytics';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: Date;
}

interface WorkspaceState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  
  // Sidebar
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  
  // Active module
  activeModule: ModuleId | null;
  setActiveModule: (module: ModuleId | null) => void;
  
  // Feature flags
  enabledModules: ModuleId[];
  toggleModule: (module: ModuleId) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      // User - mock user for demo
      user: {
        id: '1',
        name: 'Alex Chen',
        email: 'alex@aether.dev',
        avatar: undefined,
      },
      setUser: (user) => set({ user }),
      
      // Theme
      theme: 'dark',
      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      },
      
      // Sidebar
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // Active module
      activeModule: null,
      setActiveModule: (module) => set({ activeModule: module }),
      
      // Feature flags - all enabled by default
      enabledModules: ['docs', 'tasks', 'chat', 'whiteboard', 'analytics'],
      toggleModule: (module) => set((state) => ({
        enabledModules: state.enabledModules.includes(module)
          ? state.enabledModules.filter((m) => m !== module)
          : [...state.enabledModules, module],
      })),
      
      // Notifications
      notifications: [
        {
          id: '1',
          title: 'Welcome to Aether',
          message: 'Your workspace is ready. Start creating!',
          type: 'info',
          read: false,
          timestamp: new Date(),
        },
      ],
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: crypto.randomUUID(),
            timestamp: new Date(),
            read: false,
          },
          ...state.notifications,
        ],
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),
      clearNotifications: () => set({ notifications: [] }),
      
      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),
    }),
    {
      name: 'aether-workspace',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        enabledModules: state.enabledModules,
      }),
    }
  )
);
