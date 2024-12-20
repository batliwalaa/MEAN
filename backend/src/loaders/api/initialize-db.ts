import { Injector } from '../../core/di/injector';
import { SeedDataService } from '../../services/seed.data.services';

export default async () => {
    if (process.env.INITIALIZE_DB === 'true') {
        const seedDataService = Injector.resolve<SeedDataService>(SeedDataService);

        await seedDataService.insertResources();
        /*
        await seedDataService.deleteVehicles();
        await seedDataService.deleteFooter();
        await seedDataService.deleteHomepage();
        await seedDataService.deleteMenu();
        await seedDataService.deletePantry();
        await seedDataService.deleteUsers();
        await seedDataService.insertFooter();
        await seedDataService.insertMenu();
        await seedDataService.insertHomepage();
        await seedDataService.insertPantry();
        await seedDataService.insertVehicles();
        */
    }
};
