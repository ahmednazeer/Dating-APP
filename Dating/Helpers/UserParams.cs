using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dating.Helpers
{
    public class UserParams
    {
        public int PageNumber { get; set; } = 1;
		private const int maxPageSize=50;
		private int pageSize=10;

		public int PageSize
		{
			get => pageSize;
            set { pageSize = (value> maxPageSize)?maxPageSize:value; }
		}

        public int UserId { get; set; }
        public string Gender { get; set; }
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 99;

        public string OrderBy { get; set; }
        public bool Likers { get; set; } = false;
        public bool Likees { get; set; } = false;

    }
}
