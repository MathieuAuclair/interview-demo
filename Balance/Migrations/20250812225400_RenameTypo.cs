using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApp.Migrations
{
    public partial class RenameTypo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "ResourceReciepts",
                newName: "ReceiptResources"
            );

            migrationBuilder.RenameIndex(
                name: "IX_ResourceReciepts_UnitId",
                table: "ReceiptResources",
                newName: "IX_ReceiptResources_UnitId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_ResourceReciepts_ResourceId",
                table: "ReceiptResources",
                newName: "IX_ReceiptResources_ResourceId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_ResourceReciepts_ReceiptId",
                table: "ReceiptResources",
                newName: "IX_ReceiptResources_ReceiptId"
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "ReceiptResources",
                newName: "ResourceReciepts"
            );

            migrationBuilder.RenameIndex(
                name: "IX_ReceiptResources_UnitId",
                table: "ResourceReciepts",
                newName: "IX_ResourceReciepts_UnitId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_ReceiptResources_ResourceId",
                table: "ResourceReciepts",
                newName: "IX_ResourceReciepts_ResourceId"
            );

            migrationBuilder.RenameIndex(
                name: "IX_ReceiptResources_ReceiptId",
                table: "ResourceReciepts",
                newName: "IX_ResourceReciepts_ReceiptId"
            );
        }
    }
}
