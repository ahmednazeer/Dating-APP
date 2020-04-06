using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dating.Models
{
    public class UserConnection
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public string ConnectionId { get; set; }
    }
}
