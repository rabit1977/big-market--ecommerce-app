// app/contact/ContactContent.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { useMutation } from 'convex/react';
import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  captchaResult: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  captchaResult?: string;
}

const INITIAL_FORM_STATE: FormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  captchaResult: '',
};

export const ContactContent = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();

  // Simple math captcha state
  const [captcha, setCaptcha] = useState({ a: 7, b: 3, result: 10 });

  const refreshCaptcha = useCallback(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ a, b, result: a + b });
  }, []);

  /**
   * Validate form fields
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid business email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.subject.trim() || formData.subject === 'Select an inquiry type') {
      newErrors.subject = 'Please select a subject';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message';
    }

    if (parseInt(formData.captchaResult) !== captcha.result) {
      newErrors.captchaResult = 'Invalid calculation. Try again.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, captcha.result]);

  /**
   * Handle input changes
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error for this field when user starts typing
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  /**
   * Handle form submission
   */
  const submitContact = useMutation(api.contact.submit);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      startTransition(async () => {
        try {
            await submitContact({
                name: formData.name,
                email: formData.email,
                phone: formData.phone || undefined,
                subject: formData.subject,
                message: formData.message,
            });
            
            toast.success("Email sent successfully! Our team will contact you within 24 hours.");
            setFormData(INITIAL_FORM_STATE);
            setErrors({});
            refreshCaptcha();
        } catch (error) {
            console.error('Failed to submit contact form:', error);
            toast.error("Failed to send message. Please try again later.");
        }
      });
    },
    [formData, validateForm, refreshCaptcha, submitContact]
  );

  return (
      <motion.div
        initial='hidden'
        animate='visible'
        className='container mx-auto px-4 py-12 sm:py-20 lg:py-28 max-w-7xl'
      >
        {/* Page Header */}
        <motion.div 
          className='text-center mb-16 sm:mb-24 space-y-4'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className='text-4xl sm:text-6xl font-black tracking-tighter text-foreground'>
            Get in Touch
          </h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            We&apos;re here to help. Reach out to us for any questions or support.
          </p>
        </motion.div>

        <div className='grid lg:grid-cols-12 gap-8 lg:gap-16 items-start'>
          {/* Contact Form */}
          <motion.div 
            className='lg:col-span-7 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Glossy overlay effect */}
            <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none' />

            <div className='relative z-10'>
              <h2 className='text-3xl font-bold mb-8'>
                Send us a message
              </h2>

              <form onSubmit={handleSubmit} className='space-y-6' noValidate>
                <div className='grid sm:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='name' className='font-semibold'>Full Name</Label>
                    <Input
                      id='name'
                      name='name'
                      placeholder='e.g. Marko Petrovski'
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isPending}
                      className={`h-12 bg-secondary/15 border-border/40 focus:border-primary/50 transition-all rounded-xl ${errors.name ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                    />
                    {errors.name && <p className='text-[10px] font-bold text-red-500 uppercase tracking-wider'>{errors.name}</p>}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email' className='font-semibold'>Business Email</Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      placeholder='name@company.com'
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isPending}
                      className={`h-12 bg-secondary/15 border-border/40 focus:border-primary/50 transition-all rounded-xl ${errors.email ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                    />
                    {errors.email && <p className='text-[10px] font-bold text-red-500 uppercase tracking-wider'>{errors.email}</p>}
                  </div>
                </div>

                <div className='grid sm:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='phone' className='font-semibold'>Phone Number</Label>
                    <Input
                      id='phone'
                      name='phone'
                      type='tel'
                      placeholder='+389 XX XXX XXX'
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isPending}
                      className={`h-12 bg-secondary/15 border-border/40 focus:border-primary/50 transition-all rounded-xl ${errors.phone ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                    />
                    {errors.phone && <p className='text-[10px] font-bold text-red-500 uppercase tracking-wider'>{errors.phone}</p>}
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='subject' className='font-semibold'>Inquiry Type</Label>
                    <select
                        id='subject'
                        name='subject'
                        value={formData.subject}
                        onChange={handleChange as any}
                        disabled={isPending}
                        className={`w-full h-12 px-3 bg-secondary/15 border-border/40 border focus:border-primary/50 transition-all rounded-xl text-sm outline-none appearance-none ${errors.subject ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                    >
                        <option value="">Choose a category</option>
                        <option value="GENERAL">General Information</option>
                        <option value="TECHNICAL">Technical Support</option>
                        <option value="PREMIUM">Premium Services & Billing</option>
                        <option value="VERIFICATION">Identity Verification</option>
                        <option value="REPORT">Report a Listing/User</option>
                    </select>
                    {errors.subject && <p className='text-[10px] font-bold text-red-500 uppercase tracking-wider'>{errors.subject}</p>}
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='message' className='font-semibold'>Message Content</Label>
                  <Textarea
                    id='message'
                    name='message'
                    placeholder='Provide as much detail as possible to help us assist you better...'
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isPending}
                    rows={5}
                    className={`bg-secondary/15 border-border/40 focus:border-primary/50 transition-all resize-none rounded-xl ${errors.message ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                  />
                  {errors.message && <p className='text-[10px] font-bold text-red-500 uppercase tracking-wider'>{errors.message}</p>}
                </div>

                <div className='space-y-4 p-5 rounded-2xl bg-primary/5 border border-primary/10'>
                    <div className='flex items-center justify-between'>
                        <Label htmlFor='captchaResult' className='font-bold text-sm'>
                            Security Verification: <span className='text-primary ml-1'>{captcha.a} + {captcha.b} = ?</span>
                        </Label>
                        <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-[10px] uppercase font-black tracking-widest"
                            onClick={refreshCaptcha}
                        >
                            Refresh
                        </Button>
                    </div>
                    <Input
                        id='captchaResult'
                        name='captchaResult'
                        placeholder='Enter the sum'
                        value={formData.captchaResult}
                        onChange={handleChange}
                        disabled={isPending}
                        className={`h-11 bg-background border-border/40 focus:border-primary/50 transition-all rounded-xl ${errors.captchaResult ? 'border-red-500' : ''}`}
                    />
                    {errors.captchaResult && <p className='text-[10px] font-bold text-red-500 uppercase tracking-wider'>{errors.captchaResult}</p>}
                </div>

                <Button
                  type='submit'
                  className='w-full sm:w-auto h-14 px-10 text-lg font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95'
                  disabled={isPending}
                >
                  {isPending ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Email <Send className='ml-2 h-5 w-5' />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div 
            className='lg:col-span-5 space-y-8'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Info Cards */}
            <div className='grid gap-6'>
              {[
                { icon: MapPin, title: 'Visit Us', content: '123 Tech Avenue, Suite 100\nInnovation City, CA 90210' },
                { icon: Phone, title: 'Call Us', content: '+1 (555) 123-4567', link: 'tel:+15551234567' },
                { icon: Mail, title: 'Email Us', content: 'support@electro.com', link: 'mailto:support@electro.com' },
                { icon: Clock, title: 'Business Hours', content: 'Mon-Fri: 9AM - 6PM\nSat: 10AM - 4PM' }
              ].map((item, idx) => (
                <div key={idx} className='flex items-start gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors shadow-sm'>
                  <div className='h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary'>
                    <item.icon className='h-6 w-6' />
                  </div>
                  <div>
                    <h3 className='font-bold text-lg mb-1'>{item.title}</h3>
                    {item.link ? (
                      <Link href={item.link} className='text-muted-foreground hover:text-primary transition-colors whitespace-pre-line'>
                        {item.content}
                      </Link>
                    ) : (
                      <p className='text-muted-foreground whitespace-pre-line'>{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className='rounded-3xl overflow-hidden shadow-xl border border-border/50 h-64 sm:h-80'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.004258724266!3d40.74076987932881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c8eef01%3A0x7a2ff2c2e2b3c3b!2sTech%20Avenue!5e0!3m2!1sen!2sus!4v1690835000000!5m2!1sen!2sus'
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                title='Office location map'
                className='w-full h-full border-0 filter grayscale hover:grayscale-0 transition-all duration-700'
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
  );
};
