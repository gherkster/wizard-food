using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Options;
using RecipeManager.AzureFunctions.Models;
using User = RecipeManager.Application.Auth.User;

namespace RecipeManager.AzureFunctions.Auth;

public class CosmosDbIdentityStore : IUserRoleStore<User>, IUserPasswordStore<User>
{
    private readonly Container _container;

    public CosmosDbIdentityStore(CosmosClient cosmosClient, IOptions<AppSettings> settings)
    {
        _container = cosmosClient.GetContainer(settings.Value.DatabaseName, settings.Value.UserContainerName);
    }

    public Task<string> GetUserIdAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.Id);
    }

    public Task<string> GetUserNameAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.UserName);
    }

    public async Task SetUserNameAsync(User user, string userName, CancellationToken cancellationToken)
    {
        user.UserName = userName;
        await _container.UpsertItemAsync(user, new PartitionKey(user.Id), cancellationToken: cancellationToken);
    }

    public Task<string> GetNormalizedUserNameAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.NormalizedUserName);
    }

    public async Task SetNormalizedUserNameAsync(User user, string normalizedName, CancellationToken cancellationToken)
    {
        user.NormalizedUserName = normalizedName;
        await _container.UpsertItemAsync(user, new PartitionKey(user.Id), cancellationToken: cancellationToken);
    }

    public async Task<IdentityResult> CreateAsync(User user, CancellationToken cancellationToken)
    {
        await _container.CreateItemAsync(user, new PartitionKey(user.Id), cancellationToken: cancellationToken);
        return IdentityResult.Success;
    }

    public async Task<IdentityResult> UpdateAsync(User user, CancellationToken cancellationToken)
    {
        await _container.UpsertItemAsync(user, new PartitionKey(user.Id), cancellationToken: cancellationToken);
        return IdentityResult.Success;
    }

    public async Task<IdentityResult> DeleteAsync(User user, CancellationToken cancellationToken)
    {
        await _container.DeleteItemAsync<IdentityUser>(user.Id, new PartitionKey(user.Id), cancellationToken: cancellationToken);
        return IdentityResult.Success;
    }

    public async Task<User> FindByIdAsync(string userId, CancellationToken cancellationToken)
    {
        return await _container.ReadItemAsync<User>(userId, new PartitionKey(userId), cancellationToken: cancellationToken);
    }

    public Task<User> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
    {
        var results = _container.GetItemLinqQueryable<User>(true)
            .Where(u => u.NormalizedUserName == normalizedUserName).ToList();

        return Task.FromResult(results.FirstOrDefault());
    }
    
    public Task AddToRoleAsync(User user, string roleName, CancellationToken cancellationToken)
    {
        user.Roles.Add(roleName);
        return Task.CompletedTask;
    }

    public Task RemoveFromRoleAsync(User user, string roleName, CancellationToken cancellationToken)
    {
        user.Roles = user.Roles.Where(r => r != roleName).ToList();
        return Task.CompletedTask;
    }

    public Task<IList<string>> GetRolesAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult<IList<string>>(user.Roles);
    }

    public Task<bool> IsInRoleAsync(User user, string roleName, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.Roles.Contains(roleName));
    }

    public Task<IList<User>> GetUsersInRoleAsync(string roleName, CancellationToken cancellationToken)
    {
        var users = _container.GetItemLinqQueryable<User>(true).Where(u => u.Roles.Contains(roleName)).ToList();
        return Task.FromResult<IList<User>>(users);
    }

    public Task SetPasswordHashAsync(User user, string passwordHash, CancellationToken cancellationToken)
    {
        user.PasswordHash = passwordHash;
        return Task.FromResult(0);
    }

    public Task<string> GetPasswordHashAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(user.PasswordHash);
    }

    public Task<bool> HasPasswordAsync(User user, CancellationToken cancellationToken)
    {
        return Task.FromResult(!string.IsNullOrEmpty(user.PasswordHash));
    }
    
    // Nothing to dispose because CosmosClient is injected
    public void Dispose() {  }
}