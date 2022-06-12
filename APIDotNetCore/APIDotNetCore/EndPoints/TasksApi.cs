using System.Text.Json;
using APIDotNetCore.Models.Validation;
using APIDotNetCore.SignalREndPoints;
using DataLayer.Models.Entities;
using DataLayer.Models.Global;
using Microsoft.AspNetCore.SignalR;
using RepositoryLayer;

namespace APIDotNetCore.EndPoints
{
    public class TasksApi
    {
        #region Properties
        private readonly IEntityRepo<Tasks> _task;
        private readonly IRawQueryRepo<Tasks> _taskRawSql;
        private readonly IRawQueryRepo<TotalRecordCountGLB> _taskCountRawSql;
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        #endregion

        #region Constructor
        public TasksApi(
           IEntityRepo<Tasks> task,
           IRawQueryRepo<Tasks> taskRawSql,
           IRawQueryRepo<TotalRecordCountGLB> taskCountRawSql,
           IHubContext<BroadcastHub, IHubClient> hubContext
        )
        {
            _task = task;
            _taskRawSql = taskRawSql;
            _taskCountRawSql = taskCountRawSql;
            _hubContext = hubContext;
        }
        #endregion

        #region API Endpoint Function
        public async Task TaskAPIEndPoints(WebApplication app)
        {
            app.MapGet("/task-api/get", async () =>
            {
                try
                {
                    return Results.Ok(await _task.GetAll());
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    return Results.BadRequest("Failed to proceed.");
                }
            });

            app.MapPost("/task-api/get-grid", async (DatatableGLB tableObj) =>
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
                        sortInformation = "insert_date DESC";
                    }


                    #endregion single sort code

                    #region where-condition gathering code
                    string whereConditionStatement = null;
                    if (tableObj != null && tableObj.searches.Count() > 0)
                    {
                        foreach (var item in tableObj.searches)
                        {
                            if (!string.IsNullOrEmpty(item.value) && item.search_by == "title")
                            {
                                whereConditionStatement += $@"{item.search_by} ILIKE '%{item.value}%' AND ";
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

                    var dataGrid = await _taskRawSql.GetAllByWhere(new GetAllByWhereGLB()
                    {
                        TableOrViewName = "Tasks",
                        SortColumn = sortInformation,
                        WhereConditions = whereConditionStatement,
                        LimitIndex = tableObj.start,
                        LimitRange = rowSize
                    });

                    var dataGridCount = await _taskCountRawSql.CountAllByWhere(new CountAllByWhereGLB()
                    {
                        TableOrViewName = "Tasks",
                        WhereConditions = whereConditionStatement
                    });

                    #endregion database query code

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

            app.MapGet("/task-api/get/{id}", async (long id) =>
            {
                try
                {
                    if (id <= 0)
                        return Results.BadRequest("Request is not valid.");

                    var getTask = await _task.GetById(x => x.id == id);

                    if (getTask == null)
                    {
                        return Results.NotFound("Requested item is not found.");
                    }
                    return Results.Ok(getTask);
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    return Results.BadRequest("Failed to proceed.");
                }
            });

            app.MapPost("/task-api/create", async (Tasks task) =>
            {
                try
                {
                    #region Validation
                    if (task == null)
                        return Results.BadRequest("Provide valid data.");

                    var validationCheck = await new TasksValidation().ValidateAsync(task);

                    if (!validationCheck.IsValid)
                        return Results.BadRequest("Provided data is not valid.");

                    #endregion Validation

                    task.insert_date = DateTime.UtcNow;
                    await _task.Insert(task);

                    await _hubContext.Clients.All.BroadcastMessage(JsonSerializer.Serialize(new
                    {
                        topic = "Task-Created",
                        data = task
                    }));

                    return Results.Ok(task);
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    return Results.BadRequest("Failed to proceed.");
                }

            });

            app.MapPut("/task-api/update", async (Tasks task) =>
            {
                try
                {
                    #region Validation
                    if (task.id <= 0)
                        return Results.BadRequest("Provide valid data.");

                    var validationCheck = await new TasksValidation().ValidateAsync(task);

                    if (!validationCheck.IsValid)
                        return Results.BadRequest("Provided data is not valid.");

                    var getTask = await _task.GetById(x => x.id == task.id);

                    if (getTask == null)
                    {
                        return Results.NotFound("Requested item is not found.");
                    }

                    #endregion Validation

                    getTask.title = task.title;
                    getTask.details = task.details;
                    getTask.status = task.status;
                    getTask.progress_ratio = task.progress_ratio;

                    await _task.Update(getTask);

                    await _hubContext.Clients.All.BroadcastMessage(JsonSerializer.Serialize(new
                    {
                        topic = "Task-Updated",
                        data = getTask
                    }));

                    return Results.Ok(getTask);
                }
                catch (Exception ex)
                {
                    string error = ex.ToString();
                    return Results.BadRequest("Failed to proceed.");
                }
            });

            app.MapDelete("/task-api/delete/{id}", async (long id) =>
            {
                try
                {
                    if (id <= 0)
                        return Results.BadRequest("Data is not valid.");

                    var getTask = await _task.GetById(x => x.id == id);

                    if (getTask == null)
                    {
                        return Results.NotFound("Requested item is not found.");
                    }

                    await _task.Delete(getTask);

                    await _hubContext.Clients.All.BroadcastMessage(JsonSerializer.Serialize(new
                    {
                        topic = "Task-Deleted",
                        data = getTask
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
