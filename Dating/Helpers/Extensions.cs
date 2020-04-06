using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dating.Helpers;
using Microsoft.AspNetCore.Mvc.Formatters;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Dating.Extensions
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response,string message)
        {
            response.Headers.Add("Application-Error",message);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*");
        }

        public static void AddPaginationHeader(this HttpResponse response,
            int pageNumber, int pagesCount, int totalItems, int pageSize)
        {
            var paginationHeader = new PaginationHeader(pageNumber, pageSize, pagesCount, totalItems);
            var camelCaseFormatter=new JsonSerializerSettings();
            camelCaseFormatter.ContractResolver=new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination",JsonConvert.SerializeObject(paginationHeader, camelCaseFormatter));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }

        public static int CalculateUserAge(this DateTime dateOfBirth)
        {
            int age = (DateTime.Today.Year) - (dateOfBirth.Year);
            if (dateOfBirth.AddYears(age) > DateTime.Today)
            {
                age-=1;
            }
            return age;
        }
    }
}
