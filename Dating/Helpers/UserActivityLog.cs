using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Dating.Data;
using Dating.Models;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace Dating.Helpers
{
    public class UserActivityLog:IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            //context :what will happen during action execution.
            //next    :what will happen after action has been executed.

            var actionResult = await next();

            var userId = int.Parse(actionResult.HttpContext.User
                .FindFirst(ClaimTypes.NameIdentifier).Value);
            var repository = actionResult.HttpContext.RequestServices.GetService<IDatingRepository>();
            
            var user = await repository.GetUser(userId);
            user.LastActive=DateTime.Now;
            await repository.SaveAll();
            
        }
    }
}
