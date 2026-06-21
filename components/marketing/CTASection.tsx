"use client";

import Orb from "@/animation/Orb";
import GithubIcon from "@/components/shared/icons/GithubIcon";
import Button from "@/components/ui/Button";
import VisibleBackground from "@/components/ui/VisibleBackground";
import GridOverlay from "@/components/ui/GridOverlay";

export default function CTASection() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-bg-primary to-bg-base px-5 py-28 lg:px-8 lg:py-36">
      <GridOverlay />
      <VisibleBackground className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2">
          <Orb hue={115} hoverIntensity={0.18} rotateOnHover={false} forceHoverState backgroundColor="#05080F" dpr={1.25} />
        </div>
      </VisibleBackground>

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-[var(--font-display)] text-[46px] font-bold leading-[1.05] tracking-[-0.025em] text-text-primary sm:text-[64px] lg:text-[72px]">
          <span className="block">Build the verified</span>
          <span className="block">
            Nigerian internet<span className="text-green">.</span>
          </span>
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-[17px] leading-[1.65] text-text-secondary">
          AfricaZK is open infrastructure. Integrate it. Fork it. Build on
          it. Africa&apos;s identity layer belongs to everyone.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="primary" size="lg" href="#">
            Try the Demo
          </Button>
          <Button variant="outline" size="lg" href="/docs/introduction">
            Read the Docs
          </Button>
          <Button variant="ghost" size="lg" href="#">
            <GithubIcon className="h-4 w-4" />
            View on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}
