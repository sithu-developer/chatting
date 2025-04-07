export interface SnackBarType {
    isSnackBarOpen : boolean,
    message : string,
    severity : Severity
}

export enum Severity {
    success = "success",
    info = "info",
    error = "error",
    warning = "warning"
}