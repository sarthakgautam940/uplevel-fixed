'use client';

import useEmblaCarousel from 'embla-carousel-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import MagneticCard from '../components/MagneticCard';
import ParticleBackground from '../components/ParticleBackground';
import WebGLTextSlash from '../components/WebGLTextSlash';

gsap.registerPlugin(ScrollTrigger);

const workItems = [
  { title: 'CASK Atelier', desc: 'Custom wine cellar configurator + AI lead scoring' },
  { title: 'Monarch Estates', desc: 'Bespoke home builder digital twin showroom' },
  { title: 'Northline Private', desc: 'Luxury service pipeline system and CX portal' },
];

const steps = [
  'We map your exact buying journey and identify where perceived quality drops.',
  'We engineer your digital presence with creative technology that mirrors your craftsmanship.',
  'We integrate AI intelligence layers that qualify, route, and elevate every high-value inquiry.',
];

export default function HomePage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'center', containScroll: 'trimSnaps' });
  const numbersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-counter]'));
    counters.forEach((counter) => {
      const target = Number(counter.dataset.counter);
      const state = { value: 0 };
      gsap.to(state, {
        value: target,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: counter, start: 'top 90%' },
        onUpdate: () => {
          counter.textContent = `${Math.floor(state.value)}${counter.dataset.suffix || ''}`;
        },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((item) => {
      gsap.fromTo(
        item,
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 82%' },
        },
      );
    });

    gsap.to('.footer-line', {
      width: '100%',
      ease: 'power3.out',
      duration: 1.3,
      scrollTrigger: { trigger: '.footer-line', start: 'top 88%' },
    });

    gsap.utils.toArray<HTMLElement>('[data-step]').forEach((step, idx) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => highlightStep(idx),
        onEnterBack: () => highlightStep(idx),
      });
    });

    const updateEmbla = () => {
      if (!emblaApi) return;
      const slides = emblaApi.slideNodes();
      const selected = emblaApi.selectedScrollSnap();
      slides.forEach((slide, index) => {
        const active = index === selected;
        slide.style.transform = `scale(${active ? 1 : 0.9})`;
        slide.style.filter = active ? 'grayscale(0)' : 'grayscale(1)';
        slide.style.opacity = active ? '1' : '0.55';
      });
    };

    emblaApi?.on('select', updateEmbla);
    emblaApi?.on('reInit', updateEmbla);
    updateEmbla();

    function highlightStep(index: number) {
      numbersRef.current.forEach((el, i) => {
        if (!el) return;
        el.classList.toggle('text-[var(--electric)]', i === index);
        el.classList.toggle('opacity-100', i === index);
        el.classList.toggle('opacity-35', i !== index);
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      emblaApi?.off('select', updateEmbla);
      emblaApi?.off('reInit', updateEmbla);
    };
  }, [emblaApi]);

  return (
    <main className="relative">
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <ParticleBackground />
        <WebGLTextSlash />
        <div className="section-shell relative z-30 flex w-full flex-col items-start justify-end pb-20">
          <MagneticCard className="rounded-full border border-[var(--electric)] bg-transparent p-[1px]">
            <a
              href="/contact"
              data-magnetic="true"
              className="inline-flex rounded-full bg-[var(--void)] px-8 py-4 text-sm uppercase tracking-[0.14em] text-[var(--crisp)]"
            >
              Engineer Your Build
            </a>
          </MagneticCard>
        </div>
      </section>

      <section className="h-[100px] border-y border-white/10">
        <div className="section-shell grid h-full grid-cols-3 items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.14em] text-white/70">
            <span data-counter="42" data-suffix="%" className="display-serif mr-2 text-3xl text-[var(--crisp)]">
              0%
            </span>
            Lift in qualified leads
          </p>
          <p className="text-xs uppercase tracking-[0.14em] text-white/70">
            <span data-counter="3" data-suffix="x" className="display-serif mr-2 text-3xl text-[var(--crisp)]">
              0x
            </span>
            Average conversion velocity
          </p>
          <p className="text-xs uppercase tracking-[0.14em] text-white/70">
            <span data-counter="97" data-suffix="%" className="display-serif mr-2 text-3xl text-[var(--crisp)]">
              0%
            </span>
            Executive satisfaction score
          </p>
        </div>
      </section>

      <section className="section-shell py-24 md:py-36">
        <h2 className="display-serif mb-12 text-5xl md:text-7xl">The gap between your craftsmanship and your digital first impression.</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            'Your portfolio feels static while your real-world process is world-class.',
            'Leads are filtered by design quality before they ever see your proposal.',
            'Premium buyers expect technology and narrative precision at every touchpoint.',
          ].map((item) => (
            <article key={item} data-reveal className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 text-white/85">
              {item}
            </article>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="mb-8 px-6 md:px-10">
          <h3 className="display-serif text-4xl md:text-6xl">Selected transformations</h3>
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-6 flex md:-ml-10">
            {workItems.map((item, idx) => (
              <div
                key={item.title}
                className="ml-6 min-w-0 flex-[0_0_82%] transition-all duration-500 md:ml-10 md:flex-[0_0_62%]"
                style={{ zIndex: workItems.length - idx }}
              >
                <div className="h-[420px] rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.09] to-white/[0.01] p-10">
                  <p className="mb-5 text-xs uppercase tracking-[0.12em] text-[var(--electric)]">{item.title}</p>
                  <p className="display-serif max-w-xl text-3xl leading-tight md:text-5xl">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell h-[300vh] py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[240px_1fr]">
          <div className="sticky top-20 h-fit">
            {['01', '02', '03'].map((n, i) => (
              <span
                key={n}
                ref={(el) => {
                  numbersRef.current[i] = el;
                }}
                className="display-serif block text-6xl opacity-35 transition-colors duration-300"
              >
                {n}
              </span>
            ))}
          </div>
          <div className="space-y-[40vh] pt-3">
            {steps.map((step, idx) => (
              <article key={step} data-step className="max-w-2xl text-3xl leading-tight text-white/90 md:text-5xl">
                {step}
                <p className="mt-5 text-sm uppercase tracking-[0.12em] text-white/50">Step {idx + 1}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="section-shell relative pb-20 pt-8">
        <div className="footer-line mb-8 h-px w-0 bg-[var(--electric)]" />
        <p className="display-serif text-[56px] leading-none md:text-[72px]">UPLEVEL</p>
        <p className="mt-3 max-w-md text-sm uppercase tracking-[0.1em] text-white/60">
          Your site does not match your standard. Let&apos;s fix that with precision.
        </p>

        <button
          data-magnetic="true"
          className="fixed bottom-6 right-6 z-40 rounded-full border border-[var(--electric)] bg-[var(--void)] px-5 py-3 text-xs uppercase tracking-[0.12em]"
        >
          Vapi Concierge
        </button>
      </footer>
    </main>
  );
}
