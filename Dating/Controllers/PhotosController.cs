using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Dating.Data;
using Dating.Dtos;
using Dating.Helpers;
using Dating.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Dating.Controllers
{
    [Route("api/users/{userId}/photos")]
    [ApiController]
    [Authorize]
    public class PhotosController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IDatingRepository _repository;
        private readonly IOptions<CloudinarySettings> _options;
        private Cloudinary _cloudinary
            ;

        public PhotosController(IMapper mapper,IDatingRepository repository
            , IOptions<CloudinarySettings> options)
        {
            _mapper = mapper;
            _repository = repository;
            _options = options;
            //cloudinary account configurations 
            Account account=new Account(
                options.Value.CloudName,
                options.Value.APIKey,
                options.Value.APISecret
                );

            //

             _cloudinary = new Cloudinary(account);



        }
        [HttpGet("{id}",Name = "GetPhoto")]
        //Name field is user to invoke this action from another one
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photo =await _repository.GetPhoto(id);
            return Ok(photo);
        }
        [HttpPost]
        public async Task<IActionResult> AddUserPhoto(int userId,[FromForm] PhotoUploadDto photoUpload)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var user =await _repository.GetUser(userId);
            var file = photoUpload.File;

            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams=new ImageUploadParams()
                    {
                        File = new FileDescription( file.Name,stream),
                        Transformation = new Transformation().Width(500)
                            .Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);


                }

                

            }
            photoUpload.Url = uploadResult.Uri.ToString();
            photoUpload.PublicId = uploadResult.PublicId;

            var photoMapped = _mapper.Map<Photo>(photoUpload);

            if (!user.Photos.Any(ph => ph.IsMain))
            {
                photoMapped.IsMain = true;
            }
            user.Photos.Add(photoMapped);

            if (await _repository.SaveAll())
            {
                var returnedPhoto = _mapper.Map<PhotoReturnDto>(photoMapped);
                return CreatedAtRoute("GetPhoto"
                    , new {id = photoMapped.Id}, returnedPhoto);
            }
                
            return BadRequest("Failed to Upload Photo");

        }

        [HttpPost("{photoId}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int photoId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var user = await _repository.GetUser(userId);

            var currentMainPhoto = await _repository.GetMainPhoto(userId);
            if (currentMainPhoto.Id == photoId)
                return BadRequest("Photo Already 'Main'");

            var photoFromRepo = await _repository.GetPhoto(photoId);

            currentMainPhoto.IsMain = false;
            photoFromRepo.IsMain = true;
            if (await _repository.SaveAll())
                return NoContent();
            return BadRequest("Failed To Change Main Photo");

        }
        [HttpDelete("{photoId}")]

        public async Task<IActionResult> DeletePhoto(int userId, int photoId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var user = await _repository.GetUser(userId);
            var currentMainPhoto = await _repository.GetMainPhoto(userId);
            if (currentMainPhoto.Id == photoId)
                return BadRequest("Can not Delete 'Main' Photo");
            var photoFromRepo = await _repository.GetPhoto(photoId);
            if (photoFromRepo.PublicId != null)
            {
                var deletionParams = new DeletionParams(photoFromRepo.PublicId);
                //if deleted successfully then result will be {Result:"OK"}
                var deleteResult= _cloudinary.Destroy(deletionParams);
                if(deleteResult.Result=="ok")
                    _repository.Delete(photoFromRepo);
            }
            else
            {
                _repository.Delete(photoFromRepo);
            }
            if (await _repository.SaveAll())
            {
                return Ok(photoFromRepo);
            }
            return BadRequest("Failed To Delete Photo");
        }

    }
}