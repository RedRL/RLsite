
import { Component, inject, input, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ScrollRevealDirective } from '../shared/scroll-reveal.directive';

@Component({
  selector: 'app-contact-me',
  standalone: true,
  imports: [ReactiveFormsModule, ScrollRevealDirective],
  templateUrl: './contact-me.component.html',
  styleUrl: './contact-me.component.scss'
})
export class ContactMeComponent {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  readonly email = input.required<string>();
  protected readonly formSent = signal(false);
  protected readonly contactForm: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    message: FormControl<string>;
  }> = this.formBuilder.group({
    name: this.formBuilder.control('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z ]+$/)
    ]),
    email: this.formBuilder.control('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]),
    message: this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(20)
    ])
  });

  protected onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const { name, email, message } = this.contactForm.getRawValue();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
      `Hi Harel,\n\n${message}\n\nYou can reach me back at: ${email}`
    );

    this.formSent.set(true);
    window.location.href = `mailto:${this.email()}?subject=${subject}&body=${body}`;
  }
}
