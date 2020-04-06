using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dating.Dtos
{
    public class MessageReturnDto
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }

        public string SenderKnownAs { get; set; }
        public string SenderPhotoUrl { set; get; }

        public string ReceiverKnownAs { get; set; }
        public string ReceiverPhotoUrl { set; get; }

        public bool IsRead { get; set; }
        public DateTime? ReadAt { get; set; }
        public DateTime SendAt { get; set; }
    }
}
