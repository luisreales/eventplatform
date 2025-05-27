using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EventPlatform.Domain.Models;
using EventPlatform.Domain.Exceptions;
using EventPlatform.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace EventPlatform.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EventsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            var events = await _context.Events.ToListAsync();
            if (!events.Any())
            {
                throw new EventPlatformException("No events found.", 404);
            }
            return events;
        }

        // GET: api/events/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(Guid id)
        {
            var eventItem = await _context.Events.FindAsync(id);

            if (eventItem == null)
            {
                throw new EventPlatformException($"Event with ID {id} not found.", 404);
            }

            return eventItem;
        }

        // POST: api/events
        [HttpPost]
        public async Task<ActionResult<Event>> PostEvent([FromBody] Event eventItem)
        {
            if (eventItem == null)
            {
                return BadRequest("Event data is required");
            }

            // Ensure the event has a new ID
            eventItem.Id = Guid.NewGuid();

            _context.Events.Add(eventItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEvent), new { id = eventItem.Id }, eventItem);
        }

        // PUT: api/events/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEvent(Guid id, [FromBody] Event eventItem)
        {
            if (id != eventItem.Id)
            {
                return BadRequest("Event ID mismatch.");
            }

            var existingEvent = await _context.Events.FindAsync(id);
            if (existingEvent == null)
            {
                return NotFound();
            }

            _context.Entry(existingEvent).CurrentValues.SetValues(eventItem);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/events/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(Guid id)
        {
            var eventItem = await _context.Events.FindAsync(id);
            if (eventItem == null)
            {
                throw new EventPlatformException($"Event with ID {id} not found.", 404);
            }

            _context.Events.Remove(eventItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EventExists(Guid id)
        {
            return _context.Events.Any(e => e.Id == id);
        }
    }
} 