using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dating.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }

        public User Sender { get; set; }
        public User Receiver { get; set; }

        public bool IsRead { get; set; }
        public DateTime? ReadAt { get; set; }
        public DateTime SendAt { get; set; }

        public bool SenderDeleted { get; set; }
        public bool ReceiverDeleted { get; set; }


    }
}
