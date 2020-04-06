using System;
using System.Collections;
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


namespace Dating.Controllers
{
    [ServiceFilter(typeof(UserActivityLog))]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repository;
        private readonly IMapper _mapper;
        private readonly IHubContext<MessageHub> _hubContext;

        public UsersController(IDatingRepository repository
            , IMapper mapper,IHubContext<MessageHub> hubContext)
        {
            _repository = repository;
            _mapper = mapper;
            _hubContext = hubContext;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repository.GetUser(id);
            var userToReturn = _mapper.Map<UserDetailDto>(user);
            return Ok(userToReturn);
        }
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] UserParams userParams)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var loggedInUser = await _repository.GetUser(userId);
            if (userParams.Gender == null)
            {
                userParams.Gender = loggedInUser.Gender == "male" ? "female" : "male";

            }
            userParams.UserId = userId;


            var users = await _repository.GetAllUsers(userParams);

            Response.AddPaginationHeader(users.CurrentPage
                , users.TotalPagesCount, users.TotalCount, users.PageSize);

            var usersToReturn = _mapper.Map<IEnumerable<UserListDto>>(users);
            return Ok(usersToReturn);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDto userDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                return Unauthorized();
            }

            var user = await _repository.GetUser(id);
            _mapper.Map(userDto, user);
            if (await _repository.SaveAll())
            {
                return NoContent();
            }
            throw new Exception("Failed To Update Profile");
        }
        [HttpPost("{id}/like/{likedUserId}")]
        public async Task<IActionResult> AddLike(int id, int likedUserId)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var like = await _repository.GetLike(id, likedUserId);

            if (like != null)
                return BadRequest("You Already Like This User");
            var likeToADd = new Like()
            {
                LikeeId = likedUserId,
                LikerId = id
            };
            _repository.Add(likeToADd);

            if (await _repository.SaveAll())
                return Ok();
            return BadRequest("Failed to Like This User");
        }
        




    }
}