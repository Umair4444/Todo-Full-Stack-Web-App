// About page
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  Target,
  Lightbulb,
  Globe,
  Zap,
  Shield,
  Star,
  ArrowRight
} from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <Badge className="mb-4">About Us</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            Transforming Productivity, One Task at a Time
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our journey, mission, and the passionate team behind TodoApp - the ultimate task management solution for individuals and teams worldwide.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">From Idea to Reality</h3>
              <p className="text-muted-foreground mb-4">
                TodoApp was born out of a simple frustration: existing task management tools were either too complex or lacked essential features. In 2022, our founders set out to create a solution that balances simplicity with power.
              </p>
              <p className="text-muted-foreground mb-4">
                Today, we serve thousands of users worldwide who trust us to help them stay organized, meet deadlines, and achieve their goals. Our platform has evolved significantly, but our core mission remains unchanged: to make productivity accessible to everyone.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                <Badge variant="secondary">2022</Badge>
                <Badge variant="secondary">Founded</Badge>
                <Badge variant="secondary">10K+ Users</Badge>
                <Badge variant="secondary">Global Reach</Badge>
              </div>
            </div>
            <div className="bg-muted rounded-xl p-6 flex items-center justify-center">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-border rounded-xl w-full h-64 flex items-center justify-center">
                <Lightbulb className="h-16 w-16 text-primary/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission & Vision</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Guiding principles that drive everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To empower individuals and teams to achieve more by providing intuitive, powerful, and accessible task management tools that seamlessly integrate into their daily workflows.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To become the world's leading productivity platform, helping millions of people transform chaos into clarity and dreams into accomplishments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to stay organized and productive
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Smart Organization', desc: 'Intelligent categorization and tagging system' },
              { icon: Shield, title: 'Secure & Private', desc: 'Enterprise-grade security for your data' },
              { icon: Users, title: 'Team Collaboration', desc: 'Real-time collaboration with your team' },
              { icon: Globe, title: 'Multi-Platform Sync', desc: 'Access your tasks anywhere, anytime' },
              { icon: Lightbulb, title: 'Smart Suggestions', desc: 'AI-powered insights to boost productivity' },
              { icon: Target, title: 'Goal Tracking', desc: 'Set and track progress toward your goals' }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate individuals dedicated to your productivity success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Alex Johnson', role: 'CEO & Founder', bio: 'Former Google engineer with 10+ years of experience in SaaS products' },
              { name: 'Maria Garcia', role: 'Lead Designer', bio: 'Award-winning UX designer focused on creating intuitive interfaces' },
              { name: 'Samuel Chen', role: 'CTO', bio: 'Cloud architect with expertise in scalable systems and security' },
              { name: 'Priya Sharma', role: 'Product Manager', bio: 'Former Microsoft PM with deep knowledge of productivity tools' },
              { name: 'James Wilson', role: 'Senior Developer', bio: 'Full-stack expert specializing in React and cloud technologies' },
              { name: 'Emma Thompson', role: 'Community Lead', bio: 'Passionate about user experience and community building' }
            ].map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 text-center">
                  <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary">{member.role}</p>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied users who transformed their productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: 'TodoApp helped me organize my chaotic workflow. I\'ve increased my productivity by 40%!', author: 'Sarah K., Marketing Director' },
              { quote: 'The team collaboration features are exceptional. Our remote team is more aligned than ever.', author: 'Michael T., Startup Founder' },
              { quote: 'Finally, a task manager that doesn\'t feel like a chore to use. Intuitive and powerful!', author: 'David L., Freelance Developer' }
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground flex-grow">"{testimonial.quote}"</p>
                  <p className="mt-4 font-medium text-right">— {testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Technology Stack</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge technologies for optimal performance
            </p>
          </div>

          <div className="space-y-16">
            <div>
              <h3 className="text-2xl font-bold mb-8 text-center">Frontend Technologies</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { name: 'Next.js 14', desc: 'React framework with SSR' },
                  { name: 'TypeScript', desc: 'Typed JavaScript' },
                  { name: 'Tailwind CSS', desc: 'Utility-first CSS' },
                  { name: 'Zustand', desc: 'State management' },
                  { name: 'Radix UI', desc: 'Unstyled components' },
                  { name: 'Shadcn/UI', desc: 'Customizable components' }
                ].map((tech, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-background/50 backdrop-blur-sm">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <span className="font-bold text-lg">{tech.name.charAt(0)}</span>
                      </div>
                      <h4 className="text-lg font-bold mb-2">{tech.name}</h4>
                      <p className="text-sm text-muted-foreground">{tech.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-8 text-center">Additional Libraries & Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { name: 'Framer Motion', desc: 'Animations' },
                  { name: 'Lucide React', desc: 'Icons' },
                  { name: 'Sonner', desc: 'Notifications' },
                  { name: 'React Hook Form', desc: 'Forms' },
                  { name: 'Axios', desc: 'HTTP Client' },
                  { name: 'i18next', desc: 'Internationalization' }
                ].map((tech, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-background/50 backdrop-blur-sm">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <span className="font-bold text-lg">{tech.name.charAt(0)}</span>
                      </div>
                      <h4 className="text-lg font-bold mb-2">{tech.name}</h4>
                      <p className="text-sm text-muted-foreground">{tech.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-8 text-center">Backend & Infrastructure</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { name: 'FastAPI', desc: 'Python web framework' },
                  { name: 'SQLModel', desc: 'SQL databases with Python' },
                  { name: 'Neon', desc: 'Serverless PostgreSQL' },
                  { name: 'Pydantic', desc: 'Data validation' },
                  { name: 'JWT', desc: 'Authentication' },
                  { name: 'Uvicorn', desc: 'ASGI server' }
                ].map((tech, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-background/50 backdrop-blur-sm">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <span className="font-bold text-lg">{tech.name.charAt(0)}</span>
                      </div>
                      <h4 className="text-lg font-bold mb-2">{tech.name}</h4>
                      <p className="text-sm text-muted-foreground">{tech.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-8 text-center">DevOps & Testing</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { name: 'GitHub Actions', desc: 'CI/CD' },
                  { name: 'Docker', desc: 'Containerization' },
                  { name: 'Jest', desc: 'Testing Framework' },
                  { name: 'Pytest', desc: 'Python Testing' }
                ].map((tech, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-background/50 backdrop-blur-sm">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <span className="font-bold text-lg">{tech.name.charAt(0)}</span>
                      </div>
                      <h4 className="text-lg font-bold mb-2">{tech.name}</h4>
                      <p className="text-sm text-muted-foreground">{tech.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-500 text-primary-foreground">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Productivity?</h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who have revolutionized the way they manage tasks and achieve their goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-background text-primary hover:bg-background/90">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white/30">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;