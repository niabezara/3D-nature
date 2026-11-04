# Fernhollow

Full-screen hero for a regenerative design studio, over an interactive 3D night valley of glowing flowers.
Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · three.js.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Structure

| Path | What it is |
| --- | --- |
| `src/app/layout.tsx` | Fonts (Antonio, Manrope via `next/font`), metadata |
| `src/app/globals.css` | Theme tokens, the `--u` design unit, `phone:` variant, `text-u-*` utility |
| `src/components/hero/` | `Hero` (client: mounts the valley, owns UI state), header, sound toggle, loader, icons |
| `src/lib/valley/Valley.ts` | The scene: endless garden tile, flight, input, post-processing, `dispose()` |
| `src/lib/valley/shaders.ts` | All GLSL: terrain, leaves, flower species/patches, lens blur + grade |
| `src/lib/valley/config.ts` | Point counts, flower species colours, camera, scroll speed |
| `src/lib/audio/AmbientSound.ts` | Procedural ambient sound (starts muted) |
| `legacy/index.html` | The original single-file version |

## Design unit

`1u = 1px` on a 1333×750 canvas (1.2px at 1600×900), scaled to fit the viewport (`1px` flat at 820px and below).
Tailwind's spacing scale is bound to it, so `px-44` is 44u and `size-58` is 58u.
Font sizes use `text-u-158` etc. For real pixels, use arbitrary values: `min-h-[6px]`.

## Valley API

```ts
const valley = new Valley(container, { onLoaded, onIntroDone });
valley.startHoverTransition(); // ease to a stop, scatter flowers into particles
valley.stopHoverTransition();
valley.dispose();              // frees GPU resources and listeners (needed for Strict Mode / route changes)
```

## Contact form (Resend)

`/lets-talk` posts to a server action (`src/app/lets-talk/actions.ts`) that emails each enquiry to you through [Resend](https://resend.com).

1. `cp .env.example .env.local`
2. Fill in `RESEND_API_KEY` and `CONTACT_TO_EMAIL` (your inbox), then restart `npm run dev`.
3. `CONTACT_FROM_EMAIL`: until you verify a domain in Resend, keep `onboarding@resend.dev`; it only delivers to the address you signed up to Resend with. After verifying, use e.g. `NiaBezz <hello@yourdomain.dev>`.
4. On your host (e.g. Vercel), add the same three variables.

Replying to an enquiry email answers the sender directly (`replyTo`). Without a key, development logs enquiries to the terminal; production shows a "please email me directly" message instead.

Your public details (email, socials, location, stack, availability) live in `src/config/site.ts`.
