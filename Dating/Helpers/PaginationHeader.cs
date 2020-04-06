using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Dating.Helpers
{
    public  class PaginationHeader
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int PagesCount { get; set; }
        public int TotalItems { get; set; }

        public PaginationHeader(int pageNumber,int pageSize,int pagesCount,int totalItems)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
            PagesCount = pagesCount;
            TotalItems = totalItems;
        }
    }
}
