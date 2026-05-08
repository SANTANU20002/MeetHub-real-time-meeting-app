import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Button, 
  Slider, 
  TextField, 
  Card, 
  CardContent, 
  CardHeader,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Paper,
  Grid,
  IconButton
} from '@mui/material';
import { 
  Upload, RotateCw, FlipHorizontal, FlipVertical, Sun, 
  Contrast, Palette, Filter, ZoomIn, ZoomOut, Type, 
  Crop, Square, Download, Wand2, Edit2, X, Undo2, Redo2, RefreshCw
} from 'lucide-react';
// import { toast } from 'sonner'; // Commented out - install sonner package if needed

// TypeScript interfaces
interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
  isSquare?: boolean;
}

interface EditState {
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  textOverlays: TextOverlay[];
  crop: CropRect | null;
  filter: string;
}

interface HistoryItem {
  edits: EditState;
  baseImage: string;
}

const DEFAULT_HISTORY: EditState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  rotation: 0,
  flipH: false,
  flipV: false,
  textOverlays: [],
  crop: null,
  filter: 'none'
};

const FONT_FAMILIES = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
];

const FILTERS = [
  { value: 'none', label: 'None' },
  { value: 'grayscale', label: 'Grayscale' },
  { value: 'sepia', label: 'Sepia' },
  { value: 'blur', label: 'Blur' },
  { value: 'invert', label: 'Invert' },
  { value: 'vintage', label: 'Vintage' },
  { value: 'dramatic', label: 'Dramatic' },
  { value: 'warm', label: 'Warm' },
  { value: 'cool', label: 'Cool' },
  { value: 'blackwhite', label: 'Black & White' },
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'soft', label: 'Soft' },
];

const BACKGROUNDS = [
  { value: 'transparent', label: 'Transparent' },
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
  { value: 'gradient1', label: 'Gradient 1' },
  { value: 'gradient2', label: 'Gradient 2' },
  { value: 'custom', label: 'Custom Upload' },
];

// TextOverlay, CropRect, and EditState are now plain objects without TypeScript interfaces

export default function PhotoEditor() {
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [currentEdit, setCurrentEdit] = useState<EditState>(DEFAULT_HISTORY);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isCropping, setIsCropping] = useState<boolean>(false);
  const [cropMode, setCropMode] = useState<'freeform' | 'square'>('freeform');
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [showTextModal, setShowTextModal] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>('');
  const [textSize, setTextSize] = useState<number>(24);
  const [textColor, setTextColor] = useState<string>('#000000');
  const [textFont, setTextFont] = useState<string>('Arial');
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [draggingTextId, setDraggingTextId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string>('transparent');
  const [showBackgroundModal, setShowBackgroundModal] = useState<boolean>(false);
  const [isDraggingText, setIsDraggingText] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const addToHistory = useCallback((newEdit: EditState, baseImage?: string) => {
    setHistory(prev => {
      const truncated = prev.slice(0, historyIndex + 1);
      const item: HistoryItem = { edits: newEdit, baseImage: baseImage ?? image ?? '' };
      const next = [...truncated, item];
      // update historyIndex to newest
      setHistoryIndex(next.length - 1);
      return next;
    });
  }, [historyIndex, image]);

  const updateEdit = useCallback((updates: Partial<EditState>, newBaseImage: string | null = null) => {
    setCurrentEdit(prev => {
      const newEdit = { ...prev, ...updates };
      // capture a reliable base image: prefer provided newBaseImage, otherwise the current image
      const base = newBaseImage ?? image ?? '';
      addToHistory(newEdit, base);
      if (newBaseImage) setImage(newBaseImage);
      return newEdit;
    });
  }, [addToHistory, image]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentEdit(history[newIndex]?.edits || DEFAULT_HISTORY);
      setImage(history[newIndex]?.baseImage || null);
        // toast.success('Undone');
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentEdit(history[newIndex]?.edits || DEFAULT_HISTORY);
      setImage(history[newIndex]?.baseImage || null);
        // toast.success('Redone');
    }
  }, [history, historyIndex]);

  const reset = useCallback(() => {
    if (!originalImage) return;
    setImage(originalImage);
    const defaultEdits = { ...DEFAULT_HISTORY };
    setCurrentEdit(defaultEdits);
    setHistory([{ edits: defaultEdits, baseImage: originalImage }]);
    setHistoryIndex(0);
    setZoom(1);
    setIsCropping(false);
    setCropStart(null);
    // toast.success('Reset to original');
  }, [originalImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImage(result);
        setOriginalImage(result);
        const initial = { ...DEFAULT_HISTORY };
        setCurrentEdit(initial);
        setHistory([{ edits: initial, baseImage: result }]);
        setHistoryIndex(0);
        setZoom(1);
        // toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImage(result);
        setOriginalImage(result);
        const initial = { ...DEFAULT_HISTORY };
        setCurrentEdit(initial);
        setHistory([{ edits: initial, baseImage: result }]);
        setHistoryIndex(0);
        setZoom(1);
        // toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !image) return;

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Draw background first
      if (selectedBackground !== 'transparent') {
        if (selectedBackground === 'white') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (selectedBackground === 'black') {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (selectedBackground === 'gradient1') {
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, '#667eea');
          gradient.addColorStop(1, '#764ba2');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (selectedBackground === 'gradient2') {
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, '#f093fb');
          gradient.addColorStop(1, '#f5576c');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (selectedBackground === 'custom' && backgroundImage) {
          const bgImg = new Image();
          bgImg.onload = () => {
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
          };
          bgImg.src = backgroundImage;
        }
      }

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      ctx.translate(centerX, centerY);
      ctx.rotate((currentEdit.rotation * Math.PI) / 180);
      
      if (currentEdit.flipH) ctx.scale(-1, 1);
      if (currentEdit.flipV) ctx.scale(1, -1);
      
      ctx.translate(-centerX, -centerY);

      let filterStr = '';
      if (currentEdit.filter === 'grayscale') filterStr = 'grayscale(100%)';
      else if (currentEdit.filter === 'sepia') filterStr = 'sepia(100%)';
      else if (currentEdit.filter === 'blur') filterStr = 'blur(5px)';
      else if (currentEdit.filter === 'invert') filterStr = 'invert(100%)';
      else if (currentEdit.filter === 'vintage') filterStr = 'sepia(50%) contrast(120%) brightness(110%)';
      else if (currentEdit.filter === 'dramatic') filterStr = 'contrast(150%) brightness(80%) saturate(120%)';
      else if (currentEdit.filter === 'warm') filterStr = 'sepia(30%) saturate(120%) brightness(110%)';
      else if (currentEdit.filter === 'cool') filterStr = 'hue-rotate(180deg) saturate(80%) brightness(90%)';
      else if (currentEdit.filter === 'blackwhite') filterStr = 'grayscale(100%) contrast(120%)';
      else if (currentEdit.filter === 'vibrant') filterStr = 'saturate(150%) contrast(110%) brightness(105%)';
      else if (currentEdit.filter === 'soft') filterStr = 'blur(1px) brightness(110%) contrast(90%)';
      
      filterStr += ` brightness(${currentEdit.brightness}%) contrast(${currentEdit.contrast}%) saturate(${currentEdit.saturation}%)`;
      ctx.filter = filterStr;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      currentEdit.textOverlays.forEach(overlay => {
        ctx.font = `${overlay.fontSize}px "${overlay.fontFamily}"`;
        ctx.fillStyle = overlay.color;
        
        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        
        // Add stroke for selected text
        if (editingTextId === overlay.id || draggingTextId === overlay.id) {
          ctx.strokeStyle = '#1976d2';
          ctx.lineWidth = 3;
          ctx.strokeText(overlay.text, overlay.x, overlay.y);
        }
        
        ctx.fillText(overlay.text, overlay.x, overlay.y);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      });

      ctx.restore();
    };
    
    img.src = image;
  }, [image, currentEdit, editingTextId]);

  useEffect(() => {
    drawImage();
  }, [drawImage]);

  const getEventCoords = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      if (touch) {
        clientX = touch.clientX;
        clientY = touch.clientY;
      } else {
        clientX = 0;
        clientY = 0;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    
    const x = (clientX - rect.left) / zoom;
    const y = (clientY - rect.top) / zoom;
    return { x, y };
  };

  const isPointInText = (x: number, y: number, overlay: TextOverlay, ctx: CanvasRenderingContext2D) => {
    ctx.font = `${overlay.fontSize}px "${overlay.fontFamily}"`;
    const measure = ctx.measureText(overlay.text);
    const textWidth = measure.width;
    const textHeight = overlay.fontSize;
    const left = overlay.x;
    const top = overlay.y - textHeight + 5;
    return x >= left && x <= left + textWidth && y >= top && y <= overlay.y + 5;
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getEventCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    if (isCropping) {
      setCropStart({ x, y });
      return;
    }

    // Check for text overlay interaction
    for (const overlay of currentEdit.textOverlays) {
      if (isPointInText(x, y, overlay, ctx)) {
        setDraggingTextId(overlay.id);
        setDragOffset({ x: x - overlay.x, y: y - overlay.y });
        setEditingTextId(overlay.id);
        setIsDraggingText(true);
        e.preventDefault();
        return;
      }
    }
    setEditingTextId(null);
    setIsDraggingText(false);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getEventCoords(e);

    if (isCropping && cropStart) {
      const cropRect = document.getElementById('cropRect');
      if (cropRect) {
        let width = Math.abs(x - cropStart.x);
        let height = Math.abs(y - cropStart.y);
        let left = Math.min(x, cropStart.x);
        let top = Math.min(y, cropStart.y);

        if (cropMode === 'square') {
          const size = Math.max(width, height);
          left = x > cropStart.x ? cropStart.x : cropStart.x - size + width;
          top = y > cropStart.y ? cropStart.y : cropStart.y - size + height;
          width = size;
          height = size;
        }

        cropRect.style.width = `${width * zoom}px`;
        cropRect.style.height = `${height * zoom}px`;
        cropRect.style.left = `${left * zoom}px`;
        cropRect.style.top = `${top * zoom}px`;
        cropRect.style.display = 'block';
      }
      return;
    }

    if (draggingTextId && isDraggingText) {
      const newOverlays = currentEdit.textOverlays.map(overlay => {
        if (overlay.id === draggingTextId) {
          return { ...overlay, x: x - dragOffset.x, y: y - dragOffset.y };
        }
        return overlay;
      });
      updateEdit({ textOverlays: newOverlays });
      e.preventDefault();
    }
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (isCropping && cropStart) {
      const { x, y } = getEventCoords(e);
      let width = Math.abs(x - cropStart.x);
      let height = Math.abs(y - cropStart.y);
      let cropX = Math.min(x, cropStart.x);
      let cropY = Math.min(y, cropStart.y);

      if (cropMode === 'square') {
        const size = Math.max(width, height);
        cropX = x > cropStart.x ? cropStart.x : cropStart.x - size + width;
        cropY = y > cropStart.y ? cropStart.y : cropStart.y - size + height;
        width = size;
        height = size;
      }

      if (width > 10 && height > 10) {
        updateEdit({
          crop: {
            x: cropX,
            y: cropY,
            width,
            height,
            isSquare: cropMode === 'square'
          }
        });
      }

      const cropRect = document.getElementById('cropRect');
      if (cropRect) cropRect.style.display = 'none';
      setCropStart(null);
      setIsCropping(false);
      // toast.success('Crop area selected');
      return;
    }

    if (draggingTextId) {
      setDraggingTextId(null);
      setIsDraggingText(false);
    }
  };

  const applyCrop = () => {
    if (!currentEdit.crop || !canvasRef.current) return;

    const { x, y, width, height } = currentEdit.crop;

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = width;
    croppedCanvas.height = height;
    const ctx = croppedCanvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(canvasRef.current, x, y, width, height, 0, 0, width, height);

    const croppedImage = croppedCanvas.toDataURL('image/png');
    updateEdit({ crop: null }, croppedImage);
    // toast.success('Crop applied');
  };

  const removeBackground = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const tolerance = 40; // Increased tolerance for better detection
    
    // Sample multiple corner pixels for better background detection
    const samplePoints = [
      { x: 0, y: 0 },
      { x: canvas.width - 1, y: 0 },
      { x: 0, y: canvas.height - 1 },
      { x: canvas.width - 1, y: canvas.height - 1 },
      { x: Math.floor(canvas.width / 2), y: 0 },
      { x: Math.floor(canvas.width / 2), y: canvas.height - 1 }
    ];
    
    const bgColors = samplePoints.map(point => {
      const index = (point.y * canvas.width + point.x) * 4;
      return {
        r: pixels[index] || 0,
        g: pixels[index + 1] || 0,
        b: pixels[index + 2] || 0
      };
    });

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i] || 0;
      const g = pixels[i + 1] || 0;
      const b = pixels[i + 2] || 0;
      
      // Check against all sampled background colors
      let isBackground = false;
      for (const bgColor of bgColors) {
        if (
          Math.abs(r - bgColor.r) < tolerance &&
          Math.abs(g - bgColor.g) < tolerance &&
          Math.abs(b - bgColor.b) < tolerance
        ) {
          isBackground = true;
          break;
        }
      }
      
      if (isBackground) {
        pixels[i + 3] = 0; // Make transparent
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const newImage = canvas.toDataURL('image/png');
    updateEdit({}, newImage);
    // toast.success('Background removed');
  };

  const openEditText = (overlay: TextOverlay) => {
    setTextInput(overlay.text);
    setTextSize(overlay.fontSize);
    setTextColor(overlay.color);
    setTextFont(overlay.fontFamily);
    setEditingTextId(overlay.id);
    setShowTextModal(true);
  };

  const addOrUpdateText = () => {
    if (!textInput.trim()) {
        // toast.error('Please enter some text');
      return;
    }

    const updatedOverlay = {
      id: editingTextId || Date.now().toString(),
      text: textInput,
      x: editingTextId ? currentEdit.textOverlays.find(o => o.id === editingTextId)?.x || 50 : 50,
      y: editingTextId ? currentEdit.textOverlays.find(o => o.id === editingTextId)?.y || 50 : 50,
      fontSize: textSize,
      color: textColor,
      fontFamily: textFont
    };

    let newOverlays;
    if (editingTextId) {
      newOverlays = currentEdit.textOverlays.map(o => o.id === editingTextId ? updatedOverlay : o);
      // toast.success('Text updated');
    } else {
      newOverlays = [...currentEdit.textOverlays, updatedOverlay];
      // toast.success('Text added');
    }

    updateEdit({ textOverlays: newOverlays });

    setTextInput('');
    setTextSize(24);
    setTextColor('#000000');
    setTextFont('Arial');
    setEditingTextId(null);
    setShowTextModal(false);
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setBackgroundImage(result);
        setSelectedBackground('custom');
        // toast.success('Background uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundChange = (background: string) => {
    setSelectedBackground(background);
    if (background !== 'custom') {
      setBackgroundImage(null);
    }
  };

  const exportImage = (format: 'png' | 'jpeg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mime = format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = format === 'jpeg' ? 0.92 : 1;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `edited-image.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }, mime, quality);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, md: 3, lg: 4 } }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' }, gap: 3 }}>
          {/* Control Panel */}
          <Box>
            <Card sx={{ boxShadow: 3, overflow: 'hidden' }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)} 
                variant="fullWidth"
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab 
                  value="upload" 
                  label="Upload" 
                  icon={<Upload size={20} />}
                  iconPosition="start"
                />
                <Tab 
                  value="adjust" 
                  label="Adjust" 
                  icon={<Palette size={20} />}
                  iconPosition="start"
                />
                <Tab 
                  value="text" 
                  label="Text" 
                  icon={<Type size={20} />}
                  iconPosition="start"
                />
                <Tab 
                  value="background" 
                  label="Background" 
                  icon={<Palette size={20} />}
                  iconPosition="start"
                />
              </Tabs>

              <Box sx={{ maxHeight: 'calc(100vh - 20rem)', overflow: 'auto' }}>
                {activeTab === 'upload' && (
                  <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Paper
                      sx={{
                        border: '2px dashed',
                        borderColor: 'primary.main',
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        bgcolor: 'action.hover',
                        '&:hover': {
                          bgcolor: 'action.selected',
                          transform: 'scale(1.02)',
                          transition: 'all 0.2s ease'
                        }
                      }}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={48} style={{ margin: '0 auto 16px', color: '#1976d2' }} />
                      <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                        Drop image here or click to upload
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Supports PNG, JPG, JPEG
                      </Typography>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </Paper>

                    {image && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={undo}
                            disabled={historyIndex === 0}
                            startIcon={<Undo2 size={16} />}
                          >
                            Undo
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={redo}
                            disabled={historyIndex === history.length - 1}
                            startIcon={<Redo2 size={16} />}
                          >
                            Redo
                          </Button>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={reset}
                          fullWidth
                          startIcon={<RefreshCw size={16} />}
                        >
                          Reset All
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}

                {activeTab === 'adjust' && (
                  <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        Transform
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => updateEdit({ rotation: (currentEdit.rotation + 90) % 360 })}
                          startIcon={<RotateCw size={16} />}
                        >
                          Rotate
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => updateEdit({ flipH: !currentEdit.flipH })}
                          startIcon={<FlipHorizontal size={16} />}
                        >
                          Flip H
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => updateEdit({ flipV: !currentEdit.flipV })}
                          startIcon={<FlipVertical size={16} />}
                        >
                          Flip V
                        </Button>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Sun size={16} />
                        Brightness: {currentEdit.brightness}%
                      </Typography>
                      <Slider
                        value={currentEdit.brightness}
                        onChange={(e, value) => updateEdit({ brightness: value as number })}
                        min={0}
                        max={200}
                        step={1}
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Contrast size={16} />
                        Contrast: {currentEdit.contrast}%
                      </Typography>
                      <Slider
                        value={currentEdit.contrast}
                        onChange={(e, value) => updateEdit({ contrast: value as number })}
                        min={0}
                        max={200}
                        step={1}
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Palette size={16} />
                        Saturation: {currentEdit.saturation}%
                      </Typography>
                      <Slider
                        value={currentEdit.saturation}
                        onChange={(e, value) => updateEdit({ saturation: value as number })}
                        min={0}
                        max={200}
                        step={1}
                        valueLabelDisplay="auto"
                      />
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Filter size={16} />
                        Filter
                      </Typography>
                      <FormControl fullWidth size="small">
                        <InputLabel>Filter</InputLabel>
                        <Select
                          value={currentEdit.filter}
                          onChange={(e) => updateEdit({ filter: e.target.value })}
                          label="Filter"
                        >
                          {FILTERS.map(f => (
                            <MenuItem key={f.value} value={f.value}>
                              {f.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 2 }}>
                        Zoom: {Math.round(zoom * 100)}%
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                          startIcon={<ZoomOut size={16} />}
                        >
                          Zoom Out
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                          startIcon={<ZoomIn size={16} />}
                        >
                          Zoom In
                        </Button>
                      </Box>
                    </Box>

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={removeBackground}
                      startIcon={<Wand2 size={16} />}
                    >
                      Remove Background
                    </Button>
                  </Box>
                )}

                {activeTab === 'text' && (
                  <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      fullWidth
                      onClick={() => {
                        setEditingTextId(null);
                        setTextInput('');
                        setTextSize(24);
                        setTextColor('#000000');
                        setTextFont('Arial');
                        setShowTextModal(true);
                      }}
                      startIcon={<Type size={16} />}
                    >
                      Add Text
                    </Button>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {currentEdit.textOverlays.map(overlay => (
                        <Paper
                          key={overlay.id}
                          sx={{
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            bgcolor: 'action.hover'
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              flex: 1,
                              fontFamily: overlay.fontFamily,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {overlay.text}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => openEditText(overlay)}
                            >
                              <Edit2 size={16} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() =>
                                updateEdit({
                                  textOverlays: currentEdit.textOverlays.filter(
                                    t => t.id !== overlay.id
                                  )
                                })
                              }
                            >
                              <X size={16} />
                            </IconButton>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}

                {activeTab === 'background' && (
                  <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Background Options
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {BACKGROUNDS.map(bg => (
                        <Button
                          key={bg.value}
                          variant={selectedBackground === bg.value ? 'contained' : 'outlined'}
                          size="small"
                          onClick={() => handleBackgroundChange(bg.value)}
                          sx={{ justifyContent: 'flex-start' }}
                        >
                          {bg.label}
                        </Button>
                      ))}
                    </Box>

                    {selectedBackground === 'custom' && (
                      <Box sx={{ mt: 2 }}>
                        <input
                          ref={backgroundInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleBackgroundUpload}
                          style={{ display: 'none' }}
                        />
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => backgroundInputRef.current?.click()}
                          startIcon={<Upload size={16} />}
                        >
                          Upload Custom Background
                        </Button>
                      </Box>
                    )}

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={removeBackground}
                      startIcon={<Wand2 size={16} />}
                      sx={{ mt: 2 }}
                    >
                      Remove Original Background
                    </Button>
                  </Box>
                )}
              </Box>
            </Card>

            {image && (
              <CardContent sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setCropMode('freeform');
                        setIsCropping(true);
                        // toast.info('Click and drag to select crop area');
                      }}
                      startIcon={<Crop size={16} />}
                    >
                      Crop
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setCropMode('square');
                        setIsCropping(true);
                        // toast.info('Click and drag to select square crop');
                      }}
                      startIcon={<Square size={16} />}
                    >
                      Square
                    </Button>
                  </Box>

                  {currentEdit.crop && (
                    <Button
                      fullWidth
                      onClick={applyCrop}
                    >
                      Apply Crop
                    </Button>
                  )}

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    <Button
                      onClick={() => exportImage('png')}
                      startIcon={<Download size={16} />}
                    >
                      PNG
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => exportImage('jpeg')}
                      startIcon={<Download size={16} />}
                    >
                      JPEG
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            )}
          </Box>

          {/* Canvas Area */}
          <Box>
            <Card sx={{ 
              boxShadow: 3, 
              height: { xs: 'calc(100vh - 16rem)', lg: 'calc(100vh - 12rem)' }
            }}>
              <CardContent sx={{ p: 0, height: '100%' }}>
                {!image ? (
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%',
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)'
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Upload size={96} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                      <Typography variant="h5" sx={{ fontWeight: 'semibold', mb: 1, color: 'text.secondary' }}>
                        No Image Loaded
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Upload an image to start editing
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ 
                    position: 'relative', 
                    height: '100%', 
                    overflow: 'auto', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    p: 2,
                    background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)'
                  }}>
                    <canvas
                      ref={canvasRef}
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        cursor: isCropping ? 'crosshair' : (isDraggingText ? 'grabbing' : 'default'),
                        transform: `scale(${zoom})`,
                        transition: 'transform 0.2s ease-out',
                      }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onTouchStart={handleMouseDown}
                      onTouchMove={handleMouseMove}
                      onTouchEnd={handleMouseUp}
                    />
                    <div
                      id="cropRect"
                      style={{ 
                        position: 'absolute',
                        border: '2px solid #1976d2',
                        backgroundColor: 'rgba(25, 118, 210, 0.1)',
                        pointerEvents: 'none',
                        display: 'none'
                      }}
                    />
                    {currentEdit.crop && (
                      <div
                        style={{
                          position: 'absolute',
                          border: '2px solid #1976d2',
                          backgroundColor: 'rgba(25, 118, 210, 0.1)',
                          pointerEvents: 'none',
                          width: `${currentEdit.crop.width * zoom}px`,
                          height: `${currentEdit.crop.height * zoom}px`,
                          left: `${currentEdit.crop.x * zoom}px`,
                          top: `${currentEdit.crop.y * zoom}px`,
                        }}
                      />
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Text Modal */}
      <Dialog open={showTextModal} onClose={() => setShowTextModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTextId ? 'Edit Text' : 'Add Text Overlay'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Text</Typography>
              <TextField
                fullWidth
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter your text"
                size="small"
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Font Size: {textSize}px
              </Typography>
              <Slider
                value={textSize}
                onChange={(e, value) => setTextSize(value as number)}
                min={8}
                max={120}
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Font Family</Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Font Family</InputLabel>
                <Select value={textFont} onChange={(e) => setTextFont(e.target.value)} label="Font Family">
                  {FONT_FAMILIES.map(font => (
                    <MenuItem
                      key={font.value}
                      value={font.value}
                      style={{ fontFamily: font.value }}
                    >
                      {font.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Color</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  sx={{ width: 80, height: 40 }}
                  size="small"
                />
                <TextField
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  sx={{ flex: 1 }}
                  size="small"
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setShowTextModal(false);
              setEditingTextId(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={addOrUpdateText}>
            {editingTextId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
