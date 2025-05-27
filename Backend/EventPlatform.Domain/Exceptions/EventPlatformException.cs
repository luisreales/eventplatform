using System;

namespace EventPlatform.Domain.Exceptions
{
    public class EventPlatformException : Exception
    {
        public int StatusCode { get; }

        public EventPlatformException(string message, int statusCode = 400) 
            : base(message)
        {
            StatusCode = statusCode;
        }
    }
} 