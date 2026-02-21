import { Crown, Eye, Megaphone, Rocket, Star, Zap } from 'lucide-react';

interface PromotionIconProps {
  iconName?: string;
  className?: string;
}

export function PromotionIcon({ iconName, className }: PromotionIconProps) {
  switch (iconName) {
    case 'Star': return <Star className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Eye': return <Eye className={className} />;
    case 'Megaphone': return <Megaphone className={className} />;
    case 'Crown': return <Crown className={className} />;
    case 'Rocket': return <Rocket className={className} />;
    default: return <Star className={className} />;
  }
}
