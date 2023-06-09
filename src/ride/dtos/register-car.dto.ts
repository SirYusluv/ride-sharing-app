import { HTTP_STATUS, MAX_CAR_CAPACITY, SPLIT_PATTERN } from "../../util/data";
import {
  colorIsValid,
  isValidCarCapacity,
  makeIsValid,
  modelIsValid,
  numberPlateIsValid,
} from "../../util/helper";

export class RegisterCarDto {
  make: string | null = null;
  model: string | null = null;
  color: string | null = null;
  numberPlate: string | null = null;
  capacity: number | null = null;

  constructor(
    make?: string,
    model?: string,
    color?: string,
    numberPlate?: string,
    capacity?: number
  ) {
    this.setMake(make || "");
    this.setModel(model || "");
    this.setColor(color || "");
    this.setNumberPlate(numberPlate || "");
    this.setCapacity(capacity);
  }

  private setMake(make: string) {
    if (!makeIsValid(make))
      throw new Error(
        `Invalid make provided${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.make = make;
  }

  private setModel(model: string) {
    if (!modelIsValid(model))
      throw new Error(
        `Invalid model provided${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.model = model;
  }

  private setColor(color: string) {
    if (!colorIsValid(color))
      throw new Error(
        `Invalid colour provided${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.color = color;
  }

  private setNumberPlate(numberPlate: string) {
    if (!numberPlateIsValid(numberPlate))
      throw new Error(
        `Invalid number plate provided.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.numberPlate = numberPlate;
  }

  private setCapacity(capacity?: number) {
    if ((capacity === 0 || capacity) && !isValidCarCapacity(capacity))
      throw new Error(
        `Invalid number provided for car capacity.${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.capacity = capacity || MAX_CAR_CAPACITY;
  }
}
