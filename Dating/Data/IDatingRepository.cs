using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dating.Helpers;
using Dating.Models;

namespace Dating.Data
{
    public interface IDatingRepository
    {
        void Add<T>(T model) where T : class;
        void Delete<T>(T model) where T : class;
        Task<User> GetUser(int userId);
        Task<PagedList<User>> GetAllUsers(UserParams userParams);
        Task<bool> SaveAll();
        Task<Photo> GetPhoto(int id);

        Task<Photo> GetMainPhoto(int userId);

        Task<Like> GetLike(int userId, int likedUserId);
        //messages
        Task<Message> GetMessage(int messageId);

        Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams);

        Task<IEnumerable<Message>> GetMessageThread(int senderId, int receiverId);

        Task<UserConnection> GetConnection(int userId,string connectionId);

        Task<IEnumerable<string>> GetUserConnections(int userId);




    }
}
