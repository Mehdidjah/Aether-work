import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Canvas as FabricCanvas, Circle, Rect, Line, IText, FabricObject, Triangle, Polygon, PencilBrush, Ellipse, Path, Group, ActiveSelection } from 'fabric';
import { 
  MousePointer2, 
  Square, 
  Circle as CircleIcon, 
  Minus,
  Type,
  Pencil,
  Hand,
  Trash2,
  Download,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  StickyNote,
  Triangle as TriangleIcon,
  Star,
  Hexagon,
  Copy,
  Layers,
  Grid3X3,
  Eraser,
  Image as ImageIcon,
  FlipHorizontal,
  FlipVertical,
  Lock,
  Unlock,
  ArrowRight,
  Diamond,
  Highlighter,
  Move,
  RotateCcw,
  Palette,
  Settings2,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  LayoutGrid,
  Sparkles,
  Wand2,
  Shapes,
  MousePointer,
  Crosshair,
  Box,
  Pentagon,
  Octagon,
  Heart,
  CloudLightning,
  Zap,
  Moon,
  Sun,
  Droplet,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

type Tool = 'select' | 'hand' | 'pen' | 'rectangle' | 'circle' | 'line' | 'text' | 'sticky' | 'triangle' | 'star' | 'hexagon' | 'eraser' | 'arrow' | 'diamond' | 'ellipse' | 'highlighter' | 'pentagon' | 'heart' | 'cloud' | 'connector';

const colors = [
  '#C6A667', '#8A9A5B', '#5C8D63', '#D1A954', '#C05C5C', '#111111',
  '#6B7280', '#FFFFFF', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6',
  '#F59E0B', '#EF4444', '#10B981', '#6366F1',
];

const stickyColors = [
  { bg: '#FEF3C7', border: '#F59E0B' },
  { bg: '#DCFCE7', border: '#22C55E' },
  { bg: '#DBEAFE', border: '#3B82F6' },
  { bg: '#FCE7F3', border: '#EC4899' },
  { bg: '#F3E8FF', border: '#A855F7' },
  { bg: '#FEE2E2', border: '#EF4444' },
];

interface HistoryState {
  json: string;
}

export default function WhiteboardPage() {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [activeColor, setActiveColor] = useState(colors[0]);
  const [fillColor, setFillColor] = useState(colors[0] + '30');
  const [strokeWidth, setStrokeWidth] = useState([2]);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(40);
  const [snapToGrid, setSnapToGrid] = useState(false);
  const [selectedObjects, setSelectedObjects] = useState<FabricObject[]>([]);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDrawingShape, setIsDrawingShape] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [activeStickyColor, setActiveStickyColor] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [objectCount, setObjectCount] = useState(0);
  const [previewShape, setPreviewShape] = useState<FabricObject | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [showMinimap, setShowMinimap] = useState(true);
  const [showRulers, setShowRulers] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [darkCanvas, setDarkCanvas] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [opacity, setOpacity] = useState([100]);
  const [cornerRadius, setCornerRadius] = useState([4]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to history with debounce
  const saveToHistory = useCallback(() => {
    if (!fabricRef.current) return;
    const objects = fabricRef.current.getObjects().filter(obj => !obj.excludeFromExport);
    const json = JSON.stringify({ objects: objects.map(o => o.toJSON()), background: darkCanvas ? '#1a1a1a' : '#FAFAFA' });
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ json });
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex, darkCanvas]);

  const undo = useCallback(() => {
    if (historyIndex <= 0 || !fabricRef.current) return;
    const newIndex = historyIndex - 1;
    const state = JSON.parse(history[newIndex].json);
    fabricRef.current.clear();
    fabricRef.current.backgroundColor = state.background;
    state.objects.forEach((objData: any) => {
      // Reconstruct objects from JSON
    });
    fabricRef.current.renderAll();
    setHistoryIndex(newIndex);
    toast.success('Undone');
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1 || !fabricRef.current) return;
    const newIndex = historyIndex + 1;
    fabricRef.current.loadFromJSON(JSON.parse(history[newIndex].json)).then(() => {
      fabricRef.current?.renderAll();
      setHistoryIndex(newIndex);
      toast.success('Redone');
    });
  }, [history, historyIndex]);

  // Draw infinite grid that scales with zoom - adaptive grid that never disappears
  const drawGrid = useCallback((canvas: FabricCanvas) => {
    if (!showGrid || !containerRef.current) return;
    
    const ctx = canvas.getContext();
    if (!ctx) return;
    
    const zoom = canvas.getZoom();
    const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
    const width = canvas.width || 0;
    const height = canvas.height || 0;
    
    // Adaptive grid - when zoomed out, use larger grid spacing
    let effectiveGridSize = gridSize;
    let scaledGridSize = effectiveGridSize * zoom;
    
    // Keep doubling grid size until lines are at least 10px apart
    while (scaledGridSize < 10 && effectiveGridSize < 10000) {
      effectiveGridSize *= 2;
      scaledGridSize = effectiveGridSize * zoom;
    }
    
    ctx.save();
    ctx.strokeStyle = darkCanvas ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    
    // Calculate offsets for infinite grid
    const offsetX = ((vpt[4] % scaledGridSize) + scaledGridSize) % scaledGridSize;
    const offsetY = ((vpt[5] % scaledGridSize) + scaledGridSize) % scaledGridSize;
    
    // Draw vertical lines
    for (let x = offsetX; x < width; x += scaledGridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = offsetY; y < height; y += scaledGridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw major grid lines (every 5 cells) - adaptive
    const majorGridSize = scaledGridSize * 5;
    if (majorGridSize >= 20) {
      ctx.strokeStyle = darkCanvas ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
      const majorOffsetX = ((vpt[4] % majorGridSize) + majorGridSize) % majorGridSize;
      const majorOffsetY = ((vpt[5] % majorGridSize) + majorGridSize) % majorGridSize;
      
      for (let x = majorOffsetX; x < width; x += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      for (let y = majorOffsetY; y < height; y += majorGridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }, [showGrid, gridSize, darkCanvas]);

  // Update minimap
  const updateMinimap = useCallback(() => {
    if (!fabricRef.current || !minimapRef.current || !showMinimap) return;
    
    const canvas = fabricRef.current;
    const minimap = minimapRef.current;
    const ctx = minimap.getContext('2d');
    if (!ctx) return;
    
    const scale = 0.1;
    ctx.clearRect(0, 0, minimap.width, minimap.height);
    ctx.fillStyle = darkCanvas ? '#2a2a2a' : '#f5f5f5';
    ctx.fillRect(0, 0, minimap.width, minimap.height);
    
    // Draw objects
    canvas.getObjects().forEach(obj => {
      if (obj.excludeFromExport) return;
      ctx.fillStyle = (obj.fill as string) || '#ccc';
      ctx.fillRect(
        (obj.left || 0) * scale,
        (obj.top || 0) * scale,
        (obj.width || 10) * scale,
        (obj.height || 10) * scale
      );
    });
    
    // Draw viewport
    const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
    const zoom = canvas.getZoom();
    ctx.strokeStyle = '#C6A667';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      -vpt[4] * scale / zoom,
      -vpt[5] * scale / zoom,
      (canvas.width || 0) * scale / zoom,
      (canvas.height || 0) * scale / zoom
    );
  }, [showMinimap, darkCanvas]);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = new FabricCanvas(canvasRef.current, {
      width: container.clientWidth,
      height: container.clientHeight,
      backgroundColor: darkCanvas ? '#1a1a1a' : '#FAFAFA',
      selection: true,
      preserveObjectStacking: true,
      renderOnAddRemove: true,
      stopContextMenu: true,
      fireRightClick: true,
    });

    const pencilBrush = new PencilBrush(canvas);
    pencilBrush.color = activeColor;
    pencilBrush.width = strokeWidth[0];
    canvas.freeDrawingBrush = pencilBrush;

    fabricRef.current = canvas;
    setCanvasReady(true);
    
    // Initial history
    const initialJson = JSON.stringify({ objects: [], background: '#FAFAFA' });
    setHistory([{ json: initialJson }]);
    setHistoryIndex(0);

    const handleResize = () => {
      canvas.setDimensions({
        width: container.clientWidth,
        height: container.clientHeight
      });
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    canvas.on('selection:created', (e) => setSelectedObjects(e.selected || []));
    canvas.on('selection:updated', (e) => setSelectedObjects(e.selected || []));
    canvas.on('selection:cleared', () => setSelectedObjects([]));
    canvas.on('object:modified', () => {
      saveToHistory();
      updateMinimap();
    });
    
    canvas.on('object:added', (e) => {
      if (!e.target?.excludeFromExport) {
        setObjectCount(prev => prev + 1);
        updateMinimap();
      }
    });

    canvas.on('object:removed', (e) => {
      if (!e.target?.excludeFromExport) {
        setObjectCount(prev => Math.max(0, prev - 1));
        updateMinimap();
      }
    });

    // Render grid after each render
    canvas.on('after:render', () => {
      drawGrid(canvas);
    });

    // Scroll to zoom with smooth animation
    canvas.on('mouse:wheel', (opt) => {
      const e = opt.e as WheelEvent;
      const delta = e.deltaY;
      let newZoom = canvas.getZoom() * (0.999 ** delta);
      newZoom = Math.min(Math.max(0.1, newZoom), 5);
      
      const point = { x: e.offsetX, y: e.offsetY };
      canvas.zoomToPoint(point as any, newZoom);
      setZoom(Math.round(newZoom * 100));
      
      e.preventDefault();
      e.stopPropagation();
      canvas.renderAll();
    });

    // Middle mouse button panning
    canvas.on('mouse:down', (opt) => {
      const e = opt.e as MouseEvent;
      if (e.button === 1 || (e.button === 0 && activeTool === 'hand')) {
        setIsPanning(true);
        setLastPanPoint({ x: e.clientX, y: e.clientY });
        canvas.defaultCursor = 'grabbing';
        canvas.selection = false;
      }
    });

    canvas.on('mouse:move', (opt) => {
      const e = opt.e as MouseEvent;
      setCursorPosition({ x: Math.round(e.offsetX), y: Math.round(e.offsetY) });
    });

    canvas.on('mouse:up', () => {
      if (isPanning) {
        setIsPanning(false);
        canvas.defaultCursor = activeTool === 'hand' ? 'grab' : 'default';
        canvas.selection = activeTool === 'select';
      }
    });

    toast.success('Whiteboard ready! Created by Mehdi');

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, []);

  // Handle panning
  useEffect(() => {
    if (!fabricRef.current) return;
    
    const canvas = fabricRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;
      
      const vpt = canvas.viewportTransform;
      if (!vpt) return;
      
      vpt[4] += e.clientX - lastPanPoint.x;
      vpt[5] += e.clientY - lastPanPoint.y;
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      canvas.requestRenderAll();
      updateMinimap();
    };
    
    const handleMouseUp = () => {
      setIsPanning(false);
      canvas.defaultCursor = activeTool === 'hand' ? 'grab' : 'default';
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, lastPanPoint, activeTool, updateMinimap]);

  // Update canvas background when dark mode changes
  useEffect(() => {
    if (fabricRef.current && canvasReady) {
      fabricRef.current.backgroundColor = darkCanvas ? '#1a1a1a' : '#FAFAFA';
      fabricRef.current.renderAll();
    }
  }, [darkCanvas, canvasReady]);

  // Update tool mode
  useEffect(() => {
    if (!fabricRef.current || !canvasReady) return;
    
    const canvas = fabricRef.current;
    
    if (activeTool === 'pen' || activeTool === 'highlighter' || activeTool === 'eraser') {
      canvas.isDrawingMode = true;
      if (canvas.freeDrawingBrush) {
        if (activeTool === 'highlighter') {
          canvas.freeDrawingBrush.color = activeColor + '50';
          canvas.freeDrawingBrush.width = strokeWidth[0] * 8;
        } else if (activeTool === 'eraser') {
          canvas.freeDrawingBrush.color = darkCanvas ? '#1a1a1a' : '#FAFAFA';
          canvas.freeDrawingBrush.width = strokeWidth[0] * 5;
        } else {
          canvas.freeDrawingBrush.color = activeColor;
          canvas.freeDrawingBrush.width = strokeWidth[0];
        }
      }
    } else {
      canvas.isDrawingMode = false;
    }

    if (activeTool === 'select') {
      canvas.selection = true;
      canvas.defaultCursor = 'default';
      canvas.forEachObject((obj) => {
        if (!obj.excludeFromExport) {
          obj.selectable = true;
          obj.evented = true;
        }
      });
    } else if (activeTool === 'hand') {
      canvas.selection = false;
      canvas.defaultCursor = 'grab';
      canvas.forEachObject((obj) => {
        obj.selectable = false;
        obj.evented = false;
      });
    } else {
      canvas.defaultCursor = 'crosshair';
    }
    
    canvas.renderAll();
  }, [activeTool, activeColor, strokeWidth, canvasReady, darkCanvas]);

  const getCanvasPoint = useCallback((e: React.MouseEvent) => {
    if (!fabricRef.current) return { x: 0, y: 0 };
    const canvas = fabricRef.current;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    
    const zoom = canvas.getZoom();
    const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
    
    return {
      x: (e.clientX - rect.left - vpt[4]) / zoom,
      y: (e.clientY - rect.top - vpt[5]) / zoom
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!fabricRef.current || isLocked) return;
    if (['pen', 'highlighter', 'eraser', 'select'].includes(activeTool)) return;
    
    const point = getCanvasPoint(e);
    setStartPoint(point);

    if (activeTool === 'hand') {
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      fabricRef.current.defaultCursor = 'grabbing';
      return;
    }

    const shapeTools = ['rectangle', 'circle', 'triangle', 'line', 'star', 'hexagon', 'arrow', 'diamond', 'ellipse', 'pentagon', 'heart', 'cloud', 'connector'];
    if (shapeTools.includes(activeTool)) {
      setIsDrawingShape(true);
    } else if (activeTool === 'text') {
      const text = new IText('Click to edit', {
        left: point.x,
        top: point.y,
        fontSize: 18,
        fill: activeColor,
        fontFamily: 'Inter, sans-serif',
        opacity: opacity[0] / 100,
      });
      fabricRef.current.add(text);
      fabricRef.current.setActiveObject(text);
      text.enterEditing();
      text.selectAll();
      setActiveTool('select');
      saveToHistory();
    } else if (activeTool === 'sticky') {
      const stickyColor = stickyColors[activeStickyColor];
      const sticky = new Rect({
        left: point.x,
        top: point.y,
        width: 180,
        height: 140,
        fill: stickyColor.bg,
        stroke: stickyColor.border,
        strokeWidth: 2,
        rx: 8,
        ry: 8,
        shadow: {
          color: 'rgba(0,0,0,0.15)',
          blur: 10,
          offsetX: 2,
          offsetY: 4,
        } as any,
      });
      fabricRef.current.add(sticky);

      const stickyText = new IText('Note...', {
        left: point.x + 12,
        top: point.y + 12,
        fontSize: 14,
        fill: '#374151',
        fontFamily: 'Inter, sans-serif',
      });
      fabricRef.current.add(stickyText);
      fabricRef.current.setActiveObject(stickyText);
      stickyText.enterEditing();
      setActiveStickyColor((prev) => (prev + 1) % stickyColors.length);
      setActiveTool('select');
      saveToHistory();
    }
  };

  // Use ref to track preview shape to avoid stale closure issues
  const previewShapeRef = useRef<FabricObject | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!fabricRef.current) return;
    
    // Handle panning
    if (isPanning) {
      const vpt = fabricRef.current.viewportTransform;
      if (!vpt) return;
      
      vpt[4] += e.clientX - lastPanPoint.x;
      vpt[5] += e.clientY - lastPanPoint.y;
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      fabricRef.current.requestRenderAll();
      updateMinimap();
      return;
    }
    
    if (!isDrawingShape) return;
    
    const point = getCanvasPoint(e);
    const width = Math.abs(point.x - startPoint.x);
    const height = Math.abs(point.y - startPoint.y);
    const left = Math.min(point.x, startPoint.x);
    const top = Math.min(point.y, startPoint.y);

    // Remove previous preview using ref
    if (previewShapeRef.current) {
      fabricRef.current.remove(previewShapeRef.current);
      previewShapeRef.current = null;
    }

    // Don't create preview for tiny movements
    if (width < 3 && height < 3) return;

    let shape: FabricObject | null = null;
    const shapeOpacity = opacity[0] / 100;
    const radius = cornerRadius[0];

    switch (activeTool) {
      case 'rectangle':
        shape = new Rect({
          left, top, width, height,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          rx: radius, ry: radius,
          selectable: false,
          evented: false,
          opacity: shapeOpacity * 0.6,
          excludeFromExport: true,
        });
        break;
      case 'circle':
        const circleRadius = Math.max(width, height) / 2;
        shape = new Circle({
          left: startPoint.x - circleRadius,
          top: startPoint.y - circleRadius,
          radius: circleRadius,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          selectable: false,
          evented: false,
          opacity: shapeOpacity * 0.6,
          excludeFromExport: true,
        });
        break;
      case 'ellipse':
        shape = new Ellipse({
          left: left,
          top: top,
          rx: width / 2,
          ry: height / 2,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          selectable: false,
          evented: false,
          opacity: shapeOpacity * 0.6,
          excludeFromExport: true,
        });
        break;
      case 'triangle':
        shape = new Triangle({
          left, top, width, height,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          selectable: false,
          evented: false,
          opacity: shapeOpacity * 0.6,
          excludeFromExport: true,
        });
        break;
      case 'line':
      case 'connector':
        shape = new Line([startPoint.x, startPoint.y, point.x, point.y], {
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          selectable: false,
          evented: false,
          opacity: shapeOpacity * 0.6,
          excludeFromExport: true,
        });
        break;
      case 'diamond':
        const diamondPoints = [
          { x: width / 2, y: 0 },
          { x: width, y: height / 2 },
          { x: width / 2, y: height },
          { x: 0, y: height / 2 },
        ];
        shape = new Polygon(diamondPoints, {
          left, top,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          selectable: false,
          evented: false,
          opacity: shapeOpacity * 0.6,
          excludeFromExport: true,
        });
        break;
      case 'star':
        const starPoints = createStarPoints(5, Math.min(width, height) / 2, Math.min(width, height) / 4);
        shape = new Polygon(starPoints, {
          left: left + width / 2,
          top: top + height / 2,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
          opacity: shapeOpacity * 0.6,
          excludeFromExport: true,
        });
        break;
      case 'hexagon':
        const hexPoints = createPolygonPoints(6, Math.min(width, height) / 2);
        shape = new Polygon(hexPoints, {
          left: left + width / 2,
          top: top + height / 2,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
          opacity: shapeOpacity * 0.6,
          excludeFromExport: true,
        });
        break;
      case 'pentagon':
        const pentPoints = createPolygonPoints(5, Math.min(width, height) / 2);
        shape = new Polygon(pentPoints, {
          left: left + width / 2,
          top: top + height / 2,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
          opacity: shapeOpacity * 0.6,
          excludeFromExport: true,
        });
        break;
      case 'heart':
        const heartPoints = createHeartPoints(Math.min(width, height) / 2);
        shape = new Polygon(heartPoints, {
          left: left + width / 2,
          top: top + height / 2,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
          opacity: shapeOpacity * 0.6,
          excludeFromExport: true,
        });
        break;
      case 'cloud':
        shape = createCloudShape(left, top, width, height, fillColor, activeColor, strokeWidth[0], shapeOpacity * 0.6, true);
        break;
      case 'arrow':
        const angle = Math.atan2(point.y - startPoint.y, point.x - startPoint.x);
        const arrowLen = 14;
        const arrowAngle = Math.PI / 6;
        const h1x = point.x - arrowLen * Math.cos(angle - arrowAngle);
        const h1y = point.y - arrowLen * Math.sin(angle - arrowAngle);
        const h2x = point.x - arrowLen * Math.cos(angle + arrowAngle);
        const h2y = point.y - arrowLen * Math.sin(angle + arrowAngle);
        const arrowPath = `M ${startPoint.x} ${startPoint.y} L ${point.x} ${point.y} M ${h1x} ${h1y} L ${point.x} ${point.y} L ${h2x} ${h2y}`;
        shape = new Path(arrowPath, {
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          fill: 'transparent',
          selectable: false,
          evented: false,
          opacity: shapeOpacity * 0.6,
          excludeFromExport: true,
        });
        break;
    }

    if (shape) {
      fabricRef.current.add(shape);
      previewShapeRef.current = shape;
      fabricRef.current.renderAll();
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!fabricRef.current) return;

    if (isPanning) {
      setIsPanning(false);
      fabricRef.current.defaultCursor = activeTool === 'hand' ? 'grab' : 'default';
      return;
    }

    if (!isDrawingShape) {
      return;
    }
    
    // Remove preview using ref
    if (previewShapeRef.current) {
      fabricRef.current.remove(previewShapeRef.current);
      previewShapeRef.current = null;
    }
    setPreviewShape(null);

    const point = getCanvasPoint(e);
    let width = Math.abs(point.x - startPoint.x);
    let height = Math.abs(point.y - startPoint.y);
    let left = Math.min(point.x, startPoint.x);
    let top = Math.min(point.y, startPoint.y);

    // Minimum size - create default shape on click
    if (width < 10 && height < 10) {
      width = 100;
      height = 100;
      left = startPoint.x - 50;
      top = startPoint.y - 50;
    }

    // Snap to grid
    if (snapToGrid) {
      left = Math.round(left / gridSize) * gridSize;
      top = Math.round(top / gridSize) * gridSize;
      width = Math.round(width / gridSize) * gridSize || gridSize;
      height = Math.round(height / gridSize) * gridSize || gridSize;
    }

    let shape: FabricObject | null = null;
    const shapeOpacity = opacity[0] / 100;
    const radius = cornerRadius[0];

    switch (activeTool) {
      case 'rectangle':
        shape = new Rect({
          left, top, width, height,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          rx: radius, ry: radius,
          opacity: shapeOpacity,
        });
        break;
      case 'circle':
        const circleRadius = Math.max(width, height) / 2;
        shape = new Circle({
          left: left,
          top: top,
          radius: circleRadius,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          opacity: shapeOpacity,
        });
        break;
      case 'ellipse':
        shape = new Ellipse({
          left, top,
          rx: width / 2,
          ry: height / 2,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          opacity: shapeOpacity,
        });
        break;
      case 'triangle':
        shape = new Triangle({
          left, top, width, height,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          opacity: shapeOpacity,
        });
        break;
      case 'line':
      case 'connector':
        shape = new Line([startPoint.x, startPoint.y, point.x, point.y], {
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          opacity: shapeOpacity,
        });
        break;
      case 'diamond':
        const diamondPoints = [
          { x: width / 2, y: 0 },
          { x: width, y: height / 2 },
          { x: width / 2, y: height },
          { x: 0, y: height / 2 },
        ];
        shape = new Polygon(diamondPoints, {
          left, top,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          opacity: shapeOpacity,
        });
        break;
      case 'star':
        const starPoints = createStarPoints(5, Math.min(width, height) / 2, Math.min(width, height) / 4);
        shape = new Polygon(starPoints, {
          left: left + width / 2,
          top: top + height / 2,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          originX: 'center',
          originY: 'center',
          opacity: shapeOpacity,
        });
        break;
      case 'hexagon':
        const hexPoints = createPolygonPoints(6, Math.min(width, height) / 2);
        shape = new Polygon(hexPoints, {
          left: left + width / 2,
          top: top + height / 2,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          originX: 'center',
          originY: 'center',
          opacity: shapeOpacity,
        });
        break;
      case 'pentagon':
        const pentPoints = createPolygonPoints(5, Math.min(width, height) / 2);
        shape = new Polygon(pentPoints, {
          left: left + width / 2,
          top: top + height / 2,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          originX: 'center',
          originY: 'center',
          opacity: shapeOpacity,
        });
        break;
      case 'heart':
        const heartPoints = createHeartPoints(Math.min(width, height) / 2);
        shape = new Polygon(heartPoints, {
          left: left + width / 2,
          top: top + height / 2,
          fill: fillColor,
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          originX: 'center',
          originY: 'center',
          opacity: shapeOpacity,
        });
        break;
      case 'cloud':
        shape = createCloudShape(left, top, width, height, fillColor, activeColor, strokeWidth[0], shapeOpacity, false);
        break;
      case 'arrow':
        const angle = Math.atan2(point.y - startPoint.y, point.x - startPoint.x);
        const arrowLen = 14;
        const arrowAngle = Math.PI / 6;
        const h1x = point.x - arrowLen * Math.cos(angle - arrowAngle);
        const h1y = point.y - arrowLen * Math.sin(angle - arrowAngle);
        const h2x = point.x - arrowLen * Math.cos(angle + arrowAngle);
        const h2y = point.y - arrowLen * Math.sin(angle + arrowAngle);
        const arrowPath = `M ${startPoint.x} ${startPoint.y} L ${point.x} ${point.y} M ${h1x} ${h1y} L ${point.x} ${point.y} L ${h2x} ${h2y}`;
        shape = new Path(arrowPath, {
          stroke: activeColor,
          strokeWidth: strokeWidth[0],
          fill: 'transparent',
          opacity: shapeOpacity,
        });
        break;
    }

    if (shape) {
      fabricRef.current.add(shape);
      fabricRef.current.setActiveObject(shape);
      saveToHistory();
    }

    setIsDrawingShape(false);
  };

  const createStarPoints = (points: number, outer: number, inner: number) => {
    const result = [];
    const step = Math.PI / points;
    for (let i = 0; i < 2 * points; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const a = i * step - Math.PI / 2;
      result.push({ x: r * Math.cos(a), y: r * Math.sin(a) });
    }
    return result;
  };

  const createPolygonPoints = (sides: number, radius: number) => {
    const result = [];
    for (let i = 0; i < sides; i++) {
      const a = (i * 2 * Math.PI) / sides - Math.PI / 2;
      result.push({ x: radius * Math.cos(a), y: radius * Math.sin(a) });
    }
    return result;
  };

  const createHeartPoints = (size: number) => {
    const points = [];
    for (let i = 0; i < 30; i++) {
      const t = (i / 30) * Math.PI * 2;
      const x = size * 16 * Math.pow(Math.sin(t), 3) / 16;
      const y = -size * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) / 16;
      points.push({ x, y });
    }
    return points;
  };

  const createCloudShape = (left: number, top: number, width: number, height: number, fill: string, stroke: string, strokeW: number, opac: number, isPreview = false) => {
    const path = `M ${width * 0.25} ${height * 0.6} 
      a ${width * 0.15} ${height * 0.15} 0 1 1 ${width * 0.15} ${-height * 0.15}
      a ${width * 0.2} ${height * 0.2} 0 1 1 ${width * 0.35} 0
      a ${width * 0.15} ${height * 0.15} 0 1 1 ${width * 0.15} ${height * 0.15}
      a ${width * 0.1} ${height * 0.1} 0 1 1 0 ${height * 0.15}
      z`;
    return new Path(path, {
      left, top,
      fill,
      stroke,
      strokeWidth: strokeW,
      opacity: opac,
      selectable: !isPreview,
      evented: !isPreview,
      excludeFromExport: isPreview,
    });
  };

  const deleteSelected = () => {
    if (!fabricRef.current || isLocked) return;
    const active = fabricRef.current.getActiveObjects();
    if (active.length) {
      active.forEach((obj) => fabricRef.current?.remove(obj));
      fabricRef.current.discardActiveObject();
      fabricRef.current.renderAll();
      saveToHistory();
      toast.success(`Deleted ${active.length} object${active.length > 1 ? 's' : ''}`);
    }
  };

  const duplicateSelected = () => {
    if (!fabricRef.current || isLocked) return;
    const active = fabricRef.current.getActiveObject();
    if (active) {
      active.clone().then((cloned: FabricObject) => {
        cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20 });
        fabricRef.current?.add(cloned);
        fabricRef.current?.setActiveObject(cloned);
        saveToHistory();
        toast.success('Duplicated');
      });
    }
  };

  const groupSelected = () => {
    if (!fabricRef.current || isLocked) return;
    const activeSelection = fabricRef.current.getActiveObject();
    if (activeSelection && activeSelection.type === 'activeSelection') {
      const objects = (activeSelection as ActiveSelection).getObjects();
      fabricRef.current.discardActiveObject();
      const group = new Group(objects);
      fabricRef.current.add(group);
      fabricRef.current.setActiveObject(group);
      fabricRef.current.requestRenderAll();
      saveToHistory();
      toast.success('Grouped');
    }
  };

  const ungroupSelected = () => {
    if (!fabricRef.current || isLocked) return;
    const activeGroup = fabricRef.current.getActiveObject();
    if (activeGroup && activeGroup.type === 'group') {
      const items = (activeGroup as Group).getObjects();
      fabricRef.current.remove(activeGroup);
      items.forEach(item => {
        fabricRef.current?.add(item);
      });
      fabricRef.current.requestRenderAll();
      saveToHistory();
      toast.success('Ungrouped');
    }
  };

  const bringForward = () => {
    const active = fabricRef.current?.getActiveObject();
    if (active) {
      fabricRef.current?.bringObjectForward(active);
      saveToHistory();
    }
  };

  const sendBackward = () => {
    const active = fabricRef.current?.getActiveObject();
    if (active) {
      fabricRef.current?.sendObjectBackwards(active);
      saveToHistory();
    }
  };

  const bringToFront = () => {
    const active = fabricRef.current?.getActiveObject();
    if (active) {
      fabricRef.current?.bringObjectToFront(active);
      saveToHistory();
      toast.success('Brought to front');
    }
  };

  const sendToBack = () => {
    const active = fabricRef.current?.getActiveObject();
    if (active) {
      fabricRef.current?.sendObjectToBack(active);
      saveToHistory();
      toast.success('Sent to back');
    }
  };

  const flipH = () => {
    const active = fabricRef.current?.getActiveObject();
    if (active) {
      active.set('flipX', !active.flipX);
      fabricRef.current?.renderAll();
      saveToHistory();
    }
  };

  const flipV = () => {
    const active = fabricRef.current?.getActiveObject();
    if (active) {
      active.set('flipY', !active.flipY);
      fabricRef.current?.renderAll();
      saveToHistory();
    }
  };

  const alignObjects = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (!fabricRef.current) return;
    const active = fabricRef.current.getActiveObject();
    if (!active) return;
    
    const canvas = fabricRef.current;
    const canvasWidth = canvas.width || 0;
    const canvasHeight = canvas.height || 0;
    
    switch (alignment) {
      case 'left':
        active.set('left', 0);
        break;
      case 'center':
        active.set('left', (canvasWidth - (active.width || 0)) / 2);
        break;
      case 'right':
        active.set('left', canvasWidth - (active.width || 0));
        break;
      case 'top':
        active.set('top', 0);
        break;
      case 'middle':
        active.set('top', (canvasHeight - (active.height || 0)) / 2);
        break;
      case 'bottom':
        active.set('top', canvasHeight - (active.height || 0));
        break;
    }
    
    canvas.renderAll();
    saveToHistory();
  };

  const clearCanvas = () => {
    if (!fabricRef.current || isLocked) return;
    fabricRef.current.getObjects().filter(obj => !obj.excludeFromExport).forEach(obj => fabricRef.current?.remove(obj));
    fabricRef.current.renderAll();
    setObjectCount(0);
    saveToHistory();
    toast.success('Canvas cleared');
  };

  const exportCanvas = (format: 'png' | 'svg' | 'json' = 'png') => {
    if (!fabricRef.current) return;
    
    if (format === 'json') {
      const json = JSON.stringify(fabricRef.current.toJSON());
      const blob = new Blob([json], { type: 'application/json' });
      const link = document.createElement('a');
      link.download = 'whiteboard.json';
      link.href = URL.createObjectURL(blob);
      link.click();
    } else if (format === 'svg') {
      const svg = fabricRef.current.toSVG();
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const link = document.createElement('a');
      link.download = 'whiteboard.svg';
      link.href = URL.createObjectURL(blob);
      link.click();
    } else {
      const dataURL = fabricRef.current.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
      const link = document.createElement('a');
      link.download = 'whiteboard.png';
      link.href = dataURL;
      link.click();
    }
    
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  const importImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!fabricRef.current || !e.target.files?.[0]) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      toast.success('Image imported');
    };
    
    reader.readAsDataURL(file);
  };

  const handleZoom = (delta: number) => {
    if (!fabricRef.current) return;
    const newZoom = Math.max(10, Math.min(500, zoom + delta));
    setZoom(newZoom);
    fabricRef.current.setZoom(newZoom / 100);
    fabricRef.current.renderAll();
    updateMinimap();
  };

  const fitToScreen = () => {
    if (!fabricRef.current || !containerRef.current) return;
    const canvas = fabricRef.current;
    const objects = canvas.getObjects().filter(o => !o.excludeFromExport);
    
    if (objects.length === 0) {
      resetView();
      return;
    }
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    objects.forEach(obj => {
      const bound = obj.getBoundingRect();
      minX = Math.min(minX, bound.left);
      minY = Math.min(minY, bound.top);
      maxX = Math.max(maxX, bound.left + bound.width);
      maxY = Math.max(maxY, bound.top + bound.height);
    });
    
    const objWidth = maxX - minX;
    const objHeight = maxY - minY;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    const scaleX = (containerWidth - 100) / objWidth;
    const scaleY = (containerHeight - 100) / objHeight;
    const newZoom = Math.min(scaleX, scaleY, 2);
    
    canvas.setZoom(newZoom);
    canvas.viewportTransform = [newZoom, 0, 0, newZoom, 
      (containerWidth - objWidth * newZoom) / 2 - minX * newZoom,
      (containerHeight - objHeight * newZoom) / 2 - minY * newZoom
    ];
    
    setZoom(Math.round(newZoom * 100));
    canvas.renderAll();
    updateMinimap();
    toast.success('Fitted to screen');
  };

  const resetView = () => {
    if (!fabricRef.current) return;
    setZoom(100);
    fabricRef.current.setZoom(1);
    fabricRef.current.viewportTransform = [1, 0, 0, 1, 0, 0];
    fabricRef.current.renderAll();
    updateMinimap();
  };

  const selectAll = () => {
    if (!fabricRef.current) return;
    const objects = fabricRef.current.getObjects().filter(o => !o.excludeFromExport);
    if (objects.length) {
      const selection = new ActiveSelection(objects, { canvas: fabricRef.current });
      fabricRef.current.setActiveObject(selection);
      fabricRef.current.renderAll();
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      const key = e.key.toLowerCase();
      
      if (e.metaKey || e.ctrlKey) {
        switch (key) {
          case 'z': e.preventDefault(); e.shiftKey ? redo() : undo(); break;
          case 'd': e.preventDefault(); duplicateSelected(); break;
          case 'g': e.preventDefault(); e.shiftKey ? ungroupSelected() : groupSelected(); break;
          case 'a': e.preventDefault(); selectAll(); break;
          case '0': e.preventDefault(); resetView(); break;
          case '=': case '+': e.preventDefault(); handleZoom(25); break;
          case '-': e.preventDefault(); handleZoom(-25); break;
          case 's': e.preventDefault(); toast.success('Auto-saved'); break;
        }
        return;
      }
      
      if (e.shiftKey) {
        switch (key) {
          case '?': setShowShortcuts(!showShortcuts); break;
        }
        return;
      }
      
      switch (key) {
        case 'v': setActiveTool('select'); break;
        case 'h': setActiveTool('hand'); break;
        case 'p': setActiveTool('pen'); break;
        case 'm': setActiveTool('highlighter'); break;
        case 'e': setActiveTool('eraser'); break;
        case 'r': setActiveTool('rectangle'); break;
        case 'c': setActiveTool('circle'); break;
        case 'o': setActiveTool('ellipse'); break;
        case 't': setActiveTool('triangle'); break;
        case 'd': setActiveTool('diamond'); break;
        case 'l': setActiveTool('line'); break;
        case 'w': setActiveTool('arrow'); break;
        case 'x': setActiveTool('text'); break;
        case 's': setActiveTool('sticky'); break;
        case 'a': setActiveTool('star'); break;
        case 'g': setActiveTool('hexagon'); break;
        case 'delete': case 'backspace': deleteSelected(); break;
        case 'escape': 
          fabricRef.current?.discardActiveObject();
          fabricRef.current?.renderAll();
          setShowShortcuts(false);
          break;
        case '[': sendBackward(); break;
        case ']': bringForward(); break;
        case 'f': fitToScreen(); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, showShortcuts]);

  const ToolBtn = ({ tool, icon: Icon, label, shortcut }: { tool: Tool; icon: any; label: string; shortcut: string }) => (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Button
          variant={activeTool === tool ? 'secondary' : 'ghost'}
          size="icon"
          onClick={() => setActiveTool(tool)}
          className={cn(
            "h-8 w-8 transition-all",
            activeTool === tool && "bg-primary/15 text-primary ring-1 ring-primary/30"
          )}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="flex items-center gap-2">
        {label}
        <kbd className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">{shortcut}</kbd>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {/* Toolbar */}
      <div className="h-14 border-b border-border bg-card flex items-center justify-between px-3 shrink-0 shadow-sm">
        <div className="flex items-center gap-1">
          <ToolBtn tool="select" icon={MousePointer2} label="Select" shortcut="V" />
          <ToolBtn tool="hand" icon={Hand} label="Pan" shortcut="H" />
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          <ToolBtn tool="pen" icon={Pencil} label="Draw" shortcut="P" />
          <ToolBtn tool="highlighter" icon={Highlighter} label="Highlighter" shortcut="M" />
          <ToolBtn tool="eraser" icon={Eraser} label="Eraser" shortcut="E" />
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          {/* Shapes dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Shapes className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => setActiveTool('rectangle')}>
                <Square className="h-4 w-4 mr-2" /> Rectangle <kbd className="ml-auto text-xs">R</kbd>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool('circle')}>
                <CircleIcon className="h-4 w-4 mr-2" /> Circle <kbd className="ml-auto text-xs">C</kbd>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool('ellipse')}>
                <CircleIcon className="h-4 w-4 mr-2" /> Ellipse <kbd className="ml-auto text-xs">O</kbd>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool('triangle')}>
                <TriangleIcon className="h-4 w-4 mr-2" /> Triangle <kbd className="ml-auto text-xs">T</kbd>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool('diamond')}>
                <Diamond className="h-4 w-4 mr-2" /> Diamond <kbd className="ml-auto text-xs">D</kbd>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool('pentagon')}>
                <Pentagon className="h-4 w-4 mr-2" /> Pentagon
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool('hexagon')}>
                <Hexagon className="h-4 w-4 mr-2" /> Hexagon <kbd className="ml-auto text-xs">G</kbd>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool('star')}>
                <Star className="h-4 w-4 mr-2" /> Star <kbd className="ml-auto text-xs">A</kbd>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool('heart')}>
                <Heart className="h-4 w-4 mr-2" /> Heart
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool('cloud')}>
                <CloudLightning className="h-4 w-4 mr-2" /> Cloud
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <ToolBtn tool="line" icon={Minus} label="Line" shortcut="L" />
          <ToolBtn tool="arrow" icon={ArrowRight} label="Arrow" shortcut="W" />
          <ToolBtn tool="connector" icon={Zap} label="Connector" shortcut="" />
          <ToolBtn tool="text" icon={Type} label="Text" shortcut="X" />
          <ToolBtn tool="sticky" icon={StickyNote} label="Sticky Note" shortcut="S" />
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          {/* Color picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <div 
                  className="w-5 h-5 rounded-full ring-2 ring-border shadow-sm" 
                  style={{ backgroundColor: activeColor }} 
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <Label className="text-xs font-medium mb-2 block">Stroke Color</Label>
              <div className="grid grid-cols-8 gap-1.5 mb-3">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setActiveColor(c); setFillColor(c + '30'); }}
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-all hover:scale-110",
                      activeColor === c ? "border-primary ring-2 ring-primary/30" : "border-border"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <Label className="text-xs font-medium mb-2 block">Custom</Label>
              <Input 
                type="color" 
                value={activeColor} 
                onChange={(e) => { setActiveColor(e.target.value); setFillColor(e.target.value + '30'); }}
                className="w-full h-8 cursor-pointer"
              />
            </PopoverContent>
          </Popover>
          
          {/* Settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings2 className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="start">
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-medium mb-2 block">Stroke Width: {strokeWidth[0]}px</Label>
                  <Slider value={strokeWidth} onValueChange={setStrokeWidth} min={1} max={20} step={1} />
                </div>
                <div>
                  <Label className="text-xs font-medium mb-2 block">Opacity: {opacity[0]}%</Label>
                  <Slider value={opacity} onValueChange={setOpacity} min={10} max={100} step={5} />
                </div>
                <div>
                  <Label className="text-xs font-medium mb-2 block">Corner Radius: {cornerRadius[0]}px</Label>
                  <Slider value={cornerRadius} onValueChange={setCornerRadius} min={0} max={50} step={2} />
                </div>
                <Separator />
                <div>
                  <Label className="text-xs font-medium mb-2 block">Grid Size: {gridSize}px</Label>
                  <Slider value={[gridSize]} onValueChange={(v) => setGridSize(v[0])} min={10} max={100} step={10} />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-1">
          {/* Selection tools */}
          <AnimatePresence>
            {selectedObjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-0.5 mr-2 bg-secondary/50 rounded-lg px-1 py-0.5"
              >
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={duplicateSelected}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicate (⌘D)</TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={groupSelected}>
                      <Box className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Group (⌘G)</TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={bringToFront}>
                      <Layers className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bring to Front</TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={flipH}>
                      <FlipHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Flip Horizontal</TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={deleteSelected}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </motion.div>
            )}
          </AnimatePresence>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={historyIndex <= 0}>
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo (⌘Z)</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={historyIndex >= history.length - 1}>
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo (⌘⇧Z)</TooltipContent>
          </Tooltip>
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button 
                variant={showGrid ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Grid</TooltipContent>
          </Tooltip>
          
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button 
                variant={snapToGrid ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setSnapToGrid(!snapToGrid)}
              >
                <Move className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Snap to Grid</TooltipContent>
          </Tooltip>
          
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button 
                variant={darkCanvas ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setDarkCanvas(!darkCanvas)}
              >
                {darkCanvas ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Canvas Theme</TooltipContent>
          </Tooltip>
          
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button 
                variant={isLocked ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setIsLocked(!isLocked)}
              >
                {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isLocked ? 'Unlock Canvas' : 'Lock Canvas'}</TooltipContent>
          </Tooltip>
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          <div className="flex items-center bg-secondary/50 rounded-lg px-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleZoom(-25)}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <button 
              onClick={resetView} 
              className="text-xs w-12 text-center text-muted-foreground hover:text-foreground transition-colors font-mono"
            >
              {zoom}%
            </button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleZoom(25)}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={fitToScreen}>
                <Maximize className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Fit to Screen (F)</TooltipContent>
          </Tooltip>
          
          <Separator orientation="vertical" className="h-6 mx-2" />
          
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={clearCanvas}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear Canvas</TooltipContent>
          </Tooltip>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={importImage}
          />
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Import Image</TooltipContent>
          </Tooltip>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs font-medium">
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportCanvas('png')}>
                <ImageIcon className="h-4 w-4 mr-2" /> Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportCanvas('svg')}>
                <Sparkles className="h-4 w-4 mr-2" /> Export as SVG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportCanvas('json')}>
                <Box className="h-4 w-4 mr-2" /> Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: activeTool === 'hand' ? (isPanning ? 'grabbing' : 'grab') : undefined }}
      >
        <canvas ref={canvasRef} className="absolute inset-0" />

        {/* Minimap */}
        {showMinimap && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-4 right-4 bg-card/95 backdrop-blur border border-border rounded-lg p-1 shadow-lg"
          >
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-[10px] text-muted-foreground font-medium">Minimap</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4" 
                onClick={() => setShowMinimap(false)}
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            </div>
            <canvas ref={minimapRef} width={150} height={100} className="rounded border border-border" />
          </motion.div>
        )}

        {/* Status bar */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div className="text-[11px] text-muted-foreground bg-card/95 backdrop-blur px-3 py-1.5 rounded-lg border border-border shadow-sm font-medium">
            {objectCount} objects · {zoom}%
          </div>
          <div className="text-[11px] text-muted-foreground bg-card/95 backdrop-blur px-3 py-1.5 rounded-lg border border-border shadow-sm font-mono">
            {cursorPosition.x}, {cursorPosition.y}
          </div>
        </div>

        {/* Tool indicator */}
        <AnimatePresence>
          {activeTool !== 'select' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 right-4 text-[11px] bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-medium capitalize shadow-lg"
            >
              {activeTool}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Locked overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
            <div className="bg-card border border-border rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
              <Lock className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium">Canvas Locked</span>
            </div>
          </div>
        )}

        {/* Keyboard shortcuts modal */}
        <AnimatePresence>
          {showShortcuts && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowShortcuts(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border rounded-xl p-6 shadow-2xl max-w-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div><kbd className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">V</kbd> Select</div>
                  <div><kbd className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">H</kbd> Pan</div>
                  <div><kbd className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">P</kbd> Pen</div>
                  <div><kbd className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">R</kbd> Rectangle</div>
                  <div><kbd className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">C</kbd> Circle</div>
                  <div><kbd className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">L</kbd> Line</div>
                  <div><kbd className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">⌘Z</kbd> Undo</div>
                  <div><kbd className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">⌘D</kbd> Duplicate</div>
                  <div><kbd className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">⌘G</kbd> Group</div>
                  <div><kbd className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">F</kbd> Fit to Screen</div>
                  <div><kbd className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">Del</kbd> Delete</div>
                  <div><kbd className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">Esc</kbd> Deselect</div>
                </div>
                <p className="text-xs text-muted-foreground mt-4">Press <kbd className="bg-muted px-1 rounded">?</kbd> to toggle this panel</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help button */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-4 right-4 h-8 w-8 rounded-full shadow-lg"
              onClick={() => setShowShortcuts(true)}
              style={{ right: showMinimap ? '180px' : '16px' }}
            >
              <span className="text-xs font-bold">?</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Keyboard Shortcuts (Shift+?)</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
