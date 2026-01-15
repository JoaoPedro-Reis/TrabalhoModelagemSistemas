using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using StokFlow.Repository.Interface;
using StokFlow.Service.Interface;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace StokFlow.Service
{
    public class LoginService(ILoginRepository loginRepository) : ILoginService
    {
        public string GerarJwt(string username)
        {
            var claims = new Claim[]
           {
                new Claim(ClaimTypes.Name, username),
           };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Consts.CHAVE_CRIPT));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                expires: DateTime.UtcNow.AddMinutes(30),
                claims: claims,
                signingCredentials: creds
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        public bool ValidarDados(string username, string password)
        {
            XmlDocument xmlDoc = new XmlDocument();
            var json = JsonConvert.SerializeObject(new { NOME_USUARIO = username, SENHA = password });
            xmlDoc = JsonConvert.DeserializeXmlNode(json, "Parametros");
            var result = loginRepository.AcessaTB(xmlDoc);
            return !string.IsNullOrEmpty(result);
        }

        public bool ValidarJwt(string token)
        {
            if (token == null)
                return false;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(Consts.CHAVE_CRIPT);
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    // set clockskew pra zero pro tokens expirar exatamente no tempo de expiracao do token (ao inves de 5 min dps)
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                return true;
            }
            catch
            {
                // return null if validation fails
                return false;
            }
        }
    }
}
