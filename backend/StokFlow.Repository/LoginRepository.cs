using Microsoft.Extensions.Configuration;
using StokFlow.Repository.Interface;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace StokFlow.Repository
{
    public class LoginRepository(IConfiguration configuration) : ILoginRepository
    {
        public string AcessaTB(XmlNode xml)
        {
            string retorno = null;

            using SqlConnection connection = new SqlConnection(configuration.GetConnectionString("DefaultConnection"));
            connection.Open();

            using SqlCommand command = new SqlCommand($"exec sp_stokflow_verifica_dados_usuario @xml", connection);
            command.Parameters.AddWithValue("@xml", xml.InnerXml);

            using SqlDataReader reader = command.ExecuteReader();
            if (reader.HasRows)
            {
                while (reader.Read())
                {
                    retorno = reader[0].ToString();
                }
            }
            return retorno;
        }
    }
}
