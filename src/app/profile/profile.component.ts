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

interface SkillGroup {
  readonly name: string;
  readonly items: readonly string[];
}

export interface ProjectCard {
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly stack: readonly string[];
  readonly image: string;
  readonly href: string;
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

  protected readonly theme = signal<ThemeMode>('dark');
  protected readonly currentYear = new Date().getFullYear();
  protected readonly navItems: readonly NavItem[] = [
    { label: 'Home', target: 'home' },
    { label: 'About', target: 'about' },
    { label: 'Skills', target: 'skills' },
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
  protected readonly skillGroups: readonly SkillGroup[] = [
    { name: 'Frontend', items: ['Angular', 'TypeScript', 'SCSS', 'RxJS'] },
    { name: 'Design', items: ['Figma', 'Design systems', 'Motion', 'Accessibility'] },
    { name: 'Backend', items: ['Node.js', 'REST APIs', 'Auth flows', 'Data modeling'] },
    { name: 'Workflow', items: ['GitHub', 'Performance', 'Responsive UI', 'Deployment'] }
  ];
  protected readonly projects: readonly ProjectCard[] = [
    {
      title: 'Project One',
      subtitle: 'Immersive landing experience',
      description: 'A conversion-focused marketing page with motion, layered gradients, and strong content hierarchy.',
      stack: ['Angular', 'SCSS', 'Motion'],
      image: 'assets/images/b90f8212e77c64fd7938c5fed1cd5fa8.jpg',
      href: '#contact'
    },
    {
      title: 'Project Two',
      subtitle: 'Developer dashboard concept',
      description: 'A dark-glass dashboard built for readability, crisp charts, and interaction states that feel fast.',
      stack: ['TypeScript', 'UI Systems', 'Charts'],
      image: 'assets/images/70474a0b-21ff-4f14-8059-60ce4374ea36.jpg',
      href: '#skills'
    },
    {
      title: 'Project Three',
      subtitle: 'Story-driven portfolio',
      description: 'A personal brand site blending visual drama with practical navigation, theme switching, and clear calls to action.',
      stack: ['Standalone Angular', 'Signals', 'Theming'],
      image: 'assets/images/8a14c2367d8a61aa812efa0d63ef262c.jpg',
      href: 'assets/files/CV - Harel Yerushalmi.pdf'
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

  private applyTheme(theme: ThemeMode): void {
    this.document.documentElement.setAttribute('data-theme', theme);

    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(this.storageKey, theme);
    }
  }
}
