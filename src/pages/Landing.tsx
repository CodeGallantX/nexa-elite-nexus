
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Users, Trophy, Target, ArrowRight, Star, Gamepad2 } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0E0E0E] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF1F44]/10 via-transparent to-red-900/5"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF1F44]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm border-b border-[#FF1F44]/20">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF1F44] to-red-600 rounded-lg flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF1F44] to-red-300 bg-clip-text text-transparent">
              NeXa_Esports
            </h1>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Call of Duty: Mobile</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link to="/auth/login">
            <Button variant="ghost" className="text-white hover:text-[#FF1F44]">
              Login
            </Button>
          </Link>
          <Link to="/auth/signup">
            <Button className="bg-gradient-to-r from-[#FF1F44] to-red-600 hover:from-red-600 hover:to-[#FF1F44] text-white">
              Join Clan
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[#FF1F44]/10 border border-[#FF1F44]/30 rounded-full mb-6">
              <Target className="w-4 h-4 text-[#FF1F44]" />
              <span className="text-sm text-[#FF1F44] font-medium">Elite Gaming Clan</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Dominate the
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#FF1F44] to-red-300 bg-clip-text text-transparent">
                Battlefield
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join NeXa_Esports - where elite CoDM warriors unite. Experience tactical precision, 
              brotherhood, and the ultimate gaming evolution.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Link to="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-[#FF1F44] to-red-600 hover:from-red-600 hover:to-[#FF1F44] text-white px-8 py-4 text-lg">
                <Shield className="w-5 h-5 mr-2" />
                Join the Elite
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-[#FF1F44]/50 text-white hover:bg-[#FF1F44]/10 px-8 py-4 text-lg">
              <Gamepad2 className="w-5 h-5 mr-2" />
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-[#FF1F44] mb-2">250+</div>
              <div className="text-gray-300">Elite Members</div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-[#FF1F44] mb-2">95%</div>
              <div className="text-gray-300">Win Rate</div>
            </div>
            <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="text-3xl font-bold text-[#FF1F44] mb-2">#1</div>
              <div className="text-gray-300">Regional Rank</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-b from-transparent to-black/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                About NeXa_Esports
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              We're not just a clan - we're a brotherhood of tactical gaming experts 
              pushing the boundaries of competitive CoDM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#FF1F44]/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF1F44] to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Tactical Excellence</h3>
              <p className="text-gray-400">Master advanced strategies and dominate every game mode.</p>
            </div>

            <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#FF1F44]/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF1F44] to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Brotherhood</h3>
              <p className="text-gray-400">Join a community of dedicated gamers who have your back.</p>
            </div>

            <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#FF1F44]/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF1F44] to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Championship</h3>
              <p className="text-gray-400">Compete in tournaments and climb the global rankings.</p>
            </div>

            <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#FF1F44]/30 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF1F44] to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Elite Status</h3>
              <p className="text-gray-400">Earn recognition and rewards for your gaming achievements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#FF1F44] to-red-300 bg-clip-text text-transparent">
              Ready to Join the Elite?
            </span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Take your CoDM skills to the next level. Apply now and become part of gaming history.
          </p>
          
          <Link to="/auth/signup">
            <Button size="lg" className="bg-gradient-to-r from-[#FF1F44] to-red-600 hover:from-red-600 hover:to-[#FF1F44] text-white px-12 py-4 text-lg">
              <Shield className="w-6 h-6 mr-3" />
              Apply Now
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
