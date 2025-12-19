using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StokFlow.Service
{
    public class LoginService
    {
        public string GerarJwt(string username)
        {
            return "";
        }

        public bool ValidarDados(string username, string password)
        {
            return true;
        }

        public bool ValidarJwt(string token)
        {
            return true;
        }
    }
}
