import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env';
import routes from './routes';
import { errorHandler, AppError } from './middlewares/errorHandler';

const app: Application = express();

// Configuración de Middlewares globales
app.use(cors({
  origin: [env.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log simple de peticiones en consola
app.use((req: Request, res: Response, next: NextFunction) => {
  if (env.NODE_ENV === 'development') {
    console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Rutas de la API
app.use('/api', routes);

// Ruta no encontrada (404)
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
});

// Manejador centralizado de errores
app.use(errorHandler);

export default app;
