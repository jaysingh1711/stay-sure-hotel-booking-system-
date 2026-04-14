import { motion } from "framer-motion";

export default function FetchLoading() {
  return (
    <div className="flex items-center justify-center p-4 ">
      <motion.div 
        className="relative h-8 w-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-primary border-r-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-muted border-l-transparent"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}

