"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  Quote,
  Users,
  Trophy,
  Leaf,
  TrendingUp,
  Zap,
  Dumbbell,
  HeartPulse,
  ShieldCheck,
  Camera,
  Target,
  CalendarCheck,
  Award,
  Soup,
} from "lucide-react";

const testimonials = [
  {
    name: "Ananya S.",
    city: "Kolkata, West Bengal",
    avatar: "/assets/Ananya.png",
    text: "NutriAI understands Bengali food so well! It gives me plans with rice, fish and my favorite dishes — all perfectly balanced.",
    chips: [
      { icon: HeartPulse, title: "Lost 7.5 kg", sub: "in 10 weeks" },
      { icon: Zap, title: "More Energy", sub: "All Day" },
    ],
  },
  {
    name: "Rohit M.",
    city: "Pune, Maharashtra",
    avatar: "/assets/Rohit.png",
    text: "The smart food scanner is a game changer. I just scan my food and instantly know the calories & macros. Super accurate!",
    chips: [
      { icon: Camera, title: "Scanning", sub: "Every Day" },
      { icon: Target, title: "Hit My Goals", sub: "Consistently" },
    ],
  },
  {
    name: "Neha R.",
    city: "Bangalore, Karnataka",
    avatar: "/assets/Neha.png",
    text: "As a vegetarian, finding balanced protein was a challenge. NutriAI made it simple with customized veg meal plans.",
    chips: [
      { icon: Leaf, title: "Gained 4 kg", sub: "Lean Muscle" },
      { icon: ShieldCheck, title: "Better Health", sub: "Markers" },
    ],
  },
  {
    name: "Rahul V.",
    city: "Delhi",
    avatar: "/assets/Rahul.png",
    text: "NutriAI adapts to my training, recovery and protein goals automatically. My stamina and muscle recovery improved within weeks.",
    chips: [
      { icon: TrendingUp, title: "Strength +34%", sub: "Improved" },
      { icon: Dumbbell, title: "Recovery", sub: "Faster" },
    ],
  },
  {
    name: "Priya D.",
    city: "Chennai, Tamil Nadu",
    avatar: "/assets/Priya.png",
    text: "Finally a nutrition app that respects our culture and food. My whole family now eats better together!",
    chips: [
      { icon: Users, title: "Whole Family", sub: "Eating Healthy" },
      { icon: Soup, title: "Traditional Food", sub: "Made Healthy" },
    ],
  },
  {
    name: "Kunal B.",
    city: "Mumbai, Maharashtra",
    avatar: "/assets/Kunal.png",
    text: "Simple, science-backed and effective. I stayed consistent for 90 days and the results speak for themselves.",
    chips: [
      { icon: CalendarCheck, title: "90-Day Streak", sub: "Completed" },
      { icon: Award, title: "Transformed", sub: "My Lifestyle" },
    ],
  },
];

const stats = [
  { icon: Users, value: "50K+", label: "Happy Users" },
  { icon: Leaf, value: "1.2M+", label: "Meals Personalized" },
  { icon: TrendingUp, value: "4.8★", label: "Average Rating" },
  { icon: Trophy, value: "95%", label: "Achieved Their Health Goals" },
];

export default function TestimonialsSection() {
  return (
<section className="relative overflow-hidden bg-[#030805] px-4 py-28 text-white sm:px-8 lg:px-10 xl:px-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-14%] top-[-16%] h-[520px] w-[520px] rounded-full bg-lime-400/10 blur-[150px]" />

        <div className="absolute bottom-[-18%] right-[-14%] h-[560px] w-[560px] rounded-full bg-lime-500/10 blur-[170px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,204,22,0.07),transparent_50%)]" />

        <div className="absolute bottom-16 left-0 h-[210px] w-[430px] opacity-35 [background-image:radial-gradient(rgba(163,230,53,0.55)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:radial-gradient(ellipse_at_bottom_left,black,transparent_68%)]" />

        <div className="absolute bottom-16 right-0 h-[210px] w-[430px] opacity-35 [background-image:radial-gradient(rgba(163,230,53,0.55)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:radial-gradient(ellipse_at_bottom_right,black,transparent_68%)]" />
      </div>

     <div className="relative mx-auto max-w-[1320px] lg:translate-x-20 xl:translate-x-28 2xl:translate-x-32">
        <div className="grid items-start gap-14 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)] xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="pt-1"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-lime-400/25 bg-lime-400/8 px-4 py-2 text-xs font-black uppercase tracking-wide text-lime-300 shadow-[0_0_32px_rgba(163,230,53,0.08)]">
              <Users className="h-4 w-4" />
              Testimonials
            </div>

            <h2 className="max-w-[360px] text-[36px] font-black leading-[1.04] tracking-[-0.06em] text-[#F7FFF2] sm:text-[44px] lg:text-[46px] xl:text-[50px]">
              Real People. Real{" "}
              <span className="text-lime-300">Results.</span> Backed by
              Science.
            </h2>

            <p className="mt-6 max-w-[360px] text-[15px] leading-7 text-white/68">
              Thousands of Indians are transforming their health with
              AI-powered nutrition that understands their lifestyle, food and
              goals.
            </p>

            <div className="mt-8 max-w-[285px] rounded-[1.35rem] border border-lime-400/25 bg-white/[0.035] p-5 shadow-[0_0_45px_rgba(163,230,53,0.06)] backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black tracking-[-0.06em] text-lime-300">
                  4.8
                </span>

                <div className="flex gap-1 text-lime-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="mt-1 text-sm text-white/72">
                From 5,000+ happy users
              </p>
            </div>

            <div className="mt-8 grid max-w-[380px] grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="border-r border-lime-400/15 px-3 first:pl-0 last:border-r-0"
                  >
                    <Icon className="mb-3 h-7 w-7 text-lime-300" />

                    <div className="text-[22px] font-black tracking-[-0.04em] text-lime-300">
                      {stat.value}
                    </div>

                    <div className="mt-1 text-[11px] leading-4 text-white/60">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex items-start gap-4">
              <Quote className="h-14 w-14 shrink-0 fill-cyan-300 text-cyan-300" />

              <p className="pt-2 text-base leading-7 text-white/78">
                Your health journey.
                <br />
                Our AI.{" "}
                <span className="font-bold text-lime-300">
                  Real transformation.
                </span>
              </p>
            </div>
          </motion.div>

          <div>
            <div className="mb-7">
              <h3 className="text-xl font-bold text-white">
                What Our Users Say
              </h3>

              <div className="mt-3 h-[2px] w-24 bg-lime-400" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {testimonials.map((item, index) => (
                <motion.article
                  key={item.name}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-[1.45rem] border border-lime-400/20 bg-[#07130c]/80 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/40 hover:shadow-[0_0_55px_rgba(163,230,53,0.12)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.09),transparent_58%)] opacity-80" />

                  <Quote className="absolute right-5 top-6 h-8 w-8 fill-lime-400/35 text-lime-400/35" />

                  <div className="relative z-10 flex items-start gap-4">
                    <div className="relative h-[66px] w-[66px] shrink-0 overflow-hidden rounded-full border border-white/15 bg-lime-400/10">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="66px"
                      />
                    </div>

                    <div className="min-w-0 pt-1">
                      <h3 className="text-lg font-bold leading-tight text-white">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-white/60">
                        {item.city}
                      </p>

                      <div className="mt-2 flex gap-1 text-lime-300">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="relative z-10 mt-5 min-h-[88px] text-[14.5px] leading-7 text-white/76">
                    {item.text}
                  </p>

                  <div className="relative z-10 mt-5 grid grid-cols-2 overflow-hidden rounded-2xl border border-lime-400/18 bg-black/24">
                    {item.chips.map((chip) => {
                      const Icon = chip.icon;

                      return (
                        <div
                          key={chip.title}
                          className="flex items-center gap-3 border-r border-lime-400/12 p-3 last:border-r-0"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400/14 text-lime-300">
                            <Icon className="h-5 w-5" />
                          </span>

                          <span>
                            <span className="block text-xs font-bold leading-4 text-white">
                              {chip.title}
                            </span>

                            <span className="block text-xs leading-4 text-white/62">
                              {chip.sub}
                            </span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}