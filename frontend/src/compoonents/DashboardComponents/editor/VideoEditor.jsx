import React, { useState, useRef, useEffect, useCallback } from 'react';
import './VideoEditor.css';

const VideoEditor = () => {
  // Core state management
  const [videoFile, setVideoFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [selectedTool, setSelectedTool] = useState('select');
  
  // Video editing state
  const [clips, setClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  
  // Effects and filters
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [filters, setFilters] = useState([]);
  
  // Text and overlays
  const [textOverlays, setTextOverlays] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [textStyle, setTextStyle] = useState({
    font: 'Arial',
    size: 24,
    color: '#ffffff',
    alignment: 'center'
  });
  
  // Audio
  const [audioTracks, setAudioTracks] = useState([]);
  const [backgroundMusic, setBackgroundMusic] = useState(null);
  const [audioVolume, setAudioVolume] = useState(1);
  const [muteAudio, setMuteAudio] = useState(false);
  
  // Timeline
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const [snapToGrid, setSnapToGrid] = useState(true);
  
  // Export settings
  const [exportSettings, setExportSettings] = useState({
    resolution: '1080p',
    format: 'mp4',
    quality: 'high',
    frameRate: 30
  });
  
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  // Video controls
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setTrimEnd(videoRef.current.duration);
    }
  };
  
  const seekTo = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  // File handling
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVideoFile(URL.createObjectURL(file));
      const newClip = {
        id: Date.now(),
        name: file.name,
        start: 0,
        end: 0,
        duration: 0,
        type: 'video'
      };
      setClips([...clips, newClip]);
    }
  };
  
  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBackgroundMusic(URL.createObjectURL(file));
    }
  };
  
  // Video editing tools
  const trimVideo = () => {
    if (selectedClip) {
      const updatedClips = clips.map(clip => 
        clip.id === selectedClip.id 
          ? { ...clip, start: trimStart, end: trimEnd }
          : clip
      );
      setClips(updatedClips);
    }
  };
  
  const splitClip = () => {
    if (selectedClip && currentTime > selectedClip.start && currentTime < selectedClip.end) {
      const newClip = {
        id: Date.now(),
        name: `${selectedClip.name} (split)`,
        start: currentTime,
        end: selectedClip.end,
        duration: selectedClip.end - currentTime,
        type: 'video'
      };
      
      const updatedClips = clips.map(clip => 
        clip.id === selectedClip.id 
          ? { ...clip, end: currentTime }
          : clip
      );
      
      setClips([...updatedClips, newClip]);
    }
  };
  
  const mergeClips = () => {
    // Implementation for merging selected clips
    console.log('Merge clips functionality');
  };
  
  const cropVideo = () => {
    // Implementation for video cropping
    console.log('Crop video functionality');
  };
  
  const rotateVideo = (degrees) => {
    setRotation(rotation + degrees);
  };
  
  const flipVideo = (direction) => {
    if (direction === 'horizontal') {
      setFlipHorizontal(!flipHorizontal);
    } else {
      setFlipVertical(!flipVertical);
    }
  };
  
  const resizeVideo = (width, height) => {
    // Implementation for video resizing
    console.log('Resize video functionality');
  };
  
  // Effects and filters
  const applyFilter = (filterType, value) => {
    setFilters(prev => [...prev, { type: filterType, value, id: Date.now() }]);
  };
  
  const removeFilter = (filterId) => {
    setFilters(prev => prev.filter(f => f.id !== filterId));
  };
  
  // Text overlay functions
  const addTextOverlay = () => {
    if (currentText.trim()) {
      const newOverlay = {
        id: Date.now(),
        text: currentText,
        start: currentTime,
        end: currentTime + 5, // Default 5 seconds
        style: { ...textStyle },
        position: { x: 50, y: 50 }
      };
      setTextOverlays(prev => [...prev, newOverlay]);
      setCurrentText('');
    }
  };
  
  const updateTextOverlay = (overlayId, updates) => {
    setTextOverlays(prev => 
      prev.map(overlay => 
        overlay.id === overlayId ? { ...overlay, ...updates } : overlay
      )
    );
  };
  
  const removeTextOverlay = (overlayId) => {
    setTextOverlays(prev => prev.filter(overlay => overlay.id !== overlayId));
  };
  
  // Audio functions
  const adjustVolume = (newVolume) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };
  
  const toggleMute = () => {
    setMuteAudio(!muteAudio);
    if (videoRef.current) {
      videoRef.current.muted = !muteAudio;
    }
  };
  
  // Timeline functions
  const addMarker = () => {
    // Implementation for timeline markers
    console.log('Add marker at', currentTime);
  };
  
  const zoomTimeline = (direction) => {
    if (direction === 'in') {
      setTimelineZoom(prev => Math.min(prev * 1.2, 5));
    } else {
      setTimelineZoom(prev => Math.max(prev / 1.2, 0.1));
    }
  };
  
  // Export functions
  const exportVideo = async () => {
    // Implementation for video export
    console.log('Exporting video with settings:', exportSettings);
  };
  
  // Undo/Redo functionality
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const saveState = () => {
    const state = {
      clips,
      textOverlays,
      filters,
      currentTime,
      timestamp: Date.now()
    };
    setHistory(prev => [...prev.slice(0, historyIndex + 1), state]);
    setHistoryIndex(prev => prev + 1);
  };
  
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setClips(prevState.clips);
      setTextOverlays(prevState.textOverlays);
      setFilters(prevState.filters);
      setCurrentTime(prevState.currentTime);
      setHistoryIndex(prev => prev - 1);
    }
  };
  
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setClips(nextState.clips);
      setTextOverlays(nextState.textOverlays);
      setFilters(nextState.filters);
      setCurrentTime(nextState.currentTime);
      setHistoryIndex(prev => prev + 1);
    }
  };
  
  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="video-editor">
      {/* Header */}
      <div className="editor-header">
        <h2>Video Editor</h2>
        <div className="header-controls">
          <button onClick={undo} disabled={historyIndex <= 0}>Undo</button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1}>Redo</button>
          <button onClick={exportVideo}>Export</button>
        </div>
      </div>
      
      {/* Main workspace */}
      <div className="editor-workspace">
        {/* Preview area */}
        <div className="preview-area">
          <div className="video-container">
            {videoFile ? (
              <video
                ref={videoRef}
                src={videoFile}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                style={{
                  transform: `rotate(${rotation}deg) scaleX(${flipHorizontal ? -1 : 1}) scaleY(${flipVertical ? -1 : 1})`,
                  filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`,
                  opacity: opacity / 100
                }}
              />
            ) : (
              <div className="upload-area">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  style={{ display: 'none' }}
                />
                <button onClick={() => fileInputRef.current?.click()}>
                  Upload Video
                </button>
              </div>
            )}
            
            {/* Text overlays */}
            {textOverlays.map(overlay => (
              <div
                key={overlay.id}
                className="text-overlay"
                style={{
                  position: 'absolute',
                  left: `${overlay.position.x}%`,
                  top: `${overlay.position.y}%`,
                  fontFamily: overlay.style.font,
                  fontSize: `${overlay.style.size}px`,
                  color: overlay.style.color,
                  textAlign: overlay.style.alignment
                }}
              >
                {overlay.text}
              </div>
            ))}
          </div>
          
          {/* Playback controls */}
          <div className="playback-controls">
            <button onClick={togglePlayPause}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="timeline-scrubber"
            />
            <div className="speed-control">
              <label>Speed:</label>
              <select value={playbackSpeed} onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}>
                <option value={0.25}>0.25x</option>
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Tools panel */}
        <div className="tools-panel">
          <div className="tool-categories">
            {/* Video tools */}
            <div className="tool-category">
              <h3>Video Tools</h3>
              <div className="tool-buttons">
                <button onClick={() => setSelectedTool('trim')}>Trim</button>
                <button onClick={() => setSelectedTool('cut')}>Cut</button>
                <button onClick={splitClip}>Split</button>
                <button onClick={mergeClips}>Merge</button>
                <button onClick={() => setSelectedTool('crop')}>Crop</button>
                <button onClick={() => rotateVideo(90)}>Rotate 90°</button>
                <button onClick={() => flipVideo('horizontal')}>Flip H</button>
                <button onClick={() => flipVideo('vertical')}>Flip V</button>
              </div>
            </div>
            
            {/* Effects and filters */}
            <div className="tool-category">
              <h3>Effects & Filters</h3>
              <div className="effect-controls">
                <div className="control-group">
                  <label>Brightness: {brightness}%</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                  />
                </div>
                <div className="control-group">
                  <label>Contrast: {contrast}%</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(parseInt(e.target.value))}
                  />
                </div>
                <div className="control-group">
                  <label>Saturation: {saturation}%</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(parseInt(e.target.value))}
                  />
                </div>
                <div className="control-group">
                  <label>Blur: {blur}px</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={blur}
                    onChange={(e) => setBlur(parseInt(e.target.value))}
                  />
                </div>
                <div className="control-group">
                  <label>Opacity: {opacity}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
            
            {/* Text tools */}
            <div className="tool-category">
              <h3>Text & Overlays</h3>
              <div className="text-controls">
                <input
                  type="text"
                  placeholder="Enter text..."
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                />
                <button onClick={addTextOverlay}>Add Text</button>
                <div className="text-style-controls">
                  <select value={textStyle.font} onChange={(e) => setTextStyle(prev => ({...prev, font: e.target.value}))}>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Size"
                    value={textStyle.size}
                    onChange={(e) => setTextStyle(prev => ({...prev, size: parseInt(e.target.value)}))}
                  />
                  <input
                    type="color"
                    value={textStyle.color}
                    onChange={(e) => setTextStyle(prev => ({...prev, color: e.target.value}))}
                  />
                </div>
              </div>
            </div>
            
            {/* Audio tools */}
            <div className="tool-category">
              <h3>Audio</h3>
              <div className="audio-controls">
                <div className="control-group">
                  <label>Volume: {Math.round(volume * 100)}%</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                  />
                </div>
                <button onClick={toggleMute}>
                  {muteAudio ? '🔊' : '🔇'}
                </button>
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  style={{ display: 'none' }}
                />
                <button onClick={() => audioInputRef.current?.click()}>
                  Add Music
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Timeline */}
      <div className="timeline-container">
        <div className="timeline-header">
          <h3>Timeline</h3>
          <div className="timeline-controls">
            <button onClick={() => zoomTimeline('out')}>🔍-</button>
            <span>Zoom: {Math.round(timelineZoom * 100)}%</span>
            <button onClick={() => zoomTimeline('in')}>🔍+</button>
            <button onClick={addMarker}>Add Marker</button>
          </div>
        </div>
        
        <div className="timeline">
          <div className="timeline-tracks">
            {/* Video track */}
            <div className="track video-track">
              <div className="track-label">Video</div>
              <div className="track-content">
                {clips.map(clip => (
                  <div
                    key={clip.id}
                    className={`clip ${selectedClip?.id === clip.id ? 'selected' : ''}`}
                    style={{
                      left: `${(clip.start / duration) * 100}%`,
                      width: `${((clip.end - clip.start) / duration) * 100}%`
                    }}
                    onClick={() => setSelectedClip(clip)}
                  >
                    {clip.name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Audio track */}
            <div className="track audio-track">
              <div className="track-label">Audio</div>
              <div className="track-content">
                {backgroundMusic && (
                  <div className="audio-clip">
                    Background Music
                  </div>
                )}
              </div>
            </div>
            
            {/* Text track */}
            <div className="track text-track">
              <div className="track-label">Text</div>
              <div className="track-content">
                {textOverlays.map(overlay => (
                  <div
                    key={overlay.id}
                    className="text-clip"
                    style={{
                      left: `${(overlay.start / duration) * 100}%`,
                      width: `${((overlay.end - overlay.start) / duration) * 100}%`
                    }}
                  >
                    {overlay.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Playhead */}
          <div
            className="playhead"
            style={{ left: `${(currentTime / duration) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Export settings */}
      <div className="export-panel">
        <h3>Export Settings</h3>
        <div className="export-controls">
          <div className="control-group">
            <label>Resolution:</label>
            <select value={exportSettings.resolution} onChange={(e) => setExportSettings(prev => ({...prev, resolution: e.target.value}))}>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
              <option value="4K">4K</option>
            </select>
          </div>
          <div className="control-group">
            <label>Format:</label>
            <select value={exportSettings.format} onChange={(e) => setExportSettings(prev => ({...prev, format: e.target.value}))}>
              <option value="mp4">MP4</option>
              <option value="webm">WebM</option>
              <option value="mov">MOV</option>
            </select>
          </div>
          <div className="control-group">
            <label>Quality:</label>
            <select value={exportSettings.quality} onChange={(e) => setExportSettings(prev => ({...prev, quality: e.target.value}))}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button onClick={exportVideo} className="export-button">
            Export Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;
