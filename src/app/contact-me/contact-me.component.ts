import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-me',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-me.component.html',
  styleUrl: './contact-me.component.scss'
})
export class ContactMeComponent implements OnInit {
  contactForm: FormGroup;

  constructor() {
    this.contactForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        this.validName
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        this.validEmail
      ]),
      message: new FormControl('', [
        Validators.required,
        Validators.minLength(10)
      ])
    });
  }

  ngOnInit(): void {
    // Remove leading spaces
    this.contactForm.get('name').valueChanges.subscribe(value => {
      const trimmedValue = value?.trimStart();
      if (trimmedValue !== value) {
        this.contactForm.get('name').setValue(trimmedValue, { emitEvent: false });
      }
    });
  }

  // Custom validator for name (only letters allowed)
  validName(control: FormControl) {
    const regex = /^[a-zA-Z ]+$/;
    if (control.value && !regex.test(control.value)) {
      return { invalidName: true };
    }
    return null;
  }

  // Custom validator for email (basic validation example)
  validEmail(control: FormControl) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (control.value && !regex.test(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  // Function to handle form submission
  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form Submitted', this.contactForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
