import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Hash, 
  AtSign, 
  Smile, 
  Paperclip,
  MoreHorizontal,
  Users,
  Settings,
  Bell,
  Search,
  Plus,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Channel {
  id: string;
  name: string;
  unread: number;
  type: 'channel' | 'dm';
}

interface Message {
  id: string;
  content: string;
  author: { name: string; initials: string };
  timestamp: string;
  isOwn?: boolean;
}

const channels: Channel[] = [
  { id: '1', name: 'general', unread: 0, type: 'channel' },
  { id: '2', name: 'product', unread: 3, type: 'channel' },
  { id: '3', name: 'engineering', unread: 0, type: 'channel' },
  { id: '4', name: 'design', unread: 1, type: 'channel' },
  { id: '5', name: 'random', unread: 0, type: 'channel' },
];

const directMessages: Channel[] = [
  { id: '6', name: 'Jordan Lee', unread: 2, type: 'dm' },
  { id: '7', name: 'Sam Rivera', unread: 0, type: 'dm' },
  { id: '8', name: 'Taylor Kim', unread: 0, type: 'dm' },
];

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hey team! Just pushed the new design system updates.',
    author: { name: 'Jordan Lee', initials: 'JL' },
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    content: 'Looks great! The new color palette really pops.',
    author: { name: 'Sam Rivera', initials: 'SR' },
    timestamp: '10:32 AM',
  },
  {
    id: '3',
    content: 'Thanks! Let me know if you find any issues with the components.',
    author: { name: 'Jordan Lee', initials: 'JL' },
    timestamp: '10:33 AM',
  },
  {
    id: '4',
    content: 'Will do. I\'m starting to integrate them into the dashboard now.',
    author: { name: 'Alex Chen', initials: 'AC' },
    timestamp: '10:45 AM',
    isOwn: true,
  },
  {
    id: '5',
    content: 'Perfect! The analytics widgets should be ready for review by EOD.',
    author: { name: 'Taylor Kim', initials: 'TK' },
    timestamp: '11:00 AM',
  },
];

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState<Channel>(channels[1]); // product channel
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      author: { name: 'Alex Chen', initials: 'AC' },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simulate typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: 'That sounds great! Keep up the good work. 🎉',
        author: { name: 'Jordan Lee', initials: 'JL' },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="w-64 border-r border-border bg-card/30 flex flex-col"
      >
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10 h-9" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3">
            {/* Channels */}
            <div className="mb-4">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Channels
                </span>
                <Button variant="ghost" size="icon-sm" className="h-5 w-5">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                    activeChannel.id === channel.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Hash className="h-4 w-4" />
                  <span className="flex-1 text-left">{channel.name}</span>
                  {channel.unread > 0 && (
                    <span className="h-5 min-w-[20px] px-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Direct Messages */}
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Direct Messages
                </span>
                <Button variant="ghost" size="icon-sm" className="h-5 w-5">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              {directMessages.map((dm) => (
                <button
                  key={dm.id}
                  onClick={() => setActiveChannel(dm)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors",
                    activeChannel.id === dm.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[8px] bg-accent/20 text-accent-foreground">
                        {dm.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Circle className="h-2 w-2 text-success fill-success absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <span className="flex-1 text-left">{dm.name}</span>
                  {dm.unread > 0 && (
                    <span className="h-5 min-w-[20px] px-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                      {dm.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {activeChannel.type === 'channel' ? (
              <Hash className="h-5 w-5 text-muted-foreground" />
            ) : (
              <AtSign className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="font-semibold text-foreground">{activeChannel.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm">
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex gap-3",
                    message.isOwn && "flex-row-reverse"
                  )}
                >
                  {!message.isOwn && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {message.author.initials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn("max-w-[70%]", message.isOwn && "items-end")}>
                    {!message.isOwn && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {message.author.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp}
                        </span>
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2",
                        message.isOwn
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-secondary text-secondary-foreground rounded-bl-md"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.isOwn && (
                      <span className="text-xs text-muted-foreground mt-1 block text-right">
                        {message.timestamp}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">JL</AvatarFallback>
                  </Avatar>
                  <div className="bg-secondary rounded-2xl px-4 py-2 rounded-bl-md">
                    <div className="flex gap-1">
                      <motion.span
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                      />
                      <motion.span
                        className="w-2 h-2 bg-muted-foreground rounded-full"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Input
              placeholder={`Message #${activeChannel.name}`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Button 
              size="icon" 
              onClick={handleSend}
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
