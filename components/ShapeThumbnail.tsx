import React, { useMemo } from 'react';

interface ShapeThumbnailProps {
  svgGenerator?: string;
  parameters?: Record<string, number | string | boolean>;
  className?: string;
  fillColor?: string;
}

// Execute the SVG path generator with given parameters
const executeSvgGenerator = (generator: string, params: Record<string, number | string | boolean>): string => {
  try {
    // Create a safe function from the generator code
    const func = new Function('params', `
      try {
        ${generator}
      } catch (e) {
        return '';
      }
    `);
    return func(params) || '';
  } catch (e) {
    console.error('Error executing SVG generator:', e);
    return '';
  }
};

// Calculate bounding box from SVG path
const getPathBounds = (pathData: string): { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number } => {
  const numbers: number[] = [];
  const regex = /[-+]?[0-9]*\.?[0-9]+/g;
  let match;

  while ((match = regex.exec(pathData)) !== null) {
    numbers.push(parseFloat(match[0]));
  }

  if (numbers.length < 2) {
    return { minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 };
  }

  // Extract x,y coordinates (assuming they come in pairs from path commands)
  const xs: number[] = [];
  const ys: number[] = [];

  // Simple parsing for common SVG path commands
  const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
  let currentX = 0, currentY = 0;

  commands.forEach(cmd => {
    const type = cmd[0].toUpperCase();
    const nums = cmd.slice(1).match(/[-+]?[0-9]*\.?[0-9]+/g)?.map(Number) || [];

    switch (type) {
      case 'M':
      case 'L':
        for (let i = 0; i < nums.length; i += 2) {
          currentX = nums[i];
          currentY = nums[i + 1] || currentY;
          xs.push(currentX);
          ys.push(currentY);
        }
        break;
      case 'H':
        nums.forEach(n => {
          currentX = n;
          xs.push(currentX);
        });
        break;
      case 'V':
        nums.forEach(n => {
          currentY = n;
          ys.push(currentY);
        });
        break;
      case 'A':
        // Arc command: rx ry x-axis-rotation large-arc sweep x y
        for (let i = 0; i < nums.length; i += 7) {
          currentX = nums[i + 5];
          currentY = nums[i + 6];
          xs.push(currentX);
          ys.push(currentY);
        }
        break;
      case 'C':
        // Cubic bezier: x1 y1 x2 y2 x y
        for (let i = 0; i < nums.length; i += 6) {
          xs.push(nums[i], nums[i + 2], nums[i + 4]);
          ys.push(nums[i + 1], nums[i + 3], nums[i + 5]);
          currentX = nums[i + 4];
          currentY = nums[i + 5];
        }
        break;
      case 'Q':
        // Quadratic bezier: x1 y1 x y
        for (let i = 0; i < nums.length; i += 4) {
          xs.push(nums[i], nums[i + 2]);
          ys.push(nums[i + 1], nums[i + 3]);
          currentX = nums[i + 2];
          currentY = nums[i + 3];
        }
        break;
      case 'Z':
        break;
    }
  });

  if (xs.length === 0 || ys.length === 0) {
    return { minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 };
  }

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX || 100,
    height: maxY - minY || 100
  };
};

const ShapeThumbnail: React.FC<ShapeThumbnailProps> = ({
  svgGenerator,
  parameters = {},
  className = '',
  fillColor = '#94a3b8'
}) => {
  const { svgPath, viewBox } = useMemo(() => {
    if (!svgGenerator) {
      return { svgPath: '', viewBox: '0 0 100 100' };
    }

    // Use provided parameters or defaults based on common shape params
    const defaultParams: Record<string, number | string | boolean> = {
      width: 200,
      height: 150,
      cornerRadius: 15,
      holeDiameter: 10,
      diameter: 100,
      outerDiameter: 100,
      innerDiameter: 50,
      size: 100,
      base: 150,
      armWidth: 30,
      flangeWidth: 30,
      baseHeight: 25,
      ...parameters
    };

    const path = executeSvgGenerator(svgGenerator, defaultParams);

    if (!path) {
      return { svgPath: '', viewBox: '0 0 100 100' };
    }

    const bounds = getPathBounds(path);
    const padding = Math.max(bounds.width, bounds.height) * 0.1;
    const vb = `${bounds.minX - padding} ${bounds.minY - padding} ${bounds.width + padding * 2} ${bounds.height + padding * 2}`;

    return { svgPath: path, viewBox: vb };
  }, [svgGenerator, parameters]);

  if (!svgPath) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox={viewBox}
        className="w-full h-full max-w-[80%] max-h-[80%]"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={svgPath}
          fill={fillColor}
          stroke="none"
        />
      </svg>
    </div>
  );
};

export default ShapeThumbnail;
