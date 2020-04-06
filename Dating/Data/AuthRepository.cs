using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dating.Models;
using Microsoft.EntityFrameworkCore;

namespace Dating.Data
{
    public class AuthRepository:IAuthRepository

    {
        private readonly DataContext _context;

        public AuthRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash( password,out passwordHash,out passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
            //throw new NotImplementedException();
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.Include(us=>us.Photos).FirstOrDefaultAsync(us => us.Username == username);
            if (user == null) return null;
            using (var hmac = new System.Security.Cryptography.HMACSHA512(user.PasswordSalt))
            {
                var hashCode = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < hashCode.Length; i++)
                {
                    if (hashCode[i] != user.PasswordHash[i])
                    {
                        return null;
                    }
                }
            }


            return user;
        }

        public async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(us => us.Username == username);
            
            //throw new NotImplementedException();
        }
    }
}
