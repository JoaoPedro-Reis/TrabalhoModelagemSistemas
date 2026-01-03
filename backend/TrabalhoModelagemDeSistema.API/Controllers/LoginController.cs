using Microsoft.AspNetCore.Mvc;
using StokFlow.Service.Interface;

namespace TrabalhoModelagemDeSistema.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController(ILoginService service) : ControllerBase
    {
        [HttpGet("Login")]
        public IActionResult Login()
        {
            var token = HttpContext.Response.Headers["Token"].ToString();

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized(new { message = "Dados inválidos ou token não gerado" });
            }

            return Ok(new { token });
        }
    }
}
