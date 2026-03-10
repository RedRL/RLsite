import { Component } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { ContactMeComponent } from '../contact-me/contact-me.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CarouselComponent, ContactMeComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  toggleTheme() {
    // Implement theme toggle logic here
  }

  contactMe() {
    // Implement contact logic here
  }
}
