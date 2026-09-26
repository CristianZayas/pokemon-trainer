import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrainerSessionStore } from '@core/state/trainer-session.store';
import { appUrl, APP_PATHS } from '@core/routing/app-paths';
import { calculateAge, formatDui, getTrainerProfileValidationError, TrainerProfileSchema } from '@domain/trainer/trainer.schema';
import { TRAINER_PROFILE_MESSAGES } from './messages';

function todayAsIsoDate(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

@Component({
  selector: 'app-trainer-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './trainer-profile.html',
  styleUrl: './trainer-profile.css',
})
export class TrainerProfilePage {
  private readonly router = inject(Router);
  readonly store = inject(TrainerSessionStore);
  private readonly discardDialog = viewChild<ElementRef<HTMLDialogElement>>('discardDialog');
  readonly photo = signal(this.store.profile()?.photoDataUrl ?? '');
  readonly birthDate = signal(this.store.profile()?.birthDate ?? '');
  readonly age = computed(() => calculateAge(this.birthDate()));
  readonly isAdult = computed(() => (this.age() ?? 0) >= 18);
  readonly error = signal('');
  readonly maxBirthDate = todayAsIsoDate();
  readonly isEditing = this.store.hasProfile();

  readonly form = new FormGroup({
    name: new FormControl(this.store.profile()?.name ?? '', { nonNullable: true, validators: [Validators.required, Validators.minLength(2), Validators.maxLength(80)] }),
    hobby: new FormControl(this.store.profile()?.hobby ?? '', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    birthDate: new FormControl(this.store.profile()?.birthDate ?? '', { nonNullable: true, validators: [Validators.required] }),
    document: new FormControl(this.store.profile()?.document ?? '', { nonNullable: true }),
  });

  onDateChange(): void {
    this.birthDate.set(this.form.controls.birthDate.value);
    this.form.controls.document.setValue('');
  }

  onDocumentInput(): void {
    if (this.isAdult()) this.form.controls.document.setValue(formatDui(this.form.controls.document.value), { emitEvent: false });
  }

  onPhotoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 2_000_000) {
      this.error.set(TRAINER_PROFILE_MESSAGES.invalidPhoto);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { this.photo.set(String(reader.result)); this.error.set(''); };
    reader.onerror = () => this.error.set(TRAINER_PROFILE_MESSAGES.unreadablePhoto);
    reader.readAsDataURL(file);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.photo()) {
      this.error.set(TRAINER_PROFILE_MESSAGES.incompleteProfile);
      return;
    }
    const parsed = TrainerProfileSchema.safeParse({ ...this.form.getRawValue(), photoDataUrl: this.photo() });
    if (!parsed.success) {
      const invalidDocument = getTrainerProfileValidationError(parsed.error.issues) === 'document';
      this.error.set(invalidDocument ? TRAINER_PROFILE_MESSAGES.invalidDocument : TRAINER_PROFILE_MESSAGES.invalidProfile);
      return;
    }
    this.store.saveProfile(parsed.data);
    void this.router.navigateByUrl(this.isEditing && this.store.hasCompleteTeam() ? appUrl(APP_PATHS.summary) : appUrl(APP_PATHS.team));
  }

  confirmDiscard(): void { this.discardDialog()?.nativeElement.showModal(); }
  discard(): void { this.discardDialog()?.nativeElement.close(); void this.router.navigateByUrl(appUrl(APP_PATHS.summary)); }
}
