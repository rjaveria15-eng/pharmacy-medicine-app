using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using MyConsoleApp.Models;

namespace MyConsoleApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SaleController : ControllerBase
{
    private readonly string _medicineFilePath;
    private readonly string _saleFilePath;

    public SaleController(IWebHostEnvironment environment)
    {
        _medicineFilePath = Path.Combine(
        environment.ContentRootPath,
        "Data",
        "medicines.json");

        _saleFilePath = Path.Combine(
        environment.ContentRootPath,
        "Data",
        "sales.json");
    }

    [HttpPost]
    public async Task<ActionResult<Sale>> CreateSale(
    int medicineId,
    int quantitySold)
    {
        if (quantitySold <= 0)
            return BadRequest("Quantity must be greater than zero.");

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var medicineJson =
        await System.IO.File.ReadAllTextAsync(_medicineFilePath);

        var medicines =
        JsonSerializer.Deserialize<List<Medicine>>(
        medicineJson, options)
        ?? new List<Medicine>();

        var medicine = medicines.FirstOrDefault(
        m => m.Id == medicineId);

        if (medicine == null)
            return NotFound("Medicine not found.");

        if (quantitySold > medicine.Quantity)
            return BadRequest("Not enough stock available.");

        medicine.Quantity -= quantitySold;

        var saleJson =
        await System.IO.File.ReadAllTextAsync(_saleFilePath);

        var sales =
        JsonSerializer.Deserialize<List<Sale>>(
        saleJson, options)
        ?? new List<Sale>();

        var sale = new Sale
        {
            Id = sales.Count == 0
        ? 1
        : sales.Max(s => s.Id) + 1,

            MedicineId = medicineId,
            QuantitySold = quantitySold,
            SaleDate = DateTime.Now
        };

        sales.Add(sale);

        await System.IO.File.WriteAllTextAsync(
        _medicineFilePath,
        JsonSerializer.Serialize(
        medicines,
        new JsonSerializerOptions
        {
            WriteIndented = true
        }));

        await System.IO.File.WriteAllTextAsync(
        _saleFilePath,
        JsonSerializer.Serialize(
        sales,
        new JsonSerializerOptions
        {
            WriteIndented = true
        }));

        return Ok(sale);
    }
}
