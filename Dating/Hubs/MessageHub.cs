using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Dating.Dtos;
using Dating.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

using Microsoft.AspNetCore.SignalR;
using Microsoft.VisualStudio.Web.CodeGeneration.Contracts.Messaging;

namespace Dating.Hubs
{
    //[Authorize]
    public class MessageHub:Hub
    {
       
        private static readonly  Dictionary<string, int> _activeUsers = new Dictionary<string, int>();
        public async Task SendMessage(/*IReadOnlyList<String>connectionIds,*/MessageReturnDto message)
        {
            var updateUsers = Task.CompletedTask;

            if (!_activeUsers.ContainsKey(Context.ConnectionId))
            {
                _activeUsers.Add(Context.ConnectionId,message.SenderId);
                updateUsers = Clients.All.SendAsync("OnManageUsers", _activeUsers.Values);
            }

            var connectionId = _activeUsers.FirstOrDefault(u => u.Value == message.ReceiverId).Key;
            if (connectionId != null)
            {
                await Clients.Client(connectionId)/*.User(message.ReceiverId.ToString())*/.SendAsync("ReceiveMessage", message);

            }

            //var sendUsers = Clients.Clients(_activeUsers.Keys.ToList()).SendAsync("ReceiveMessage", message);
            Task.WaitAll(/*sendUser,*/ updateUsers);
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }
        
        public override  async Task OnConnectedAsync()
        {
            //var userId= Context.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var httpContext = Context.GetHttpContext();
            var userId = int.Parse(httpContext.Request.Query["access_token"].ToString());
            if(!_activeUsers.ContainsKey(Context.ConnectionId))
                _activeUsers.Add(Context.ConnectionId,userId);

            await base.OnConnectedAsync();
             await Clients.Client(Context.ConnectionId).SendAsync("OnConnected", Context.ConnectionId/*+" userId ="+userId.ToString()*/);
        }
    
        //public override async Task OnReconnected()
        //{
        //    string name = Context.User.Identity.Name;

        //    /*if (!_connections.GetConnections(name).Contains(Context.ConnectionId))
        //    {
        //        _connections.Add(name, Context.ConnectionId);
        //    }*/

        //    return base.OnReconnected();
        //}
        
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var user = _activeUsers.FirstOrDefault(us => us.Key == Context.ConnectionId);
            if (user.Key!=null)
            {
                _activeUsers.Remove(Context.ConnectionId);
                await Clients.Clients(_activeUsers.Keys.ToString()).SendAsync("OnManageUsers", _activeUsers.Values);
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task AddNewUser(int userId,string connectionId)
        {
            _activeUsers.Add(Context.ConnectionId,userId);

        }
    }
}
