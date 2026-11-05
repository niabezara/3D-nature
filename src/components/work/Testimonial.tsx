// "use client";

// import {
//   motion,
//   useScroll,
//   useTransform,
//   type MotionValue,
// } from "motion/react";
// import { useRef, type RefObject } from "react";
// import { work } from "@/config/work";

// const DIM = "rgb(92 89 82)"; // cream at ~35% on black
// const LIT = "rgb(245 239 226)"; // cream
// /**
//  * The quote pins to the middle of the screen while you scroll through a taller section,
//  * so every word lights up (and dims again on the way back) where you can actually see it.
//  * Words reveal between these points of the pinned scroll; the rest is a short hold.
//  */
// const REVEAL = { start: 0.05, end: 0.8 };

// /** Client quote whose words light up one by one as you scroll. */
// export function Testimonial({
//   scroller,
// }: {
//   scroller: RefObject<HTMLElement | null>;
// }) {
//   const track = useRef<HTMLElement>(null);
//   const { scrollYProgress } = useScroll({
//     container: scroller,
//     target: track,
//     offset: ["start start", "end end"],
//   });
//   const span = REVEAL.end - REVEAL.start;
//   const { quote } = work.testimonial;
//   const words = quote.split(" ");

//   return (
//     <section ref={track} className="relative h-[260svh]">
//       <div className="sticky top-0 flex h-svh items-center px-112 phone:px-32">
//         <div className="mx-auto flex max-w-768 flex-col items-start gap-40 phone:gap-32">
//           <QuoteMark className="h-40 w-56" />

//           <p className="flex flex-wrap text-u-48 leading-[1.2] font-medium phone:text-[34px]">
//             {words.map((word, i) => (
//               <Word
//                 key={i}
//                 progress={scrollYProgress}
//                 range={[
//                   REVEAL.start + (i / words.length) * span,
//                   REVEAL.start + ((i + 1) / words.length) * span,
//                 ]}
//               >
//                 {word}
//               </Word>
//             ))}
//             <span className="ml-8 text-cream/65">”</span>
//           </p>

//           <div className="flex items-center gap-16">
//             <span className="grid size-56 place-items-center rounded-full border-[3px] border-cream bg-[radial-gradient(circle_at_30%_25%,#b07b5a,#3c2a20_70%)] text-u-16 font-semibold tracking-wide phone:text-[16px]">
//               {initials}
//             </span>
//             <div>
//               <p className="text-u-16 leading-[1.75] font-semibold phone:text-[16px]">
//                 {author}
//               </p>
//               <p className="text-u-14 leading-[1.4] text-cream/65 phone:text-[14px]">
//                 {role}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// function Word({
//   children,
//   progress,
//   range,
// }: {
//   children: string;
//   progress: MotionValue<number>;
//   range: [number, number];
// }) {
//   const opacity = useTransform(progress, range, [0.2, 1]);
//   const color = useTransform(progress, range, [DIM, LIT]);
//   return (
//     <motion.span style={{ opacity, color }} className="mr-[0.3em]">
//       {children}
//     </motion.span>
//   );
// }

// function QuoteMark({ className }: { className?: string }) {
//   return (
//     <svg
//       viewBox="0 0 56 40"
//       aria-hidden
//       className={className}
//       fill="var(--color-cream)"
//     >
//       <path d="M0 40V24C0 10.7 6.2 2.7 18.6 0l2.6 5.2C14.6 7.5 11.2 11.6 11 18h10v22H0Zm32 0V24C32 10.7 38.2 2.7 50.6 0l2.6 5.2C46.6 7.5 43.2 11.6 43 18h10v22H32Z" />
//     </svg>
//   );
// }
