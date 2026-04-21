'use client'

import { motion } from 'framer-motion'

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030014]">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/[0.08] rounded-full blur-[120px]" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Animated logo */}
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30"
            animate={{ 
              rotateY: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'easeInOut'
            }}
          >
            <span className="text-white text-2xl font-bold">M</span>
          </motion.div>
          <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 blur-xl opacity-40 animate-pulse" />
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: '50%' }}
          />
        </div>

        <p className="text-gray-500 text-xs uppercase tracking-[0.3em] font-medium">Loading</p>
      </div>
    </div>
  )
}

export default Loading