import express from 'express';
import { computerRouter } from './computer/computer.routes.js';
const app = express();
app.use(express.json());
app.use('/api/computers', computerRouter);
app.use((_, res) => {
    return res.status(404).send({ message: 'Route not found' });
});
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});
//# sourceMappingURL=app.js.map