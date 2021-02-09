import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    
            {
                id      : 'nursery',
                title   : 'Nursery',
                type    : 'collapsable',
                icon    : 'view_quilt',
                children: [
                    {
                        id   : 'species',
                        title: 'Species',
                        type : 'item',
                        url  : '/ui/species'
                    },
                    {
                        id   : 'stocks',
                        title: 'Stocks',
                        type : 'item',
                        url  : '/ui/stocks'
                    },
                    {
                        id   : 'harvest',
                        title: 'Harvest',
                        type : 'item',
                        url  : '/ui/harvest'
                    },
                    {
                        id   : 'seeding',
                        title: 'Seeding',
                        type : 'item',
                        url  : '/ui/seeding'
                    },                   
                    {
                        id      : 'zones',
                        title   : 'Zones',
                        type    : 'item',                        
                        url  : '/ui/zones'
                    },                    
                    {
                        id   : 'samples',
                        title: 'Samples',
                        type : 'item',
                        url  : '/ui/samples'
                    },
                    {
                        id   : 'measurements',
                        title: 'Measurements',
                        type : 'item',
                        url  : '/ui/measurements'
                    },
                    {
                        id      : 'irrigations',
                        title   : 'Irrigations',
                        type    : 'item',                        
                        url  : '/ui/irrigations'
                    }


                ]
            },
            {
                id      : 'admin',
                title   : 'Admin',
                type    : 'collapsable',
                icon    : 'view_quilt',
                children: [
                    {
                        id      : 'users',
                        title   : 'Users',
                        type    : 'item',
                        icon : 'person',                    
                        url  : '/ui/users'
                    },
                    
                    {
                        id   : 'roles',
                        title: 'Roles',
                        type : 'item',
                        url  : '/sample',
                        icon : 'settings',
                    }

                ]
            }

     
];