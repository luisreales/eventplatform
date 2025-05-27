using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EventPlatform.Domain.Models
{
    public class Event
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 100 characters")]
        public required string Title { get; set; }

        [Required(ErrorMessage = "Date and time is required")]
        public DateTime DateTime { get; set; }

        [Required(ErrorMessage = "Location is required")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "Location must be between 3 and 200 characters")]
        public required string Location { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Description must be between 10 and 1000 characters")]
        public required string Description { get; set; }

        [Required(ErrorMessage = "Status is required")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public EventStatus Status { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum EventStatus
    {
        Upcoming,
        Attending,
        Maybe,
        Declined
    }
} 