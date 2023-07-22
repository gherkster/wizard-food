using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;
using RecipeManager.AzureFunctions.Auth;
using RecipeManager.AzureFunctions.Services;

namespace RecipeManager.AzureFunctions.Middleware;

public class AdminAuthorizationMiddleware : IFunctionsWorkerMiddleware
{
    private readonly IJwtTokenService _tokenService;
    
    
    public AdminAuthorizationMiddleware(IJwtTokenService tokenService)
    {
        _tokenService = tokenService;
    }
    
    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var httpRequestData = await context.GetHttpRequestDataAsync();
        if (httpRequestData is null)
        {
            // Only run middleware for HTTP requests
            await next(context);
            return;
        }

        if (!TryGetBearerToken(context, out var token))
        {
            var response = httpRequestData.CreateResponse();
            response.StatusCode = HttpStatusCode.Unauthorized;
            return;
        }
        
        var tokenClaims = _tokenService.GetTokenClaims(token);

        // Get Authorize attributes from the function class and method
        var methodInfo = GetExecutingMethodInfo(context.FunctionDefinition.EntryPoint);
        var authorizationAttributes = GetCustomAttributesOnClassAndMethod<AuthorizeAttribute>(methodInfo);

        if (!authorizationAttributes.Any())
        {
            await next(context);
            return;
        }

        if (!tokenClaims.Intersect(authorizationAttributes.SelectMany(a => a.Roles)).Any())
        {
            var response = httpRequestData.CreateResponse(HttpStatusCode.Unauthorized);
            await response.WriteAsJsonAsync(new { ResponseText = "Unauthorized" }, response.StatusCode);

            // https://github.com/Azure/azure-functions-dotnet-worker/blob/main/samples/CustomMiddleware/ExceptionHandlingMiddleware.cs
            var httpOutputBinding = context.GetOutputBindings<HttpResponseData>()
                .First(b => b.BindingType == "http" && b.Name != "$return");
            httpOutputBinding.Value = response;
            
            return;
        }

        await next(context);
    }

    private static bool TryGetBearerToken(FunctionContext context, out string token)
    {
        token = string.Empty;
        
        if (!context.BindingContext.BindingData.TryGetValue("Headers", out var headersObject))
        {
            return false;
        }

        if (headersObject is not string headersJson)
        {
            return false;
        }

        var headers = JsonSerializer.Deserialize<Dictionary<string, string>>(headersJson);
        var lowercaseHeaders = headers!.ToDictionary(h => h.Key.ToLowerInvariant(), h => h.Value);
        if (!lowercaseHeaders.TryGetValue("authorization", out var authHeader))
        {
            return false;
        }

        if (!authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        token = authHeader["Bearer ".Length..].Trim();
        return true;
    }

    private MethodInfo GetExecutingMethodInfo(string entryPoint)
    {
        var assemblyType = Type.GetType(entryPoint.Substring(0, entryPoint.LastIndexOf('.')))!;
        var methodInfo = assemblyType.GetMethod(entryPoint.Substring(entryPoint.LastIndexOf('.') + 1))!;

        return methodInfo;
    }

    private static List<T> GetCustomAttributesOnClassAndMethod<T>(MemberInfo targetMethod) where T: Attribute
    {
        var methodAttributes = targetMethod.GetCustomAttributes<T>();
        var classAttributes = targetMethod.DeclaringType!.GetCustomAttributes<T>();
        return methodAttributes.Concat(classAttributes).ToList();
    }
}