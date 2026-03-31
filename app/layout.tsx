
import "./global.css";
import { RootProvider } from "fumadocs-ui/provider";
import {
  Epilogue,
  Space_Grotesk,
  Work_Sans,
  Geist_Mono,
} from "next/font/google";
import type { ReactNode } from "react";
import { RisoProvider } from "@/lib/riso-context";
import { RisoFilterProvider } from "@/components/nav/riso-filter-provider";

const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-riso-headline",
  weight: ["800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-riso-label",
  weight: ["500", "700"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-riso-body",
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// Inline script that runs synchronously before React hydrates.
// Reads localStorage and applies the saved theme vars to <html>
// so there is ZERO flash of the default theme on load.
const themeScript = `
(function() {
  var themes = {
    'pink-teal':    { p:'#ff5e7e', s:'#00a99d', o:'#7b4f7a', paper:'#f7f0e2' },
    'red-yellow':   { p:'#e8362a', s:'#f5d800', o:'#c07a00', paper:'#f6f0e0' },
    'blue-pink':    { p:'#3d6bce', s:'#ff5e7e', o:'#7b3fa0', paper:'#f8f6ff' },
    'black-yellow': { p:'#1a1a1a', s:'#f5d800', o:'#3a3200', paper:'#f5efdc' },
  };
  var saved;
  try { saved = localStorage.getItem('riso-theme') || 'pink-teal'; } catch(e) { saved = 'pink-teal'; }
  var t = themes[saved] || themes['pink-teal'];
  var r = document.documentElement;
  r.setAttribute('data-riso-theme', saved);
  r.style.setProperty('--riso-primary',   t.p);
  r.style.setProperty('--riso-secondary',  t.s);
  r.style.setProperty('--riso-overlap',    t.o);
  r.style.setProperty('--riso-paper',      t.paper);
})();
`;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${epilogue.variable} ${spaceGrotesk.variable} ${workSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Blocking script: applies saved theme BEFORE paint — prevents flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <RootProvider>
          {/* SVG filter defs for grain/bleed — once per page */}
          <RisoFilterProvider />
          <RisoProvider defaultTheme="pink-teal">{children}</RisoProvider>
        </RootProvider>
      </body>
    </html>
  );
}
