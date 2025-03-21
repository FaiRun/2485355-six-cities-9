import EventEmitter from 'node:events';
import { FileReader } from './file-reader.interface.js';
import { Offer, Photo, HousingType, Amenitie, Coordinates, User, UserType } from '../../types/index.js';
import { createReadStream } from 'node:fs';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384;

  constructor(
    private readonly filename: string
  ) {
    super();
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      publicationDate,
      cityName,
      previewImage,
      photos,
      isPremium,
      isFavorite,
      rating,
      housingType,
      roomCount,
      guestCount,
      rentalPrice,
      amenities,
      name,
      email,
      avatar,
      type,
      commentCount,
      coordinates
    ] = line.split('\t');

    return {
      title,
      description,
      publicationDate: new Date(publicationDate),
      cityName,
      previewImage,
      photos: this.parsePhotos(photos),
      isPremium: this.parseIsPremium(isPremium),
      isFavorite: this.parseIsFavorite(isFavorite),
      rating: Number.parseFloat(rating),
      housingType: housingType as HousingType,
      roomCount: Number.parseInt(roomCount, 10),
      guestCount: Number.parseInt(guestCount, 10),
      rentalPrice: Number.parseInt(rentalPrice, 10),
      amenities: this.parseAmenities(amenities),
      author: this.parseUser(name, email, avatar, type as UserType),
      commentCount: Number.parseInt(commentCount, 10),
      coordinates: this.parseCoordinates(coordinates)
    };
  }

  private parseUser(name: string, email: string, avatar: string, type: UserType): User {
    return { name, avatar, email, type };
  }

  private parsePhotos(photosString: string): Photo[] {
    return photosString.split(';').map((src) => ({
      src
    }));
  }

  private parseIsPremium(isPremiumString: string): boolean {
    return isPremiumString === 'Да';
  }

  private parseIsFavorite(isFavoriteString: string): boolean {
    return isFavoriteString === 'Да';
  }

  private parseAmenities(amenitiesString: string): Amenitie[] {
    return amenitiesString.split(';').map((amentie) => amentie.trim()) as Amenitie[];
  }

  private parseCoordinates(coordinatesString: string): Coordinates {
    const [latitude, longitude] = coordinatesString.split(';').map((coordinate) => Number.parseFloat(coordinate));
    return {latitude, longitude};
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {highWaterMark: this.CHUNK_SIZE, encoding: 'utf-8'});

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completedRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completedRow);

        await new Promise((resolve) => {
          this.emit('line', parsedOffer, resolve);
        });
      }
    }

    this.emit('end', importedRowCount);
  }
}
