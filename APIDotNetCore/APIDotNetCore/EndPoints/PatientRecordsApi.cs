using System.Text.Json;
using APIDotNetCore.Models.Validation;
using APIDotNetCore.SignalREndPoints;
using DataLayer.Models.Entities;
using DataLayer.Models.Global;
using Microsoft.AspNetCore.SignalR;
using RepositoryLayer;

namespace APIDotNetCore.EndPoints
{
    public class PatientRecordsApi
    {
        #region Properties
        private readonly IEntityRepo<PatientRecords> _patientRecord;
        private readonly IRawQueryRepo<PatientRecords> _patientRecordRawSql;
        private readonly IRawQueryRepo<TotalRecordCountGLB> _patientRecordCountRawSql;
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        #endregion

        #region Constructor
        public PatientRecordsApi(
           IEntityRepo<PatientRecords> task,
           IRawQueryRepo<PatientRecords> taskRawSql,
           IRawQueryRepo<TotalRecordCountGLB> taskCountRawSql,
           IHubContext<BroadcastHub, IHubClient> hubContext
        )
        {
            _patientRecord = task;
            _patientRecordRawSql = taskRawSql;
            _patientRecordCountRawSql = taskCountRawSql;
            _hubContext = hubContext;
        }
        #endregion

        #region API Endpoint Function
        public async Task PatientRecordsAPIEndPoints(WebApplication app)
        {
            app.MapGet("/patient-record-api/get", async () =>
            {
                try
                {
                    return Results.Ok(await _patientRecord.GetAll());
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    return Results.BadRequest("Failed to proceed.");
                }
            });

            app.MapPost("/patient-record-api/get-grid", async (DatatableGLB tableObj) =>
            {
                try
                {
                    int rowSize = 0;
                    if (tableObj.length == "All")
                    {
                        rowSize = 0;
                    }
                    else
                    {
                        rowSize = int.Parse(tableObj.length);
                    }

                    string searchText = default(string);
                    if (tableObj.search != null)
                    {
                        searchText = tableObj.search.value;
                    }

                    #region single sort gathering code
                    string sortInformation = null;
                    if (tableObj.orders != null && tableObj.orders.Count > 0)
                    {
                        var getSort = tableObj.orders.FirstOrDefault();
                        sortInformation = getSort.column + " " + getSort.order_by;
                    }
                    else
                    {
                        //assign default sort info base on column
                        sortInformation = "InsertDate DESC";
                    }


                    #endregion single sort code

                    #region where-condition gathering code
                    string whereConditionStatement = null;
                    if (tableObj != null && tableObj.searches.Count() > 0)
                    {
                        foreach (var item in tableObj.searches)
                        {
                            if (!string.IsNullOrEmpty(item.value) && item.search_by == "name")
                            {
                                whereConditionStatement += $@"{item.search_by} LIKE '%{item.value}%' AND ";
                            }
                            else if (!string.IsNullOrEmpty(item.value) && item.search_by == "phone")
                            {
                                whereConditionStatement += $@"{item.search_by} LIKE '%{item.value}%' AND ";
                            }
                            else if (!string.IsNullOrEmpty(item.value))
                                whereConditionStatement += item.search_by + " = '" + item.value + "' AND ";
                        }
                        if (!string.IsNullOrEmpty(whereConditionStatement))
                        {
                            whereConditionStatement = whereConditionStatement.Substring(0, whereConditionStatement.Length - 4);
                        }
                    }
                    #endregion where-condition gathering code

                    #region database query code 

                    var dataGrid = await _patientRecordRawSql.GetAllByWhere(new GetAllByWhereGLB()
                    {
                        TableOrViewName = "PatientRecords",
                        SortColumn = sortInformation,
                        WhereConditions = whereConditionStatement,
                        LimitIndex = tableObj.start,
                        LimitRange = rowSize
                    });

                    var dataGridCount = await _patientRecordCountRawSql.CountAllByWhere(new CountAllByWhereGLB()
                    {
                        TableOrViewName = "PatientRecords",
                        WhereConditions = whereConditionStatement
                    });

                    #endregion database query code

                    #region ChartData
                    var createLabel = new List<int> { 
                    6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,
                    };

                    //var chartValues = new List<PatientRecords>();

                    foreach (var patientItem in dataGrid)
                    {
                        patientItem.Age = DateTime.Now.Year - patientItem.DateOfBirth.Value.Year;

                        var patientChartData = new List<decimal>();
                        foreach (var item in createLabel)
                        {
                            patientChartData.Add( 
                               DateTime.Now.Year - patientItem.DateOfBirth.Value.Year == item ? (decimal)patientItem.Dioptres : 0
                            );

                            //patientChart.Dioptres = DateTime.Now.Year - patientItem.DateOfBirth.Value.Year == item ? patientItem.Dioptres : 0;
                        }

                        patientItem.ChartData = new
                        {
                            label = createLabel,
                            data = patientChartData
                        };
                    }


                    #endregion

                    return Results.Ok(new
                    {
                        data = dataGrid,
                        totalRecords = dataGridCount.totalrecord
                    });
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    return Results.BadRequest("Failed to proceed.");
                }
            });

            app.MapGet("/patient-record-api/get/{id}", async (long id) =>
            {
                try
                {
                    if (id <= 0)
                        return Results.BadRequest("Request is not valid.");

                    var getPatientRecord = await _patientRecord.GetById(x => x.Id == id);

                    if (getPatientRecord == null)
                    {
                        return Results.NotFound("Requested item is not found.");
                    }
                    return Results.Ok(getPatientRecord);
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    return Results.BadRequest("Failed to proceed.");
                }
            });

            app.MapPost("/patient-record-api/create", async (PatientRecords patientRecord) =>
            {
                try
                {
                    #region Validation
                    if (patientRecord == null)
                        return Results.BadRequest("Provide valid data.");

                    var validationCheck = await new PatientRecordsValidation().ValidateAsync(patientRecord);

                    if (!validationCheck.IsValid)
                        return Results.BadRequest("Provided data is not valid.");

                    #endregion Validation

                    patientRecord.InsertDate = DateTime.UtcNow;
                    await _patientRecord.Insert(patientRecord);

                    patientRecord.Age = DateTime.Now.DayOfYear < patientRecord.DateOfBirth.Value.DayOfYear ? DateTime.Now.Year - patientRecord.DateOfBirth.Value.Year  : DateTime.Now.Year - patientRecord.DateOfBirth.Value.Year;


                    await _hubContext.Clients.All.BroadcastMessage(JsonSerializer.Serialize(new
                    {
                        topic = "Patient-Record-Created",
                        data = patientRecord
                    }));

                    return Results.Ok(patientRecord);
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    return Results.BadRequest("Failed to proceed.");
                }

            });

            app.MapPut("/patient-record-api/update", async (PatientRecords patientRecord) =>
            {
                try
                {
                    #region Validation
                    if (patientRecord.Id <= 0)
                        return Results.BadRequest("Provide valid data.");

                    var validationCheck = await new PatientRecordsValidation().ValidateAsync(patientRecord);

                    if (!validationCheck.IsValid)
                        return Results.BadRequest("Provided data is not valid.");

                    var getPatientRecord = await _patientRecord.GetById(x => x.Id == patientRecord.Id);

                    if (getPatientRecord == null)
                    {
                        return Results.NotFound("Requested item is not found.");
                    }

                    #endregion Validation

                    getPatientRecord.Name = patientRecord.Name;
                    getPatientRecord.Phone = patientRecord.Phone;
                    getPatientRecord.DateOfBirth = patientRecord.DateOfBirth;
                    getPatientRecord.Dioptres = patientRecord.Dioptres;

                    await _patientRecord.Update(getPatientRecord);

                    getPatientRecord.Age = DateTime.Now.DayOfYear < getPatientRecord.DateOfBirth.Value.DayOfYear ? DateTime.Now.Year - getPatientRecord.DateOfBirth.Value.Year : DateTime.Now.Year - getPatientRecord.DateOfBirth.Value.Year;

                    await _hubContext.Clients.All.BroadcastMessage(JsonSerializer.Serialize(new
                    {
                        topic = "Patient-Record-Updated",
                        data = getPatientRecord
                    }));

                    return Results.Ok(getPatientRecord);
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    return Results.BadRequest("Failed to proceed.");
                }
            });

            app.MapDelete("/patient-record-api/delete/{id}", async (long id) =>
            {
                try
                {
                    if (id <= 0)
                        return Results.BadRequest("Data is not valid.");

                    var getPatientRecord = await _patientRecord.GetById(x => x.Id == id);

                    if (getPatientRecord == null)
                    {
                        return Results.NotFound("Requested item is not found.");
                    }

                    await _patientRecord.Delete(getPatientRecord);

                    await _hubContext.Clients.All.BroadcastMessage(JsonSerializer.Serialize(new
                    {
                        topic = "Patient-Record-Deleted",
                        data = getPatientRecord
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
