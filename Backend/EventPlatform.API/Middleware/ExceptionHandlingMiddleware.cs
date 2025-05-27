using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using EventPlatform.Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;

namespace EventPlatform.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var response = context.Response;
            response.ContentType = "application/json";

            int statusCode;
            string message;

            switch (exception)
            {
                case EventPlatformException ex:
                    statusCode = ex.StatusCode;
                    message = ex.Message;
                    break;
                case ValidationException ex:
                    statusCode = StatusCodes.Status400BadRequest;
                    message = ex.Message;
                    break;
                default:
                    statusCode = StatusCodes.Status500InternalServerError;
                    message = "An unexpected error occurred.";
                    break;
            }

            _logger.LogError(exception, "An error occurred: {Message}", exception.Message);

            response.StatusCode = statusCode;
            var result = JsonSerializer.Serialize(new { error = message });
            await response.WriteAsync(result);
        }
    }
} 