using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dating.Helpers;
using Dating.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.EntityFrameworkCore.Query.ExpressionTranslators.Internal;

namespace Dating.Data
{
    public class DatingRepository:IDatingRepository
    {
        private readonly DataContext _context;

        public DatingRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T model) where T : class
        {
            _context.Add(model);
            //throw new NotImplementedException();
        }

        public void Delete<T>(T model) where T : class
        {
            _context.Remove(model);
            //throw new NotImplementedException();
        }

        public async Task<User> GetUser(int userId)
        {
            var user =await _context.Users.Include(us=>us.Photos).FirstOrDefaultAsync(us => us.Id == userId);
            return user;
            //throw new NotImplementedException();
        }

        public async Task<PagedList<User>> GetAllUsers(UserParams userParams)
        {
            var users = _context.Users.Include(ph => ph.Photos).AsQueryable();
            //get all users except logged in user
            users = users.Where(user => user.Id != userParams.UserId);
            //get users of opposite gender 
            users = users.Where(user => user.Gender == userParams.Gender);

            if (userParams.Likers)
            {
                var likersIds = await GetLikers(userParams.UserId, userParams.Likers);
                users = users.Where(us => likersIds.Contains(us.Id));

            }
            else if(userParams.Likees)
            {
                var likeesIds = await GetLikers(userParams.UserId, userParams.Likers);
                users = users.Where(u => likeesIds.Contains(u.Id));

            }


            //get users with ages between minAge and maxAge

            if (userParams.MaxAge != 99 && userParams.MinAge != 18)
            {
                var minDoB = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDoB = DateTime.Today.AddYears(-userParams.MinAge);
                users = users.Where(user => user.DateOfBirth >= minDoB && user.DateOfBirth <= maxDoB);
            }
            


            
            users = users.OrderByDescending(u => u.LastActive);
            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await  PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
            //throw new NotImplementedException();
        }


        private async Task<IEnumerable<int>> GetLikers(int id, bool likers)
        {
            var user =await _context.Users
                .Include(u => u.Likees)
                .Include(us => us.Likers)
                .FirstOrDefaultAsync(us => us.Id == id);

            if (likers)
            {
                return user.Likers.Where(li=>li.LikeeId==id).Select(li => li.LikerId);//.ToList();
            }
            else
            {
                return user.Likees.Where(li => li.LikerId == id).Select(li => li.LikeeId); //.ToList();
            }


        }

        public async Task<bool> SaveAll()
        {
            //if returned value >0 then saved successfully 
            return await _context.SaveChangesAsync() > 0;
            //throw new NotImplementedException();
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photoToReturn =await _context.Photos.FirstOrDefaultAsync(ph => ph.Id == id);
            return photoToReturn;
        }

        public async Task<Photo> GetMainPhoto(int userId)
        {
            var photo =await _context.Photos.Where(ph => ph.UserId == userId).FirstOrDefaultAsync(p => p.IsMain == true);
            //var photo = new Photo();//await photoOfUser
            
            return photo;
        }

        public async Task<Like> GetLike(int userId, int likedUserId)
        {
            var like =await _context.Likes
                .FirstOrDefaultAsync(us => us.LikerId == userId && us.LikeeId == likedUserId);


            return like;
        }

        public async Task<Message> GetMessage(int messageId)
        {
            return await _context.Messages
                .FirstOrDefaultAsync(mess => mess.Id == messageId);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
                .Include(u => u.Receiver).ThenInclude(u => u.Photos)
                .Include(u => u.Sender).ThenInclude(u => u.Photos).AsQueryable();

            switch (messageParams.MessageType)
            {
                case "Inbox":
                    messages = messages.Where(message => message.ReceiverId == messageParams.UserId&&message.ReceiverDeleted==false);
                    break;
                case "Outbox":
                    messages = messages.Where(message => message.SenderId == messageParams.UserId && message.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(message => message.ReceiverId == messageParams.UserId
                                                && messageParams.MessageType == "Unread"
                                                && message.ReceiverDeleted == false
                                                &&message.IsRead==false
                                                );
                    break;
            }

            messages = messages.OrderByDescending(mess => mess.SendAt);
            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);


        }

        public async Task<IEnumerable<Message>> GetMessageThread(int senderId, int receiverId)
        {
            var messages =await _context.Messages
                .Include(m => m.Receiver).ThenInclude(u=>u.Photos)
                .Include(m => m.Sender).ThenInclude(u => u.Photos)
                .Where(m => m.SenderId == senderId && m.ReceiverId == receiverId 
                                                   &&m.SenderDeleted==false
                            || m.ReceiverId == senderId && m.SenderId == receiverId
                            &&m.ReceiverDeleted==false)
                .OrderByDescending(m=>m.SendAt).ToListAsync();
            return messages;
        }

        public async Task<UserConnection> GetConnection(int userId, string connectionId)
        {
            var connection =await _context.UserConnections.FirstOrDefaultAsync(
                con => con.UserId == userId&& con.ConnectionId == connectionId);

            return connection;
        }

        public async Task<IEnumerable<string>> GetUserConnections(int userId)
        {
            var connections =await _context.UserConnections.Where(con => con.UserId == userId).Select(co => co.ConnectionId).ToListAsync();
            return connections;
        }
    }
}
