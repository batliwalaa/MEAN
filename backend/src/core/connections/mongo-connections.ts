import mongoose from 'mongoose';

// @ts-ignore
export default async (environment: Environment) => {
    const d = await mongoose.createConnection(environment.defaultDatabaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const l = await mongoose.createConnection(environment.loggingDatabaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const s = await mongoose.createConnection(environment.sessionDatabaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    return {
        databaseConnection: () => d,
        loggingConnection: () => l,
        sessionConnection: () => s,
    };
};
