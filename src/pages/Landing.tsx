
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Users, Trophy, Target, ArrowRight, Star, Gamepad2, Mail } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ClanGallery } from '@/components/ClanGallery';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 bg-card/20 backdrop-blur-sm border-b border-border/20">
        <div className="flex items-center space-x-3">
          <div className="w-24 h-24 flex items-center justify-center nexa-glow rounded-lg">
            <img src="/nexa-logo.jpg" alt="logo" className="object-cover w-full h-full rounded-lg" />
          </div>
          {/* <div>
            <h1 className="text-2xl font-orbitron font-bold bg-gradient-to-r from-primary to-red-300 bg-clip-text text-transparent">
              NeXa_Esports
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-rajdhani">Call of Duty: Mobile</p>
          </div> */}
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link to="/auth/login">
            <Button variant="ghost" className="text-foreground hover:text-primary font-rajdhani font-medium">
              Login
            </Button>
          </Link>
          <Link to="/auth/signup">
            <Button className="nexa-button font-rajdhani font-bold">
              Join Clan
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-slide-up">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6 nexa-glow">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium font-rajdhani">NeXa_Esports Clan</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-orbitron font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                Dominate the
              </span>
              <br /> 
              <span className="bg-gradient-to-r from-primary to-red-300 bg-clip-text text-transparent animate-glow-pulse">
                Battlefield
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed font-rajdhani">
              Join NeXa_Esports - where elite CoDM warriors unite. Experience tactical precision, 
              brotherhood, and the ultimate gaming evolution.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Link to="/auth/signup">
              <Button size="lg" className="nexa-button px-8 py-4 text-lg font-rajdhani font-bold">
                <Shield className="w-5 h-5 mr-2" />
                Join the Elite
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-primary/50 text-foreground hover:bg-primary/10 px-8 py-4 text-lg font-rajdhani font-medium transition-all duration-300">
              <Gamepad2 className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6 nexa-card hover:nexa-glow transition-all duration-300">
              <div className="text-3xl font-orbitron font-bold text-primary mb-2">70+</div>
              <div className="text-muted-foreground font-rajdhani">Elite Members</div>
            </div>
            <div className="text-center p-6 nexa-card hover:nexa-glow transition-all duration-300">
              <div className="text-3xl font-orbitron font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground font-rajdhani">Win Rate</div>
            </div>
            <div className="text-center p-6 nexa-card hover:nexa-glow transition-all duration-300">
              <div className="text-3xl font-orbitron font-bold text-primary mb-2">#1</div>
              <div className="text-muted-foreground font-rajdhani">Regional Rank</div>
            </div>
          </div>
        </div>
      </section>

      {/* Clan Gallery */}
      <ClanGallery />

      {/* About Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-b from-transparent to-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-orbitron font-bold mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                About NeXa_Esports
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-rajdhani">
              We're not just a clan - we're a brotherhood of tactical gaming experts 
              pushing the boundaries of competitive CoDM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 nexa-card hover:nexa-glow transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-orbitron font-bold mb-3 text-foreground">Tactical Excellence</h3>
              <p className="text-muted-foreground font-rajdhani">Master advanced strategies and dominate every game mode.</p>
            </div>

            <div className="text-center p-8 nexa-card hover:nexa-glow transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-orbitron font-bold mb-3 text-foreground">Brotherhood</h3>
              <p className="text-muted-foreground font-rajdhani">Join a community of dedicated gamers who have your back.</p>
            </div>

            <div className="text-center p-8 nexa-card hover:nexa-glow transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-orbitron font-bold mb-3 text-foreground">Championship</h3>
              <p className="text-muted-foreground font-rajdhani">Compete in tournaments and climb the global rankings.</p>
            </div>

            <div className="text-center p-8 nexa-card hover:nexa-glow transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-orbitron font-bold mb-3 text-foreground">Elite Status</h3>
              <p className="text-muted-foreground font-rajdhani">Earn recognition and rewards for your gaming achievements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-orbitron font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-red-300 bg-clip-text text-transparent">
              Ready to Join NeXa_Esports?
            </span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto font-rajdhani">
            Take your CoDM skills to the next level. Apply now and become part of gaming history.
          </p>
          
          <Link to="/auth/signup">
            <Button size="lg" className="nexa-button px-12 py-4 text-lg font-rajdhani font-bold">
              <Shield className="w-6 h-6 mr-3" />
              Apply Now
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-b from-transparent to-card/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6 nexa-glow">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium font-rajdhani">Get in Touch</span>
          </div>
          <h2 className="text-4xl font-orbitron font-bold mb-6">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Contact Us
            </span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto font-rajdhani">
            Have questions or want to learn more about NeXa_Esports? Reach out to us!
          </p>

          <form className="grid grid-cols-1 gap-8 text-left">
            <div>
              <label htmlFor="name" className="block text-muted-foreground text-sm font-rajdhani mb-2">Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full p-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 font-rajdhani text-foreground" 
                placeholder="Your Name" 
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-muted-foreground text-sm font-rajdhani mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                className="w-full p-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 font-rajdhani text-foreground" 
                placeholder="your@example.com" 
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-muted-foreground text-sm font-rajdhani mb-2">Message</label>
              <textarea 
                id="message" 
                rows={5} 
                className="w-full p-3 rounded-lg bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 font-rajdhani text-foreground" 
                placeholder="Your message..."
              ></textarea>
            </div>
            <Button type="submit" size="lg" className="nexa-button px-12 py-4 text-lg font-rajdhani font-bold mx-auto">
              Send Message
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};
