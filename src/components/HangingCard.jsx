import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import LanyardClip from './LanyardClip';

export default function HangingCard({
  icon: Icon,
  badgeText,
  title,
  subtitle,
  description,
  buttonText,
  buttonIcon: ButtonIcon,
  onButtonClick,
  customContent,
  initialDelay = 0,
  strapLength = 'h-10 sm:h-12',
}) {
  const constraintsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateSpring = useSpring(useTransform(x, [-100, 100], [-12, 12]), {
    stiffness: 350,
    damping: 22,
  });

  const strapRotate = useTransform(x, [-100, 100], [-8, 8]);

  return (
    <div
      ref={constraintsRef}
      className="relative flex flex-col items-center select-none touch-none w-full max-w-[240px] mx-auto"
    >
      {/* Top Lanyard Strap (Sleek Compact Length) */}
      <motion.div
        style={{ rotate: strapRotate, originY: 0 }}
        className={`w-4 ${strapLength} bg-gradient-to-r from-slate-900 via-[#1E293B] to-slate-900 border-x border-slate-700/60 shadow-md relative flex flex-col items-center z-10`}
      >
        <div className="w-1 h-full bg-blue-500/20" />
      </motion.div>

      {/* Metal Clip */}
      <div className="-mt-1 z-20">
        <LanyardClip />
      </div>

      {/* Compact White Card Body */}
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.35}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 20 }}
        style={{
          x,
          y,
          rotate: rotateSpring,
          transformOrigin: '50% 0px',
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 1.03, cursor: 'grabbing' }}
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          y: { duration: 0.6, delay: initialDelay, ease: 'easeOut' },
          opacity: { duration: 0.5, delay: initialDelay },
        }}
        className="relative -mt-2 w-full bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#F1F5F9] rounded-[16px] p-3.5 sm:p-4 shadow-[0_15px_35px_-8px_rgba(0,0,0,0.7)] border border-slate-300/80 text-slate-900 cursor-grab active:cursor-grabbing z-30 flex flex-col justify-between min-h-[255px]"
      >
        {/* Top Punch Slot */}
        <div className="relative w-8 h-2 bg-slate-950/90 rounded-full mx-auto mb-2.5 border border-slate-400/60 shadow-inner flex items-center justify-center">
          <div className="w-3 h-0.5 bg-slate-700 rounded-full" />
        </div>

        {/* Custom content or Default ID layout */}
        {customContent ? (
          customContent
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Header Icon */}
              {Icon && (
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-2 border border-blue-100 shadow-xs">
                  <Icon className="w-4 h-4" />
                </div>
              )}

              {/* Title / Badge */}
              {badgeText && (
                <span className="text-[9px] font-bold font-mono tracking-wider text-slate-400 uppercase block mb-0.5">
                  {badgeText}
                </span>
              )}

              <h4 className="text-sm font-extrabold text-slate-950 tracking-tight leading-snug uppercase mb-0.5">
                {title}
              </h4>

              {subtitle && (
                <p className="text-[11px] font-semibold text-blue-600 mb-1.5 leading-tight">
                  {subtitle}
                </p>
              )}

              {description && (
                <p className="text-[10.5px] text-slate-600 leading-snug">
                  {description}
                </p>
              )}
            </div>

            {/* Blue Action Button at Bottom */}
            {buttonText && (
              <div className="mt-3 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onButtonClick}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 shadow-xs shadow-blue-600/30"
                >
                  <span>{buttonText}</span>
                  {ButtonIcon && <ButtonIcon className="w-3 h-3" />}
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
