import { useState, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { insertWaitlistSchema, type InsertWaitlistEntry } from "@shared/schema";
import { api, buildUrl } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  MessageSquare,
  Repeat,
  Target,
  ChevronRight,
  ArrowRight,
  Network,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  TrendingUp,
} from "lucide-react";
import logoImg from "@assets/image_1771063202481.png";

function Scene() {
  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere args={[1, 64, 64]} scale={2.5}>
          <MeshDistortMaterial
            color="#ef4444"
            speed={3}
            distort={0.4}
            radius={1}
            emissive="#991b1b"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ef4444" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#450a0a" />
    </group>
  );
}

export default function Home() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<InsertWaitlistEntry>({
    resolver: zodResolver(insertWaitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Founder",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertWaitlistEntry) => {
      const res = await apiRequest("POST", api.waitlist.create.path, data);
      return res.json();
    },
    onSuccess: () => {
      setIsSuccess(true);
      toast({
        title: "Joined Waitlist",
        description: "We'll be in touch with early access details.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertWaitlistEntry) => {
    mutation.mutate(data);
  };

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* WebGL Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Scene />
        </Canvas>
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <header className="container mx-auto px-6 py-8 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Prodizzy Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold font-display tracking-tight">Prodizzy</span>
          </div>
          <Button onClick={scrollToWaitlist} variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary transition-all rounded-full">
            Join Waitlist
          </Button>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-24 lg:py-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl lg:text-8xl font-bold font-display leading-[1.1] mb-8 text-balance bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Turn Networking <br />
              <span className="text-primary italic">Into Outcomes.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              A calm, intelligent networking operating system that turns 
              connections into hires, deals, and partnerships—automatically.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={scrollToWaitlist} className="min-h-12 px-8 text-lg font-medium group rounded-full">
                Join Waitlist
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="ghost" className="min-h-12 px-8 text-lg font-medium rounded-full hover:bg-white/5">
                Learn More
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Problem Section */}
        <section className="container mx-auto px-6 py-24 border-y border-white/5 bg-background/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: "Manual Effort",
                desc: "Networking shouldn't feel like a second job.",
              },
              {
                icon: Repeat,
                title: "Unreliable Follow-ups",
                desc: "Never lose a critical connection to a forgotten DM.",
              },
              {
                icon: MessageSquare,
                title: "Lost Conversations",
                desc: "Your network is scattered across 10 different apps.",
              },
              {
                icon: TrendingUp,
                title: "Low Conversion",
                desc: "Turn passive chats into meaningful business outcomes.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-panel p-8 rounded-2xl relative overflow-hidden group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <item.icon className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Solution Section */}
        <section className="container mx-auto px-6 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold font-display mb-8">
                The Operating System <br />
                for your Network.
              </h2>
              <ul className="space-y-8">
                {[
                  { title: "Declare Intent", desc: "Tell the AI who you need to meet (e.g., 'Series A Investors')." },
                  { title: "System Executes", desc: "Prodizzy identifies high-warmth paths across your network." },
                  { title: "Consent-Based", desc: "Double opt-in intros ensure high signal and zero spam." },
                  { title: "Outcomes Tracked", desc: "Track ROI from initial intro to signed deal." },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1.5 w-5 h-5 rounded-full border border-primary flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">{item.title}</div>
                      <div className="text-muted-foreground">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full" />
              <Card className="relative glass-panel border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Network className="text-primary w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Intent declared: Fundraising</div>
                      <div className="text-xs text-muted-foreground">Series A • Strategic Partners</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-12 bg-white/5 rounded-md border border-white/5 animate-pulse" />
                    <div className="h-12 bg-white/5 rounded-md border border-white/5 animate-pulse delay-75" />
                    <div className="h-12 bg-white/5 rounded-md border border-white/5 animate-pulse delay-150" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Waitlist Section */}
        <section id="waitlist" className="container mx-auto px-6 py-24 lg:py-32 border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full -z-10" />
          
          <div className="max-w-xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold font-display mb-4">Join the Inner Circle</h2>
            <p className="text-muted-foreground">
              We are onboarding users gradually to ensure quality. Secure your spot in line today.
            </p>
          </div>

          <Card className="max-w-lg mx-auto glass-panel border-white/10 rounded-3xl shadow-2xl">
            <CardContent className="p-8">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">You're on the list</h3>
                  <p className="text-muted-foreground">
                    We'll be in touch soon. Keep an eye on your inbox for your invite.
                  </p>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 h-11 transition-colors" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Email</FormLabel>
                          <FormControl>
                            <Input placeholder="jane@company.com" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 h-11 transition-colors" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What best describes you?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 focus:border-primary/50 h-11 transition-colors">
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-secondary border-white/10">
                              <SelectItem value="Founder">Founder</SelectItem>
                              <SelectItem value="Student">Student</SelectItem>
                              <SelectItem value="Operator">Operator</SelectItem>
                              <SelectItem value="Freelancer">Freelancer</SelectItem>
                              <SelectItem value="Investor">Investor</SelectItem>
                              <SelectItem value="Agency">Agency Owner</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full min-h-12 text-lg font-medium rounded-full shadow-[0_0_20px_-5px_rgba(var(--primary),0.4)]" disabled={mutation.isPending}>
                      {mutation.isPending ? "Joining..." : "Join Waitlist"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-background">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Prodizzy Logo" className="w-6 h-6 grayscale" />
            <span className="text-xl font-bold font-display opacity-50">Prodizzy</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Prodizzy. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>
        </footer>
      </div>
    </div>
  );
}