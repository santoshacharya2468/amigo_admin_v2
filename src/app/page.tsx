"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Moon, Sun, Sparkles, Users2, Camera, MapPin } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Page() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 text-foreground overflow-hidden">
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-primary/20 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent flex items-center gap-2"
          >
            <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
            Amigo
          </motion.h1>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-primary/10"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:opacity-90 transition-all">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="container mx-auto px-4"
        >
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
                Find Your Perfect Match
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with amazing people and create meaningful relationships
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-4 mt-8"
            >
              <Button className="bg-gradient-to-r from-pink-500 to-violet-500 text-white px-8 py-6 text-lg hover:opacity-90 transition-all">
                Start Matching
              </Button>
              <Button variant="outline" className="px-8 py-6 text-lg border-primary/20 hover:bg-primary/10">
                Learn More
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              { icon: Sparkles, title: "Smart Matching", description: "Our AI-powered algorithm finds your perfect match" },
              { icon: MessageCircle, title: "Real Conversations", description: "Meaningful chats with genuine people" },
              { icon: Users2, title: "Verified Users", description: "Safe and secure dating environment" },
              { icon: MapPin, title: "Local Dating", description: "Meet amazing people in your area" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-primary/10 bg-background/50 backdrop-blur hover:bg-primary/5 transition-all duration-300">
                  <CardHeader className="text-center space-y-2">
                    <feature.icon className="w-8 h-8 mx-auto text-pink-500" />
                    <CardTitle className="text-xl font-semibold">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground text-center">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
