import { Component } from '@angular/core';
import { ScrollRevealDirective } from '../shared/scroll-reveal.directive';

@Component({
  selector: 'app-contact-me',
  standalone: true,
  imports: [ScrollRevealDirective],
  templateUrl: './contact-me.component.html',
  styleUrl: './contact-me.component.scss'
})
export class ContactMeComponent {}
