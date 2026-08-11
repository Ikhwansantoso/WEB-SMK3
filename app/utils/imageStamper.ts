// Tile stitching function using CartoDB Voyager tiles (fully supports CORS)
const fetchStaticMapImage = async (
  lat: number,
  lng: number,
  width: number,
  height: number
): Promise<HTMLCanvasElement | null> => {
  const zoom = 16;
  const x = ((lng + 180) / 360) * Math.pow(2, zoom);
  const y = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom);
  
  const tileX = Math.floor(x);
  const tileY = Math.floor(y);
  
  const canvas = document.createElement('canvas');
  canvas.width = 768;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  
  const loadImage = (url: string): Promise<HTMLImageElement | null> => new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
  
  const tilePromises: Promise<{ img: HTMLImageElement | null; dx: number; dy: number }>[] = [];
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const tx = tileX + dx;
      const ty = tileY + dy;
      const url = `https://basemaps.cartocdn.com/rastertiles/voyager/${zoom}/${tx}/${ty}.png`;
      tilePromises.push(loadImage(url).then(img => ({ img, dx, dy })));
    }
  }
  
  const tiles = await Promise.all(tilePromises);
  for (const tile of tiles) {
    if (tile.img) {
      ctx.drawImage(tile.img, (tile.dx + 1) * 256, (tile.dy + 1) * 256);
    }
  }
  
  const px = (x - (tileX - 1)) * 256;
  const py = (y - (tileY - 1)) * 256;
  
  const mapCanvas = document.createElement('canvas');
  mapCanvas.width = width;
  mapCanvas.height = height;
  const mapCtx = mapCanvas.getContext('2d');
  if (!mapCtx) return null;
  
  const cropX = Math.round(px - width / 2);
  const cropY = Math.round(py - height / 2);
  mapCtx.drawImage(canvas, cropX, cropY, width, height, 0, 0, width, height);
  
  // Draw red pin
  const cx = width / 2;
  const cy = height / 2;
  
  mapCtx.beginPath();
  mapCtx.moveTo(cx, cy);
  mapCtx.lineTo(cx, cy - 12);
  mapCtx.strokeStyle = '#b40000';
  mapCtx.lineWidth = 2;
  mapCtx.stroke();
  
  mapCtx.beginPath();
  mapCtx.arc(cx, cy - 12, 5, 0, 2 * Math.PI);
  mapCtx.fillStyle = '#eb3232';
  mapCtx.fill();
  mapCtx.lineWidth = 1;
  mapCtx.strokeStyle = '#b40000';
  mapCtx.stroke();
  
  mapCtx.beginPath();
  mapCtx.arc(cx - 1.5, cy - 13.5, 1, 0, 2 * Math.PI);
  mapCtx.fillStyle = '#ffffff';
  mapCtx.fill();
  
  return mapCanvas;
};

// Text wrap utility
const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (let n = 0; n < words.length; n++) {
    const testLine = currentLine + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(currentLine.trim());
      currentLine = words[n] + ' ';
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine.trim());
  return lines;
};

// Main stamp function
export const stampImage = async (
  imageFile: File,
  lat: string | null,
  lng: string | null,
  desc: string,
  address: string,
  takenAt: string
): Promise<Blob | null> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }
      
      // Draw main image
      ctx.drawImage(img, 0, 0);
      
      const width = img.width;
      const height = img.height;
      const scale = Math.min(3.0, Math.max(1.0, width / 1000.0));
      
      // Prepare overlay lines
      const timestamp = new Date(takenAt).toLocaleString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/\//g, '-').replace(/:/g, '.');
      
      const lines: string[] = [timestamp];
      if (lat && lng) {
        lines.push(`${parseFloat(lat).toFixed(6)}, ${parseFloat(lng).toFixed(6)}`);
        if (address) {
          lines.push(address);
        }
      }
      if (desc) {
        lines.push(desc);
      }
      
      let mapWidth = 0;
      let mapHeight = 0;
      let mapCanvas: HTMLCanvasElement | null = null;
      
      const mapWidthScaled = Math.round(220 * scale);
      const mapHeightScaled = Math.round(120 * scale);
      
      if (lat && lng) {
        try {
          mapCanvas = await fetchStaticMapImage(parseFloat(lat), parseFloat(lng), mapWidthScaled, mapHeightScaled);
          if (mapCanvas) {
            mapWidth = mapCanvas.width;
            mapHeight = mapCanvas.height;
          }
        } catch (e) {
          console.warn('Stitching static map failed', e);
        }
      }
      
      const boxPaddingX = Math.round(14 * scale);
      const boxPaddingY = Math.round(14 * scale);
      const margin = Math.round(10 * scale);
      const fontSize = Math.round(11 * scale);
      
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textBaseline = 'top';
      
      const textBoxWidth = Math.min(
        Math.round(260 * scale),
        width - Math.round(50 * scale) - (mapWidth ? mapWidth + Math.round(25 * scale) : 0)
      );
      
      const textLines: string[] = [];
      lines.forEach(line => {
        const chunks = wrapText(ctx, line, textBoxWidth);
        textLines.push(...chunks);
      });
      
      const lineHeight = Math.round(fontSize * 1.5);
      const textBlockHeight = textLines.length * lineHeight;
      
      let totalBoxWidth = 0;
      let totalBoxHeight = 0;
      
      if (mapCanvas) {
        totalBoxWidth = mapWidth + Math.round(15 * scale) + textBoxWidth + (boxPaddingX * 2);
        totalBoxHeight = Math.max(mapHeight, textBlockHeight) + (boxPaddingY * 2);
      } else {
        totalBoxWidth = textBoxWidth + (boxPaddingX * 2);
        totalBoxHeight = textBlockHeight + (boxPaddingY * 2);
      }
      
      let boxX2 = width - margin;
      let boxX1 = boxX2 - totalBoxWidth;
      if (boxX1 < margin) boxX1 = margin;
      
      let boxY1 = height - totalBoxHeight - margin;
      if (boxY1 < margin) boxY1 = margin;
      
      // Draw overlay box
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.beginPath();
      const r = Math.round(8 * scale);
      
      if ((ctx as any).roundRect) {
        (ctx as any).roundRect(boxX1, boxY1, totalBoxWidth, totalBoxHeight, r);
      } else {
        ctx.rect(boxX1, boxY1, totalBoxWidth, totalBoxHeight);
      }
      ctx.fill();
      
      let textX = boxX1 + boxPaddingX;
      if (mapCanvas) {
        const mapX = boxX1 + boxPaddingX;
        const mapY = boxY1 + Math.round((totalBoxHeight - mapHeight) / 2);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(mapX - 2, mapY - 2, mapWidth + 4, mapHeight + 4);
        ctx.drawImage(mapCanvas, mapX, mapY);
        
        textX = mapX + mapWidth + Math.round(15 * scale);
      }
      
      ctx.fillStyle = '#ffffff';
      let y = boxY1 + Math.round((totalBoxHeight - textBlockHeight) / 2);
      
      textLines.forEach(chunk => {
        ctx.fillText(chunk, textX, y);
        y += lineHeight;
      });
      
      canvas.toBlob(blob => {
        resolve(blob);
      }, 'image/jpeg', 0.85);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(imageFile);
  });
};
