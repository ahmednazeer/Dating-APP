using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Dating.Helpers
{
    public class PagedList<T>:List<T>
    {
        public int TotalCount { get; set; }
        public int PageSize { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPagesCount { get; set; }

        public PagedList(List<T> items,int count,int pageSize,int currentPage)
        {
            TotalCount = count;
            PageSize = pageSize;
            CurrentPage = currentPage;
            TotalPagesCount =(int) Math.Ceiling(count / (double)pageSize);
            this.AddRange(items);
        }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source
            , int pageNumber, int pageSize)
        {
            var count = await source.CountAsync();

            var data = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(data,count,pageSize,pageNumber);
        }

    }
}
