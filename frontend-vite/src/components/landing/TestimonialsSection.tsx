"use client";

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
    <section className="relative overflow-hidden bg-[#030805] px-4 pb-12 pt-12 text-white sm:px-6 lg:px-8 lg:pt-14 xl:px-10 2xl:px-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-14%] top-[-16%] h-[34vw] max-h-[520px] min-h-[320px] w-[34vw] min-w-[320px] max-w-[520px] rounded-full bg-lime-400/10 blur-[150px]" />
        <div className="absolute bottom-[-18%] right-[-14%] h-[36vw] max-h-[560px] min-h-[340px] w-[36vw] min-w-[340px] max-w-[560px] rounded-full bg-lime-500/10 blur-[170px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,204,22,0.07),transparent_50%)]" />

        <div className="absolute bottom-16 left-0 h-[210px] w-[430px] opacity-35 [background-image:radial-gradient(rgba(163,230,53,0.55)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:radial-gradient(ellipse_at_bottom_left,black,transparent_68%)]" />

        <div className="absolute bottom-16 right-0 h-[210px] w-[430px] opacity-35 [background-image:radial-gradient(rgba(163,230,53,0.55)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:radial-gradient(ellipse_at_bottom_right,black,transparent_68%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[92vw] 2xl:max-w-[1780px]">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_minmax(0,1.9fr)] xl:gap-10 2xl:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="pt-0"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-400/25 bg-lime-400/8 px-5 py-2.5 text-[12px] font-black uppercase tracking-wide text-lime-300 shadow-[0_0_32px_rgba(163,230,53,0.08)] sm:text-[13px]">
              <Users className="h-4 w-4" />
              Testimonials
            </div>

            <h2 className="max-w-[720px] text-[44px] font-black leading-[1.02] tracking-[-0.06em] text-[#F7FFF2] sm:text-[56px] lg:text-[64px] xl:text-[70px] 2xl:text-[80px]">
              Real People. Real{" "}
              <span className="text-lime-300">Results.</span> Backed by
              Science.
            </h2>

            <p className="mt-5 max-w-[680px] text-[18px] leading-8 text-white/68 lg:text-[20px] xl:text-[21px]">
              Thousands of Indians are transforming their health with
              AI-powered nutrition that understands their lifestyle, food and
              goals.
            </p>

            <div className="mt-7 max-w-[420px] rounded-[1.5rem] border border-lime-400/25 bg-white/[0.035] p-5 shadow-[0_0_45px_rgba(163,230,53,0.06)] backdrop-blur-xl xl:p-6">
              <div className="flex items-center gap-3">
                <span className="text-5xl font-black tracking-[-0.06em] text-lime-300">
                  4.8
                </span>

                <div className="flex gap-1 text-lime-300">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="mt-2 text-[15px] text-white/72 xl:text-[16px]">
                From 5,000+ happy users
              </p>
            </div>

            <div className="mt-7 grid max-w-[620px] grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-lime-400/15 bg-[#07130c]/70 p-4"
                  >
                    <Icon className="mb-3 h-7 w-7 text-lime-300" />

                    <div className="text-[24px] font-black tracking-[-0.04em] text-lime-300">
                      {stat.value}
                    </div>

                    <div className="mt-1 text-[12px] leading-4 text-white/60">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-start gap-4">
              <Quote className="h-14 w-14 shrink-0 fill-cyan-300 text-cyan-300" />

              <p className="pt-2 text-[18px] leading-8 text-white/78 xl:text-[20px]">
                Your health journey.
                <br />
                Our AI.{" "}
                <span className="font-bold text-lime-300">
                  Real transformation.
                </span>
              </p>
            </div>
          </motion.div>

          <div className="min-w-0">
            <div className="mb-5">
              <h3 className="text-[24px] font-bold text-white xl:text-[28px]">
                What Our Users Say
              </h3>

              <div className="mt-3 h-[2px] w-28 bg-lime-400" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {testimonials.map((item, index) => (
                <motion.article
                  key={item.name}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-lime-400/20 bg-[#07130c]/80 p-5 shadow-[0_18px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/40 hover:shadow-[0_0_55px_rgba(163,230,53,0.12)] xl:p-6"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.09),transparent_58%)] opacity-80" />

                  <Quote className="absolute right-5 top-6 h-8 w-8 fill-lime-400/35 text-lime-400/35" />

                  <div className="relative z-10 flex items-start gap-4">
                    <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-full border border-white/15 bg-lime-400/10 xl:h-[70px] xl:w-[70px]">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 pt-1">
                      <h3 className="text-[19px] font-bold leading-tight text-white xl:text-[21px]">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-white/60 xl:text-[15px]">
                        {item.city}
                      </p>

                      <div className="mt-2 flex gap-1 text-lime-300">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="relative z-10 mt-5 min-h-[96px] text-[15px] leading-7 text-white/76 xl:text-[16px]">
                    {item.text}
                  </p>

                  <div className="relative z-10 mt-4 grid grid-cols-1 overflow-hidden rounded-2xl border border-lime-400/18 bg-black/24 sm:grid-cols-2">
                    {item.chips.map((chip) => {
                      const Icon = chip.icon;

                      return (
                        <div
                          key={chip.title}
                          className="flex items-center gap-3 border-b border-lime-400/12 p-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400/14 text-lime-300">
                            <Icon className="h-5 w-5" />
                          </span>

                          <span>
                            <span className="block text-[13px] font-bold leading-4 text-white">
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