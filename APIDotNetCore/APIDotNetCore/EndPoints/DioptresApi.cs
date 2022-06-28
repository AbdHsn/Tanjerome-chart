using System.Text.Json;
using APIDotNetCore.Models.Validation;
using APIDotNetCore.SignalREndPoints;
using DataLayer.Models.Entities;
using DataLayer.Models.Global;
using Microsoft.AspNetCore.SignalR;
using RepositoryLayer;

namespace APIDotNetCore.EndPoints
{
    public class DioptresApi
    {
        #region Properties
        private readonly IEntityRepo<Dioptres> _dioptres;
        private readonly IRawQueryRepo<Dioptres> _dioptresRawSql;
        private readonly IRawQueryRepo<TotalRecordCountGLB> _dioptresCountRawSql;
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        #endregion

        #region Constructor
        public DioptresApi(
           IEntityRepo<Dioptres> dioptres,
           IRawQueryRepo<Dioptres> dioptresRawSql,
           IRawQueryRepo<TotalRecordCountGLB> dioptresCountRawSql,
           IHubContext<BroadcastHub, IHubClient> hubContext
        )
        {
            _dioptres = dioptres;
            _dioptresRawSql = dioptresRawSql;
            _dioptresCountRawSql = dioptresCountRawSql;
            _hubContext = hubContext;
        }
        #endregion

        #region API Endpoint Function
        public async Task DioptresAPIEndPoints(WebApplication app)
        {
            app.MapGet("/dioptres-api/get/{patientId}", async (long patientId) =>
            {
                try
                {
                    var returnData = await _dioptres.GetAllByFilter(d => d.PatientId == patientId);
                    return Results.Ok(returnData.OrderBy(o => o.CalculatedAge));
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    return Results.BadRequest("Failed to proceed.");
                }
            });

            app.MapPost("/dioptres-api/create", async (Dioptres dioptres) =>
            {
                try
                {
                    #region Validation
                    if (dioptres == null)
                        return Results.BadRequest("Provide valid data.");

                    var validationCheck = await new DioptresValidation().ValidateAsync(dioptres);

                    if (!validationCheck.IsValid)
                        return Results.BadRequest("Provided data is not valid.");

                    #endregion Validation

                    dioptres.CalculatedAge =  dioptres.InsertDate.Value.Year - dioptres.DateOfBirth.Value.Year;
                   

                    await _dioptres.Insert(dioptres);


                    await _hubContext.Clients.All.BroadcastMessage(JsonSerializer.Serialize(new
                    {
                        topic = "Dioptres-Created",
                        data = dioptres
                    }));

                    return Results.Ok(dioptres);
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    return Results.BadRequest("Failed to proceed.");
                }

            });

            app.MapPut("/dioptres-api/update", async (Dioptres dioptres) =>
            {
                try
                {
                    #region Validation
                    if (dioptres.Id <= 0)
                        return Results.BadRequest("Provide valid data.");

                    var validationCheck = await new DioptresValidation().ValidateAsync(dioptres);

                    if (!validationCheck.IsValid)
                        return Results.BadRequest("Provided data is not valid.");

                    var getDioptre = await _dioptres.GetById(x => x.Id == dioptres.Id);

                    if (getDioptre == null)
                    {
                        return Results.NotFound("Requested item is not found.");
                    }

                    #endregion Validation

                    getDioptre.Dioptre = dioptres.Dioptre;

                    await _dioptres.Update(getDioptre);

                    await _hubContext.Clients.All.BroadcastMessage(JsonSerializer.Serialize(new
                    {
                        topic = "Dioptres-Updated",
                        data = getDioptre
                    }));

                    return Results.Ok(getDioptre);
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    return Results.BadRequest("Failed to proceed.");
                }
            });

            app.MapDelete("/dioptres-api/delete/{id}", async (long id) =>
            {
                try
                {
                    if (id <= 0)
                        return Results.BadRequest("Data is not valid.");

                    var getDioptre = await _dioptres.GetById(x => x.Id == id);

                    if (getDioptre == null)
                    {
                        return Results.NotFound("Requested item is not found.");
                    }

                    await _dioptres.Delete(getDioptre);

                    await _hubContext.Clients.All.BroadcastMessage(JsonSerializer.Serialize(new
                    {
                        topic = "Dioptres-Deleted",
                        data = getDioptre
                    }));

                    return Results.Ok(true);
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    return Results.BadRequest("Failed to proceed.");
                }

            });
        }
        #endregion
    }
}
