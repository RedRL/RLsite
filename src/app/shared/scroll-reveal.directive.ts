import {
  Directive,
  ElementRef,
  HostBinding,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  input
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  readonly revealDelay = input(0);

  @HostBinding('class.is-revealed') protected isRevealed = false;
  @HostBinding('style.transition-delay.ms') protected get delayMs(): number {
    return this.revealDelay();
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.isRevealed = true;
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.isRevealed = true;
            this.observer?.disconnect();
          }
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
