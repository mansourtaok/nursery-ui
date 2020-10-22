import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    
            {
                id      : 'nursery',
                title   : 'Nursery',
                type    : 'collapsable',
                icon    : 'view_quilt',
                children: [

                   
                    {
                        id      : 'zones',
                        title   : 'Zones',
                        type    : 'item',                        
                        url  : '/ui/zones'
                    },
                    {
                        id      : 'login',
                        title   : 'login',
                        type    : 'item',                        
                        url  : '/auth/login'
                    },
                    
                    {
                        id   : 'stocks',
                        title: 'Stocks',
                        type : 'item',
                        url  : '/ui/stocks'
                    },
                    {
                        id   : 'species',
                        title: 'Species',
                        type : 'item',
                        url  : '/ui/species'
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
                        url  : '/sample'
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