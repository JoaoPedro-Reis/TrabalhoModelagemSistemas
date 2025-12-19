using Microsoft.AspNetCore.Mvc;

namespace TrabalhoModelagemDeSistema.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        [HttpGet("Login")]
        public IActionResult Login()
        {
            return View();
        }
    }
}
