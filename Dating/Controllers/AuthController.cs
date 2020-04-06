using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Dating.Data;
using Dating.Dtos;
using Dating.Extensions;
using Dating.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Dating.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository authRepository,IConfiguration config,IMapper mapper)
        {
            _authRepository = authRepository;
            _config = config;
            _mapper = mapper;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto userRegisterDto)
        {
            userRegisterDto.Username = userRegisterDto.Username.ToLower();
            if (await _authRepository.UserExists(userRegisterDto.Username))
            {
                return BadRequest("Username Already Exists");
            }

            var userToCreate = _mapper.Map<User>(userRegisterDto);
            var createdUser =await _authRepository.Register(userToCreate, userRegisterDto.Password);
            var userTorReturn = _mapper.Map<UserDetailDto>(createdUser);
            return CreatedAtRoute("GetUser",
                new {controller = "Users", id = createdUser.Id}, userTorReturn);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            //throw new Exception("Computer says no!");
            var loginUser =await _authRepository.Login(userLoginDto.Username, userLoginDto.Password);
            if (loginUser == null) return Unauthorized();
            var userToReturn = _mapper.Map<UserListDto>(loginUser);
            //Creating Token 
            //token must has piece of information about user
            //like username and id so we will create caims contain these info
            // 1- create claims
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, loginUser.Id.ToString()),
                new Claim(ClaimTypes.Name, loginUser.Username)
            };
            // 2- create key

            var key = new SymmetricSecurityKey(Encoding
                .UTF8.GetBytes(_config.GetSection("UserSettings:token").Value));
            // 3- create credentials
            var credentials=new SigningCredentials(key,SecurityAlgorithms.HmacSha512);
            // 4- creating token descriptor

            var tokenDescriptor=new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials
            };

            // 5- creating token handler to create token

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            // 6- return token in successful login response 
            //Response.AddApplicationError("");
            return Ok(new
            {
                token=tokenHandler.WriteToken(token),
                user = userToReturn
            });
        }


    }
}