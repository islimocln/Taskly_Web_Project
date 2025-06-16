using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TasklyAPI.Migrations
{
    /// <inheritdoc />
    public partial class ChangeRelatedIdToStringInNotification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "RelatedId",
                table: "Notifications",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "RelatedId",
                table: "Notifications",
                type: "integer",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
