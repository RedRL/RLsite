import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject, signal, DOCUMENT } from '@angular/core';
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
  readonly kind: 'github' | 'linkedin' | 'email';
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
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'rlsite-theme';

  protected readonly aboutExpanded = signal(false);
  protected readonly theme = signal<ThemeMode>('dark');
  protected readonly currentYear = new Date().getFullYear();
  protected readonly navItems: readonly NavItem[] = [
    { label: 'Home', target: 'home' },
    { label: 'About', target: 'about' },
    { label: 'Projects', target: 'projects' },
    { label: 'Contact', target: 'contact' }
  ];
  protected readonly socialLinks: readonly SocialLink[] = [
    { label: 'GitHub', href: 'https://github.com/RedRL', kind: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/harel-yerushalmi-891091178/', kind: 'linkedin' },
    { label: 'Email', href: 'mailto:harel.yerushalmi@gmail.com', kind: 'email' }
  ];
  protected readonly stats = [
    { value: '3+', label: 'Years building polished web experiences' },
    { value: '12', label: 'Concept-to-launch portfolio and product builds' },
    { value: '100%', label: 'Responsive, animated, and theme-aware UI' }
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
    }
  }

  protected setTheme(theme: ThemeMode): void {
    this.theme.set(theme);
    this.applyTheme(theme);
  }

  protected scrollToSection(sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  protected toggleAboutExpanded(panel?: HTMLElement): void {
    const expanded = this.aboutExpanded();

    if (expanded && panel) {
      panel.scrollTop = 0;
    }

    this.aboutExpanded.set(!expanded);
  }

  private applyTheme(theme: ThemeMode): void {
    this.document.documentElement.setAttribute('data-theme', theme);

    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(this.storageKey, theme);
    }
  }
}
