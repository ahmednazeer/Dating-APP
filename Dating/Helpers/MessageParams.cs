using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dating.Helpers
{
    public class MessageParams
    {
        public int PageNumber { get; set; } = 1;
        private const int maxPageSize = 50;
        private int pageSize = 10;

        public int PageSize
        {
            get => pageSize;
            set { pageSize = (value > maxPageSize) ? maxPageSize : value; }
        }

        public int UserId { get; set; }
        public string MessageType { get; set; } = "unread";
    }
}
