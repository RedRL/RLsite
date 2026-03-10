import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import Swiper, { Navigation } from 'swiper';
// import 'swiper/swiper-bundle.min.css';

// Initialize the Navigation module
// Swiper.use([Navigation]);

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarouselComponent {
  // Swiper configuration (optional)
  swiperConfig = {
    mousewheel: false,
    watchOverflow: true,
    pagination: {
      // enabled: true,
      clickable: true,
      renderBullet: function (index: number, className: string) {
        return '<span style="border: 1px solid #2ED5C4;" class="' + className + '"></span>';
      }
    },
    breakpoints: {
      360: {
        slidesPerView: 1.2,
      },
      1024: {
        slidesPerView: 3,
        pagination: {
          // enabled: false
        }
      },
    },
  }
}
