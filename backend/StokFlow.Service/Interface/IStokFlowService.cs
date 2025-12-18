using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StokFlow.Service.Interface
{
    public interface IStokFlowService
    {
        public string Negocios(string proc, object body);
    }
}
