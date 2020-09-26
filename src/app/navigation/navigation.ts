import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'application-modules',
        title    : 'Modules',
        translate: 'NAV.MODULES',
        type     : 'group',
        children : [
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
                        id   : 'stocks',
                        title: 'Stocks',
                        type : 'item',
                        url  : '/ui/stocks'
                    },
                    {
                        id   : 'species',
                        title: 'Species',
                        type : 'item',
                        url  : '/ui/forms'
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
                        url  : '/ui/forms',
                        icon : 'settings',
                    }

                ]
            }            
        ]
    }
];