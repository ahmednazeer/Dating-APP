using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Dating.Data;
using Dating.Dtos;
using Dating.Extensions;
using Dating.Helpers;
using Dating.Hubs;
using Dating.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

//using Microsoft.VisualStudio.Web.CodeGeneration.Contracts.Messaging;

namespace Dating.Controllers
{
    [ServiceFilter(typeof(UserActivityLog) )]
    [Route("api/users/{senderId}/[controller]")]
    [ApiController]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IDatingRepository _repository;
        private readonly IHubContext<MessageHub> messageHubContext;

        public MessagesController(IMapper mapper,IDatingRepository repository
            ,IHubContext<MessageHub> messageHubContext)
        {
            _mapper = mapper;
            _repository = repository;
            this.messageHubContext = messageHubContext;
        }
        [HttpGet("{messageId}",Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int senderId,int messageId/*, int receiverId*/)
        {
            if (senderId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var message = await _repository.GetMessage(messageId);
            if (message == null)
                return BadRequest("Can not find Message");
            return Ok(message);

        }
        [HttpPost()]

        public async Task<IActionResult> CreateMessage(int senderId
            , MessageCreateDto messageCreateDto)
        {
            if (senderId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var sender= await _repository.GetUser(messageCreateDto.SenderId);
            var receiver = await _repository.GetUser(messageCreateDto.ReceiverId);
            if (receiver == null)
                return BadRequest("User Un Available");

            var message =_mapper.Map<Message>(messageCreateDto);

            _repository.Add(message);

            if (await _repository.SaveAll())
            {
                var messageToReturn = _mapper.Map<MessageReturnDto>(message);
                var connectionIds =await _repository.GetUserConnections(message.ReceiverId);
                /*for (int i = 0; i < connectionIds.Count(); i++)
                {
                    await messageHubContext.Groups.AddToGroupAsync(connectionIds.ElementAt(i), "chat");

                }*/
                /*await messageHubContext.Clients//.All
                    //.User(message.ReceiverId.ToString())
                    //Client(connectionIds.ToList().AsReadOnly()[0])
                    .Group("chat")
                    .SendAsync("ReceiveMessage", messageToReturn);
                */
                return CreatedAtRoute("GetMessage", new {MessageId = message.Id }
                    , new {IDs=connectionIds,msg=messageToReturn});
            }

            throw new Exception("Failed To Send Message");


        }
        
        public async Task<IActionResult> GetUserMessages(int senderId,[FromQuery] MessageParams messageParams)
        {
            if (senderId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messageParams.UserId = senderId;

            var userMessages = await _repository.GetMessagesForUser(messageParams);

            var messagesToReturn = _mapper.Map<IEnumerable<MessageReturnDto>>(userMessages);
            Response.AddPaginationHeader(messageParams.PageNumber,userMessages.TotalPagesCount,userMessages.TotalCount, messageParams.PageSize);

            return Ok(messagesToReturn);


        }
        [HttpGet("thread/{receiverId}")]
        public async Task<IActionResult> GetMessageThread(int senderId, int receiverId)
        {

            if (senderId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messages = await _repository.GetMessageThread(senderId, receiverId);
            var messageThread = _mapper.Map<IEnumerable<MessageReturnDto>>(messages);

            return Ok(messageThread) ;
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int senderId)
        {
            var messageToDelete = await _repository.GetMessage(id);

            if (messageToDelete == null)
            {
                return BadRequest("Something wrong happened");
            }

            if (messageToDelete.SenderId == senderId)
                messageToDelete.SenderDeleted = true;
            if (messageToDelete.ReceiverId == senderId)
                messageToDelete.ReceiverDeleted = true;

            if (messageToDelete.ReceiverDeleted && messageToDelete.ReceiverDeleted) 
                _repository.Delete(messageToDelete);

            if (await _repository.SaveAll())
                return NoContent();
            throw new Exception("Failed To Delete Message");

        }
        [HttpPost("{messageId}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int messageId, int senderId)
        {
            if (senderId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var message = await _repository.GetMessage(messageId);

            if (message.ReceiverId != senderId)
                return Unauthorized();

            message.IsRead = true;
            message.ReadAt = DateTime.Now;

            if(await _repository.SaveAll()) 
                return NoContent();

            throw new Exception("Failed to Update Read message");
            
        }


    }
}