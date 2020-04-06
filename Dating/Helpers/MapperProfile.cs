using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Dating.Dtos;
using Dating.Extensions;
using Dating.Models;

namespace Dating.Helpers
{
    public class MapperProfile:Profile
    {
        public MapperProfile()
        {
            CreateMap<User , UserListDto>().ForMember(mem=>mem.PhotoUrl, opt =>
                {
                    opt.MapFrom(us=>us.Photos.FirstOrDefault(ph =>ph.IsMain==true).Url);
                }).ForMember(user=>user.Age
                ,opt=>opt.ResolveUsing(user=>user.DateOfBirth.CalculateUserAge())
                );
               
            CreateMap<User,UserDetailDto>()
                .ForMember(mem => mem.PhotoUrl, opt =>
                {
                    opt.MapFrom(us => us.Photos.FirstOrDefault(ph => ph.IsMain == true).Url);
                }).ForMember(user => user.Age
                    , opt => opt.ResolveUsing(user => user.DateOfBirth.CalculateUserAge())
                ); ;
            CreateMap<Photo,PhotoDetailDto>();
            CreateMap<Photo,PhotoReturnDto>();
            CreateMap<PhotoUploadDto,Photo>();
            CreateMap<UserUpdateDto, User>();
            CreateMap<UserRegisterDto, User>();

            CreateMap<MessageCreateDto, Message>().ReverseMap();
            CreateMap<Message, MessageReturnDto>()
                .ForMember(m=>m.SenderPhotoUrl,opt=>opt.MapFrom(
                    u=>u.Sender.Photos.FirstOrDefault(ph=>ph.IsMain).Url
                    ))
                .ForMember(m => m.ReceiverPhotoUrl, opt => opt.MapFrom(
                    u => u.Receiver.Photos.FirstOrDefault(ph => ph.IsMain).Url
                ));


        }
    }
}
