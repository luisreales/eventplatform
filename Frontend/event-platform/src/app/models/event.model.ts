export enum EventStatus {
  Upcoming = 'Upcoming',
  Attending = 'Attending',
  Maybe = 'Maybe',
  Declined = 'Declined'
}

export interface Event {
  id: string;
  title: string;
  dateTime: string | Date;
  location: string;
  description: string;
  status: EventStatus;
}
