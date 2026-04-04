import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  inject,
  NgZone,
  signal,
  viewChild,
  DOCUMENT
} from '@angular/core';
import type { Swiper } from 'swiper/types';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CarouselComponent } from '../carousel/carousel.component';
import { ContactMeComponent } from '../contact-me/contact-me.component';
import { ScrollRevealDirective } from '../shared/scroll-reveal.directive';

type ThemeMode = 'dark' | 'light';

interface NavItem {
  readonly label: string;
  readonly target: string;
}

interface SocialLink {
  readonly label: string;
  readonly href: string;
  readonly kind: 'github' | 'linkedin' | 'instagram' | 'whatsapp';
}

interface ShowcaseImage {
  readonly src: string;
  readonly alt: string;
}

interface MusicVideoOverlay {
  readonly title: string;
  readonly embedUrl: SafeResourceUrl;
}

export interface ProjectCard {
  readonly title: string;
  readonly subtitle: string;
  readonly prompt?: string;
  readonly description: string;
  readonly stack: readonly string[];
  readonly image?: string;
  readonly href: string;
  readonly linkLabel?: string;
  readonly audioSrc?: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CarouselComponent, ContactMeComponent, ScrollRevealDirective],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileComponent {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly storageKey = 'rlsite-theme';
  private readonly mobileScrollMaxWidthPx = 820;
  private readonly mobileSectionScrollExtraPx = 36;
  private readonly checkersSwiperHost = viewChild<ElementRef<HTMLElement>>('checkersSwiper');
  private checkersSwiperUnsubSlideSync: (() => void) | null = null;
  private checkersSwiperDomCleanups: Array<() => void> = [];
  private checkersSwiperAttachRetryId: ReturnType<typeof setTimeout> | null = null;
  private checkersSwiperInstance: Swiper | null = null;

  protected readonly aboutExpanded = signal(false);
  protected readonly activeCheckersIndex = signal(0);
  protected readonly checkersLightboxImage = signal<ShowcaseImage | null>(null);
  protected readonly activeMusicVideo = signal<MusicVideoOverlay | null>(null);
  protected readonly theme = signal<ThemeMode>('dark');
  protected readonly phonePreviewOpen = signal(false);
  protected readonly showJumpToTop = signal(false);
  /** When true, use mobile layout (Swiper checkers, phone preview, etc.); desktop matches master. */
  protected readonly narrowLayout = signal(false);
  protected readonly currentYear = new Date().getFullYear();
  protected readonly checkersVisibleOffsets = [-1, 0, 1] as const;
  protected readonly navItems: readonly NavItem[] = [
    { label: 'About', target: 'about' },
    { label: 'Projects', target: 'projects' },
    { label: 'Music', target: 'music' },
    { label: 'Contact', target: 'contact' }
  ];
  protected readonly socialLinks: readonly SocialLink[] = [
    { label: 'GitHub', href: 'https://github.com/RedRL', kind: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/harel-yerushalmi-891091178/', kind: 'linkedin' },
    { label: 'Instagram', href: 'https://www.instagram.com/harel.yerushalmi', kind: 'instagram' },
    { label: 'WhatsApp', href: 'https://wa.me/972546602230', kind: 'whatsapp' }
  ];
  protected readonly stats = [
    { value: '19', label: 'Years since my first line of code' },
    { value: '3', label: 'Years of "hands-on" experience' },
    { value: '100%', label: 'Devoted to whatever it is I am working on' }
  ] as const;
  protected readonly checkersScreens: readonly ShowcaseImage[] = [
    { src: 'assets/images/checkers/open-screen.png', alt: 'Checkers game opening screen' },
    { src: 'assets/images/checkers/6x6.png', alt: 'Checkers game board in 6 by 6 mode' },
    { src: 'assets/images/checkers/8x8.png', alt: 'Checkers game board in 8 by 8 mode' },
    { src: 'assets/images/checkers/10x10.png', alt: 'Checkers game board in 10 by 10 mode' },
    { src: 'assets/images/checkers/king.png', alt: 'Checkers game king piece screen' },
    { src: 'assets/images/checkers/GPT-comment.png', alt: 'Checkers game playing against ChatGPT' }
  ] as const;
  protected readonly projects: readonly ProjectCard[] = [
    {
      title: 'Composing Polyphonic Melody Using RNN with Attention',
      subtitle: 'ML generated music',
      prompt: 'Do you like Bach? Check this piece out:',
      description: 'This music was generated completely by the learned model, which was trained with an LSTM-based attention RNN to compose polyphonic melodies.',
      stack: ['Python', 'RNN', 'Attention', 'Music generation'],
      image: 'assets/images/bach.png',
      href: 'https://colab.research.google.com/drive/1ckfmWaYnpKTo0tSwIEZdU3sGiHv6Np3U?usp=sharing',
      linkLabel: 'View code',
      audioSrc: 'assets/media/attention%20audio%20cut.mp3'
    },
    {
      title: 't-SNE',
      subtitle: 'ML visualization',
      prompt: 'Do you like clustering?',
      description: 'An implementation of t-SNE for dimensionality reduction and visual exploration, built to project complex high-dimensional data into an interpretable 2D representation.',
      stack: ['Python', 't-SNE', 'Clustering', 'Visualization'],
      image: 'assets/images/t-SNE.png',
      href: 'https://colab.research.google.com/drive/1ewk2KGGafw4p_TxHs8q3iPVxMI7qN_zw?usp=sharing',
      linkLabel: 'View code'
    },
    {
      title: 'AdaBoost',
      subtitle: 'ML classification',
      prompt: 'Do you like classifying?',
      description: 'An AdaBoost implementation focused on boosting weak learners into a stronger classifier, with clear training flow and visual inspection of the resulting decision behavior.',
      stack: ['Python', 'AdaBoost', 'Classification', 'Ensemble learning'],
      image: 'assets/images/AdaBoost.png',
      href: 'https://colab.research.google.com/drive/1U6qJedV_FEvv1yVdruV6UGlckPZosv9Z?usp=sharing',
      linkLabel: 'View code'
    },
    {
      title: 'Music Genre Classification',
      subtitle: 'ML audio classification',
      prompt: 'Do you like music?',
      description: 'A music genre classification project built with a CNN, focused on learning audio patterns and distinguishing between genres from extracted musical features.',
      stack: ['Python', 'CNN', 'Audio', 'Classification'],
      image: 'assets/images/music genre.png',
      href: 'https://drive.google.com/file/d/1zO2O0c2TDj6147nbaStZQo6R6QzjzhaX/view?usp=sharing',
      linkLabel: 'View report'
    }
  ];
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const storedTheme = window.localStorage.getItem(this.storageKey);

      if (storedTheme === 'dark' || storedTheme === 'light') {
        this.theme.set(storedTheme);
      }

      this.applyTheme(this.theme());

      const onScroll = (): void => {
        this.showJumpToTop.set(this.getViewportScrollTop() > 340);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
      });

      const mq = window.matchMedia(`(max-width: ${this.mobileScrollMaxWidthPx}px)`);
      const onMq = (): void => {
        const narrow = mq.matches;
        this.narrowLayout.set(narrow);
        if (!narrow) {
          this.teardownCheckersSwiperDotSync();
        } else {
          this.scheduleCheckersSwiperAttach();
        }
        this.ngZone.run(() => this.cdr.markForCheck());
      };
      onMq();
      mq.addEventListener('change', onMq);
      this.destroyRef.onDestroy(() => mq.removeEventListener('change', onMq));
    }

    this.destroyRef.onDestroy(() => {
      if (this.checkersSwiperAttachRetryId !== null) {
        window.clearTimeout(this.checkersSwiperAttachRetryId);
        this.checkersSwiperAttachRetryId = null;
      }

      this.teardownCheckersSwiperDotSync();
    });

    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      if (this.narrowLayout()) {
        this.scheduleCheckersSwiperAttach();
      }
    });
  }

  /**
   * Desktop uses `body` as the scroll container (see global styles); the window does not scroll.
   */
  private isDesktopBodyScroll(): boolean {
    return isPlatformBrowser(this.platformId) && window.innerWidth > this.mobileScrollMaxWidthPx;
  }

  private getViewportScrollTop(): number {
    return this.isDesktopBodyScroll() ? this.document.body.scrollTop : window.scrollY;
  }

  private scrollViewportTo(top: number, behavior: ScrollBehavior): void {
    const y = Math.max(0, top);
    if (this.isDesktopBodyScroll()) {
      this.document.body.scrollTo({ top: y, behavior });
      return;
    }
    window.scrollTo({ top: y, behavior });
  }

  private scheduleCheckersSwiperAttach(): void {
    if (!isPlatformBrowser(this.platformId) || !this.narrowLayout()) {
      return;
    }

    queueMicrotask(() => this.attachCheckersSwiperDotSync());

    if (this.checkersSwiperAttachRetryId !== null) {
      window.clearTimeout(this.checkersSwiperAttachRetryId);
    }

    this.checkersSwiperAttachRetryId = window.setTimeout(() => {
      this.checkersSwiperAttachRetryId = null;
      this.attachCheckersSwiperDotSync();
    }, 400);
  }

  private teardownCheckersSwiperDotSync(): void {
    for (const fn of this.checkersSwiperDomCleanups) {
      fn();
    }

    this.checkersSwiperDomCleanups = [];
    this.checkersSwiperUnsubSlideSync?.();
    this.checkersSwiperUnsubSlideSync = null;
    this.checkersSwiperInstance = null;
  }

  /**
   * Swiper runs outside Angular and may initialize before projected slides exist.
   * Bind index sync via polling + DOM events + swiper.on so dots stay aligned.
   */
  private attachCheckersSwiperDotSync(): void {
    if (!this.narrowLayout()) {
      return;
    }

    this.teardownCheckersSwiperDotSync();

    const hostRef = this.checkersSwiperHost();
    const host = hostRef?.nativeElement as HTMLElement & { swiper?: Swiper };

    if (!host) {
      return;
    }

    const bindSwiper = (swiper: Swiper): void => {
      if (this.checkersSwiperInstance === swiper) {
        return;
      }

      this.checkersSwiperUnsubSlideSync?.();
      this.checkersSwiperUnsubSlideSync = null;

      this.checkersSwiperInstance = swiper;

      const resolveDotIndex = (s: Swiper): number => {
        const last = this.checkersScreens.length - 1;
        const raw =
          typeof s.realIndex === 'number' && !Number.isNaN(s.realIndex) ? s.realIndex : s.activeIndex;
        return Math.min(Math.max(raw, 0), last);
      };

      const sync = (s: Swiper): void => {
        if (!s || s.destroyed) {
          return;
        }
        const idx = resolveDotIndex(s);
        if (this.activeCheckersIndex() === idx) {
          return;
        }
        this.ngZone.run(() => {
          this.activeCheckersIndex.set(idx);
          this.cdr.markForCheck();
        });
      };

      sync(swiper);
      swiper.update?.();

      const afterTransition = (): void => {
        swiper.updateSize();
        swiper.updateSlides();
        sync(swiper);
      };

      const onTouchEnd = (s: Swiper): void => {
        queueMicrotask(() => {
          if (!s.destroyed) {
            sync(s);
          }
        });
      };

      swiper.on('slideChange', sync);
      swiper.on('activeIndexChange', sync);
      swiper.on('realIndexChange', sync);
      swiper.on('observerUpdate', sync);
      swiper.on('slideChangeTransitionEnd', afterTransition);
      swiper.on('touchEnd', onTouchEnd);

      this.checkersSwiperUnsubSlideSync = () => {
        swiper.off('slideChange', sync);
        swiper.off('activeIndexChange', sync);
        swiper.off('realIndexChange', sync);
        swiper.off('observerUpdate', sync);
        swiper.off('slideChangeTransitionEnd', afterTransition);
        swiper.off('touchEnd', onTouchEnd);
        this.checkersSwiperInstance = null;
      };
    };

    const onAfterInit = (ev: Event): void => {
      const detail = (ev as CustomEvent<[Swiper]>).detail;
      const sw = detail?.[0];

      if (sw) {
        bindSwiper(sw);
      }
    };

    host.addEventListener('afterinit', onAfterInit);
    this.checkersSwiperDomCleanups.push(() => host.removeEventListener('afterinit', onAfterInit));

    const onSlideDom = (ev: Event): void => {
      const detail = (ev as CustomEvent<unknown[]>).detail;
      const sw = (detail?.[0] as Swiper | undefined) ?? host.swiper;

      if (!sw || sw.destroyed) {
        return;
      }

      const last = this.checkersScreens.length - 1;
      const raw =
        typeof sw.realIndex === 'number' && !Number.isNaN(sw.realIndex) ? sw.realIndex : sw.activeIndex;
      const idx = Math.min(Math.max(raw, 0), last);

      this.ngZone.run(() => {
        this.activeCheckersIndex.set(idx);
        this.cdr.markForCheck();
      });
    };

    host.addEventListener('slidechange', onSlideDom);
    host.addEventListener('activeindexchange', onSlideDom);
    host.addEventListener('realindexchange', onSlideDom);
    host.addEventListener('slidechangetransitionend', onSlideDom);
    this.checkersSwiperDomCleanups.push(() => {
      host.removeEventListener('slidechange', onSlideDom);
      host.removeEventListener('activeindexchange', onSlideDom);
      host.removeEventListener('realindexchange', onSlideDom);
      host.removeEventListener('slidechangetransitionend', onSlideDom);
    });

    let tries = 0;
    const maxTries = 200;
    const pollId = window.setInterval(() => {
      tries += 1;
      const sw = host.swiper;

      if (sw) {
        bindSwiper(sw);
        clearInterval(pollId);
        return;
      }

      if (tries >= maxTries) {
        clearInterval(pollId);
      }
    }, 25);

    this.checkersSwiperDomCleanups.push(() => clearInterval(pollId));
  }

  protected setTheme(theme: ThemeMode): void {
    this.theme.set(theme);
    this.applyTheme(theme);
  }

  protected scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const target = this.document.getElementById(sectionId);

    if (!target) {
      return;
    }

    const header = this.document.querySelector('.site-header');

    if (window.innerWidth > this.mobileScrollMaxWidthPx) {
      if (sectionId === 'home') {
        this.scrollViewportTo(0, 'smooth');
        return;
      }

      const headerOffset = header instanceof HTMLElement ? header.getBoundingClientRect().height + 8 : 84;
      const targetTop =
        this.getViewportScrollTop() + target.getBoundingClientRect().top - headerOffset;

      this.scrollViewportTo(targetTop, 'smooth');
      return;
    }

    let headerOffset = 12;

    if (header instanceof HTMLElement) {
      const headerPosition = window.getComputedStyle(header).position;
      headerOffset = headerPosition === 'sticky' ? header.getBoundingClientRect().height + 6 : 12;
    }

    const scrollFurtherDown =
      sectionId !== 'hero-title-anchor' ? this.mobileSectionScrollExtraPx : 0;

    const targetTop =
      this.getViewportScrollTop() +
      target.getBoundingClientRect().top -
      headerOffset +
      scrollFurtherDown;

    this.scrollViewportTo(targetTop, 'smooth');
  }

  protected scrollToTop(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.scrollViewportTo(0, 'smooth');
  }

  protected openPhonePreview(): void {
    this.phonePreviewOpen.set(true);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.document.getElementById('phone-simulation-anchor')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    });
  }

  protected closePhonePreview(): void {
    this.phonePreviewOpen.set(false);
  }

  protected toggleAboutExpanded(panel?: HTMLElement): void {
    const expanded = this.aboutExpanded();

    if (expanded && panel) {
      panel.scrollTop = 0;
    }

    this.aboutExpanded.set(!expanded);
  }

  protected previousCheckersSlide(): void {
    if (!this.narrowLayout()) {
      this.activeCheckersIndex.update((index) => this.getWrappedCheckersIndex(index - 1));
      return;
    }

    this.getCheckersSwiper()?.slidePrev();
  }

  protected nextCheckersSlide(): void {
    if (!this.narrowLayout()) {
      this.activeCheckersIndex.update((index) => this.getWrappedCheckersIndex(index + 1));
      return;
    }

    this.getCheckersSwiper()?.slideNext();
  }

  protected selectCheckersSlide(index: number): void {
    if (!this.narrowLayout()) {
      this.activeCheckersIndex.set(this.getWrappedCheckersIndex(index));
      return;
    }

    const host = this.checkersSwiperHost()?.nativeElement as HTMLElement & { swiper?: Swiper };
    const swiper = host?.swiper;

    if (!swiper || swiper.destroyed) {
      return;
    }

    this.checkersSwiperInstance = swiper;

    const speed = typeof swiper.params.speed === 'number' ? swiper.params.speed : 380;
    const clamped = Math.max(0, Math.min(index, this.checkersScreens.length - 1));

    const applySlide = (): void => {
      swiper.updateSlides();
      swiper.updateProgress();
      swiper.slideTo(clamped, speed, true);
      if (swiper.activeIndex !== clamped) {
        swiper.slideTo(clamped, 0, true);
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => applySlide());
    });

    this.ngZone.run(() => {
      this.activeCheckersIndex.set(clamped);
      this.cdr.markForCheck();
    });
  }

  protected getCheckersSlide(indexOffset: number): ShowcaseImage {
    return this.checkersScreens[this.getCheckersSlideIndex(indexOffset)];
  }

  protected getCheckersSlideIndex(indexOffset: number): number {
    return this.getWrappedCheckersIndex(this.activeCheckersIndex() + indexOffset);
  }

  protected openCheckersLightbox(image: ShowcaseImage): void {
    this.checkersLightboxImage.set(image);
  }

  protected closeCheckersLightbox(): void {
    this.checkersLightboxImage.set(null);
  }

  protected openMusicVideo(videoId: string, title: string): void {
    this.activeMusicVideo.set({
      title,
      embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
      )
    });
  }

  protected closeMusicVideo(): void {
    this.activeMusicVideo.set(null);
  }

  private applyTheme(theme: ThemeMode): void {
    this.document.documentElement.setAttribute('data-theme', theme);

    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(this.storageKey, theme);
    }
  }

  private getWrappedCheckersIndex(index: number): number {
    return (index + this.checkersScreens.length) % this.checkersScreens.length;
  }

  private getCheckersSwiper(): Swiper | undefined {
    const el = this.checkersSwiperHost()?.nativeElement as HTMLElement & { swiper?: Swiper };
    const live = el?.swiper;
    if (live && !live.destroyed) {
      this.checkersSwiperInstance = live;
      return live;
    }
    return undefined;
  }
}
