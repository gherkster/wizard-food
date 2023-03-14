using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class Images : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageId",
                table: "Recipes",
                newName: "CoverImageId");

            migrationBuilder.CreateTable(
                name: "Images",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    DisplayName = table.Column<string>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    AspectRatioX = table.Column<int>(type: "INTEGER", nullable: false),
                    AspectRatioY = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Images", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_CoverImageId",
                table: "Recipes",
                column: "CoverImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Recipes_Images_CoverImageId",
                table: "Recipes",
                column: "CoverImageId",
                principalTable: "Images",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Recipes_Images_CoverImageId",
                table: "Recipes");

            migrationBuilder.DropTable(
                name: "Images");

            migrationBuilder.DropIndex(
                name: "IX_Recipes_CoverImageId",
                table: "Recipes");

            migrationBuilder.RenameColumn(
                name: "CoverImageId",
                table: "Recipes",
                newName: "ImageId");
        }
    }
}
