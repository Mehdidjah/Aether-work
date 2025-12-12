import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  FileText, 
  Star, 
  MoreHorizontal, 
  Clock,
  Users,
  Folder,
  Trash2,
  Copy,
  Share2,
  Archive,
  Edit3,
  Eye,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Filter,
  FolderPlus,
  Download,
  Upload,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { staggerContainer, staggerItem } from '@/lib/motion';

interface Document {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  lastEdited: string;
  createdAt: string;
  starred: boolean;
  archived: boolean;
  collaborators: number;
  folder?: string;
  tags: string[];
  version: number;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Q4 Product Roadmap',
    excerpt: 'Strategic planning for upcoming features and releases...',
    content: 'This document outlines the strategic planning for Q4...',
    lastEdited: '2 min ago',
    createdAt: '2024-10-01',
    starred: true,
    archived: false,
    collaborators: 4,
    folder: 'Planning',
    tags: ['strategy', 'roadmap'],
    version: 3,
  },
  {
    id: '2',
    title: 'Design System Guidelines',
    excerpt: 'Component library documentation and usage patterns...',
    content: 'Our design system is built on the following principles...',
    lastEdited: '1 hour ago',
    createdAt: '2024-09-15',
    starred: true,
    archived: false,
    collaborators: 2,
    folder: 'Design',
    tags: ['design', 'components'],
    version: 7,
  },
  {
    id: '3',
    title: 'API Documentation',
    excerpt: 'REST endpoints, authentication, and response schemas...',
    content: 'API endpoints follow RESTful conventions...',
    lastEdited: '3 hours ago',
    createdAt: '2024-08-20',
    starred: false,
    archived: false,
    collaborators: 3,
    folder: 'Engineering',
    tags: ['api', 'backend'],
    version: 12,
  },
  {
    id: '4',
    title: 'Meeting Notes - Sprint 23',
    excerpt: 'Key decisions and action items from the sprint review...',
    content: 'Sprint 23 focused on performance improvements...',
    lastEdited: 'Yesterday',
    createdAt: '2024-11-28',
    starred: false,
    archived: false,
    collaborators: 6,
    folder: 'Meetings',
    tags: ['meeting', 'sprint'],
    version: 1,
  },
  {
    id: '5',
    title: 'Onboarding Guide',
    excerpt: 'Step-by-step guide for new team members...',
    content: 'Welcome to the team! This guide will help you...',
    lastEdited: '2 days ago',
    createdAt: '2024-06-01',
    starred: false,
    archived: false,
    collaborators: 1,
    folder: 'HR',
    tags: ['onboarding', 'guide'],
    version: 5,
  },
  {
    id: '6',
    title: 'Brand Guidelines',
    excerpt: 'Logo usage, color palette, and typography standards...',
    content: 'Our brand represents innovation and reliability...',
    lastEdited: '1 week ago',
    createdAt: '2024-05-10',
    starred: false,
    archived: true,
    collaborators: 2,
    folder: 'Design',
    tags: ['brand', 'design'],
    version: 2,
  },
];

const folders = ['Planning', 'Design', 'Engineering', 'HR', 'Meetings', 'Marketing'];

type ViewMode = 'grid' | 'list';
type SortField = 'title' | 'lastEdited' | 'createdAt';
type SortOrder = 'asc' | 'desc';
type TabView = 'all' | 'starred' | 'archived';

export default function DocsPage() {
  const [documents, setDocuments] = useState(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('lastEdited');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterFolder, setFilterFolder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabView>('all');
  const [isNewDocOpen, setIsNewDocOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [newDoc, setNewDoc] = useState({ title: '', excerpt: '', folder: '', tags: '' });

  const filteredDocs = documents
    .filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFolder = !filterFolder || doc.folder === filterFolder;
      const matchesTab = activeTab === 'all' ? !doc.archived : 
        activeTab === 'starred' ? doc.starred && !doc.archived : 
        doc.archived;
      return matchesSearch && matchesFolder && matchesTab;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const order = sortOrder === 'asc' ? 1 : -1;
      return aVal > bVal ? order : -order;
    });

  const toggleStar = (id: string) => {
    setDocuments(docs => 
      docs.map(doc => doc.id === id ? { ...doc, starred: !doc.starred } : doc)
    );
    const doc = documents.find(d => d.id === id);
    toast.success(doc?.starred ? 'Removed from starred' : 'Added to starred');
  };

  const archiveDoc = (id: string) => {
    setDocuments(docs => 
      docs.map(doc => doc.id === id ? { ...doc, archived: !doc.archived } : doc)
    );
    toast.success('Document archived');
  };

  const duplicateDoc = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      const newDocument: Document = {
        ...doc,
        id: Date.now().toString(),
        title: `${doc.title} (Copy)`,
        lastEdited: 'Just now',
        version: 1,
      };
      setDocuments(prev => [newDocument, ...prev]);
      toast.success('Document duplicated');
    }
  };

  const deleteDoc = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast.success('Document deleted');
  };

  const createNewDoc = () => {
    if (!newDoc.title.trim()) {
      toast.error('Title is required');
      return;
    }
    const document: Document = {
      id: Date.now().toString(),
      title: newDoc.title,
      excerpt: newDoc.excerpt || 'No description',
      content: '',
      lastEdited: 'Just now',
      createdAt: new Date().toISOString().split('T')[0],
      starred: false,
      archived: false,
      collaborators: 1,
      folder: newDoc.folder || undefined,
      tags: newDoc.tags.split(',').map(t => t.trim()).filter(Boolean),
      version: 1,
    };
    setDocuments(prev => [document, ...prev]);
    setNewDoc({ title: '', excerpt: '', folder: '', tags: '' });
    setIsNewDocOpen(false);
    toast.success('Document created');
  };

  const openEditDialog = (doc: Document) => {
    setEditingDoc(doc);
    setIsEditOpen(true);
  };

  const saveEdit = () => {
    if (editingDoc) {
      setDocuments(prev => 
        prev.map(doc => doc.id === editingDoc.id ? { 
          ...editingDoc, 
          lastEdited: 'Just now',
          version: doc.version + 1 
        } : doc)
      );
      setIsEditOpen(false);
      setEditingDoc(null);
      toast.success('Document updated');
    }
  };

  const moveToFolder = (docId: string, folder: string) => {
    setDocuments(prev => 
      prev.map(doc => doc.id === docId ? { ...doc, folder } : doc)
    );
    toast.success(`Moved to ${folder}`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Docs</h1>
          <p className="text-muted-foreground">Create and collaborate on documents</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => toast.info('Import feature coming soon')}>
            <Upload className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => toast.info('Create folder feature coming soon')}>
            <FolderPlus className="h-4 w-4" />
            <span className="hidden sm:inline">New Folder</span>
          </Button>
          <Button className="gap-2" onClick={() => setIsNewDocOpen(true)}>
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterFolder || 'all'} onValueChange={(v) => setFilterFolder(v === 'all' ? null : v)}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Folders</SelectItem>
              {folders.map(folder => (
                <SelectItem key={folder} value={folder}>{folder}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { setSortField('title'); setSortOrder('asc'); }}>
                Name (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortField('title'); setSortOrder('desc'); }}>
                Name (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortField('lastEdited'); setSortOrder('desc'); }}>
                Recently Edited
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortField('createdAt'); setSortOrder('desc'); }}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortField('createdAt'); setSortOrder('asc'); }}>
                Oldest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button 
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
              size="icon-sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
              size="icon-sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabView)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="starred">
            <Star className="h-3 w-3 mr-1" />
            Starred
          </TabsTrigger>
          <TabsTrigger value="archived">
            <Archive className="h-3 w-3 mr-1" />
            Archived
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'flex flex-col gap-2'
        }
      >
        <AnimatePresence>
          {filteredDocs.map((doc) => (
            viewMode === 'grid' ? (
              <DocumentCard 
                key={doc.id} 
                document={doc} 
                onToggleStar={() => toggleStar(doc.id)}
                onArchive={() => archiveDoc(doc.id)}
                onDuplicate={() => duplicateDoc(doc.id)}
                onDelete={() => deleteDoc(doc.id)}
                onEdit={() => openEditDialog(doc)}
                onMoveToFolder={(folder) => moveToFolder(doc.id, folder)}
                isSelected={selectedDoc === doc.id}
                onSelect={() => setSelectedDoc(doc.id)}
                folders={folders}
              />
            ) : (
              <DocumentListItem
                key={doc.id}
                document={doc}
                onToggleStar={() => toggleStar(doc.id)}
                onArchive={() => archiveDoc(doc.id)}
                onDuplicate={() => duplicateDoc(doc.id)}
                onDelete={() => deleteDoc(doc.id)}
                onEdit={() => openEditDialog(doc)}
                isSelected={selectedDoc === doc.id}
                onSelect={() => setSelectedDoc(doc.id)}
              />
            )
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredDocs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">No documents found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try a different search term' : 'Create your first document to get started'}
          </p>
          <Button className="gap-2" onClick={() => setIsNewDocOpen(true)}>
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </motion.div>
      )}

      <Dialog open={isNewDocOpen} onOpenChange={setIsNewDocOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newDoc.title}
                onChange={(e) => setNewDoc(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Document title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt">Description</Label>
              <Textarea
                id="excerpt"
                value={newDoc.excerpt}
                onChange={(e) => setNewDoc(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief description..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="folder">Folder</Label>
              <Select value={newDoc.folder} onValueChange={(v) => setNewDoc(prev => ({ ...prev, folder: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map(folder => (
                    <SelectItem key={folder} value={folder}>{folder}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={newDoc.tags}
                onChange={(e) => setNewDoc(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="design, docs, api"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewDocOpen(false)}>Cancel</Button>
            <Button onClick={createNewDoc}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>
          {editingDoc && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingDoc.title}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-excerpt">Description</Label>
                <Textarea
                  id="edit-excerpt"
                  value={editingDoc.excerpt}
                  onChange={(e) => setEditingDoc({ ...editingDoc, excerpt: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={editingDoc.content}
                  onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value })}
                  className="min-h-[200px]"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <History className="h-4 w-4" />
                Version {editingDoc.version}
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

function DocumentCard({ 
  document, 
  onToggleStar,
  onArchive,
  onDuplicate,
  onDelete,
  onEdit,
  onMoveToFolder,
  isSelected, 
  onSelect,
  folders
}: { 
  document: Document;
  onToggleStar: () => void;
  onArchive: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onMoveToFolder: (folder: string) => void;
  isSelected: boolean;
  onSelect: () => void;
  folders: string[];
}) {
  return (
    <motion.div variants={staggerItem} layout>
      <Card 
        className={`group cursor-pointer transition-all duration-160 hover:shadow-medium hover:border-primary/30 ${isSelected ? 'ring-2 ring-primary' : ''}`}
        onClick={onSelect}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              {document.folder && (
                <Badge variant="secondary" className="text-xs">
                  <Folder className="h-3 w-3 mr-1" />
                  {document.folder}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar();
                }}
              >
                <Star className={`h-4 w-4 ${document.starred ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('Preview coming soon'); }}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('Share coming soon'); }}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
                      <Folder className="h-4 w-4 mr-2" />
                      Move to
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {folders.map(folder => (
                        <DropdownMenuItem 
                          key={folder} 
                          onClick={(e) => { e.stopPropagation(); onMoveToFolder(folder); }}
                        >
                          {folder}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.info('Export coming soon'); }}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(); }}>
                    <Archive className="h-4 w-4 mr-2" />
                    {document.archived ? 'Unarchive' : 'Archive'}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-error" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <h3 className="font-medium text-foreground mb-1 line-clamp-1">{document.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{document.excerpt}</p>
          
          {document.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {document.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {document.lastEdited}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {document.collaborators}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function DocumentListItem({ 
  document, 
  onToggleStar,
  onArchive,
  onDuplicate,
  onDelete,
  onEdit,
  isSelected, 
  onSelect 
}: { 
  document: Document;
  onToggleStar: () => void;
  onArchive: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onEdit: () => void;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.div variants={staggerItem} layout>
      <div 
        className={`group flex items-center gap-4 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}
        onClick={onSelect}
      >
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground truncate">{document.title}</h3>
            {document.starred && <Star className="h-3 w-3 fill-primary text-primary flex-shrink-0" />}
          </div>
          <p className="text-sm text-muted-foreground truncate">{document.excerpt}</p>
        </div>
        {document.folder && (
          <Badge variant="secondary" className="text-xs hidden sm:flex">
            <Folder className="h-3 w-3 mr-1" />
            {document.folder}
          </Badge>
        )}
        <div className="text-xs text-muted-foreground hidden md:block">{document.lastEdited}</div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); onToggleStar(); }}>
            <Star className={`h-4 w-4 ${document.starred ? 'fill-primary text-primary' : ''}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(); }}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-error" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}
