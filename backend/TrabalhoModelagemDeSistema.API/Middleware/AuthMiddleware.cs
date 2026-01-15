using StokFlow.Service.Interface;
using System.Security.Claims;
using System.Text;

namespace TrabalhoModelagemDeSistema.API.Middleware
{
    public class AuthMiddleware(ILogger<AuthMiddleware> _logger, ILoginService loginService) : IMiddleware
    {
        public async Task InvokeAsync(HttpContext context, RequestDelegate _next)
        {
            string authHeader = context.Request.Headers.Authorization;

            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                string authToken = authHeader.Substring(7);
                if (!loginService.ValidarJwt(authToken))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsync("Token inválido");
                    return;
                }
            }
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Basic"))
            {
                var dadosEncoded = authHeader.Substring(6);
                var dados = Encoding.UTF8.GetString(Convert.FromBase64String(dadosEncoded));
                var credencials = dados.Split(':');

                if (credencials.Length == 2)
                {
                    var user = credencials[0];
                    var password = credencials[1];
                    if (loginService.ValidarDados(user, password))
                    {
                        var token = loginService.GerarJwt(user);
                        context.Response.Headers.Add("Token", token);
                        //aqui as claims sao usadas p definir o usuario autenticado dentro do httpcontext
                        var claims = new[]
                        {
                            new Claim("name", user)
                        };
                        var identity = new ClaimsIdentity(claims, "basic");
                        context.User = new ClaimsPrincipal(identity);
                    }
                }
                else
                {
                    throw new UnauthorizedAccessException("Dados inválidos");
                }
            }

            //Pass to the next middleware
            await _next(context);
        }


    }
}
