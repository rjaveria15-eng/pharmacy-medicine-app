using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using MyConsoleApp.Models;

namespace MyConsoleApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicineController : ControllerBase
{
    private readonly string _filePath;

    public MedicineController(IWebHostEnvironment environment)
    {
        _filePath = Path.Combine(
        environment.ContentRootPath,
        "Data",
        "medicines.json"
        );
    }

    [HttpGet]
    public async Task<ActionResult<List<Medicine>>> GetMedicines()
    {
        if (!System.IO.File.Exists(_filePath))
        {
            return Ok(new List<Medicine>());
        }

        var json = await System.IO.File.ReadAllTextAsync(_filePath);

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var medicines = JsonSerializer.Deserialize<List<Medicine>>(json, options)
        ?? new List<Medicine>();

        return Ok(medicines);
    }


    [HttpPost]
    public async Task<ActionResult<Medicine>> AddMedicine(Medicine medicine)
    {
        var json = await System.IO.File.ReadAllTextAsync(_filePath);

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var medicines = JsonSerializer.Deserialize<List<Medicine>>(json, options)
        ?? new List<Medicine>();

        medicine.Id = medicines.Count == 0
        ? 1
        : medicines.Max(m => m.Id) + 1;

        medicines.Add(medicine);

        var updatedJson = JsonSerializer.Serialize(
        medicines,
        new JsonSerializerOptions
        {
            WriteIndented = true
        });

        await System.IO.File.WriteAllTextAsync(_filePath, updatedJson);

        return Ok(medicine);
    }
}
