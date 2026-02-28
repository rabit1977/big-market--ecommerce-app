'use client';

import { HeroHeader } from './hero-header';

export const Hero = () => {
  return (
    <section className='dark:bg-background relative'>
      <HeroHeader />
      {/* Testimonials preserved if needed but hidden for now or standard */}
      {/* <Testimonials /> */} 
    </section>
  );
};
