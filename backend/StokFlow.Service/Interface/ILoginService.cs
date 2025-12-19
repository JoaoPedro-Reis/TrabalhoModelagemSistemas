using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StokFlow.Service.Interface
{
    public interface ILoginService
    {
        public string GerarJwt(string username);
        public bool ValidarDados(string username, string password);
        public bool ValidarJwt(string token);
    }
}
