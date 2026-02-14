import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWaitlistSchema, type InsertWaitlistEntry } from "@shared/schema";
import { useCreateWaitlist } from "@/hooks/use-waitlist";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion } from "framer-motion";
import { 
  Network, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  Cpu
} from "lucide-react";

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const { mutate, isPending } = useCreateWaitlist();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<InsertWaitlistEntry>({
    resolver: zodResolver(insertWaitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Founder" // Default to avoid controlled/uncontrolled issues with Select
    }
  });

  const onSubmit = (data: InsertWaitlistEntry) => {
    mutate(data, {
      onSuccess: () => setIsSuccess(true)
    });
  };

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 mesh-gradient">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-24 md:pt-48 md:pb-32 container mx-auto px-6 relative overflow-hidden">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Accepting Early Access
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-display font-bold leading-[1.1] text-balance bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Turn Networking Into Outcomes.
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Prodizzy is the calm, intelligent operating system that automates your professional relationships. No cold DMs. No manual follow-ups. Just results.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={scrollToWaitlist} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12 text-base font-semibold shadow-[0_0_20px_-5px_rgba(var(--primary),0.4)]">
              Join Waitlist
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base bg-transparent border-white/10 hover:bg-white/5 hover:text-white">
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Decorative Grid Background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </section>

      {/* Problem Section */}
      <section id="features" className="py-24 border-t border-white/5 bg-background/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-8 rounded-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Network className="w-24 h-24" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-6">
                <Users className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Networking is Manual</h3>
              <p className="text-muted-foreground leading-relaxed">
                Spreadsheets, sticky notes, and mental reminders. The current process is fragmented and prone to human error.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-8 rounded-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-24 h-24" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-6">
                <Zap className="w-5 h-5 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Follow-ups Fail</h3>
              <p className="text-muted-foreground leading-relaxed">
                80% of opportunities are lost because follow-ups don't happen. Life gets in the way, and momentum dies.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glass-panel p-8 rounded-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingUp className="w-24 h-24" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Low ROI</h3>
              <p className="text-muted-foreground leading-relaxed">
                Hours spent on coffee chats that lead nowhere. Effort rarely converts into tangible outcomes like hiring or deals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solution / How it Works */}
      <section id="how-it-works" className="py-24 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">An Operating System for Relationships</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Systematize your serendipity. Here is how Prodizzy turns intent into reality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              step: "01", 
              title: "Declare Intent", 
              desc: "Tell the AI who you need to meet (e.g., 'Series A Investors' or 'Frontend Engineers').",
              icon: <Cpu className="w-5 h-5" />
            },
            { 
              step: "02", 
              title: "System Executes", 
              desc: "Prodizzy scans your extended network and identifies high-warmth paths.",
              icon: <Network className="w-5 h-5" />
            },
            { 
              step: "03", 
              title: "Consent-Based", 
              desc: "Double opt-in introductions ensure high signal and zero spam.",
              icon: <ShieldCheck className="w-5 h-5" />
            },
            { 
              step: "04", 
              title: "Outcomes Tracked", 
              desc: "From initial intro to signed deal, track the ROI of your network.",
              icon: <CheckCircle2 className="w-5 h-5" />
            }
          ].map((item, idx) => (
            <motion.div 
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-4xl font-display font-bold text-white/5">{item.step}</span>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {item.icon}
                </div>
              </div>
              <h4 className="text-lg font-bold mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-24 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[100px] rounded-full -z-10" />

        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Join the Inner Circle</h2>
              <p className="text-muted-foreground">
                We are onboarding users gradually to ensure quality. Secure your spot in line today.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-secondary/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl shadow-black/50"
            >
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
                            <Input placeholder="Jane Doe" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors h-11" />
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
                            <Input placeholder="jane@company.com" {...field} className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors h-11" />
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
                              <SelectTrigger className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors h-11">
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

                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 justify-center">
                          Join Waitlist <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust / Footer */}
      <footer className="border-t border-white/5 py-12 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white/50" />
              </div>
              <span className="font-display font-bold text-lg">Prodizzy</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
              <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground/50">
            © {new Date().getFullYear()} Prodizzy Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
