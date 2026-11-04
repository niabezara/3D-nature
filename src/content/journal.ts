/**
 * Journal posts. Placeholder writing: replace with your own.
 * Each post's moon is drawn from its `date`, so keep dates real.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "code"; text: string };

export interface Post {
  slug: string;
  title: string;
  /** ISO date the post was published (the moon is drawn for this night). */
  date: string;
  minutes: number;
  tag: string;
  excerpt: string;
  body: Block[];
}

export const posts: Post[] = [
  {
    slug: "half-a-million-flowers",
    title: "Half a million flowers, one draw call",
    date: "2026-10-28",
    minutes: 9,
    tag: "WebGL",
    excerpt: "How the valley on my home page renders an endless garden on a laptop GPU without breaking a sweat.",
    body: [
      { type: "p", text: "The garden you walk through on my home page is not a garden. It is a single tile of points, about half a million of them, that wraps around the camera like a treadmill." },
      { type: "h2", text: "The treadmill trick" },
      { type: "p", text: "Every point stores a position inside a fixed tile. In the vertex shader I wrap that position around the camera with a modulo, so the same points are reused forever. Nothing is created or destroyed while you scroll." },
      { type: "code", text: "vec2 world = mod(local - uOrigin.xz, uTile) + uOrigin.xz;" },
      { type: "p", text: "Because the colour patches and terrain are computed from the wrapped world position, the garden stays consistent: walk back and the same pink patch is waiting for you." },
      { type: "quote", text: "The cheapest geometry is the geometry you never have to upload twice." },
    ],
  },
  {
    slug: "fast-is-a-feeling",
    title: "Fast is a feeling",
    date: "2026-09-14",
    minutes: 6,
    tag: "Craft",
    excerpt: "Lighthouse scores are a number. Speed is what someone feels in the first second. They are not the same thing.",
    body: [
      { type: "p", text: "I have shipped sites that scored 100 and still felt slow, and sites that scored 70 and felt instant. The difference was almost always what happened in the first second." },
      { type: "h2", text: "Answer immediately" },
      { type: "p", text: "A button should react on the frame it is pressed, even if the real work takes longer. A pending state that appears instantly feels faster than a result that appears 200ms later with nothing in between." },
      { type: "quote", text: "Perceived performance is a design problem wearing an engineering costume." },
    ],
  },
  {
    slug: "container-queries-in-practice",
    title: "Container queries, two years in",
    date: "2026-08-02",
    minutes: 5,
    tag: "CSS",
    excerpt: "What changed when I stopped asking how wide the screen is and started asking how wide the component is.",
    body: [
      { type: "p", text: "Media queries ask about the window. Components do not live in windows, they live in sidebars, cards and modals. Container queries finally let them ask the right question." },
      { type: "code", text: ".card { container-type: inline-size; }\n@container (width > 28rem) { .card__media { display: block; } }" },
      { type: "p", text: "The biggest change was not technical. Designers and I started talking about components instead of breakpoints, and the handoffs got shorter." },
    ],
  },
  {
    slug: "glsl-for-interface-designers",
    title: "GLSL for interface designers",
    date: "2026-06-11",
    minutes: 11,
    tag: "Shaders",
    excerpt: "Shaders look like maths homework. They are closer to a very fast, very strict colour picker.",
    body: [
      { type: "p", text: "A fragment shader answers one question for every pixel: what colour are you? That is it. Everything else is a clever way of answering it." },
      { type: "h2", text: "Start with a gradient" },
      { type: "code", text: "void main() {\n  gl_FragColor = vec4(vUv.x, 0.4, vUv.y, 1.0);\n}" },
      { type: "p", text: "From there, every effect on this site is a small step: a smoothstep for a soft edge, a noise function for texture, a mix between two colours for mood." },
    ],
  },
  {
    slug: "the-hover-state-nobody-sees",
    title: "The hover state nobody sees",
    date: "2026-04-19",
    minutes: 4,
    tag: "Craft",
    excerpt: "On the details that only a few people will ever notice, and why they are worth it anyway.",
    body: [
      { type: "p", text: "Most visitors will never hover the arrow on my home page long enough to see the flowers lift. A few will. Those few remember." },
      { type: "quote", text: "Details are a letter to the people who look closely." },
      { type: "p", text: "I budget for them the way I budget for accessibility: not as polish at the end, but as part of the work." },
    ],
  },
  {
    slug: "motion-with-meaning",
    title: "Motion with meaning",
    date: "2026-02-03",
    minutes: 7,
    tag: "Motion",
    excerpt: "Every animation should answer a question: where did this come from, where did it go, what changed?",
    body: [
      { type: "p", text: "Animation that only decorates gets skipped by the eye after the second visit. Animation that explains stays useful forever." },
      { type: "h2", text: "Three questions" },
      { type: "p", text: "Where did this come from? Where did it go? What changed? If a transition answers one of these, it earns its milliseconds. If not, I cut it." },
      { type: "p", text: "And always: respect prefers-reduced-motion. Meaning should survive without movement." },
    ],
  },
  {
    slug: "a-year-of-next-js",
    title: "A year of building on Next.js",
    date: "2025-11-22",
    minutes: 8,
    tag: "Next.js",
    excerpt: "Server components, actions and the parts I still reach for a client component to do.",
    body: [
      { type: "p", text: "A year ago I moved every client project to the App Router. Some of it clicked on day one; some of it took months." },
      { type: "p", text: "Server actions made forms boring again, in the best way. A contact form is now one function and a component, with validation in one place." },
      { type: "quote", text: "The best framework feature is the one that lets you delete code." },
    ],
  },
  {
    slug: "first-light",
    title: "First light",
    date: "2025-09-07",
    minutes: 3,
    tag: "Notes",
    excerpt: "Why I am starting a journal, and what I hope to write about.",
    body: [
      { type: "p", text: "I learned almost everything I know from people who wrote down what they figured out. This journal is my attempt to pay that back." },
      { type: "p", text: "Expect notes on WebGL, CSS, motion and the craft of building interfaces that feel alive. Some will be long. Most will be short." },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
