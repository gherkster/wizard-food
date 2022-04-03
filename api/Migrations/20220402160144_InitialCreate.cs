using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Label = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Label);
                });

            migrationBuilder.CreateTable(
                name: "Cuisines",
                columns: table => new
                {
                    Label = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cuisines", x => x.Label);
                });

            migrationBuilder.CreateTable(
                name: "CustomTimeTypes",
                columns: table => new
                {
                    Label = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomTimeTypes", x => x.Label);
                });

            migrationBuilder.CreateTable(
                name: "DbImage",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FileName = table.Column<string>(type: "TEXT", nullable: false),
                    BinaryData = table.Column<byte[]>(type: "BLOB", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DbImage", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ServingTypes",
                columns: table => new
                {
                    Label = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServingTypes", x => x.Label);
                });

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Label = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Label);
                });

            migrationBuilder.CreateTable(
                name: "Recipes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    ImageId = table.Column<int>(type: "INTEGER", nullable: true),
                    CategoryLabel = table.Column<string>(type: "TEXT", nullable: true),
                    CuisineLabel = table.Column<string>(type: "TEXT", nullable: true),
                    Rating = table.Column<decimal>(type: "TEXT", nullable: false),
                    Servings = table.Column<decimal>(type: "TEXT", nullable: false),
                    ServingTypeLabel = table.Column<string>(type: "TEXT", nullable: false),
                    PreparationTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    CookingTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    CustomTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    CustomTimeLabelLabel = table.Column<string>(type: "TEXT", nullable: true),
                    Energy = table.Column<decimal>(type: "TEXT", nullable: true),
                    Protein = table.Column<decimal>(type: "TEXT", nullable: true),
                    Carbohydrates = table.Column<decimal>(type: "TEXT", nullable: true),
                    Fat = table.Column<decimal>(type: "TEXT", nullable: true),
                    Sodium = table.Column<decimal>(type: "TEXT", nullable: true),
                    Slug = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recipes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Recipes_Categories_CategoryLabel",
                        column: x => x.CategoryLabel,
                        principalTable: "Categories",
                        principalColumn: "Label");
                    table.ForeignKey(
                        name: "FK_Recipes_Cuisines_CuisineLabel",
                        column: x => x.CuisineLabel,
                        principalTable: "Cuisines",
                        principalColumn: "Label");
                    table.ForeignKey(
                        name: "FK_Recipes_CustomTimeTypes_CustomTimeLabelLabel",
                        column: x => x.CustomTimeLabelLabel,
                        principalTable: "CustomTimeTypes",
                        principalColumn: "Label");
                    table.ForeignKey(
                        name: "FK_Recipes_DbImage_ImageId",
                        column: x => x.ImageId,
                        principalTable: "DbImage",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Recipes_ServingTypes_ServingTypeLabel",
                        column: x => x.ServingTypeLabel,
                        principalTable: "ServingTypes",
                        principalColumn: "Label",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DbIngredient",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ItemType = table.Column<int>(type: "INTEGER", nullable: false),
                    Amount = table.Column<decimal>(type: "TEXT", nullable: false),
                    Unit = table.Column<string>(type: "TEXT", nullable: false),
                    Label = table.Column<string>(type: "TEXT", nullable: false),
                    Note = table.Column<string>(type: "TEXT", nullable: false),
                    DbRecipeId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DbIngredient", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DbIngredient_Recipes_DbRecipeId",
                        column: x => x.DbRecipeId,
                        principalTable: "Recipes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DbInstruction",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ItemType = table.Column<int>(type: "INTEGER", nullable: false),
                    Label = table.Column<string>(type: "TEXT", nullable: false),
                    DbRecipeId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DbInstruction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DbInstruction_Recipes_DbRecipeId",
                        column: x => x.DbRecipeId,
                        principalTable: "Recipes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DbRecipeDbTag",
                columns: table => new
                {
                    RecipesId = table.Column<int>(type: "INTEGER", nullable: false),
                    TagsLabel = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DbRecipeDbTag", x => new { x.RecipesId, x.TagsLabel });
                    table.ForeignKey(
                        name: "FK_DbRecipeDbTag_Recipes_RecipesId",
                        column: x => x.RecipesId,
                        principalTable: "Recipes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DbRecipeDbTag_Tags_TagsLabel",
                        column: x => x.TagsLabel,
                        principalTable: "Tags",
                        principalColumn: "Label",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DbIngredient_DbRecipeId",
                table: "DbIngredient",
                column: "DbRecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_DbInstruction_DbRecipeId",
                table: "DbInstruction",
                column: "DbRecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_DbRecipeDbTag_TagsLabel",
                table: "DbRecipeDbTag",
                column: "TagsLabel");

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_CategoryLabel",
                table: "Recipes",
                column: "CategoryLabel");

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_CuisineLabel",
                table: "Recipes",
                column: "CuisineLabel");

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_CustomTimeLabelLabel",
                table: "Recipes",
                column: "CustomTimeLabelLabel");

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_ImageId",
                table: "Recipes",
                column: "ImageId");

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_ServingTypeLabel",
                table: "Recipes",
                column: "ServingTypeLabel");

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_Slug",
                table: "Recipes",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DbIngredient");

            migrationBuilder.DropTable(
                name: "DbInstruction");

            migrationBuilder.DropTable(
                name: "DbRecipeDbTag");

            migrationBuilder.DropTable(
                name: "Recipes");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Cuisines");

            migrationBuilder.DropTable(
                name: "CustomTimeTypes");

            migrationBuilder.DropTable(
                name: "DbImage");

            migrationBuilder.DropTable(
                name: "ServingTypes");
        }
    }
}
