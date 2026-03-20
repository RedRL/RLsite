
import { Component, input } from '@angular/core';
import { ScrollRevealDirective } from '../shared/scroll-reveal.directive';
import { ProjectCard } from '../profile/profile.component';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  standalone: true,
  imports: [ScrollRevealDirective]
})
export class CarouselComponent {
  readonly projects = input.required<readonly ProjectCard[]>();
}
