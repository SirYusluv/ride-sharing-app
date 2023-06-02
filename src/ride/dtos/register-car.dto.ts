import { HTTP_STATUS, SPLIT_PATTERN } from "../../util/data";
import {
  colorIsValid,
  makeIsValid,
  modelIsValid,
  numberPlateIsValid,
} from "../../util/helper";

export class RegisterCarDto {
  make: string | null = null;
  model: string | null = null;
  color: string | null = null;
  numberPlate: string | null = null;

  constructor(
    make?: string,
    model?: string,
    color?: string,
    numberPlate?: string
  ) {
    this.setMake(make || "");
    this.setModel(model || "");
    this.setColor(color || "");
    this.setNumberPlate(numberPlate || "");
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
        `Invalid number plate provided${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.numberPlate = numberPlate;
  }
}
