'use client';

import { motion } from 'framer-motion';
import { FileText, MapPin, TrendingUp, Users } from 'lucide-react';

interface StatsProps {
  listingCount?: number;
}

const stats = [
  {
    icon: FileText,
    value: '348,360+',
    label: 'Active Listings',
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Users,
    value: '50,000+',
    label: 'Verified Users',
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: MapPin,
    value: '30+',
    label: 'Cities Covered',
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: TrendingUp,
    value: '1,000+',
    label: 'Daily Deals',
    color: 'text-orange-600',
    bgColor: 'bg-orange-500/10',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function StatsSection({ listingCount }: StatsProps) {
  // Update the first stat with actual listing count if provided
  const displayStats = stats.map((stat, index) => {
    if (index === 0 && listingCount) {
      return {
        ...stat,
        value: `${listingCount.toLocaleString()}+`,
      };
    }
    return stat;
  });

  return (
    <div className="bg-muted/30 border-t">
      <div className="container-wide py-8 md:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {displayStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center group"
            >
              <div className="flex flex-col items-center space-y-2 md:space-y-3">
                {/* Icon */}
                <div className={`
                  w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${stat.bgColor} 
                  flex items-center justify-center
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <stat.icon className={`w-5 h-5 md:w-7 md:h-7 ${stat.color}`} />
                </div>

                {/* Value */}
                <div className="space-y-0.5 md:space-y-1">
                  <p className="text-lg md:text-2xl font-bold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[10px] md:text-sm text-muted-foreground/60 font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
