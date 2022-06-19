using APIDotNetCore.EndPoints;
using APIDotNetCore.SignalREndPoints;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.EntityFrameworkCore;
using RepositoryLayer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

builder.Services.AddDbContext<EntityContext>(options =>
{
    options.UseSqlServer(builder.Configuration["ConnectionStrings:DefaultConnection"]);
});

#region DI
builder.Services.AddTransient(typeof(IEntityRepo<>), typeof(EntityRepo<>));
builder.Services.AddTransient(typeof(IRawQueryRepo<>), typeof(RawQueryRepo<>));
builder.Services.AddTransient<PatientRecordsApi>();
builder.Services.AddTransient<DioptresApi>();
builder.Services.AddTransient<EntityContext>();
#endregion

string CorsPolicy = "CorsPolicy";
builder.Services.AddCors(options => options.AddPolicy(name: CorsPolicy,
    builder =>
    {
        builder.AllowAnyHeader()
               .AllowAnyMethod()
               .AllowAnyOrigin()
               .WithOrigins(
                                "http://3.129.206.72",
                                "http://localhost:4200",
                                "http://localhost:4300"
                            )
                           .WithMethods("POST", "GET", "PUT", "DELETE")
                           .AllowCredentials();
    }));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(CorsPolicy);
//app.UseHttpsRedirection();

var scope = app.Services.CreateAsyncScope();
var patientRecordService = scope.ServiceProvider.GetService<PatientRecordsApi>();
await patientRecordService.PatientRecordsAPIEndPoints(app);

var dioptresService = scope.ServiceProvider.GetService<DioptresApi>();
await dioptresService.DioptresAPIEndPoints(app);


app.MapHub<BroadcastHub>("/broadcast-message", options =>
{
    options.Transports = HttpTransportType.ServerSentEvents |
                         HttpTransportType.LongPolling |
                         HttpTransportType.WebSockets;
}).RequireCors(CorsPolicy);

app.Run();
