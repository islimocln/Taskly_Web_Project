using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TasklyAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Progress",
                table: "Projects",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectDocuments_UpdatedByUserId",
                table: "ProjectDocuments",
                column: "UpdatedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectDocuments_Users_UpdatedByUserId",
                table: "ProjectDocuments",
                column: "UpdatedByUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectDocuments_Users_UpdatedByUserId",
                table: "ProjectDocuments");

            migrationBuilder.DropIndex(
                name: "IX_ProjectDocuments_UpdatedByUserId",
                table: "ProjectDocuments");

            migrationBuilder.DropColumn(
                name: "Progress",
                table: "Projects");
        }
    }
}
