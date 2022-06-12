
public interface IHubClient
{    
    Task BroadcastMessage(object obj);
}