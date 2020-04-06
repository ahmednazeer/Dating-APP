using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dating.Dtos
{
    public class MessageCreateDto
    {
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; }
        public DateTime SendAt { get; set; }

        public MessageCreateDto()
        {
            SendAt=DateTime.Now;
        }
    }
}
