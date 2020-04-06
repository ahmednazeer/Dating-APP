using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Dating.Dtos
{
    public class PhotoUploadDto
    {
        public string Url { get; set; }
        public string Description { get; set; }
        public IFormFile File { get; set; }
        public string PublicId { get; set; }
        public DateTime DateAdded { get; set; }

        public PhotoUploadDto()
        {
            DateAdded=DateTime.Now;
        }

    }

}
