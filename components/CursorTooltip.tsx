"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState } from "react";

export function CursorTooltip({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  const [visible, setVisible] = useState(false);

  return (
    <div
      onMouseMove={(e) => {
        x.set(e.clientX + 12);
        y.set(e.clientY + 12);
      }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="relative inline-block"
    >
      {children}

      {visible && (
        <motion.div
          style={{ left: mouseX, top: mouseY }}
          className="fixed z-50 rounded-md bg-black px-3 py-1 text-xs text-white pointer-events-none"
        >
          {label}
        </motion.div>
      )}
    </div>
  );
}
