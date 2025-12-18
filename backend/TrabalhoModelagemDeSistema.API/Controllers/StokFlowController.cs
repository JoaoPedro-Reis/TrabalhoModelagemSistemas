using Microsoft.AspNetCore.Mvc;
using StokFlow.Service.Interface;



namespace TrabalhoModelagemDeSistema.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class StokFlowController(IStokFlowService service) : ControllerBase
    {
        [HttpPost("PersisteTB/{proc}")]
        public ActionResult Index([FromRoute] string proc, [FromBody] object body)
        {
            return View();
        }
    }

}
