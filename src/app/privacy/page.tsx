'use client';

import { AppBreadcrumbs } from '@/components/shared/app-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useMutation } from 'convex/react';
import { Building2, Globe, HelpCircle, KeyRound, Lock, Mail, Shield, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';

export default function PrivacyPage() {
  const submitContact = useMutation(api.contact.submit);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      if(!formData.name || !formData.email || !formData.subject || !formData.message) {
          toast.error("Please fill in all required fields.");
          setLoading(false);
          return;
      }
      
      if (formData.message.length < 10) {
          toast.error("Message is too short.");
          setLoading(false);
          return;
      }

      try {
          await submitContact(formData);
          toast.success("Email sent successfully! We will get back to you soon.");
          setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } catch (err) {
          toast.error("Failed to send message. Please try again.");
          console.error(err);
      } finally {
          setLoading(false);
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <div className="relative bg-muted/30 border-b border-border/50">
        <div className="container-wide py-8 md:py-12">
          <AppBreadcrumbs className="mb-6" />
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Data Protection and Terms of Service for Biggest Market
          </p>
        </div>
      </div>

      <div className="container-wide py-8 md:py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">

            {/* Introduction */}
            <section className="prose dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground">
                The protection and security of your personal data are among our top priorities at Biggest Market. We pay special attention to the right to privacy and the protection of our users' personal data. We appreciate your interest in our website and thank you for your visit.
              </p>
            </section>

            {/* Data Collection */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>What Data Do We Collect?</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  When creating a user profile on Biggest Market, we collect and store the data necessary to create your profile. By using the Biggest Market website and verifying your user profile, you consent to the collection, processing, and use of your personal data by our company.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['Full Name', 'Email Address', 'Phone Number', 'Location', 'Listing Data', 'IP Address'].map((item) => (
                    <div key={item} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <p className="text-xs text-muted-foreground italic">
                  * Data is stored in accordance with personal data protection regulations. For more detailed information, please visit the website of the Directorate for Personal Data Protection of the Republic of North Macedonia at <a href="https://dzlp.mk" target="_blank" className="text-primary hover:underline">dzlp.mk</a>.
                </p>
              </CardContent>
            </Card>

            {/* Security & Usage */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Security & Data Usage
              </h2>
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Your personal data is used exclusively to provide and improve our services. Personal data will not be disclosed to third parties without your consent. We use appropriate technical security measures (SSL encryption) to protect your data submitted to us.
                </p>
                <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <span className="font-bold">Note:</span> Our security measures are constantly being improved in line with technological developments. However, we cannot fully guarantee that security measures will prevent third parties from illegal use. If you are aware of such an incident, please notify us immediately.
                  </div>
                </div>
              </div>
            </section>

             {/* Registration & Account */}
             <section className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <KeyRound className="w-6 h-6 text-primary" />
                Registration & Profile
              </h2>
              <div className="grid gap-4">
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-2">Profile Verification</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    For security reasons, Profile Verification is mandatory. The verification cost is <span className="font-bold text-foreground">98 MKD + VAT</span> for 1 year. 
                    This allows you to post and edit up to 50 listings per year for free.
                  </p>
                  <div className="text-xs p-3 bg-muted rounded-lg border border-border/50">
                    <strong>Important:</strong> All unverified profiles will be deleted. The certified logo does not provide 100% protection against misuse; the same Biggest Market terms and conditions apply.
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-2">Social Login</h3>
                  <p className="text-sm text-muted-foreground">
                    The Social Login function (Google, Facebook, Apple) serves for simplified and secure user authentication. Depending on the chosen provider, certain personal data is transferred to us during login. These data include, but are not limited to, name, email, and unique user ID.
                  </p>
                </div>
              </div>
            </section>

            {/* Forbidden Content */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Lock className="w-6 h-6 text-destructive" />
                Prohibited Content
              </h2>
              <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  It is strictly forbidden to post listings with the following content:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {[
                    'Stolen or counterfeit items',
                    'Weapons and ammunition',
                    'Drugs and stimulants',
                    'Human organs and bodily fluids',
                    'Pyrotechnics and explosives',
                    'Prescription medications',
                    'Pornography',
                    'Racist or offensive content',
                    'Personal data of third parties',
                    'Listings in foreign languages without translation'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

             {/* Cookies & Maps */}
             <section className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary" />
                Cookies & Maps
              </h2>
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-base mb-1">Cookies</h3>
                  <p className="text-sm text-muted-foreground">
                    We use cookies to optimize our services. This information is anonymous. You can disable cookies in your browser settings, but this may limit some functionalities of the platform.
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-bold text-base mb-1">Maps</h3>
                  <p className="text-sm text-muted-foreground">
                    We use OpenStreetMap and Google Maps. Your IP address may be transmitted to these services to display map data.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Form Section */}
            <section id="contact" className="pt-8 border-t border-border">
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 md:p-8 bg-primary/5 border-b border-primary/10">
                  <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                    <Mail className="w-6 h-6 text-primary" />
                    Contact Biggest Market
                  </h2>
                  <p className="text-muted-foreground">
                    Have any questions? Fill out the form below.
                  </p>
                </div>
                
                <div className="p-6 md:p-8 space-y-6">
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Your Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="Enter your name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Phone Number</label>
                        <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="07x xxx xxx" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Email Address</label>
                      <input name="email" value={formData.email} onChange={handleChange} required type="email" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" placeholder="name@example.com" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Subject</label>
                      <select name="subject" value={formData.subject} onChange={handleChange} required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <option value="">Select subject...</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="abuse">Report Abuse</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Message</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} required className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y" placeholder="Enter your message..." />
                    </div>

                    <div className="pt-2">
                      <Button type="submit" disabled={loading} className="w-full md:w-auto font-bold px-8">
                        {loading ? 'Sending...' : 'Send Email'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </section>

          </div>

          {/* Sidebar Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">
              
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Company
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Biggest Market</p>
                  <p>Skopje, Macedonia</p>
                  <div className="pt-2 border-t border-border/50 mt-2">
                    <p className="text-xs">Updated: 05.01.2026</p>
                  </div>
                </div>
              </div>

               <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  Useful Links
                </h3>
                <nav className="flex flex-col gap-2 text-sm">
                  <Link href="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                    Registration
                  </Link>
                  <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                    Help & Support
                  </Link>
                  <Link href="/safety" className="text-muted-foreground hover:text-primary transition-colors">
                    Safety Tips
                  </Link>
                </nav>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
