using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RecipeManager.Application.Auth;
using RecipeManager.AzureFunctions.Models;

namespace RecipeManager.AzureFunctions.Services;

public class JwtTokenService : IJwtTokenService
{
    // Ignore unused issuer and audience fields
    private readonly TokenValidationParameters _tokenValidationParameters;
    private readonly SymmetricSecurityKey _secretKey;
    
    public JwtTokenService(IOptions<AppSettings> settings)
    {
        var secretKey = settings.Value.JwtKey;
        // Ensure that secret is at least 256 bits
        if (secretKey.Length < 32)
        {
            throw new ArgumentException("Provide at least a 32 character long secret key");
        }
        
        _secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        _tokenValidationParameters = new TokenValidationParameters()
        {
            IssuerSigningKey = _secretKey,
            ValidateIssuer = false,
            ValidateAudience = false,
        };
    }

    public string GenerateAccessToken(User payload)
    {
        
    }

    public string GenerateRefreshToken(User payload)
    {
        
    }

    public string GenerateJwtToken(User payload)
    {
        var credentials = new SigningCredentials(_secretKey, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>()
        {
            new(JwtRegisteredClaimNames.Sub, payload.Id),
            new(ClaimTypes.Role, JsonSerializer.Serialize(payload.Roles))
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public List<string> GetTokenClaims(string token)
    {
        try
        {
            var claimsPrincipal =
                new JwtSecurityTokenHandler().ValidateToken(token, _tokenValidationParameters, out _);

            var claims = claimsPrincipal.FindFirst(ClaimTypes.Role)?.Value;
            if (claims is null)
            {
                return new List<string>();
            }

            return JsonSerializer.Deserialize<List<string>>(claims) ?? new List<string>();
        }
        catch
        {
            return new List<string>();
        }
        
    }
}

public interface IJwtTokenService
{
    string GenerateJwtToken(User payload);
    List<string> GetTokenClaims(string token);
}