import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id       : 'applications',
        title    : 'Applications',
        translate: 'NAV.APPLICATIONS',
        type     : 'group',
        children : [
            {
                id       : 'sample',
                title    : 'Sample',
                translate: 'NAV.SAMPLE.TITLE',
                type     : 'item',
                icon     : 'email',
                url      : '/sample',
                badge    : {
                    title    : '25',
                    translate: 'NAV.SAMPLE.BADGE',
                    bg       : '#F44336',
                    fg       : '#FFFFFF'
                }
            }
        ]
    },
    {
        id      : 'user-interface',
        title   : 'User Interface',
        type    : 'group',
        icon    : 'web',
        children: [
            {
                id   : 'angular-material',
                title: 'Angular Material',
                type : 'item',
                icon : 'ballot',
                url  : '/ui/angular-material'
            },
            {
                id   : 'cards',
                title: 'Cards',
                type : 'item',
                icon : 'crop_portrait',
                url  : '/ui/cards'
            },
            {
                id   : 'forms',
                title: 'Forms',
                type : 'item',
                icon : 'web_asset',
                url  : '/ui/forms'
            },
            {
                id   : 'icons',
                title: 'Icons',
                type : 'item',
                icon : 'photo',
                url  : '/ui/icons'
            },
            {
                id   : 'typography',
                title: 'Typography',
                type : 'item',
                icon : 'text_fields',
                url  : '/ui/typography'
            },
            {
                id   : 'helper-classes',
                title: 'Helper Classes',
                type : 'item',
                icon : 'help',
                url  : '/ui/helper-classes'
            },
            {
                id      : 'page-layouts',
                title   : 'Page Layouts',
                type    : 'collapsable',
                icon    : 'view_quilt',
                children: [
                    {
                        id      : 'carded',
                        title   : 'Carded',
                        type    : 'collapsable',
                        badge   : {
                            title: '12',
                            bg   : '#525e8a',
                            fg   : '#FFFFFF'
                        },
                        children: [
                            {
                                id   : 'full-width-1',
                                title: 'Full Width #1',
                                type : 'item',
                                url  : '/ui/page-layouts/carded/full-width-1'
                            },
                            {
                                id   : 'full-width-2',
                                title: 'Full Width #2',
                                type : 'item',
                                url  : '/ui/page-layouts/carded/full-width-2'
                            },
                            {
                                id   : 'full-width-tabbed-1',
                                title: 'Full Width Tabbed #1',
                                type : 'item',
                                url  : '/ui/page-layouts/carded/full-width-tabbed-1'
                            },
                            {
                                id   : 'full-width-tabbed-2',
                                title: 'Full Width Tabbed #2',
                                type : 'item',
                                url  : '/ui/page-layouts/carded/full-width-tabbed-2'
                            },
                            {
                                id   : 'left-sidebar-1',
                                title: 'Left Sidebar #1',
                                type : 'item',
                                url  : '/ui/page-layouts/carded/left-sidebar-1'
                            },
                            {
                                id   : 'left-sidebar-2',
                                title: 'Left Sidebar #2',
                                type : 'item',
                                url  : '/ui/page-layouts/carded/left-sidebar-2'
                            },
                            {
                                id   : 'left-sidebar-tabbed-1',
                                title: 'Left Sidebar Tabbed #1',
                                type : 'item',
                                url  : '/ui/page-layouts/carded/left-sidebar-tabbed-1'
                            },
                            {
                                id   : 'left-sidebar-tabbed-2',
                                title: 'Left Sidebar Tabbed #2',
                                type : 'item',
                                url  : '/ui/page-layouts/carded/left-sidebar-tabbed-2'
                            },
                            {
                                id   : 'right-sidebar-1',
                                title: 'Right Sidebar #1',
                                type : 'item',
                                url  : '/ui/page-layouts/carded/right-sidebar-1'
                            },
                            {
                                id   : 'right-sidebar-2',
                                title: 'Right Sidebar #2',
                                type : 'item',
                                url  : '/ui/page-layouts/carded/right-sidebar-2'
                            },
                            {
                                id   : 'right-sidebar-tabbed-1',
                                title: 'Right Sidebar Tabbed #1',
                                type : 'item',
                                url  : '/ui/page-layouts/carded/right-sidebar-tabbed-1'
                            },
                            {
                                id   : 'right-sidebar-tabbed-2',
                                title: 'Right Sidebar Tabbed #2',
                                type : 'item',
                                url  : '/ui/page-layouts/carded/right-sidebar-tabbed-2'
                            }
                        ]
                    },
                    {
                        id      : 'simple',
                        title   : 'Simple',
                        type    : 'collapsable',
                        badge   : {
                            title: '10',
                            bg   : '#525e8a',
                            fg   : '#FFFFFF'
                        },
                        children: [
                            {
                                id   : 'full-width-1',
                                title: 'Full Width #1',
                                type : 'item',
                                url  : '/ui/page-layouts/simple/full-width-1'
                            },
                            {
                                id   : 'full-width-tabbed-1',
                                title: 'Full Width Tabbed #1',
                                type : 'item',
                                url  : '/ui/page-layouts/simple/full-width-tabbed-1'
                            },
                            {
                                id   : 'left-sidebar-1',
                                title: 'Left Sidebar #1',
                                type : 'item',
                                url  : '/ui/page-layouts/simple/left-sidebar-1'
                            },
                            {
                                id   : 'left-sidebar-2',
                                title: 'Left Sidebar #2',
                                type : 'item',
                                url  : '/ui/page-layouts/simple/left-sidebar-2'
                            },
                            {
                                id   : 'left-sidebar-3',
                                title: 'Left Sidebar #3',
                                type : 'item',
                                url  : '/ui/page-layouts/simple/left-sidebar-3'
                            },
                            {
                                id   : 'left-sidebar-4',
                                title: 'Left Sidebar #4',
                                type : 'item',
                                url  : '/ui/page-layouts/simple/left-sidebar-4'
                            },
                            {
                                id   : 'right-sidebar-1',
                                title: 'Right Sidebar #1',
                                type : 'item',
                                url  : '/ui/page-layouts/simple/right-sidebar-1'
                            },
                            {
                                id   : 'right-sidebar-2',
                                title: 'Right Sidebar #2',
                                type : 'item',
                                url  : '/ui/page-layouts/simple/right-sidebar-2'
                            },
                            {
                                id   : 'right-sidebar-3',
                                title: 'Right Sidebar #3',
                                type : 'item',
                                url  : '/ui/page-layouts/simple/right-sidebar-3'
                            },
                            {
                                id   : 'right-sidebar-4',
                                title: 'Right Sidebar #4',
                                type : 'item',
                                url  : '/ui/page-layouts/simple/right-sidebar-4'
                            }
                        ]
                    },
                    {
                        id   : 'blank',
                        title: 'Blank',
                        type : 'item',
                        url  : '/ui/forms'
                    }
                ]
            },
            {
                id   : 'colors',
                title: 'Colors',
                type : 'item',
                icon : 'color_lens',
                url  : '/ui/colors'
            }
        ]
    },    
];
