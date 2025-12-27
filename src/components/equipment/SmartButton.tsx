import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartButtonProps {
  count: number;
  onClick?: (e: React.MouseEvent) => void;
}

export function SmartButton({ count, onClick }: SmartButtonProps) {
  const hasRepairs = count > 0;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
        'border',
        hasRepairs
          ? 'bg-warning/10 border-warning/30 text-warning hover:bg-warning/20'
          : 'bg-success/10 border-success/30 text-success hover:bg-success/20'
      )}
    >
      <Wrench className="w-4 h-4" />
      <span>{hasRepairs ? `${count} Active` : 'Healthy'}</span>
      {hasRepairs && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-5 h-5 rounded-full bg-warning text-warning-foreground flex items-center justify-center text-xs font-bold"
        >
          {count}
        </motion.span>
      )}
    </motion.button>
  );
}
