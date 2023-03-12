import { Severity } from "@/constants/enums";

export interface Alert {
  severity: Severity;
  message: string;
}
