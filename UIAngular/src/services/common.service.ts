import * as signalR from '@microsoft/signalr';

export class CommonService {
  // API url
  public apiUrl = 'https://localhost:7294/';
  constructor() {}

  signalRConnectionInitilization() {
    let connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.apiUrl + 'broadcast-message')
      .build();

    connection
      .start()
      .then(function () {
        console.log('SignalR Connection Established');
      })
      .catch(function (err) {
        return console.error(
          'SignalR Connection Failed: It is require to smooth and realtime process.',
          err.toString()
        );
      });

    return connection;
  }
}

export function enumToList(enumType: any) {
  return Object.keys(enumType).map((key) => ({
    value: enumType[key],
    title: key,
  }));
}
