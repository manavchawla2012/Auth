import express from 'express';
import dotenv from 'dotenv';
import apiRoutes from '@routes/api';
import {RequestLoggerMiddleware} from '@middlewares/requestLoggerMiddleware';
import {ExceptionHandlerMiddleware} from "@middlewares/exceptionHandlerMiddleware";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

(BigInt.prototype as any).toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

app.use(express.json());
app.use(RequestLoggerMiddleware);
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Auth Service');
});

app.use(ExceptionHandlerMiddleware);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
