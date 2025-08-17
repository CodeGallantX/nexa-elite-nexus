import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ContactFormProps {
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ className }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send email via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (!error && data?.success) {
        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for contacting NeXa_Esports. We'll get back to you soon.",
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        throw new Error(error?.message || data?.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Email sending error:', error);
      toast({
        title: "Message Failed to Send",
        description: "There was an error sending your message. Please try again or contact us directly at nexaesports@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`grid grid-cols-1 gap-6 text-left ${className}`}>
      <div>
        <Label htmlFor="name" className="block text-muted-foreground text-sm font-rajdhani mb-2">
          Name *
        </Label>
        <Input 
          type="text" 
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 font-rajdhani text-foreground" 
          placeholder="Your Name"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <Label htmlFor="email" className="block text-muted-foreground text-sm font-rajdhani mb-2">
          Email *
        </Label>
        <Input 
          type="email" 
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 font-rajdhani text-foreground" 
          placeholder="your@example.com"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div>
        <Label htmlFor="message" className="block text-muted-foreground text-sm font-rajdhani mb-2">
          Message *
        </Label>
        <Textarea 
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5} 
          className="w-full p-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 font-rajdhani text-foreground" 
          placeholder="Your message..."
          required
          disabled={isSubmitting}
        />
      </div>
      
      <Button 
        type="submit" 
        size="lg" 
        className="nexa-button px-12 py-4 text-lg font-rajdhani font-bold mx-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
};