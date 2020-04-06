﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dating.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string LookingFor { get; set; }
        public string KnownAs { get; set; }
        public string Gender { get; set; }
        public DateTime Created { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime LastActive { get; set; }
        public string Introduction { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public ICollection<Photo> Photos { get; set; }
        
        //likes
        public ICollection<Like> Likees { get; set; }
        public ICollection<Like> Likers { get; set; }

        //messages
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }

    }
}
