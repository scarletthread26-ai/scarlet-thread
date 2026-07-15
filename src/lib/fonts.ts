import { Outfit, Great_Vibes } from 'next/font/google';

export const fontHeading = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const fontSans = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const fontCursive = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-cursive-custom',
  display: 'swap',
});
