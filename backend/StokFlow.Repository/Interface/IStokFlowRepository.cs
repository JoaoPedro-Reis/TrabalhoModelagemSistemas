using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace StokFlow.Repository.Interface
{
    public interface IStokFlowRepository
    {
        public string ExecuteProcedure(string proc, XmlNode xml);

    }
}
