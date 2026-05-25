import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
  PrismaClientRustPanicError
} from "@prisma/client/runtime/client";
import AppError from "../helpers/appError.js";

function handleValidationError(err) {
  return new AppError('Invalid input data.', 400);
}

function handleInitializationError(err) {
  return new AppError('Database connection failed.', 500);
}

function handleRustPanicError(err) {
  return new AppError('Critical database error.', 500);
}

function handleKnownRequestError(err) {
  const errorMap = new Map([
    ['P2002', () => {
        const field = (err.meta?.driverAdapterError.cause.constraint.fields)?.join(", ") || "field";
        return new AppError(`Duplicate value found for ${field}. Please use a different value.`, 409);
      }
    ],
    ['P2003', () => {
        const field = (err.meta?.field_name) || (err.meta?.driverAdapterError.cause.constraint.fields) || "unknown field";
        return new AppError( `Invalid reference for field: ${field}`, 400);
      }
    ],
    ['P2025', () => new AppError("Record not found.", 404)],
    ['P2021', () => new AppError("The table does not exist.", 500)],
    ['P2022', () => new AppError("The column does not exist.", 500)],
  ]);

  return errorMap.get(err.code)?.() || new AppError('Database error occured.', 500);
}

function sendError(err, res) {
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
    error: err,
  });
}

export default function errorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  let error = err;

  if (err instanceof PrismaClientInitializationError) {
    error = handleInitializationError(err);
  } else if (err instanceof PrismaClientRustPanicError) {
    error = handleRustPanicError(err);
  } else if (err instanceof PrismaClientValidationError) {
    error = handleValidationError(err);
  } else if (err instanceof PrismaClientKnownRequestError) {
    error = handleKnownRequestError(err);
  }

  sendError(error, res);
}