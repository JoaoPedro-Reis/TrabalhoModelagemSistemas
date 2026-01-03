using Microsoft.Extensions.Configuration;
using StokFlow.Repository.Interface;
using System.Data.SqlClient;
using System.Xml;

namespace StokFlow.Repository
{
    public class StokFlowRepository(IConfiguration configuration) : IStokFlowRepository
    {
        public string xmlRetorno = null;
        public string ExecuteProcedure(string proc, XmlNode xml)
        {
            using SqlConnection connection = new SqlConnection(configuration.GetConnectionString("DefaultConnection"));
            connection.Open();

            using SqlCommand command = new SqlCommand($"exec {proc} {(xml is null ? "" : "@xml")}", connection);
            if(xml is not null) command.Parameters.AddWithValue("@xml", xml.InnerXml);

            using SqlDataReader reader = command.ExecuteReader();
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    xmlRetorno = reader[0].ToString();
                }
            }

            if (string.IsNullOrEmpty(xmlRetorno))
            {
                return null;
            }
            else
            {
                return xmlRetorno;
            }

        }
    }
}
