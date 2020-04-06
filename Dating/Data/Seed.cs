using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dating.Models;
using Newtonsoft.Json;

namespace Dating.Data
{
    public class Seed
    {
        private readonly DataContext _context;

        public Seed(DataContext context)
        {
            _context = context;
        }

        public void SeedData()
        {
            var jsonUsers = System.IO.File.ReadAllText("Data/UserSeedData.json");
            var Users = JsonConvert.DeserializeObject < List < User >> (jsonUsers);
            foreach (var user in Users)
            {
                byte[] passwordSalt, passwordHash;
                CreatePasswordHash("password", out passwordHash, out passwordSalt);
                user.PasswordSalt = passwordSalt;
                user.PasswordHash = passwordHash;
                user.Username = user.Username.ToLower();
                _context.Users.Add(user);
            }
            _context.SaveChanges();
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

    }
}
