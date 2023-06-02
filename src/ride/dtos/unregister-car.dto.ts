import { HTTP_STATUS, SPLIT_PATTERN } from "../../util/data";
import { numberPlateIsValid } from "../../util/helper";

export class UnregisterCarDto {
  make: string | null = null;
  model: string | null = null;
  color: string | null = null;
  numberPlate: string | null = null;

  constructor(numberPlate?: string) {
    this.setNumberPlate(numberPlate || "");
  }
  private setNumberPlate(numberPlate: string) {
    if (!numberPlateIsValid(numberPlate))
      throw new Error(
        `Invalid number plate provided${SPLIT_PATTERN}${HTTP_STATUS.badRequest}`
      );
    this.numberPlate = numberPlate;
  }
}
