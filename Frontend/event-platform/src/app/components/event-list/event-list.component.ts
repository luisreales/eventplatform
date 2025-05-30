import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="container">
      <h2>Events</h2>
      <button mat-raised-button color="primary" routerLink="/events/new">Create New Event</button>

      <table mat-table [dataSource]="events" class="mat-elevation-z8">
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>Title</th>
          <td mat-cell *matCellDef="let event">{{event.title}}</td>
        </ng-container>

        <ng-container matColumnDef="dateTime">
          <th mat-header-cell *matHeaderCellDef>Date & Time</th>
          <td mat-cell *matCellDef="let event">{{event.dateTime | date:'medium'}}</td>
        </ng-container>

        <ng-container matColumnDef="location">
          <th mat-header-cell *matHeaderCellDef>Location</th>
          <td mat-cell *matCellDef="let event">{{event.location}}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let event">{{event.status}}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let event">
            <ng-container *ngIf="events.length > 0">
              <div class="action-buttons">
                <button mat-icon-button [routerLink]="['/events', event.id]">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteEvent(event.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </ng-container>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

        <!-- Row when there is no data -->
       <tr class="mat-row" *matNoDataRow>
        <td class="mat-cell" [attr.colspan]="displayedColumns.length">No events found.</td>
      </tr>
      </table>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    table {
      width: 100%;
      margin-top: 20px;
    }
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 8px; /* Adjust the gap between buttons as needed */
    }
  `]
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  displayedColumns: string[] = ['title', 'dateTime', 'location', 'status', 'actions'];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data) => this.events = data,
      error: (error) => {
        console.error('Error loading events:', error);
        // Assuming 404 means no events, clear the list
        if (error.status === 404) {
          this.events = [];
        } else {
          // Handle other errors as needed
        }
      }
    });
  }

  deleteEvent(id: string): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => this.loadEvents(),
        error: (error) => console.error('Error deleting event:', error)
      });
    }
  }
}
