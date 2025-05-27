export enum EventStatus {
  Upcoming = 'Upcoming',
  Attending = 'Attending',
  Maybe = 'Maybe',
  Declined = 'Declined'
}

export interface Event {
  Id: string;
  Title: string;
  DateTime: string | Date;
  Location: string;
  Description: string;
  Status: EventStatus;
}
