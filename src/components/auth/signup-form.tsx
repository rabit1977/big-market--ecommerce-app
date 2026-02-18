'use client';

import { signupAction } from '@/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Loader2, 
  Lock, 
  Mail, 
  Sparkles, 
  User 
} from 'lucide-react';
import { useActionState, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// --- Utility: Password Strength Calculator ---
const getPasswordStrength = (password: string) => {
  let score = 0;
  if (!password) return { score: 0, label: 'Enter password', color: 'bg-muted' };

  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-500' };
  if (score <= 3) return { score, label: 'Good', color: 'bg-amber-500' };
  if (score <= 4) return { score, label: 'Strong', color: 'bg-blue-500' };
  return { score, label: 'Excellent', color: 'bg-emerald-500' };
};

// --- Component: SignUpForm ---
export function SignUpForm({ onSuccess }: { onSuccess: (email: string, password: string) => void }) {
  const [state, formAction, isPending] = useActionState(signupAction, null);

  // Consolidated Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Derived State
  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);
  const passwordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = 
    formData.name.length >= 2 && 
    formData.email.includes('@') && 
    formData.password.length >= 6 && 
    passwordsMatch;

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Effect: Handle Server Response
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      onSuccess(formData.email, formData.password);
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, onSuccess, formData.email, formData.password]);

  return (
    <form action={formAction} className="space-y-5">
      
      {/* Server Error Message */}
      <AnimatePresence>
        {state?.message && !state.success && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm flex items-start gap-3 overflow-hidden"
          >
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{state.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          Full Name
        </label>
        <div className="relative">
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            minLength={2}
            className="pl-11"
            value={formData.name}
            onChange={handleChange}
            disabled={isPending}
          />
          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium leading-none flex gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          Email Address
        </label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="pl-11"
            value={formData.email}
            onChange={handleChange}
            disabled={isPending}
          />
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium leading-none flex gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            required
            minLength={6}
            className="pl-11 pr-11"
            value={formData.password}
            onChange={handleChange}
            disabled={isPending}
          />
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Password Strength Meter */}
        <AnimatePresence>
          {formData.password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <div className="flex gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      level <= passwordStrength.score ? passwordStrength.color : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <KeyRound className="h-3 w-3" />
                Strength: <span className={`font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>{passwordStrength.label}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium leading-none flex gap-2">
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          Confirm Password
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword" // Note: This field usually isn't needed by the server action unless you validate there too
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            required
            className={`pl-11 pr-11 ${!passwordsMatch && formData.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isPending}
          />
          <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        
        {/* Mismatch Error */}
        <AnimatePresence>
          {!passwordsMatch && formData.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-xs flex items-center gap-1.5 font-medium"
            >
              <AlertCircle className="h-3 w-3" />
              Passwords do not match
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
        size="lg"
        // Robustly disable the button if logic isn't met
        disabled={isPending || !isFormValid}
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Creating account...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Create Account
          </>
        )}
      </Button>
    </form>
  );
}