import React, { useState, useEffect, useRef } from 'react';
import { Upload, Download, Settings, Image as ImageIcon, LayoutGrid, LayoutTemplate, Shapes, Circle, Plus, Trash2 } from 'lucide-react';

const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M50 10 C70 40, 90 60, 50 90 C10 60, 30 40, 50 10 Z" fill="#2dd4bf" stroke="#0f766e" stroke-width="4"/><circle cx="50" cy="65" r="10" fill="#0f766e"/></svg>`;
const defaultImageSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(defaultSvg)}`;

const defaultSvg2 = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><polygon points="50,15 61,35 85,35 66,50 73,75 50,60 27,75 34,50 15,35 39,35" fill="#f43f5e" stroke="#be123c" stroke-width="4"/></svg>`;
const defaultImageSrc2 = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(defaultSvg2)}`;

const defaultSvg3 = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect x="30" y="30" width="40" height="40" fill="#f59e0b" stroke="#b45309" stroke-width="4" transform="rotate(45 50 50)"/></svg>`;
const defaultImageSrc3 = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(defaultSvg3)}`;

export default function PatternDesignTool() {
  const [bgColor, setBgColor] = useState('#f8fafc');
  const [unitImageSrc, setUnitImageSrc] = useState(defaultImageSrc);
  const [unitImage, setUnitImage] = useState(null);
  
  const [bgType, setBgType] = useState('color');
  const [bgImageSrc, setBgImageSrc] = useState(null);
  const [bgImage, setBgImage] = useState(null);
  const [bgSize, setBgSize] = useState(100);

  const [hasPattern2, setHasPattern2] = useState(false);
  const [unitImageSrc2, setUnitImageSrc2] = useState(defaultImageSrc2);
  const [unitImage2, setUnitImage2] = useState(null);
  
  const [hasPattern3, setHasPattern3] = useState(false);
  const [unitImageSrc3, setUnitImageSrc3] = useState(defaultImageSrc3);
  const [unitImage3, setUnitImage3] = useState(null);
  
  const [patternSize, setPatternSize] = useState(80); 
  const [spacing, setSpacing] = useState(120);        
  const [rotationAngle, setRotationAngle] = useState(0); 
  
  const [patternSize2, setPatternSize2] = useState(60);  
  const [spacing2, setSpacing2] = useState(120);         
  const [rotationAngle2, setRotationAngle2] = useState(0); 

  const [patternSize3, setPatternSize3] = useState(40);  
  const [spacing3, setSpacing3] = useState(120);         
  const [rotationAngle3, setRotationAngle3] = useState(0); 

  const [skeletonType, setSkeletonType] = useState('grid'); 

  const canvasRef = useRef(null);

  useEffect(() => { if (unitImageSrc) { const img = new Image(); img.onload = () => setUnitImage(img); img.src = unitImageSrc; } }, [unitImageSrc]);
  useEffect(() => { if (unitImageSrc2) { const img = new Image(); img.onload = () => setUnitImage2(img); img.src = unitImageSrc2; } }, [unitImageSrc2]);
  useEffect(() => { if (unitImageSrc3) { const img = new Image(); img.onload = () => setUnitImage3(img); img.src = unitImageSrc3; } }, [unitImageSrc3]);
  useEffect(() => { if (bgImageSrc) { const img = new Image(); img.onload = () => setBgImage(img); img.src = bgImageSrc; } }, [bgImageSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !unitImage) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    if (bgType === 'image' && bgImage) {
      const drawW = width * (bgSize / 100);
      const drawH = height * (bgSize / 100);
      const x = (width - drawW) / 2;
      const y = (height - drawH) / 2;
      ctx.drawImage(bgImage, x, y, drawW, drawH);
    }

    const drawLayer = (img, size, layerSpacing, rotAngle, offsetXMult, offsetYMult) => {
      if (!img) return;
      const aspect = img.width / img.height;
      const drawW = size;
      const drawH = size / aspect;

      const points = [];
      const cols = Math.ceil(width / layerSpacing) + 2; 
      const rows = Math.ceil(height / layerSpacing) + 2;

      const offsetX = layerSpacing * offsetXMult;
      const offsetY = layerSpacing * offsetYMult;

      for (let i = -2; i <= cols; i++) {
        for (let j = -2; j <= rows; j++) {
          let x = i * layerSpacing + offsetX;
          let y = j * layerSpacing + offsetY;

          if (skeletonType === 'brick') {
            if (j % 2 !== 0) x += layerSpacing / 2;
          } else if (skeletonType === 'halfDrop') {
            if (i % 2 !== 0) y += layerSpacing / 2;
          } else if (skeletonType === 'diamond') {
            y = j * (layerSpacing * 0.866) + offsetY; 
            if (j % 2 !== 0) x += layerSpacing / 2;
          }
          points.push({ x, y });
        }
      }

      ctx.globalCompositeOperation = 'source-over';
      points.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((rotAngle * Math.PI) / 180);
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      });
    };

    drawLayer(unitImage, patternSize, spacing, rotationAngle, 0, 0);
    if (hasPattern2 && unitImage2) drawLayer(unitImage2, patternSize2, spacing2, rotationAngle2, 0.5, 0.5);
    if (hasPattern3 && unitImage3) drawLayer(unitImage3, patternSize3, spacing3, rotationAngle3, 0.5, 0);

  }, [bgColor, unitImage, patternSize, spacing, rotationAngle, skeletonType, hasPattern2, unitImage2, patternSize2, spacing2, rotationAngle2, hasPattern3, unitImage3, patternSize3, spacing3, rotationAngle3, bgType, bgImage, bgSize]);

  const handleImageUpload = (e, layerIndex = 0) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (layerIndex === 1) setUnitImageSrc2(url);
      else if (layerIndex === 2) setUnitImageSrc3(url);
      else setUnitImageSrc(url);
    }
  };

  const handleBgImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBgImageSrc(url);
      setBgType('image'); 
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `pattern-design-${skeletonType}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const skeletons = [
    { id: 'grid', name: '基础网格', icon: <LayoutGrid size={18} /> },
    { id: 'brick', name: '砖块错排', icon: <LayoutTemplate size={18} /> },
    { id: 'halfDrop', name: '半降错排', icon: <Shapes size={18} /> },
    { id: 'diamond', name: '菱形网格', icon: <Circle size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-full">
        
        <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto max-h-[85vh] custom-scrollbar">
          
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-1">
              <Settings className="text-indigo-600" /> 图案设计控制器
            </h2>
            <p className="text-xs text-slate-500 mb-4">通过骨式图参数化生成连续图案</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <ImageIcon size={16} /> 1. 输入单元图案
            </label>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">主图案 (Pattern 1)</span>
              <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-indigo-300 rounded-lg bg-indigo-50 hover:bg-indigo-100 cursor-pointer">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-4 h-4 text-indigo-500 mb-1" />
                  <p className="text-[10px] text-indigo-600 font-medium">点击更换图案1</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 0)} />
              </label>
            </div>

            {hasPattern2 ? (
              <div className="flex flex-col gap-1 mt-1 relative">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-500">副图案 (Pattern 2 - 错排)</span>
                  <button onClick={() => { setHasPattern2(false); setHasPattern3(false); }} className="text-red-500 hover:text-red-700">
                    <Trash2 size={14} />
                  </button>
                </div>
                <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-pink-300 rounded-lg bg-pink-50 hover:bg-pink-100 cursor-pointer">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-4 h-4 text-pink-500 mb-1" />
                    <p className="text-[10px] text-pink-600 font-medium">点击更换图案2</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 1)} />
                </label>
              </div>
            ) : (
              <button onClick={() => setHasPattern2(true)} className="mt-1 flex items-center justify-center gap-1 w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-300 text-xs">
                <Plus size={14} /> 添加第二个错排图案
              </button>
            )}

            {hasPattern2 && (
              hasPattern3 ? (
                <div className="flex flex-col gap-1 mt-1 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">副图案 (Pattern 3 - 错排)</span>
                    <button onClick={() => setHasPattern3(false)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-amber-300 rounded-lg bg-amber-50 hover:bg-amber-100 cursor-pointer">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-4 h-4 text-amber-500 mb-1" />
                      <p className="text-[10px] text-amber-600 font-medium">点击更换图案3</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 2)} />
                  </label>
                </div>
              ) : (
                <button onClick={() => setHasPattern3(true)} className="mt-1 flex items-center justify-center gap-1 w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-amber-600 hover:border-amber-300 text-xs">
                  <Plus size={14} /> 添加第三个错排图案
                </button>
              )
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">2. 骨式图排列法则</label>
            <div className="grid grid-cols-2 gap-2">
              {skeletons.map((sk) => (
                <button key={sk.id} onClick={() => setSkeletonType(sk.id)} className={`flex items-center gap-2 p-2 rounded border text-sm ${skeletonType === sk.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}>
                  {sk.icon} {sk.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex flex-col gap-3">
              {hasPattern2 && <h3 className="text-xs font-bold text-indigo-600 border-b pb-1">图案 1 控制</h3>}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700">图案大小</label>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{patternSize}px</span>
                </div>
                <input type="range" min="20" max="300" value={patternSize} onChange={(e) => setPatternSize(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700">骨架间距</label>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{spacing}px</span>
                </div>
                <input type="range" min="50" max="400" value={spacing} onChange={(e) => setSpacing(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700">旋转角度</label>
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{rotationAngle}°</span>
                </div>
                <input type="range" min="0" max="360" value={rotationAngle} onChange={(e) => setRotationAngle(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>
            </div>

            {hasPattern2 && (
              <div className="flex flex-col gap-3 mt-2">
                <h3 className="text-xs font-bold text-pink-600 border-b pb-1">图案 2 控制</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">图案大小</label>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{patternSize2}px</span>
                  </div>
                  <input type="range" min="20" max="300" value={patternSize2} onChange={(e) => setPatternSize2(Number(e.target.value))} className="w-full accent-pink-600" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">骨架间距</label>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{spacing2}px</span>
                  </div>
                  <input type="range" min="50" max="400" value={spacing2} onChange={(e) => setSpacing2(Number(e.target.value))} className="w-full accent-pink-600" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">旋转角度</label>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{rotationAngle2}°</span>
                  </div>
                  <input type="range" min="0" max="360" value={rotationAngle2} onChange={(e) => setRotationAngle2(Number(e.target.value))} className="w-full accent-pink-600" />
                </div>
              </div>
            )}

            {hasPattern3 && (
              <div className="flex flex-col gap-3 mt-2">
                <h3 className="text-xs font-bold text-amber-600 border-b pb-1">图案 3 控制</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">图案大小</label>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{patternSize3}px</span>
                  </div>
                  <input type="range" min="20" max="300" value={patternSize3} onChange={(e) => setPatternSize3(Number(e.target.value))} className="w-full accent-amber-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">骨架间距</label>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{spacing3}px</span>
                  </div>
                  <input type="range" min="50" max="400" value={spacing3} onChange={(e) => setSpacing3(Number(e.target.value))} className="w-full accent-amber-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-700">旋转角度</label>
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{rotationAngle3}°</span>
                  </div>
                  <input type="range" min="0" max="360" value={rotationAngle3} onChange={(e) => setRotationAngle3(Number(e.target.value))} className="w-full accent-amber-500" />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-slate-700">4. 选取底色或背景</label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button onClick={() => setBgType('color')} className={`flex-1 text-xs py-1.5 rounded-md ${bgType === 'color' ? 'bg-white font-bold text-indigo-600 shadow-sm' : 'text-slate-500'}`}>纯色底</button>
              <button onClick={() => setBgType('image')} className={`flex-1 text-xs py-1.5 rounded-md ${bgType === 'image' ? 'bg-white font-bold text-indigo-600 shadow-sm' : 'text-slate-500'}`}>图案底</button>
            </div>
            {bgType === 'color' ? (
              <div className="flex items-center gap-3 mt-1">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                <span className="text-sm text-slate-600 uppercase font-mono bg-white px-2 py-1 border rounded">{bgColor}</span>
              </div>
            ) : (
              <div className="mt-1 flex flex-col gap-2">
                <label className="flex items-center justify-center w-full h-16 border-2 border-dashed border-indigo-300 rounded-lg bg-indigo-50 cursor-pointer">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="w-4 h-4 text-indigo-500 mb-1" />
                    <p className="text-[10px] text-indigo-600">{bgImageSrc ? '更换背景' : '上传背景'}</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleBgImageUpload} />
                </label>
                {bgImageSrc && (
                  <div className="flex flex-col gap-2 bg-white p-3 rounded border border-slate-200 mt-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-700">背景图缩放</label>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{bgSize}%</span>
                    </div>
                    <input type="range" min="10" max="300" value={bgSize} onChange={(e) => setBgSize(Number(e.target.value))} className="w-full accent-indigo-500" />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-auto pt-4">
            <button onClick={handleDownload} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg">
              <Download size={20} /> 下载 PNG
            </button>
          </div>
        </div>

        <div className="flex-1 bg-slate-200 relative overflow-hidden flex items-center justify-center min-h-[500px]">
          <div className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur px-3 py-1.5 rounded-md shadow-sm border border-slate-200 text-xs font-semibold text-slate-600">实时渲染预览区 (1024x1024)</div>
          <div className="w-full h-full p-4 flex items-center justify-center overflow-auto">
             <canvas ref={canvasRef} width={1024} height={1024} className="max-w-full max-h-full object-contain shadow-2xl rounded" style={{ backgroundColor: 'white' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
