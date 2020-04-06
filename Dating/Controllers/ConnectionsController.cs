using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Dating.Data;
using Dating.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Dating.Controllers
{
    [Route("api/users/{userId}/connections")]
    [ApiController]
    [Authorize]
    public class ConnectionsController : ControllerBase
    {
        private readonly IDatingRepository _repository;
        
        public ConnectionsController(IDatingRepository repository)
        {
            _repository = repository;
        }
        /*
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok("Every thing is okay !");
        }
        */
        [HttpGet("{connectionId}")]
        public async Task<IActionResult> DeleteUserConnection(int userId,string connectionId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var connection =await _repository.GetConnection(userId, connectionId);
            if (connection == null)
            {
                return BadRequest("failed to delete connection");

            }
            _repository.Delete(connection);
            if( await _repository.SaveAll())
                return Ok();
            return BadRequest("failed to delete connection");
        }

    

    [HttpPost("{connectionId}")]
        public async Task<IActionResult> AddConnection(string connectionId,int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var connection = new UserConnection()
            {
                UserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value),
                ConnectionId = connectionId
            };
            _repository.Add(connection);

            if (await _repository.SaveAll())
            {
                return Ok(connection);
            }
            throw new Exception("Failed To Save Connection Info");

        }
        
    }
}