export enum CityName {
  Paris = 'Paris',
  Cologne = 'Cologne',
  Brussels = 'Brussels',
  Amsterdam = 'Amsterdam',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf'
}

export type City =
  { name: 'Paris', coordinates: {latitude: 48.85661, longitude: 2.351499} } |
  { name: 'Cologne', coordinates: {latitude: 50.938361, longitude: 6.959974} } |
  { name: 'Brussels', coordinates: {latitude: 50.846557, longitude: 4.351697} } |
  { name: 'Amsterdam', coordinates: {latitude: 52.370216, longitude: 4.895168} } |
  { name: 'Hamburg', coordinates: {latitude: 53.550341, longitude: 10.000654} } |
  { name: 'Dusseldorf', coordinates: {latitude: 51.225402, longitude: 6.776314} }
