import React, { useState, useEffect, useRef, useCallback } from 'react';

type Matrix3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

const IDENTITY_MATRIX: Matrix3 = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

// Exact 3x3 matrix multiplication
function multiply3x3(a: Matrix3, b: Matrix3): Matrix3 {
  const res: Matrix3 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      let sum = 0;
      for (let k = 0; k < 3; k++) {
        sum += a[r][k] * b[k][c];
      }
      res[r][c] = Math.round(sum);
    }
  }
  return res;
}

// 90-degree orthogonal rotation matrices for CSS 3D space
function getRotationMatrix(axis: 'x' | 'y' | 'z', dir: 1 | -1): Matrix3 {
  if (axis === 'x') {
    return [
      [1, 0, 0],
      [0, 0, -dir],
      [0, dir, 0],
    ];
  } else if (axis === 'y') {
    return [
      [0, 0, dir],
      [0, 1, 0],
      [-dir, 0, 0],
    ];
  } else {
    return [
      [0, -dir, 0],
      [dir, 0, 0],
      [0, 0, 1],
    ];
  }
}

interface CubieState {
  id: number;
  origX: number;
  origY: number;
  origZ: number;
  currX: number;
  currY: number;
  currZ: number;
  matrix: Matrix3;
}

const PHASES = [
  { text: 'Addressing the problem space...', action: 'scramble' },
  { text: 'Formulating an optimal approach...', action: 'scramble' },
  { text: 'Engineering the architecture...', action: 'explode' },
  { text: 'Refining & building the system...', action: 'solve' },
  { text: 'System optimized & harmonized.', action: 'idle' },
];

export const GlassRubiksCube: React.FC = () => {
  const cubeRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // 3D rotation state (calm, steady, not erratic)
  const rotationRef = useRef({ x: -18, y: 35 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(true);

  // Autonomous phase state & smooth text transition state
  const [displayedText, setDisplayedText] = useState(PHASES[0].text);
  const [isTextFading, setIsTextFading] = useState(false);
  const [isExploded, setIsExploded] = useState(false);

  // Spacing for explode animation
  const spacingRef = useRef(48);
  const targetSpacingRef = useRef(48);

  // Initialize 26 outer cubies in 3x3x3 grid (internal 0,0,0 is skipped)
  const initialCubies: CubieState[] = [];
  let idCounter = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;

        initialCubies.push({
          id: idCounter++,
          origX: x,
          origY: y,
          origZ: z,
          currX: x,
          currY: y,
          currZ: z,
          matrix: IDENTITY_MATRIX,
        });
      }
    }
  }

  const [cubies, setCubies] = useState<CubieState[]>(initialCubies);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Direct DOM transform update (Zero React re-renders during motion)
  const applyCubeTransform = useCallback(() => {
    if (cubeRef.current) {
      const { x, y } = rotationRef.current;
      cubeRef.current.style.transform = `rotateX(${x.toFixed(2)}deg) rotateY(${y.toFixed(2)}deg)`;
    }
  }, []);

  // IntersectionObserver: automatically stop 3D loop when hero is scrolled out of view
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Rotate a specific layer in 3D using exact 3x3 orthogonal matrix multiplication
  const rotateLayer = useCallback((axis: 'x' | 'y' | 'z', layerIndex: number, dir: 1 | -1 = 1) => {
    const R = getRotationMatrix(axis, dir);

    setCubies((prev) =>
      prev.map((c) => {
        const matchesLayer =
          (axis === 'x' && Math.round(c.currX) === layerIndex) ||
          (axis === 'y' && Math.round(c.currY) === layerIndex) ||
          (axis === 'z' && Math.round(c.currZ) === layerIndex);

        if (!matchesLayer) return c;

        // Position vector multiplied by rotation matrix
        const newX = R[0][0] * c.currX + R[0][1] * c.currY + R[0][2] * c.currZ;
        const newY = R[1][0] * c.currX + R[1][1] * c.currY + R[1][2] * c.currZ;
        const newZ = R[2][0] * c.currX + R[2][1] * c.currY + R[2][2] * c.currZ;

        // Orientation matrix multiplied by rotation matrix (guarantees faces NEVER point inward)
        const newMatrix = multiply3x3(R, c.matrix);

        return {
          ...c,
          currX: Math.round(newX),
          currY: Math.round(newY),
          currZ: Math.round(newZ),
          matrix: newMatrix,
        };
      })
    );
  }, []);

  // Reorganize / Solve all cubies back to pristine state
  const solveCube = useCallback(() => {
    setCubies((prev) =>
      prev.map((c) => ({
        ...c,
        currX: c.origX,
        currY: c.origY,
        currZ: c.origZ,
        matrix: IDENTITY_MATRIX,
      }))
    );
  }, []);

  // Smooth text change handler with fade transition
  const transitionToPhase = useCallback((newPhaseIndex: number) => {
    setIsTextFading(true);
    setTimeout(() => {
      setDisplayedText(PHASES[newPhaseIndex].text);
      setIsTextFading(false);
    }, 300);
  }, []);

  // Autonomous phased lifecycle loop (spacious 5.5s intervals, gentle single actions)
  useEffect(() => {
    const axes: Array<'x' | 'y' | 'z'> = ['x', 'y', 'z'];
    const layers = [-1, 0, 1];
    const dirs: Array<1 | -1> = [1, -1];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep = (currentStep + 1) % PHASES.length;
      transitionToPhase(currentStep);

      const action = PHASES[currentStep].action;

      if (action === 'scramble') {
        targetSpacingRef.current = 48;
        setIsExploded(false);
        const axis = axes[Math.floor(Math.random() * axes.length)];
        const layer = layers[Math.floor(Math.random() * layers.length)];
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        rotateLayer(axis, layer, dir);
      } else if (action === 'explode') {
        targetSpacingRef.current = 68;
        setIsExploded(true);
      } else if (action === 'solve') {
        targetSpacingRef.current = 48;
        setIsExploded(false);
        setTimeout(() => {
          solveCube();
        }, 350);
      } else if (action === 'idle') {
        targetSpacingRef.current = 48;
        setIsExploded(false);
      }
    }, 5500);

    return () => clearInterval(interval);
  }, [rotateLayer, solveCube, transitionToPhase]);

  // Main 60/120fps Animation Loop: Calm, gentle, steady rotation
  useEffect(() => {
    const loop = (time: number) => {
      const delta = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      if (isVisibleRef.current) {
        spacingRef.current += (targetSpacingRef.current - spacingRef.current) * 0.08;

        if (!isDraggingRef.current) {
          // Simultaneous continuous rotation along both X and Y axes
          rotationRef.current.y = (rotationRef.current.y + 7.5 * delta) % 360;
          rotationRef.current.x = (rotationRef.current.x + 5.0 * delta) % 360;

          applyCubeTransform();
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [applyCubeTransform]);

  // Pointer drag controls: User can rotate freely, and upon release it continues smoothly from that angle!
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    rotationRef.current.x = (rotationRef.current.x - deltaY * 0.35) % 360;
    rotationRef.current.y = (rotationRef.current.y + deltaX * 0.35) % 360;

    dragStartRef.current = { x: e.clientX, y: e.clientY };

    applyCubeTransform();
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Dimensions
  const cubieSize = 46;
  const currentSpacing = isExploded ? 68 : 48;
  const half = cubieSize / 2;

  return (
    <div className="relative flex flex-col items-center select-none font-mono">
      {/* 3D Viewport Stage */}
      <div
        ref={stageRef}
        className="w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center cursor-grab active:cursor-grabbing perspective-[900px] touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Ambient Specular Floor Shadow */}
        <div className="absolute w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none -bottom-5 transform -rotate-x-60 scale-y-50 opacity-30 will-change-transform" />

        {/* 3D Rotating Pivot Container (Direct DOM transform, zero React re-render) */}
        <div
          ref={cubeRef}
          className="relative w-0 h-0 will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(-18deg) rotateY(35deg)',
          }}
        >
          {cubies.map((cubie) => {
            const posX = cubie.currX * currentSpacing;
            const posY = cubie.currY * currentSpacing;
            const posZ = cubie.currZ * currentSpacing;
            const m = cubie.matrix;

            // Direct 4x4 matrix transformation combining position and 3D orientation
            const matrix3d = `matrix3d(${m[0][0]}, ${m[1][0]}, ${m[2][0]}, 0, ${m[0][1]}, ${m[1][1]}, ${m[2][1]}, 0, ${m[0][2]}, ${m[1][2]}, ${m[2][2]}, 0, ${posX}, ${posY}, ${posZ}, 1)`;

            // Colored stickers belong to the physical cubie's canonical original outer sides
            const hasFront = cubie.origZ === 1;
            const hasBack = cubie.origZ === -1;
            const hasTop = cubie.origY === -1;
            const hasBottom = cubie.origY === 1;
            const hasRight = cubie.origX === 1;
            const hasLeft = cubie.origX === -1;

            return (
              <div
                key={cubie.id}
                className="absolute transition-transform duration-500 ease-out will-change-transform"
                style={{
                  width: `${cubieSize}px`,
                  height: `${cubieSize}px`,
                  left: `${-half}px`,
                  top: `${-half}px`,
                  transformStyle: 'preserve-3d',
                  transform: matrix3d,
                }}
              >
                {/* 1. FRONT FACE (Z+) - Brick */}
                {hasFront && (
                  <div
                    className="absolute inset-0 rounded-[6px] border bg-[#7D2E24]/90 border-[#B23A2B]/45 shadow-[inset_0_0_12px_rgba(178,58,43,0.25)]"
                    style={{
                      transform: `translateZ(${half}px)`,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center opacity-45 text-[9px] text-[#E06A55]">
                      ◆
                    </div>
                  </div>
                )}

                {/* 2. BACK FACE (Z-) - Denim */}
                {hasBack && (
                  <div
                    className="absolute inset-0 rounded-[6px] border bg-[#183153]/90 border-[#3B6BA5]/45 shadow-[inset_0_0_12px_rgba(59,107,165,0.25)]"
                    style={{
                      transform: `rotateY(180deg) translateZ(${half}px)`,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center opacity-45 text-[9px] text-[#60A5FA]">
                      ◇
                    </div>
                  </div>
                )}

                {/* 3. RIGHT FACE (X+) - Burnt Orange */}
                {hasRight && (
                  <div
                    className="absolute inset-0 rounded-[6px] border bg-[#783204]/90 border-[#D45D16]/45 shadow-[inset_0_0_12px_rgba(212,93,22,0.25)]"
                    style={{
                      transform: `rotateY(90deg) translateZ(${half}px)`,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center opacity-45 text-[9px] text-[#FB923C]">
                      ▲
                    </div>
                  </div>
                )}

                {/* 4. LEFT FACE (X-) - Plum */}
                {hasLeft && (
                  <div
                    className="absolute inset-0 rounded-[6px] border bg-[#3D1438]/90 border-[#8A337E]/45 shadow-[inset_0_0_12px_rgba(138,51,126,0.25)]"
                    style={{
                      transform: `rotateY(-90deg) translateZ(${half}px)`,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center opacity-45 text-[9px] text-[#C084FC]">
                      ▼
                    </div>
                  </div>
                )}

                {/* 5. TOP FACE (Y-) - Parchment */}
                {hasTop && (
                  <div
                    className="absolute inset-0 rounded-[6px] border bg-[#483F33]/90 border-[#D8CCA9]/40 shadow-[inset_0_0_12px_rgba(232,223,208,0.22)]"
                    style={{
                      transform: `rotateX(90deg) translateZ(${half}px)`,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center opacity-45 text-[9px] text-[#E8DFD0]">
                      ●
                    </div>
                  </div>
                )}

                {/* 6. BOTTOM FACE (Y+) - Forest */}
                {hasBottom && (
                  <div
                    className="absolute inset-0 rounded-[6px] border bg-[#0B331A]/90 border-[#2A7545]/45 shadow-[inset_0_0_12px_rgba(42,117,69,0.25)]"
                    style={{
                      transform: `rotateX(-90deg) translateZ(${half}px)`,
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center opacity-45 text-[9px] text-[#4ADE80]">
                      ■
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Smoothly Animated Engineering Narrative Telemetry */}
      <div className="min-h-[38px] flex items-center justify-center mt-3">
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface/90 border border-border/80 shadow-md backdrop-blur-sm transition-all duration-300 ease-out ${
            isTextFading
              ? 'opacity-0 translate-y-1.5 scale-95'
              : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-mono text-text-main tracking-wide">
            // {displayedText}
          </span>
        </div>
      </div>
    </div>
  );
};




