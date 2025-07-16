
fx_version 'cerulean'
game 'gta5'

author 'Lovable Dev'
description 'Complete Organization System for ESX'
version '2.0.0'

shared_scripts {
    '@es_extended/imports.lua',
    '@ox_lib/init.lua',
    'shared/config.lua'
}

client_scripts {
    'client/*.lua'
}

server_scripts {
    '@oxmysql/lib/MySQL.lua',
    'server/*.lua'
}

dependencies {
    'es_extended',
    'oxmysql',
    'ox_inventory'
}
