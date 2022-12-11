using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Label = table.Column<string>(type: "TEXT", nullable: false, collation: "NOCASE")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Cuisines",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Label = table.Column<string>(type: "TEXT", nullable: false, collation: "NOCASE")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cuisines", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CustomTimeLabels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Label = table.Column<string>(type: "TEXT", nullable: false, collation: "NOCASE")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomTimeLabels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Label = table.Column<string>(type: "TEXT", nullable: false, collation: "NOCASE")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Recipes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    Note = table.Column<string>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    PreparationTime = table.Column<TimeSpan>(type: "TEXT", nullable: true),
                    CookingTime = table.Column<TimeSpan>(type: "TEXT", nullable: true),
                    CategoryId = table.Column<int>(type: "INTEGER", nullable: false),
                    CuisineId = table.Column<int>(type: "INTEGER", nullable: false),
                    Servings = table.Column<decimal>(type: "TEXT", nullable: false),
                    Rating = table.Column<decimal>(type: "TEXT", nullable: false),
                    Slug = table.Column<string>(type: "TEXT", nullable: false, collation: "NOCASE")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recipes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Recipes_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Recipes_Cuisines_CuisineId",
                        column: x => x.CuisineId,
                        principalTable: "Cuisines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CustomTimes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CookingTime = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    RecipeId = table.Column<int>(type: "INTEGER", nullable: false),
                    CustomTimeLabelId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomTimes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomTimes_CustomTimeLabels_CustomTimeLabelId",
                        column: x => x.CustomTimeLabelId,
                        principalTable: "CustomTimeLabels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CustomTimes_Recipes_RecipeId",
                        column: x => x.RecipeId,
                        principalTable: "Recipes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DbIngredientGroup",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    DbRecipeId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DbIngredientGroup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DbIngredientGroup_Recipes_DbRecipeId",
                        column: x => x.DbRecipeId,
                        principalTable: "Recipes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DbInstructionGroup",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    DbRecipeId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DbInstructionGroup", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DbInstructionGroup_Recipes_DbRecipeId",
                        column: x => x.DbRecipeId,
                        principalTable: "Recipes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "DbRecipeDbTag",
                columns: table => new
                {
                    RecipesId = table.Column<int>(type: "INTEGER", nullable: false),
                    TagsId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DbRecipeDbTag", x => new { x.RecipesId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_DbRecipeDbTag_Recipes_RecipesId",
                        column: x => x.RecipesId,
                        principalTable: "Recipes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DbRecipeDbTag_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DbIngredient",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Amount = table.Column<decimal>(type: "TEXT", nullable: false),
                    Unit = table.Column<string>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    Name = table.Column<string>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    Note = table.Column<string>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    IngredientGroupId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DbIngredient", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DbIngredient_DbIngredientGroup_IngredientGroupId",
                        column: x => x.IngredientGroupId,
                        principalTable: "DbIngredientGroup",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DbInstruction",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Label = table.Column<string>(type: "TEXT", nullable: false, collation: "NOCASE"),
                    InstructionGroupId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DbInstruction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DbInstruction_DbInstructionGroup_InstructionGroupId",
                        column: x => x.InstructionGroupId,
                        principalTable: "DbInstructionGroup",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Label",
                table: "Categories",
                column: "Label",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cuisines_Label",
                table: "Cuisines",
                column: "Label",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CustomTimeLabels_Label",
                table: "CustomTimeLabels",
                column: "Label",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CustomTimes_CustomTimeLabelId",
                table: "CustomTimes",
                column: "CustomTimeLabelId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomTimes_RecipeId",
                table: "CustomTimes",
                column: "RecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_DbIngredient_IngredientGroupId",
                table: "DbIngredient",
                column: "IngredientGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_DbIngredient_Name",
                table: "DbIngredient",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_DbIngredientGroup_DbRecipeId",
                table: "DbIngredientGroup",
                column: "DbRecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_DbInstruction_InstructionGroupId",
                table: "DbInstruction",
                column: "InstructionGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_DbInstructionGroup_DbRecipeId",
                table: "DbInstructionGroup",
                column: "DbRecipeId");

            migrationBuilder.CreateIndex(
                name: "IX_DbRecipeDbTag_TagsId",
                table: "DbRecipeDbTag",
                column: "TagsId");

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_CategoryId",
                table: "Recipes",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_CuisineId",
                table: "Recipes",
                column: "CuisineId");

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_Slug",
                table: "Recipes",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Recipes_Title",
                table: "Recipes",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_Label",
                table: "Tags",
                column: "Label",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CustomTimes");

            migrationBuilder.DropTable(
                name: "DbIngredient");

            migrationBuilder.DropTable(
                name: "DbInstruction");

            migrationBuilder.DropTable(
                name: "DbRecipeDbTag");

            migrationBuilder.DropTable(
                name: "CustomTimeLabels");

            migrationBuilder.DropTable(
                name: "DbIngredientGroup");

            migrationBuilder.DropTable(
                name: "DbInstructionGroup");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.DropTable(
                name: "Recipes");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Cuisines");
        }
    }
}
