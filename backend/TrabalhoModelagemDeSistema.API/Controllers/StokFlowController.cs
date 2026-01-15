using Microsoft.AspNetCore.Mvc;
using StokFlow.Service.Interface;



namespace TrabalhoModelagemDeSistema.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class StokFlowController(IStokFlowService service) : ControllerBase
    {
        [HttpPost("AcessaBD/{proc}")]
        public ActionResult RegistraProcedure([FromRoute] string proc, [FromBody] object? body)
        {
            var retorno  = service.Negocios(proc, body);
            return new ContentResult()
            {
                StatusCode = 200,
                Content = retorno,
                ContentType = "application/json"
            };
        }
    }

}
