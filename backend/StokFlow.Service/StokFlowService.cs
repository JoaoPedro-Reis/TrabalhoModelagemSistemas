using Newtonsoft.Json;
using StokFlow.Repository.Interface;
using StokFlow.Service.Interface;
using System.Xml;

namespace StokFlow.Service
{
    public class StokFlowService(IStokFlowRepository repositorio) : IStokFlowService
    {

        public string Negocios(string proc, object body)
        {
            XmlDocument xml = new XmlDocument();
            xml = JsonConvert.DeserializeXmlNode(body is null ? string.Empty : body.ToString(), "Parametros");

            var retorno = repositorio.ExecuteProcedure(proc, xml);

            if (retorno == null) return null;

            var doc = new XmlDocument();
            doc.LoadXml(retorno);
            var jsonConv = JsonConvert.SerializeXmlNode(doc);
            return jsonConv;
        }

    }
}
