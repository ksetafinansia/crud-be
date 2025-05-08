interface SuccessResponse<T> {
    status: "success";
    message: string;
    data: T;
}

export const success = <T>(res: any, message: string, data: T): void => {
    res.json({ status: "success", message, data } as SuccessResponse<T>);
};

interface ErrorResponse {
    status: "error";
    message: string;
}

export const error = (res: any, message: string, code: number = 400): void => {
    res.status(code).json({ status: "error", message } as ErrorResponse);
};