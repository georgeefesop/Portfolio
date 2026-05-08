export type TechLogoId =
  | 'react'
  | 'vite'
  | 'nextjs'
  | 'webflow'
  | 'wordpress'
  | 'elementor'
  | 'sanity'
  | 'tailwindcss'
  | 'figma'
  | 'vercel'
  | 'stripe'
  | 'typescript'
  | 'javascript'
  | 'nodedotjs'
  | 'html5'
  | 'css3'
  | 'framer'
  | 'greensock'
  | 'supabase'
  | 'prisma';

export type TechLogo = {
  id: TechLogoId;
  name: string;
  src: string;
  href?: string;
};

export const techLogos: Record<TechLogoId, TechLogo> = {
  react: {
    id: 'react',
    name: 'React',
    src: '/images/tech-logos/react.svg',
    href: 'https://react.dev',
  },
  vite: {
    id: 'vite',
    name: 'Vite',
    src: '/images/tech-logos/vite.svg',
    href: 'https://vitejs.dev',
  },
  nextjs: {
    id: 'nextjs',
    name: 'Next.js',
    src: '/images/tech-logos/nextjs.svg',
    href: 'https://nextjs.org',
  },
  webflow: {
    id: 'webflow',
    name: 'Webflow',
    src: '/images/tech-logos/webflow.svg',
    href: 'https://webflow.com',
  },
  wordpress: {
    id: 'wordpress',
    name: 'WordPress',
    src: '/images/tech-logos/wordpress.svg',
    href: 'https://wordpress.org',
  },
  elementor: {
    id: 'elementor',
    name: 'Elementor',
    src: '/images/tech-logos/elementor.svg',
    href: 'https://elementor.com',
  },
  sanity: {
    id: 'sanity',
    name: 'Sanity',
    src: '/images/tech-logos/sanity.svg',
    href: 'https://www.sanity.io',
  },
  tailwindcss: {
    id: 'tailwindcss',
    name: 'Tailwind CSS',
    src: '/images/tech-logos/tailwindcss.svg',
    href: 'https://tailwindcss.com',
  },
  figma: {
    id: 'figma',
    name: 'Figma',
    src: '/images/tech-logos/figma.svg',
    href: 'https://figma.com',
  },
  vercel: {
    id: 'vercel',
    name: 'Vercel',
    src: '/images/tech-logos/vercel.svg',
    href: 'https://vercel.com',
  },
  stripe: {
    id: 'stripe',
    name: 'Stripe',
    src: '/images/tech-logos/stripe.svg',
    href: 'https://stripe.com',
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    src: '/images/tech-logos/typescript.svg',
    href: 'https://www.typescriptlang.org',
  },
  javascript: {
    id: 'javascript',
    name: 'JavaScript',
    src: '/images/tech-logos/javascript.svg',
    href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  },
  nodedotjs: {
    id: 'nodedotjs',
    name: 'Node.js',
    src: '/images/tech-logos/nodedotjs.svg',
    href: 'https://nodejs.org',
  },
  html5: {
    id: 'html5',
    name: 'HTML5',
    src: '/images/tech-logos/html5.svg',
    href: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  },
  css3: {
    id: 'css3',
    name: 'CSS3',
    src: '/images/tech-logos/css3.svg',
    href: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  },
  framer: {
    id: 'framer',
    name: 'Framer Motion',
    src: '/images/tech-logos/framer.svg',
    href: 'https://www.framer.com/motion',
  },
  greensock: {
    id: 'greensock',
    name: 'GSAP',
    src: '/images/tech-logos/greensock.svg',
    href: 'https://gsap.com',
  },
  supabase: {
    id: 'supabase',
    name: 'Supabase',
    src: '/images/tech-logos/supabase.svg',
    href: 'https://supabase.com',
  },
  prisma: {
    id: 'prisma',
    name: 'Prisma',
    src: '/images/tech-logos/prisma.svg',
    href: 'https://www.prisma.io',
  },
};
