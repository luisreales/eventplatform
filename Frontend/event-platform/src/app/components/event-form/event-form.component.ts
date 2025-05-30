import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EventService } from '../../services/event.service';
import { Event, EventStatus } from '../../models/event.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="container">
      <h2>{{isEditMode ? 'Edit' : 'Create'}} Event</h2>
      <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" required>
          <mat-error *ngIf="eventForm.get('title')?.hasError('required')">Title is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Date & Time</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dateTime" required>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="eventForm.get('dateTime')?.hasError('required')">Date & Time is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Location</mat-label>
          <input matInput formControlName="location" required>
          <mat-error *ngIf="eventForm.get('location')?.hasError('required')">Location is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" required></textarea>
          <mat-error *ngIf="eventForm.get('description')?.hasError('required')">Description is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status" required>
            <mat-option *ngFor="let status of eventStatuses" [value]="status">
              {{status}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="eventForm.get('status')?.hasError('required')">Status is required</mat-error>
        </mat-form-field>

        <div class="button-container">
          <button mat-button type="button" routerLink="/events">Cancel</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!eventForm.valid">
            {{isEditMode ? 'Update' : 'Create'}}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .button-container {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 16px;
    }
  `]
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  eventId: string | null = null;
  eventStatuses = Object.values(EventStatus);

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      dateTime: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.eventId;

    if (this.isEditMode && this.eventId) {
      this.eventService.getEvent(this.eventId).subscribe({
        next: (event) => {
          this.eventForm.patchValue({
            title: event.title,
            dateTime: new Date(event.dateTime),
            location: event.location,
            description: event.description,
            status: event.status
          });
        },
        error: (error) => {
          console.error('Error loading event:', error);
          this.router.navigate(['/events']);
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.eventForm.valid) return;

    const formValue = this.eventForm.value;

    const eventData: Event = {
      ...formValue,
      dateTime: new Date(formValue.dateTime).toISOString(),
      ...(this.isEditMode && { id: this.eventId })
    };

    const request$ = this.isEditMode
      ? this.eventService.updateEvent(this.eventId!, eventData)
      : this.eventService.createEvent(eventData);

    request$.subscribe({
      next: () => this.router.navigate(['/events']),
      error: (error: any) => this.handleError(error)
    });
  }

  private handleError(error: any): void {
    console.error('Error saving event:', error);
    const validationErrors = error?.error?.errors;
    if (validationErrors) {
      console.error('Validation errors:', JSON.stringify(validationErrors, null, 2));
      alert('Validation error:\n' + JSON.stringify(validationErrors, null, 2));
    } else {
      alert('Unexpected error:\n' + error.message);
    }
  }
}
