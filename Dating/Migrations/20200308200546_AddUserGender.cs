using Microsoft.EntityFrameworkCore.Migrations;

namespace Dating.Migrations
{
    public partial class AddUserGender : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "KnwonAs",
                table: "Users",
                newName: "KnownAs");

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Users",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "KnownAs",
                table: "Users",
                newName: "KnwonAs");
        }
    }
}
