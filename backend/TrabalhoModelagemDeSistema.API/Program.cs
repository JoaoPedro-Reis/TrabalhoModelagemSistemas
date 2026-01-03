using StokFlow.Service.Interface;
using StokFlow.Service;
using StokFlow.Repository.Interface;
using StokFlow.Repository;
using TrabalhoModelagemDeSistema.API.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();//fornece acesso ao httprequest
//builder.Services.AddTransient<AuthMiddleware>();
builder.Services.AddTransient<IStokFlowService, StokFlowService>();
builder.Services.AddTransient<IStokFlowRepository, StokFlowRepository>();
builder.Services.AddTransient<ILoginService, LoginService>();
builder.Services.AddTransient<ILoginRepository, LoginRepository>();
builder.Services.AddAuthorization();
builder.Services.AddAuthentication();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthentication();
app.UseMiddleware<AuthMiddleware>();
app.UseAuthorization();

app.MapControllers();

app.Run();
